// core modules
require("dotenv").config();
const path = require("path");

// external module
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const multer = require("multer");
// const DB_PATH = "";

//local module
const storeRouter = require("./routes/storeRouter");
const hostRouter = require("./routes/hostRouter");
const authRouter = require("./routes/authRouter");
const rootDir = require("./utils/pathUtil");
const errorscontroller = require("./controllers/errors");
// const {mongoConnect} = require("./utils/databaseUtil");
const { default: mongoose } = require("mongoose");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const store = MongoStore.create({
  mongoUrl: process.env.MONGODB_URI,
  collectionName: "sessions"
});

const randomString = (length) => {
  const characters = 'abcdefghijklmnopqrstuvwxz';
  let result = '';
  for(let i=0; i< length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, randomString(10) + '_' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

const multerOptions = {
  storage, fileFilter
}

store.on("error", function(error) {
  console.log("Session store error", error);
})

app.use(express.urlencoded());
app.use(multer(multerOptions).single('photo'));
app.use(express.static(path.join(rootDir, "public")));
app.use("/uploads", express.static(path.join(rootDir, "uploads")));
app.use("/host/uploads", express.static(path.join(rootDir, "uploads")));
app.use("/homes/uploads", express.static(path.join(rootDir, "uploads")));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store
}));

app.use((req, res, next) => {
  req.isLoggedIn = req.session.isLoggedIn;
  next();
})
app.use(storeRouter);
app.use(authRouter);
app.use("/host", (req, res, next) => {
  if(req.isLoggedIn) {
    next();
  } else {
    res.redirect("/login");
  }
})
app.use("/host", hostRouter);

app.use(errorscontroller.pageNotFound);



const PORT = 3009;

mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log("connect to mongo")
  app.listen(PORT, () => {
    console.log(`Server running on address http://localhost:${PORT}`);
  })
}).catch(err => {
  console.log("Error while connecting to mongo:", err);
});
