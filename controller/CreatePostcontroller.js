const USER = require("../model/UserModel");
const POST = require("../model/Post.Model");
const Cloudinay = require("../config/cloudnary");

const CreatePost = async (req, res) => {
  const { body } = req.fields;
  const { file } = req.files;
  if (!file || !body) {
    return res.send({ message: "fill all fileds" });
  }
  try {
    const userPostCreate = await USER.findOne({ _id: req.user });
    const imageUrl = await Cloudinay.uploader.upload(file.path);
    const savePost = new POST({
      body,
      photo: imageUrl.url,
      postedBy: userPostCreate,
    });
    const result = await savePost.save();
    result
      ? res.send({ message: "post create successfully" })
      : res.send({ message: "some thing went worng " });
  } catch (error) {
    if (error) {
      console.log(error);
      res.send({ message: "some thing went worng 22 ", error });
    }
  }
};

const allPosts = async (req, res) => {
  let skip = req.query.skip ? parseInt(req.query.skip) : 0;
  console.log(skip);
  try {
    const allPost = await POST.find()
      .populate("postedBy", "_id userName photo")
      .skip(skip)
      .limit("10")
      .sort({ createdAt: -1 })
  

    const count = await POST.countDocuments();

    res.status(200).send({ allPost, count });
  } catch (error) {
    if (error) {
      res.send("some thing went wrong");
    }
  }
};

const myPosts = async (req, res) => {
  try {
    const data = await POST.find({ postedBy: req.user });
    res.send({ data });
  } catch (error) {
    res.send(error);
  }
};

const likePost = async (req, res) => {
  try {
    const id = req.body.id;

    const LikedPost = await POST.findByIdAndUpdate(
      id,
      {
        $push: { likes: req.user },
      },
      {
        new: true,
      }
    ).exec();

    res.send(LikedPost);
  } catch (error) {
    res.send(error);
  }
};

const unlikePost = async (req, res) => {
  try {
    const id = req.body.id;

    const LikedPost = await POST.findByIdAndUpdate(
      id,
      {
        $pull: { likes: req.user },
      },
      {
        new: true,
      }
    ).exec();

    res.send(LikedPost);
  } catch (error) {
    res.send(error);
  }
};

const postCommit = async (req, res) => {
  const commit = {
    comment: req.body.postCommit,
    postedBy: req.user,
  };

  try {
    const commentPost = await POST.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          comments: commit,
        },
      },
      { new: true }
    );
    res.send({ commentPost });
  } catch (error) {
    res.send({ error });
  }
};

const commitdetail = async (req, res) => {
  try {
    const post = await POST.findById(req.params.id)
      .populate("comments.postedBy", "userName")
      .populate("postedBy", "userName");
    res.send(post);
  } catch (error) {
    res.send(error);
  }
};

const deletePost = async (req, res) => {
  try {
    const result = await POST.findByIdAndDelete(req.params.id);
    res.send({ result, success: true });
  } catch (error) {
    res.send({ error, success: false });
  }
};

const myFollowing = async (req, res) => {
  try {
    const user = await USER.findById(req.user);

    const followingPost = await POST.find({
      postedBy: { $in: user.following },
    })
      .populate("postedBy", "userName _id photo")
      .populate("comments.postedBy", "userName _id")
      .sort({ createdAt: -1 });

    res.send(followingPost);
  } catch (error) {
    res.send(error);
  }
};

module.exports = {
  CreatePost,
  allPosts,
  myPosts,
  unlikePost,
  likePost,
  postCommit,
  commitdetail,
  deletePost,
  myFollowing,
};
