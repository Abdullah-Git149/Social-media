const express = require("express")
const router = express.Router()
const { upload } = require("../utils/utils")
const auth = require("../middleware/auth")
const { createPost, likeAndUnlink } = require("../controller/postController")



router.post("/api/create-post", upload.single("image"), auth, createPost)
router.get("/api/like/:id", auth, likeAndUnlink)


module.exports = router