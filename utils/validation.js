const validator = require("validator");

const validateSignUpData = (req) => {
  const {firstName, lastName, emailId, password} = req.body;
  if(!firstName || !lastName) {
    throw new Error("Name is not valid")
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Invalid Email Id")
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please Enter a strong password")
  }
}


const validateProfileUpdateData = (req) => {
  if(req.body.skills.length > 50) {
    throw new Error("Too much skills not allowed")
  }

  const allowedProfileData = ["age", "gender", "skills", "about", "profileUrl"];
  const isProfileEditAllowed = Object.keys(req.body).every(field => allowedProfileData.includes(field))
  return isProfileEditAllowed;
}

module.exports = {
  validateSignUpData,
  validateProfileUpdateData
}