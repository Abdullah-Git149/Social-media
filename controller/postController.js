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
module.exports = { createPost ,likeAndUnlink}