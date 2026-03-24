import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    default: null
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,  
    trim: true
  },
  password: {
    type: String,
    required: false,   
    default: null
  },
  authProvider: {
    type: String,
    enum: ["local", "google"], 
    default: "local"
  },
  avatar: {
    type: String,
    default: null     
  }
}, { timestamps: true })

// ✅ Virtual — never accidentally expose password in API responses
userSchema.methods.toJSON = function () {
  const user = this.toObject()
  delete user.password
  return user
}

const User = mongoose.model("User", userSchema)
export default User