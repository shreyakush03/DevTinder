const User = require("../models/user");
const jwt = require("jsonwebtoken")

const UserAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).send("Please login ")
            // throw new Error("You need to login!!!!!")
        }
        const decodeData = await jwt.verify(token, "DevTinder@123")
        
        const { _id } = decodeData;

        const user = await User.findById(_id)
        if (!user) {
            throw new Error("User not found")
        }
        req.user = user;
        next();
    }
    catch (err) {
        res.status(400).send("Error : " + err.message)
    }
}
module.exports = {
    UserAuth,
}