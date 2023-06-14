const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bodyParser = require("body-parser");
const session = require("express-session");
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

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
        if (email === "test@mail" && password === "test") {
          return done(null, email);
        } else {
          return done(null, false, {
            message: "login error",
          });
        }
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
    console.log(req.user + " logged in");
    res.send(req.user + " logged in");
  },
  (err, req, res, next) => {
    console.error(err);
    res.send("login error");
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

app.post(
  "/api/signup",
  passport.authenticate("local", { session: true }),
  (req, res) => {
    res.send(req.user + " logged in");
  },
  (err, req, res, next) => {
    console.error(err);
    res.send("signup error");
  }
);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
