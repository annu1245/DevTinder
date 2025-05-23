const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    minLength: [2, "name is too sort"],
    maxLength: 50,
  },
  lastName: {
    type: String,
    trim: true,
    minLength: 2,
    maxLength: 50
  },
  emailId: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    minLength: 4,
    maxLength: 50,
    validate(value) {
      if(!validator.isEmail(value)) {
        throw new Error("Emailid is not valid " + value);
      }
    }
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: 3,
    maxLength: 100
  },
  age: {
    type: Number,
    min: 18
  },
  gender: {
    type: String,
    validate(value) {
      if(!['male', 'female', 'other'].includes(value)) {
        throw new Error("Invalid gender");
      }
    }
  },
  photoUrl: {
    type: String,
    default: "https://www.gse.org/wp-content/uploads/2021/03/avatar-dummy.png"
  },
  about: {
    type: String,
    default: "This is default about",
    trim: true,
    minLength: 4,
    maxLength: 100
  },
  skills: {
    type: [String]
  }
}, 
{
  timestamps: true
})

userSchema.methods.getJwt = async function() {
  const user = this;
  let token = await jwt.sign({_id: user._id}, "Secret@key12#45", {expiresIn: "1d"});
  return token;
}

userSchema.methods.validatePassword = async function(passwordInput) {
  const user = this;
  const passwordHash = user.password;
  const isPasswordValid = await bcrypt.compare(passwordInput, passwordHash);

  return isPasswordValid;
}

module.exports = mongoose.model("User", userSchema);