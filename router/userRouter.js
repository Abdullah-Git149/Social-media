const express = require("express")
const router = express.Router()
const { signUp, signIn, followUser, logOut, getPostOfFollowing, updatePassword, updateProfile, deleteProfile, myProfile } = require("../controller/userController")
const { upload } = require("../utils/utils")
const auth = require("../middleware/auth")



router.post("/api/signUp", upload.single("profile"), signUp)
router.post("/api/signIn", signIn)
router.get("/api/follow-user/:id", auth, followUser)
router.get("/api/show-posts", auth, getPostOfFollowing)
router.get("/api/logout", logOut)
router.post("/api/update-password", auth, updatePassword)
router.post("/api/update-user", auth, updateProfile)
router.post("/api/delete-user", auth, deleteProfile)
router.get("/api/user-profile", auth, myProfile)

module.exports = router