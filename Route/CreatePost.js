const express = require("express");
const formidable = require("express-formidable")
const { CreatePost,allPosts ,myPosts,unlikePost,likePost,postCommit,commitdetail ,deletePost,myFollowing,searchApi} = require("../controller/CreatePostcontroller");
const { validation } = require("../middleware/Validation");

const app = express()



const router = express.Router();

router.post("/createPost", validation,formidable(),CreatePost);

router.get("/allposts",validation,allPosts)

router.get("/myposts",validation, myPosts )

router.put("/likePost",validation,likePost)

router.put("/unlikePost",validation,unlikePost)

router.put("/commit/:id",validation,postCommit)

router.get("/commitdetail/:id",validation,commitdetail)

router.delete("/delete/:id", validation, deletePost)

router.get("/myfollowing",validation , myFollowing)

router.get("/searching",validation,searchApi)

module.exports = router;
