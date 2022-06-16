const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    caption: {
        type: String,
        trim: true,
        default: null
    },
    image: {
        type: String,
        default: null
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    likes: [
        { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    ],
    comments: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        comment: { type: String, required: true }
    }],
    
})


const Post = mongoose.model("Post", postSchema)
module.exports = Post