const User = require("../model/User")
const bcrypt = require("bcryptjs")
const Post = require("../model/Post")

// user sign Up
const signUp = async (req, res) => {
    try {
        if (!req.body.name) {
            return res.status(400).json({ status: 0, msg: "Name is require" })
        } else if (!req.body.email) {
            return res.status(400).json({ status: 0, msg: "email is require" })
        } else if (!req.body.password) {
            return res.status(400).json({ status: 0, msg: "password is require" })
        }

        const check = await User.findOne({ email: req.body.email })
        if (check) {
            return res.status(400).json({ status: 0, msg: "use another email address" })

        } else {

            const user = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                profile: req.file.path
            })
            const token = await user.generateAuthToken()
            // console.log(token);
            // const newPost = await user.save()
            if (user) {
                return res.status(200).cookie("token", token, {
                    expires: new Date(Date.now() + 90 * 60 * 60 * 1000),
                    httpOnly: true
                }).json({ status: 1, msg: "Sign Up successful", token })
            }
        }


    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// user sign In
const signIn = async (req, res) => {
    try {
        if (!req.body.email) {
            return res.status(400).json({ status: 0, msg: "email is required" })

        } else if (!req.body.password) {
            return res.status(400).json({ status: 0, msg: "password is required" })

        }
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            return res.status(200).json({ status: 0, msg: "Email not found" })
        } else {


            const isMatch = await bcrypt.compare(req.body.password, user.password)


            if (!isMatch) {
                return res.status(400).json({ status: 0, msg: "Passsword not match" })
            } else {
                const token = await user.generateAuthToken()
                return res.status(200).cookie("token", token, {
                    expires: new Date(Date.now() + 9024 * 60 * 60 * 1000),
                    httpOnly: true
                }).json({ status: 1, msg: "Login successful", token })
            }
        }
    } catch (error) {
        console.log(error.message);
    }
}

const followUser = async (req, res) => {
    try {
        const loginUser = await User.findById(req.user._id)
        const otherUser = await User.findById(req.params.id)


        if (!otherUser) {
            return res.status(404).json({ message: 0, msg: "User not found" });
        } else {
            if (loginUser.following.includes(otherUser._id)) {


                const indexOfFollowing = loginUser.following.indexOf(otherUser._id)
                loginUser.following.splice(indexOfFollowing, 1)

                const indexOfFollower = otherUser.followers.indexOf(loginUser._id)
                otherUser.followers.splice(indexOfFollower, 1)

                await loginUser.save()
                await otherUser.save()
                return res.status(200).json({ status: 1, msg: "You unfollow the account" })
            } else {
                loginUser.following.push(otherUser._id)
                otherUser.followers.push(loginUser._id)

                await loginUser.save()
                await otherUser.save()

                return res.status(200).json({ status: 1, msg: "You follow the account" })
            }
        }
    } catch (error) {

        console.log(error.message);
    }
}


const getPostOfFollowing = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        const posts = await Post.find({ owner: { $in: user.following } })

        return res.status(200).json({ following: user.following, allposts: posts })

    } catch (error) {

        console.log(error.message);
    }
}

const logOut = async (req, res) => {
    try {
        return res.status(200).cookie("token", null, { expires: new Date(Date.now()), httpOnly: true }).json({ status: 1, msg: "Logout successfully" })
    } catch (error) {

        console.log(error.message);

    }
}


const updatePassword = async (req, res) => {
    try {

        const user = await User.findById(req.user._id)
        console.log(req.user._id);
        console.log(user.password);
        const isMatch = await bcrypt.compare(req.body.password, user.password)
        if (!isMatch) {
            res.status(400).json({ status: 0, msg: "Password mismatch" })
        } else {
            const hashPassword = await bcrypt.hash(req.body.newPassword, 10)
            const newUser = await User.findByIdAndUpdate({ _id: req.user._id }, { password: hashPassword })
            await newUser.save()
            return res.status(200).json({ status: 1, msg: "Password updated successfully " })
        }
    } catch (error) {

        console.log(error.message);
    }
}

const updateProfile = async (req, res) => {
    try {
        if (!req.body.name) {
            return res.status(404).json({ status: 0, msg: "Please enter a name" });
        } else if (!req.body.email) {
            return res.status(404).json({ status: 0, msg: "Please enter a email" });
        }
        const user = await User.findById(req.user._id)

        if (req.body.name) {
            user.name = req.body.name
        }
        if (req.body.email) {
            user.email = req.body.email
        }

        await user.save()
        return res.status(200).json({ status: 1, msg: "User updated successfully", user })
    } catch (error) {
        console.log(error.message);

    }
}

const deleteProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        const posts = user.posts
        const followers = user.followers
        const following = user.following
        const userId = user._id

        // LOGOUT USER

        await user.remove()


        // DELETE THE POSTS OF USER
        for (let i = 0; i < posts.length; i++) {
            const post = await Post.findById(posts[i])
            await post.remove()
        }

        // REMOVING USER FROM FOLLOWER'S FOLLOWING

        for (let i = 0; i < followers.length; i++) {
            const followerUser = await User.findById(followers[i])
            // console.log(followerUser);

            const index = followerUser.following.indexOf(userId)
            followerUser.following.splice(index, 1)
            await followerUser.save()

        }

        // REMOVING USER FROM FOLLOWING'S FOLLOWER


        for (let i = 0; i < following.length; i++) {
            const follows = await User.findById(following[i])
            // console.log(followerUser);
            const index = follows.followers.indexOf(userId)
            follows.followers.splice(index, 1)
            await follows.save()

        }

        return res.status(200).cookie("token", null, { expires: new Date(Date.now()), httpOnly: true }).json({ status: 1, msg: "Logout successfully and post deleted" })

    } catch (error) {
        console.log(error.message);

    }
}

const myProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate("posts")

        res.status(200).json({ status: 1, Profile: user })
    } catch (error) {

        console.log(error.message);
    }
}
module.exports = { signUp, signIn, followUser, getPostOfFollowing, logOut, updatePassword, updateProfile, deleteProfile, myProfile }