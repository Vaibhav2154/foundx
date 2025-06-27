import jwt from 'jsonwebtoken';
import User from '../models/user.models.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import {asyncHandler} from '../utils/asyncHandler.js';

const authMiddleware = asyncHandler(async(req,res, next)=>{
    const authHeader = req.headers.authorization;
    console.log("authHeader:",authHeader);
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        throw new ApiError(401, "You are not authorized to access this resource")
    }

    const token = authHeader.split(" ")[1];
    console.log("token:", token);
    if(!token){
        throw new ApiError(401, "You are not authorized to access this resource")
    }
    try{
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decoded._id).select("-password -refreshToken")
        if(!user){
            throw new ApiError(404, "user not found")
        }
        req.user = user;
        next();
    }catch(error){
        throw new ApiError(401, "Invalid token or token expired");
    }
})

export {authMiddleware}