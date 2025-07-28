const mongoose = require("mongoose");
const validator = require("validator")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const UserSchema = mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            minLenth:4,
            maxLength:30,
        },
        lastName: {
            type: String
        },
        emailId: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            validate(value){
                if(!validator.isEmail(value)){
                    throw new Error("Invalid Email " + value)
                }
            }
        },
        password: {
            type: String,
            required: true,
            validate(value){
                if(!validator.isStrongPassword(value)){
                    throw new Error("Enter strong password" + value)
                }
            }
        },
        age: {
            type: Number
        },
        gender: {
            type: String,
            enum :{
                values:["male","female","others"],
                message:`{VALUE} not a gender`
            },
            validate(value) {
                if (!["male", "female", "others"].includes(value)) {
                    throw new Error("Gender data is in valid")
                }
            }
        },
        about: {
            type: String,
            default: "Hey! hope you're doing well "
        },
        photoUrl: {
            type: String,
        },
        skills: {
            type: [String]
        }
    },
    {
        timestamps: true
    }
);

UserSchema.index({firstName:1});
UserSchema.index({gender:1})

UserSchema.methods.getJWT = async function(){
   
    const user = this;
    const token = await jwt.sign({_id: user._id}, "DevTinder@123")
    return token;
}
UserSchema.methods.validatePassword = async function(passwordInputByUser){
    const user = this;
    const passwordHash = user.password

    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash)

    return isPasswordValid;

}

module.exports = mongoose.model("User", UserSchema)
