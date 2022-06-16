const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")


const userSchema = mongoose.Schema({
    profile: {
        type: String,
        required: false,
        default: null
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    posts: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Post" }
    ],
    followers: [
        { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    ],
    following: [
        { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    ]
})

userSchema.pre("save", async function (next) {
    if (this.isModified()) {

        this.password = await bcrypt.hash(this.password, 10)
    }
    next()
})

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = await jwt.sign({ user }, process.env.KEY)
  
    await user.save()
    return token
}

const User = mongoose.model('User', userSchema);

module.exports = User;  