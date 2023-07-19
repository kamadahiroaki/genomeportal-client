const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bodyParser = require("body-parser");
const session = require("express-session");
const express = require("express");
const bcrypt = require("bcrypt");
const sqlite3 = require("sqlite3").verbose();
const app = express();
const port = process.env.PORT || 5000;
const httpProxy = require("http-proxy");
const proxy = httpProxy.createProxyServer({});
const { createProxyMiddleware } = require("http-proxy-middleware");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const { on } = require("events");

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

app.get("/api/logout", (req, res) => {
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

const proxyOptions = {
  target: queueingServerUrl,
  changeOrigin: true,
  onProxyReq: (proxyReq, req, res) => {
    console.log("onProxyReq");
    const encodedCredentials = Buffer.from(
      `${master.username}:${master.password}`
    ).toString("base64");
    authorization = `Basic ${encodedCredentials}`;
    proxyReq.setHeader("Authorization", authorization);

    if (req.is("multipart/form-data")) {
      // マルチパートリクエストのヘッダーを適切に設定
      proxyReq.setHeader("Content-Type", req.get("Content-Type"));
      proxyReq.setHeader("Content-Length", req.get("Content-Length"));

      // フォームデータのボディをそのままプロキシにパイプ
      //        req.pipe(proxyReq);
    } else if (req.body && typeof req.body === "object") {
      // リクエストボディがオブジェクト形式の場合、JSON形式に変換してプロキシに書き込む
      const jsonData = JSON.stringify(req.body);
      proxyReq.setHeader("Content-Type", "application/json");
      proxyReq.setHeader("Content-Length", Buffer.byteLength(jsonData));
      proxyReq.write(jsonData);
    } else if (req.body && typeof req.body === "string") {
      // リクエストボディが文字列形式の場合、そのままプロキシに書き込む
      proxyReq.write(req.body);
    }
  },
  onProxyReqEnd: (proxyReq, req, res) => {
    proxyReq.end();
  },
};
app.use(
  ["/jobSubmit", "/jobResult", "/resultFile"],
  createProxyMiddleware(proxyOptions)
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
