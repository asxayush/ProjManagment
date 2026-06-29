import { User } from "../models/user.models.js"
import {ApiError} from "../utils/api-error.js"
import { asyncHandler} from "../utils/async-handler.js"
import jwt from "jsonwebtoken"



export const verifyJWT = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")

    if(!token){
        throw new ApiError(401, "unauthorised access")
    }

    try {
       const decodedToken  =  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
       console.log("DECODED:", decodedToken)
      const user =  await User.findById(decodedToken?._id).select( "-password -refreshToken -emailVerificationToken -emailVerificationExpiry")
      console.log("USER:", user)


      if(!user){
        console.log("JWT ERROR:", error.message) 
        throw new ApiError(401, "invalid access token")
      }
      req.user = user
      next()
    } catch (error) {
        throw new ApiError(401, "invalid access token")
    }
})