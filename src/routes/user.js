const express = require("express");
const { UserAuth } = require("../middlewares/auth");
const userRouter = express.Router();
const User = require("../models/user")

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

            res.json({ data })



        } catch (err) {

        }
    }
);

userRouter.get("/feed",
    UserAuth,
    async (req, res) => {
        try {

            const loggedInUser = req.user;

            const page = parseInt(req.query.page) || 1
            let limit = parseInt(req.query.limit) || 10;
            limit = limit > 50 ? 50 : limit;

            const skip = (page - 1) * limit;


            const connectionRequest = await ConnectionRequest.find({
                $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }]
            })
                .select("fromUserId  toUserId");


            const hideUserFromFeed = new Set();
            connectionRequest.forEach((req) => {
                hideUserFromFeed.add(req.fromUserId.toString());
                hideUserFromFeed.add(req.toUserId.toString())
            });

            const user = await User.find({
                $and: [
                    { _id: { $nin: Array.from(hideUserFromFeed) } },
                    { _id: { $ne: loggedInUser._id } }
                ]
            })
                .select(USER_SAFE_DATA)
                .skip(skip)
                .limit(limit)
           res.json({data:user})
        }
        catch (err) {
            res
                .status(400)
                .json({
                    message: err.message

                })
        }
    }
)

module.exports = userRouter;