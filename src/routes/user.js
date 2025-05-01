const express = require("express");
const { UserAuth } = require("../middlewares/auth");
const userRouter = express.Router();

const ConnectionRequest = require("../models/connectionRequest")

const USER_SAFE_DATA = "firstName lastName photoURL skills"

userRouter.get("/user/requests/received",
    UserAuth,
    async (req, res) => {
        try {
            const loggedInUser = req.user;
            const connectionRequest = await ConnectionRequest.find({
                toUserId: loggedInUser._id,
                status: "interested"
            }).populate("fromUserId", USER_SAFE_DATA)

            res.json({
                message: "All the interested requests",
                data: connectionRequest
            })
        } catch (err) {
            res.status(400).send("Error :" + err.message)
        }
    }
);

userRouter.get("/user/connection",
    UserAuth,
    async (req, res) => {
        try {
            const loggedIn = req.user;
            const connectionRequest = await ConnectionRequest.find({
                $or: [
                    { toUserId: loggedIn._id, status: "accepted" },
                    { fromUserID: loggedIn._id, status: "accepted" },
                ],
            })
                .populate("fromUserId", USER_SAFE_DATA)
                .populate("toUserId", USER_SAFE_DATA);

            const data = await connectionRequest.map((row) => {
                if (row.fromUserId._id.toString() === loggedIn._id.toString()) {
                    return row.toUserId
                }
                return row.fromUserId
            })

            res.json({data})



        } catch (err) {

        }
    }
)

module.exports = userRouter;