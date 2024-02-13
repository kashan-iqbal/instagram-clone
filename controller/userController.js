const USER = require("../model/UserModel");
const POST = require("../model/Post.Model");
const bcyrpt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Cloudnary = require("../config/cloudnary");
const nodemailer = require("nodemailer");

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
    console.log(email, password);
    const loginUser = await USER.findOne({ email: email });
    if (!loginUser) {
      return res.send({ message: "user with this email is not register" });
    }
    if (loginUser) {
      const result = await bcyrpt.compare(password, loginUser.password);
      if (!result) {
        return res.send({ message: "Wrong Password" });
      }
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
        return res.send({ success: true,message:"Login Successfully", token, id: loginUser._id ,userName:loginUser.userName });
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
      res.send({ message: `some thing went wrong backend${error}` });
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

const uploadImage = async (req, res) => {
  const { file } = req.files;

  try {
    const image = await Cloudnary.uploader.upload(file.path);
    const removePhot = await USER.findById(req.user);
    if (removePhot.photoId) {
      const result = await await Cloudnary.uploader.destroy(removePhot.photoId);
    }
    const user = await USER.findByIdAndUpdate(
      req.user,
      {
        $set: {
          photo: image.url,
          photoId: image.public_id,
        },
      },
      { new: true }
    );
    res.status(201).send({user,message:"image upload successful"});
  } catch (error) {
    res.send(error);
  }
};
const deleteImage = async (req, res) => {
  try {
    const user = await USER.findByIdAndUpdate(
      req.user,
      {
        $set: {
          photo: null,
        },
      },
      { new: true }
    );
    const result = await Cloudnary.uploader.destroy(user.photoId);
    console.log(result);
    res.send({user,message:"Profile Image Deleted"});
  } catch (error) {
    res.send(error);
  }
};

const forget = async (req, res) => {
  const { email } = req.body;
  console.log(email);
  try {
    const user = await USER.findOne({ email: email });
    if (!user) {
      return res.send("user is exist");
    }
    const token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN, {
      expiresIn: "1h",
    });

    const transporter =  nodemailer.createTransport({
      service: "gmail",
      port:3000,
      logger:true,
      debug:true,
      secure:true,
      auth: {
        user: "kashaniqbal33@gamil.com",
        pass: "ztqa vfnt outl umko",
      },
      tls:{
        rejectUnauthorized:true
      }
    });

    const mailOptions = {
      from: "kashaniqbal33@gamil.com",
      to: `${email}`,
      subject: "Reset Password",
      text: `http://localhost:3000/forget-Password${user._id}/${token}`,
    };

    const result = await transporter.sendMail(mailOptions)
    res.send(result)
     console.log(`i am result ` ,result);

  } catch (error) {
    console.log(error);

  }
};

module.exports = {
  singup,
  singin,
  userprofile,
  singleUserProfile,
  unFollowUser,
  followUser,
  uploadImage,
  deleteImage,
  forget,
};
