const express = require("express")
const router = express.Router()
const { upload } = require("../utils/utils")
const auth = require("../middleware/auth")
const { createPost, likeAndUnlink, deletePost, updateCaption, addComment ,deleteComment} = require("../controller/postController")



router.post("/api/create-post", upload.single("image"), auth, createPost)
// router.get("/api/like/:id", auth, likeAndUnlink).delete(auth, deletePost)
// router.get("/api/like/:id", auth, likeAndUnlink).delete(auth, deletePost)
// router.route("/api/like/:id").get(auth, likeAndUnlink).delete(auth, deletePost)
router.get("/api/like/:id", auth, likeAndUnlink)
router.delete("/api/delete/:id", auth, deletePost)
router.post("/api/update-caption/:id", auth, updateCaption)
router.post("/api/add-comment/:id", auth, addComment)
router.post("/api/delete-comment/:id", auth,deleteComment)


module.exports = router