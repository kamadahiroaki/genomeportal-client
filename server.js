const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bodyParser = require("body-parser");
const session = require("express-session");
const express = require("express");
const bcrypt = require("bcrypt");
const sqlite3 = require("sqlite3").verbose();
const app = express();
const port = process.env.PORT || 5000;
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const multer = require("multer");
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 1024 * 1024 * 10 },
});
const FormData = require("form-data");
const axios = require("axios");
const { checkParams } = require("./checkRequest.js");

const db = new sqlite3.Database("react-server-db.sqlite3");
db.serialize(() => {
  db.run(
    'CREATE TABLE IF NOT EXISTS "users" ("id" INTEGER PRIMARY KEY AUTOINCREMENT, "email" TEXT NOT NULL UNIQUE, "password" TEXT NOT NULL)'
  );
});

const master_file_path = "master.json";
if (!fs.existsSync(master_file_path, fs.constants.F_OK)) {
  console.log(
    "ERROR: master.json file not found. Please execute initializeenv.js first."
  );
  process.exit(1);
}
const master = JSON.parse(fs.readFileSync(master_file_path));
db.get(
  'SELECT * FROM "users" WHERE "email" = ?',
  [master.username],
  (err, row) => {
    if (err) {
      console.error(err);
    }
    if (!row) {
      bcrypt.hash(master.password, 10, (err, hash) => {
        if (err) throw err;

        db.serialize(() => {
          db.run("BEGIN TRANSACTION");
          const stmt = db.prepare(
            'INSERT INTO "users" ("email", "password") VALUES (?, ?)'
          );
          stmt.run(master.username, hash, (err) => {
            if (err) {
              console.error(err);
            }
          });
          stmt.finalize();
          db.run("COMMIT");
        });
      });
    }
  }
);

const server_file_path = "server.json";
if (!fs.existsSync(server_file_path, fs.constants.F_OK)) {
  console.log(
    "ERROR: server.json file not found. Please execute initializeenv.js first."
  );
  process.exit(1);
}
const serverFile = JSON.parse(fs.readFileSync(server_file_path));
const queueingServerUrl = serverFile.queueingServerUrl;

app.use(express.static(path.join(__dirname, "build")));
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ resave: false, saveUninitialized: false, secret: "secret" }));
app.use(passport.initialize());
app.use(passport.session());
passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    (email, password, done) => {
      process.nextTick(() => {
        db.get(
          'SELECT * FROM "users" WHERE "email" = ?',
          [email],
          (err, row) => {
            if (err) {
              return done(err);
            }
            if (!row) {
              return done(null, false, { message: "login error" });
            }
            if (bcrypt.compareSync(password, row.password)) {
              return done(null, row.email);
            } else {
              return done(null, false, { message: "login error" });
            }
          }
        );
      });
    }
  )
);
passport.serializeUser((email, done) => {
  done(null, email);
});
passport.deserializeUser((email, done) => {
  done(null, email);
});

app.get("/api/data", (req, res) => {
  res.json({ message: "Hello from Express!" });
});

app.get("/api/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.send(req.user);
  } else {
    res.send("");
  }
});

app.post(
  "/api/login",
  passport.authenticate("local", { session: true }),
  (req, res) => {
    console.log("login success");
    console.log(req.user + " logged in");
    res.send(req.user + " logged in");
  },
  (err, req, res, next) => {
    console.error(err);
    res.status(401).send("login error");
  }
);

app.get("/api/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      console.error(err);
      return next(err);
    }
  });
  res.send(req.user + " logged out");
});

app.post("/api/signup", (req, res) => {
  const { email, password } = req.body;
  const MAX_EMAIL_LENGTH = 256;
  const MAX_PASSWORD_LENGTH = 256;
  // 文字列の長さを制限する
  if (
    email.length > MAX_EMAIL_LENGTH ||
    password.length > MAX_PASSWORD_LENGTH
  ) {
    return res.send("signup error: Invalid email or password length");
  }

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) throw err;

    db.serialize(() => {
      db.run("BEGIN TRANSACTION");
      const stmt = db.prepare(
        'INSERT INTO "users" ("email", "password") VALUES (?, ?)'
      );

      stmt.run(email, hash, (err) => {
        if (err) {
          console.error(err);
          res.send("signup error");
        } else {
          res.send("signup success");
        }
      });

      stmt.finalize();
      db.run("COMMIT");
    });
  });
});

app.use(
  [
    "/jobSubmit",
    "/jobResult",
    "/resultFile",
    "/usersJobs",
    "/allJobs",
    "/unfinishedJobs",
  ],
  upload.array("files"),
  (req, res, next) => {
    const headers = {};
    if (req.isAuthenticated()) {
      headers["user"] = req.user;
    } else {
      headers["user"] = "";
    }

    const encodedCredentials = Buffer.from(
      `${master.username}:${master.password}`
    ).toString("base64");
    const authorization = `Basic ${encodedCredentials}`;
    headers.authorization = authorization;

    const path = req.originalUrl;
    if (path.startsWith("/jobSubmit")) {
      const params = JSON.parse(req.body.params);
      const errMessage = checkParams(params);
      if (errMessage == "") {
        const formData = new FormData();
        formData.append("params", JSON.stringify(params));
        req.files.forEach((file) => {
          formData.append(
            "files",
            fs.createReadStream(file.path),
            file.originalname
          );
        });
        axios
          .post(queueingServerUrl + path, formData, {
            withCredentials: true,
            headers: { ...formData.getHeaders(), ...headers },
          })
          .then((response) => {
            return res.send(response.data);
          })
          .catch((error) => {
            return res.send(error);
          })
          .finally(() => {
            req.files.forEach((file) => {
              fs.unlink(file.path, (err) => {
                if (err) {
                  console.error(err);
                }
              });
            });
          });
      } else {
        return res.status(401).send(errMessage);
      }
    } else {
      if (path.startsWith("/jobResult")) {
        const nonAllowedChars = /[^a-zA-Z0-9_]/;
        if (req.query.jobid.match(nonAllowedChars)) {
          return res.status(401).send("jobid error");
        }
      } else if (path.startsWith("/resultFile")) {
        const nonAllowedChars = /[^a-zA-Z0-9_.]/;
        if (req.query.fileName.match(nonAllowedChars)) {
          return res.status(401).send("fileName error");
        }
      }
      axios
        .get(queueingServerUrl + path, {
          withCredentials: true,
          headers: headers,
        })
        .then((response) => {
          return res.send(response.data);
        })
        .catch((error) => {
          return res.send(error);
        });
    }
  }
);

app.post("/debug", (req, res) => {
  console.log("debug");
  console.log(req.body);
  res.send("ok");
});

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
