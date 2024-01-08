const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const validation = (req, res, next) => {
  const authToken = req.headers.Authorization || req.headers.authorization;
  // console.log(authToken,` iam middel ware`);
  if (!authToken) {
    return res.status(401).send({ message: "token is required" });
  }

  const token = authToken.split(" ");
  const finalToken = token[1];
  if (!finalToken) {
    return res.send({ message: "you must have login " });
  }
  jwt.verify(finalToken, process.env.ACCESS_TOKEN, (err, payload) => {
    if (err) {
      return res.send({ message: "some thing went wront" });
    }
    const { id } = payload.user;
    req.user = id;
    next();
  });
};

module.exports = { validation };
