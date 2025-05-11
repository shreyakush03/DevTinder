const express = require("express")
const connectDb = require("./config/database")
const app = express()
const cookieParser = require("cookie-parser")
const cors = require("cors")

app.use(cors())
app.use(express.json());
app.use(cookieParser())

const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/", authRouter) 
app.use("/", profileRouter)
app.use("/", requestRouter)
app.use("/", userRouter)

connectDb().then(() => {
    console.log("Database connection established")
    app.listen(7777, () => {
        console.log("server is successfully listening on port 7777")
    })
}).catch(err => {
    console.error("Database cannot be established")
})
