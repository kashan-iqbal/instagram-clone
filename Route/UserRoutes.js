const express = require("express");
const { singup, singin ,userprofile,singleUserProfile,unFollowUser,followUser,uploadImage,deleteImage} = require("../controller/userController");
const formidable = require("express-formidable")
const { validation } = require("../middleware/Validation");

const router = express.Router();

router.post("/", singup);

router.post("/singin", singin);

router.get("/userprofile",validation,userprofile)

router.get("/singleUserProfile/:id",validation,singleUserProfile)

router.put("/follow/:id",validation,followUser)

router.put("/unfollow/:id",validation,unFollowUser)

router.put("/upload-image",validation,formidable(),uploadImage)

router.put("/delete-image",validation,deleteImage)

module.exports = router;
