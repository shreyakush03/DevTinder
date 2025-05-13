const express = require("express")
const authRouter = express.Router();
const User = require("../models/user")
const {ValidateSignupData} = require("../utils/validation")
const bcrypt = require("bcrypt")  

authRouter.post("/signup", async (req, res) => {
    try {
        //  validation of data 
        ValidateSignupData(req);

        // encrypting the passsword
        const { firstName, lastName, emailId, password } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        console.log(passwordHash);

        // creating a new instance of the User model
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
        })
        await user.save();
        res.send("data added successfully")
    } catch (err) {
        res.status(400).send("ERROR : " + err.message)
    }
});
  
authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId })
    
        if (!user) {
            throw new Error("Enter valid emailId")
        }
        const isPasswordValid = await user.validatePassword(password)

        if (isPasswordValid) {
            //   create a jwt token, pass the data which you want to hide along with that add a secret key
            const token = await user.getJWT();
            // Add the token to the cookie and send back the response to the user
           res.cookie("token", token)
           
            res.send(user)
        } else {
            throw new Error("Incorrect password")
        }
    }
    catch (err) {
        res.status(404).send("Error : " + err.message)
    }
})

authRouter.post("/logout", async (req,res)=>{
    res.cookie("token", null,{
        expires: new Date(Date.now())
    });
    res.send("You have been logout successfully")
})


module.exports = authRouter;

