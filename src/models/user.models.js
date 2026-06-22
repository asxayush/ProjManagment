import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import crypto from "crypto"

const userSchema = new Schema(
    {
        avatar: {
            type:{
                url: String,
                localPath: String
            },
            default: {
                url: `https://placehold.co/600x400`,
                localPath: ""
            }
        },
        username: {
            type: String,
            required: true, // required field otherwise u can't go ahead
            unique: true, // username should be uniquee
            lowercase: true,
            trim: true, // no space
            index: true,
        }, 
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullName: {
            type: String,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        refreshToken: {
            type: String,
        },
        forgotPasswordToken: {
            type: true,
        },
        forgotPasswordExpiry: {
            type: Date,
        },
        emailVerificationToken: {
            type: String,
        },
        emailVerificationExpiry: {
            type: Date,
        },
    }, 
    {
        timestamps: true,
    }
)

userSchema.pre("save", async function (next) { // arrow fn does not have their own this so we ave to use normal fn
    if(!this.isModified("password")) return next() // we have to encrypt the password one time only if we don't use this code then password will be encrypted everytime with a new value whenever user press save

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            __id: this.__id,
            email: this.email,
            username: this.username
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: process.env.ACCESS_TOKEN_EXPIRY}
    )
}

userSchema.methods.generateRefreshToken = function () {
   return jwt.sign(
        {
            __id: this.__id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: process.env.REFRESH_TOKEN_EXPIRY}
    )
}

userSchema.methods.generateTemporaryToken = function () {
    const unHashedToken = crypto.randomBytes(20).toString("hex")

    const hashedToken = crypto
    .createHash("sha256")
    .update(unHashedToken)
    .digest("hex")
    

    const tokenExpiry = Date.now() + (20*60*1000) // 20 mins

    return {unHashedToken, hashedToken, tokenExpiry}
}


export const User = mongoose.model('User', userSchema)