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
const multer = require("multer");
const upload = multer();
const formidable = require("express-formidable");
const busboy = require("busboy");
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

app.use(["/jobResult", "/resultFile"], (req, res, next) => {
  const nonAllowedChars = /[^a-zA-Z0-9_]/;
  if (req.query.jobid.match(nonAllowedChars) === null) {
    return next();
  } else {
    return res.status(401).send("jobid error");
  }
});

//app.use(formidable({ encoding: "utf-8", multiples: true }));
//app.use("/jobSubmit", upload.array("files"), (req, res, next) => {
app.use("/jobSubmita", (req, res, next) => {
  console.log("req.is=multipart", req.is("multipart/form-data"));
  console.log("typeof req.body", typeof req.body);
  console.log("req.body:", req.body);
  let errorType = "";

  const busboyInstance = busboy({ headers: req.headers });
  const formData = {};
  busboyInstance.on("field", (fieldname, val) => {
    if (fieldname === "params") {
      formData.params = val;
    }
  });
  busboyInstance.on("field", (name, val, info) => {
    console.log(`Field [${name}]: value: %j`, val);
  });
  busboyInstance.on("finish", () => {
    console.log("formData:", formData);
    const params = JSON.parse(formData.params);
    console.log("params:", params);
    //    const paramsCheckResult = paramsCheck(params);
    //    if (paramsCheckResult != "ok") {
    //      return res.status(401).send(paramsCheckResult);
    //    }
  });
  req.pipe(busboyInstance);

  //  const params = JSON.parse(req.fields.params);
  //  console.log("params:", params);

  //  const params = JSON.parse(req.body.params);
  const params = {};
  const allowedParams = [
    "alignmentTool",
    "task",
    "db",
    "jobTitle",
    "alignTwoOrMoreSequences",
    "query_gencode",
    "query_loc",
    "subject_loc",
    "evalue",
    "word_size",
    "max_target_seqs",
    "culling_limit",
    "gapopen",
    "gapextend",
    "penalty",
    "reward",
    "matrix",
    "comp_based_stats",
    "template_type",
    "template_length",
    "dust",
    "seg",
    "soft_masking",
    "lcase_masking",
  ];
  if (
    Object.getOwnPropertyNames(params).filter(
      (key) => !allowedParams.includes(key)
    ).length > 0
  ) {
    errorType = "params error";
  }

  const dbPattern = /^[a-zA-Z][a-zA-Z0-9_\-]*$/;
  if (params.db && !dbPattern.test(params.db)) {
    errorType = "db error";
  }
  const isNotNumeric = (str) => {
    return str && !/^-?\d+(\.\d+)?$/.test(str);
  };
  if (isNotNumeric(params.evalue)) {
    errorType = "evalue error";
  }
  if (isNotNumeric(params.word_size)) {
    errorType = "word_size error";
  }
  if (isNotNumeric(params.max_target_seqs)) {
    errorType = "max_target_seqs error";
  }
  if (isNotNumeric(params.culling_limit)) {
    errorType = "culling_limit error";
  }
  if (isNotNumeric(params.gapopen)) {
    errorType = "gapopen error";
  }
  if (isNotNumeric(params.gapextend)) {
    errorType = "gapextend error";
  }
  if (isNotNumeric(params.penalty)) {
    errorType = "penalty error";
  }
  if (isNotNumeric(params.reward)) {
    errorType = "reward error";
  }
  if (isNotNumeric(params.template_length)) {
    errorType = "template_length error";
  }
  if (isNotNumeric(params.query_gencode)) {
    errorType = "query_gencode error";
  }
  if (isNotNumeric(params.comp_based_stats)) {
    errorType = "comp_based_stats error";
  }
  const locPattern = /^\d+-\d+$/;
  if (params.query_loc && !locPattern.test(params.query_loc)) {
    errorType = "query_loc error";
  }
  if (params.subject_loc && !locPattern.test(params.subject_loc)) {
    errorType = "subject_loc error";
  }

  const alignmentTool = ["blastn", "blastp", "blastx", "tblastn", "tblastx"];
  const task = [
    "megablast",
    "dc-megablast",
    "blastn",
    "blastp",
    "blastp-short",
    "blastp-fast",
    "blastx",
    "tblastn",
    "tblastx",
  ];
  const matrix = [
    "BLOSUM45",
    "BLOSUM50",
    "BLOSUM62",
    "BLOSUM80",
    "BLOSUM90",
    "PAM30",
    "PAM70",
    "PAM250",
  ];
  const templateType = ["coding", "coding_and_optimal", "optimal"];
  const boolean = [
    "yes",
    "no",
    "true",
    "false",
    "True",
    "False",
    "",
    "TRUE",
    "FALSE",
    "YES",
    "NO",
    true,
    false,
  ];

  if (
    params.alignmentTool &&
    alignmentTool.every((item) => item != params.alignmentTool)
  ) {
    errorType = "alignmentTool error";
  }
  if (params.task && task.every((item) => item != params.task)) {
    errorType = "task error";
  }
  if (params.matrix && matrix.every((item) => item != params.matrix)) {
    errorType = "matrix error";
  }
  if (
    params.templateType &&
    templateType.every((item) => item != params.template_type)
  ) {
    errorType = "template_type error";
  }
  if (params.dust && boolean.every((item) => item != params.dust)) {
    errorType = "dust error";
  }
  if (params.seg && boolean.every((item) => item != params.seg)) {
    errorType = "seg error";
  }
  if (
    params.soft_masking &&
    boolean.every((item) => item != params.soft_masking)
  ) {
    errorType = "soft_masking error";
  }
  if (
    params.lcase_masking &&
    boolean.every((item) => item != params.lcase_masking)
  ) {
    errorType = "lcase_masking error";
  }
  if (
    params.alignTwoOrMoreSequences &&
    boolean.every((item) => item != params.alignTwoOrMoreSequences)
  ) {
    errorType = "alignTwoOrMoreSequences error";
  }
  if (params.max_target_seqs == "1000") {
    console.log("max_target_seqs error");
    errorType = "max_target_seqs  1000 error";
  }
  if (errorType == "") {
    console.log("next");
    return next();
  } else {
    console.log("errorType:", errorType);
    return res.status(401).send(errorType);
  }
});

const proxyOptions = {
  target: queueingServerUrl,
  changeOrigin: true,
  onProxyReq: (proxyReq, req, res) => {
    if (req.isAuthenticated()) {
      proxyReq.setHeader("user", req.user);
    } else {
      proxyReq.setHeader("user", "");
    }

    const encodedCredentials = Buffer.from(
      `${master.username}:${master.password}`
    ).toString("base64");
    authorization = `Basic ${encodedCredentials}`;
    proxyReq.setHeader("Authorization", authorization);

    if (req.is("multipart/form-data")) {
      // マルチパートリクエストのヘッダーを適切に設定
      proxyReq.setHeader("Content-Type", req.get("Content-Type"));
      proxyReq.setHeader("Content-Length", req.get("Content-Length"));

      console.log("multipart/form-data");
      // フォームデータのボディをそのままプロキシにパイプ
      //        req.pipe(proxyReq);
    } else if (req.body && typeof req.body === "object") {
      console.log("object");
      // リクエストボディがオブジェクト形式の場合、JSON形式に変換してプロキシに書き込む
      const jsonData = JSON.stringify(req.body);
      proxyReq.setHeader("Content-Type", "application/json");
      proxyReq.setHeader("Content-Length", Buffer.byteLength(jsonData));
      proxyReq.write(jsonData);
    } else if (req.body && typeof req.body === "string") {
      console.log("string");
      // リクエストボディが文字列形式の場合、そのままプロキシに書き込む
      proxyReq.write(req.body);
    }
  },
  onProxyReqEnd: (proxyReq, req, res) => {
    proxyReq.end();
  },
};
app.use(
  [
    "/jobSubmit",
    "/jobResult",
    "/resultFile",
    "/usersJobs",
    "/allJobs",
    "/unfinishedJobs",
  ],
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
