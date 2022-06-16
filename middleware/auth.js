const User = require("../model/User")
const jwt = require("jsonwebtoken")

const auth = async (req, res, next) => {
    const { token } = req.cookies

    if (!token) {
        return res.status(401).json({ status: 0, msg: "Please login" })
    }
    const decoded = await jwt.verify(token, process.env.KEY)

    req.user = await User.findById(decoded.user._id)
    next()
}

module.exports = auth