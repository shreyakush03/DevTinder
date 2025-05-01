const express = require("express")
const requestRouter = express.Router()
const User = require("../models/user")
const { UserAuth } = require("../middlewares/auth")
const ConnectionRequest = require("../models/connectionRequest")

requestRouter.post("/request/send/:status/:toUserId",
    UserAuth,
    async (req, res) => {

        try {
            const loggedIn = req.user;
            const fromUserId = req.user._id;  //loggedIn user who is sending the request
            const toUserId = req.params.toUserId;
            const status = req.params.status;

            const AllowedStatus = ["ignored", "interested"];
            if (!AllowedStatus.includes(status)) {
                return res.status(400).send("Invalid status type " + status)
            }
            const toUser = await User.findById(toUserId)
            if (!toUser) {
                return res.status(404).json({
                    message: "User does not exists"
                })
            }
            const existingConnectionRequest = await ConnectionRequest.findOne({
                $or: [
                    { fromUserId, toUserId },
                    { fromUserId: toUserId, toUserId: fromUserId }
                ]
            })
            if (existingConnectionRequest) {
                return res
                    .status(400)
                    .json({
                        message: "Connection request already exists"
                    })
            }

            //    creating new instance of the connectionrequestmodel
            const connectionRequests = new ConnectionRequest({
                fromUserId,
                toUserId,
                status
            })

            const data = await connectionRequests.save(); //save it into db;
            res.json({
                message: loggedIn.firstName + " is " + status + " in " + toUser.firstName,
                data
            }
            )
        }
        catch (err) {
            res.status(400).send("Error: " + err.message)
        }

    });

requestRouter.post("/request/review/:status/:requestId",
    UserAuth,
    async (req, res) => {
        try {
            const loggedIn = req.user;
            const { status, requestId } = req.params;


            const AllowedStatus = ["accepted", "rejected"]
            if (!AllowedStatus.includes(status)) {
                return res.status(400).json({
                    message: "Status not specified"
                })
            }

            const connectionRequest = await ConnectionRequest.findOne({
                _id: requestId,
                toUserId: loggedIn._id,
                status: "interested"
            })

            if (!connectionRequest) {
                return res
                    .status(404)
                    .json({
                        message: "connection request not found"
                    })
            }

            // changing the status to accepted
            connectionRequest.status = status

            const data = await connectionRequest.save()
            res.json({
                message:"Connection request" + status,
                data
            })


        }
        catch (err) {

        }
    }
)

module.exports = requestRouter;