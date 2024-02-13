const express = require("express");
const dotenv = require("dotenv");
const connectDb = require("./config/ConnectDb");
const cors = require("cors");
const body_Parser = require("body-parser");
const path = require("path");

// load evviroment variable from .envfile
dotenv.config();

//  initialized the express application
const app = express();

//  connect DB
connectDb();

// middleware to parse json in comming request
app.use(express.json());
// app.use(body_Parser.json())

app.use(cors());

// deifne besic api routes
app.use("/api/v1/user", require("./Route/UserRoutes"));
app.use("/api/v1/post", require("./Route/CreatePost"));


app.use(express.static(path.join(__dirname, "./client/build")));

app.use("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html")),
  function (err) {
    res.send(err);
  };
});

// server is listing on specitfic port
// setup prot
const port = process.env.PORT || 5000;
app.listen(5000, () => {
  console.log(`server is running on ${port}`);
});







