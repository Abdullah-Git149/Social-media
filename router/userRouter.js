const express = require("express")
const router = express.Router()
const { signUp, signIn } = require("../controller/userController")
const { upload } = require("../utils/utils")




router.post("/api/signUp", upload.single("profile"),  signUp)
router.post("/api/signIn", signIn)

module.exports = router