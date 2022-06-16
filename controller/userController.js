const User = require("../model/User")
const bcrypt = require("bcryptjs")

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
                console.log(token);
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
module.exports = { signUp, signIn }