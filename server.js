const express = require("express");
const dotenv = require("dotenv");
const connectDb = require("./config/ConnectDb");
const cors = require('cors')
const body_Parser = require("body-parser")

// load evviroment variable from .envfile
dotenv.config();

//  initialized the express application
const app = express();

//  connect DB
connectDb();

// middleware to parse json in comming request
app.use(express.json());
// app.use(body_Parser.json())

app.use(cors())


// deifne besic api routes
app.use("/api/v1/user", require("./Route/UserRoutes"));
app.use("/api/v1/post", require("./Route/CreatePost"));


app.use("/",(req,res)=>{
  res.send("<h1>insta clone</h1>")
})

// setup prot
const port = process.env.PORT || 5000;


// server is listing on specitfic port
app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
