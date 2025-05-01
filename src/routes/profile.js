const express = require("express")
const { UserAuth } = require("../middlewares/auth");
const User = require("../models/user")
const bcrypt = require("bcrypt")
const { ValidateEditProfileData } = require("../utils/validation")
const profileRouter = express.Router();


profileRouter.get("/profile/view", UserAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user)
    } catch (err) {
        res.status(400).send("Error : " + err.message)
    }
})

profileRouter.patch("/profile/edit", UserAuth, async (req, res) => {
    try {
        if (!ValidateEditProfileData(req)) {
            throw new Error("Invalid edit requests")
        }
        const loggedInUser = req.user;
        console.log(loggedInUser)

        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]))

        await loggedInUser.save()

        res.json({
            message: `${loggedInUser.firstName}, Your profile was updated successfully `,
            info: loggedInUser
        })


    } catch (err) {
        res.status(400).send("Error : " + err.message)

    }
})

profileRouter.patch("/profile/password", UserAuth, async (req, res) => {

    const { password } = req.body;
    const user = req.user
    user.password = await bcrypt.hash(password, 10);
    
    await user.save()
    res.send("New password")
})


module.exports = profileRouter;