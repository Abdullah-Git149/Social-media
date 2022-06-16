const express = require("express")
const app = express()
const connect = require("./db/db")
const userRouter = require("./router/userRouter")
const postRouter = require("./router/postRouter")
require("dotenv").config()
const cookieParser = require("cookie-parser")


app.use(cookieParser())
app.use(express.json())

app.use(userRouter)
app.use(postRouter)

const PORT = 5000

connect()
app.listen(PORT, (req, res) => {
    console.log(`Connection running on ${PORT}`);
})