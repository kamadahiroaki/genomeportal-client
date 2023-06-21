const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bodyParser = require("body-parser");
const session = require("express-session");
const express = require("express");
const bcrypt = require("bcrypt");
const sqlite3 = require("sqlite3").verbose();
const app = express();
const port = process.env.PORT || 5000;

const db = new sqlite3.Database("db.sqlite3");
db.serialize(() => {
  db.run(
    'CREATE TABLE IF NOT EXISTS "users" ("id" INTEGER PRIMARY KEY AUTOINCREMENT, "email" TEXT NOT NULL UNIQUE, "password" TEXT NOT NULL)'
  );
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ resave: false, saveUninitialized: false, secret: "secret" }));
app.use(passport.initialize());
app.use(passport.session());
passport.use(
  new LocalStrategy(
    { usernameField: "email", passwardField: "password" },
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
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) throw err;
    db.run(
      'INSERT INTO "users" ("email", "password") VALUES (?, ?)',
      [email, hash],
      (err) => {
        if (err) {
          console.error(err);
          res.send("signup error");
        } else {
          res.send("signup success");
        }
      }
    );
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
