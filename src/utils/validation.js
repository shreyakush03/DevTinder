const validator = require("validator")

const ValidateSignupData = (req) => {
   const { firstName, lastName, emailId, password } = req.body;
   if (!firstName || !lastName) {
      throw new Error("Enter valid name");
   }
   else if (!validator.isEmail(emailId)) {
      throw new Error("Enter valid emailId");
   }
   else if (!validator.isStrongPassword(password)) {
      throw new Error("Password is invalid");
   }
}

const ValidateEditProfileData = (req) => {
   const allowedEditFields = ["age", "skills", "photoUrl"]

   const isEditAllowed = Object.keys(req.body).every(field => 
      allowedEditFields.includes(field));

   return isEditAllowed;
}

module.exports = { ValidateSignupData, ValidateEditProfileData }


