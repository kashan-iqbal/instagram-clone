const USER = require("../model/UserModel");
const POST = require("../model/Post.Model");
const bcyrpt = require("bcrypt");
const jwt = require("jsonwebtoken");

const singup = async (req, res) => {
  const { userName, email, password, confirmPassword } = req.body;
  try {
    if (!userName || !email || !password || !confirmPassword) {
      return res.send({ message: "all field are required" });
    }
    const findUser = await USER.findOne({ email: email });
    if (findUser) {
      return res.send({ message: "user already exist" });
    }
    if (password !== confirmPassword) {
      return res.send({ message: "password are not same" });
    }
    const hashPassword = await bcyrpt.hash(password, 10);
    const createUser = await USER.create({
      userName,
      email,
      password: hashPassword,
    });
    res.send({ createUser, success: true });
  } catch (error) {
    res.send(error);
  }
};

const singin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.send({ message: "all filed are require" });
    }
    const loginUser = await USER.findOne({ email: email });
    if (loginUser) {
      const result = await bcyrpt.compare(password, loginUser.password);
      if (result) {
        const token = jwt.sign(
          {
            user: {
              userName: loginUser.userName,
              email: loginUser.email,
              id: loginUser._id,
            },
          },
          process.env.ACCESS_TOKEN,
          { expiresIn: "1h" }
        );
        return res.send({ success: true, token, id: loginUser._id });
      } else {
        res.send({ success: false, message: "incorrect password" });
      }
    } else {
      res.send({
        success: false,
        message: "user with this email is not register",
      });
    }
  } catch (error) {
    if (error) {
      res.send({ message: "some thing went wrong " });
    }
  }
};

const userprofile = async (req, res) => {
  try {
    const user = await USER.findById({ _id: req.user }).select("-password");
    res.send(user);
  } catch (error) {
    res.send(error);
  }
};

const singleUserProfile = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await USER.findById(id).select("-password");
    const post = await POST.find({ postedBy: id });

    res.send({ user, post });
  } catch (error) {
    res.send(error);
  }
};

const followUser = async (req, res) => {
  const id = req.params.id;
  try {
    const creater = await USER.findByIdAndUpdate(
      id,
      {
        $push: { follower: req.user },
      },
      {
        new: true,
      }
    );
    const user = await USER.findByIdAndUpdate(
      req.user,
      {
        $push: { following: id },
      },
      {
        new: true,
      }
    );
    res.send({ user, creater });
  } catch (error) {
    res.send(error);
  }
};

const unFollowUser = async (req, res) => {
  const id = req.params.id;
  try {
    const creater = await USER.findByIdAndUpdate(
      id,
      {
        $pull: { follower: req.user },
      },
      {
        new: true,
      }
    );
    const user = await USER.findByIdAndUpdate(
      req.user,
      {
        $pull: { following: id },
      },
      {
        new: true,
      }
    );
    res.send({ user, creater });
  } catch (error) {
    res.send(error);
  }
};
module.exports = {
  singup,
  singin,
  userprofile,
  singleUserProfile,
  unFollowUser,
  followUser,
};