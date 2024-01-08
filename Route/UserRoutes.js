const express = require("express");
const { singup, singin ,userprofile,singleUserProfile,unFollowUser,followUser} = require("../controller/userController");
const { validation } = require("../middleware/Validation");

const router = express.Router();

router.post("/", singup);

router.post("/singin", singin);

router.get("/userprofile",validation,userprofile)

router.get("/singleUserProfile/:id",validation,singleUserProfile)

router.put("/follow/:id",validation,followUser)

router.put("/unfollow/:id",validation,unFollowUser)


module.exports = router;
