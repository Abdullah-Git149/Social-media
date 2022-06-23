const Post = require("../model/Post")
const User = require("../model/User")


const createPost = async (req, res) => {
    try {
        const post = await Post({
            caption: req.body.caption,
            image: req.file.path,
            owner: req.user._id
        })

        const user = await User.findById(req.user._id)


        user.posts.push(post._id)
        await user.save()
        const newPost = await post.save()
        if (newPost) {

            return res.status(201).json({ status: 1, msg: "Post created", post: newPost })
        }
    } catch (error) {
        res.status(500).send(error.message)
    }
}

// LIKE AND UNLIKE API

const likeAndUnlink = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(404).json({ status: 0, msg: "Post not found" })
        } else {

            if (post.likes.includes(req.user._id)) {
                const index = post.likes.indexOf(req.user._id)
                post.likes.splice(index, 1)
                await post.save()
                return res.status(200).json({ status: 0, msg: "Post unlike" })
            } else {
                post.likes.push(req.user._id)
                await post.save()
                return res.status(200).json({ status: 0, msg: "Post like" })
            }
        }


    } catch (error) {
        res.status(500).send(error.message)

    }
}

const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(404).json({ status: 0, msg: "Post not found" })
        }
        if (post.owner.toString() !== req.user._id.toString()) {
            return res.status(404).json({ status: 0, msg: "Unauthorized" })
        }
        await post.remove()
        const user = await User.findById(req.user._id)
        const index = user.posts.indexOf(req.params.id)
        user.posts.splice(index, 1)
        await user.save()
        console.log(user);

        return res.status(200).json({ status: 1, msg: "Post is deleted successfully" })
    } catch (error) {

        res.status(500).send(error.message)
    }
}

const updateCaption = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(404).json({ status: 0, msg: "Post not found" })
        } else {
            if (!req.body.caption) {
                return res.status(404).json({ status: 0, msg: "caption is requied" })
            }

            if (post.owner.toString() !== req.user._id.toString()) {
                return res.status(404).json({ status: 0, msg: "Unauthorized" })
            } else {
                post.caption = req.body.caption
                await post.save()
                return res.status(200).json({ status: 1, msg: "Caption saved successfully", post })
            }
        }
    } catch (error) {

        res.status(500).send(error.message)
    }
}

const addComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(404).json({ status: 0, msg: "Post not found" })
        }

        let commentIndex = -1
        post.comments.forEach((item, index) => {
            if (item.user.toString() === req.user._id.toString()) {
                commentIndex = index
            }
        })
        if (commentIndex !== -1) {
            post.comments[commentIndex].comment = req.body.comment

            post.save()
            return res.status(200).json({ status: 1, msg: "comment updated successfully" })
        } else {
            post.comments.push({
                user: req.user._id,
                comment: req.body.comment
            })
            await post.save()
            return res.status(200).json({ status: 1, msg: "comment added successfully" })
        }
    } catch (error) {

        res.status(500).send(error.message)
    }
}

const deleteComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(404).json({ status: 0, msg: "Post not found" })
        }

        if (post.owner.toString() === req.user._id.toString()) {
            if (!req.body.commentId) {
                return res.status(400).json({ status: 0, msg: "Comment id not found" })
            }
            post.comments.forEach((item, index) => {
                if (item.user.toString() === req.body.commentId.toString()) {
                    return post.comments.splice(index, 1);
                }
            })
            await post.save()
            return res.status(200).json({ status: 1, msg: "selected comment has deleted successfully" })
        } else {
            post.comments.forEach((item, index) => {
                if (item.user.toString() === req.user._id.toString()) {
                    return post.comments.splice(index, 1);
                }
            })
            await post.save()
            return res.status(200).json({ status: 1, msg: "your comment has deleted successfully" })

        }
    } catch (error) {

        res.status(500).send(error.message)
    }
}

module.exports = { createPost, likeAndUnlink, deletePost, updateCaption, addComment, deleteComment }