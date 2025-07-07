import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js"
import  User from "../models/user.models.js"
import StartUp from "../models/startup.model.js";
import  ApiResponse  from "../utils/ApiResponse.js";


const registerUser = asyncHandler( async (req, res) => {


    const {fullName, email, username, password,startUpId } = req.body
    //store the startUpId in localStorage in frontend after the get accessStartUp Route is called and then send it in the registerUser route and clear localStorage

    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username: username.toLowerCase() }, { email: email.toLowerCase().trim() }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }
    //console.log(req.files);

   

    const user = await User.create({
        fullName,
        email: email.toLowerCase().trim(), 
        password,
        username: username.toLowerCase(),
        startUpId: startUpId ? startUpId : null //if startUpId is not provided, it will be null
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(startUpId){
        const startUp = await StartUp.findById(startUpId);
        if(startUp){
            startUp.employees.push(user._id);
            await startUp.save();
        }
    }

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

} )

const loginUser = asyncHandler(async(req,res)=>{
    console.log("Login attempt with:", req.body);
    const {email,password} = req.body;
    if(!email || !password){
        throw new ApiError(400, "email and password are required")
    }
    
    // Convert email to lowercase to match the database schema
    const normalizedEmail = email.toLowerCase().trim();
    console.log("Searching for user with email:", normalizedEmail);
    const user = await User.findOne({email: normalizedEmail});
    console.log("Found user:", user ? "Yes" : "No");
    
    if(!user){
        console.log("User not found for email:", normalizedEmail);
        throw new ApiError(404,"User not found")
    }
    
    const isPasswordValid = await user.comparePassword(password);
    console.log("Password valid:", isPasswordValid);
    if(!isPasswordValid){
        throw new ApiError(401,"Invalid email or password")
    }
    
    const token = await user.generateAccessToken();
    const userData = await User.findById(user._id).select(
        "-password -refreshToken"
    );
    if(!userData){
        throw new ApiError(500, "Something went wrong while logging in the user")
    }
    const cleanUser = userData.toObject();
    
    return res.status(200).json(
        new ApiResponse(200, { ...cleanUser, token }, "User logged in Successfully")
    );
}
)

const logout = asyncHandler(async(req,res)=>{
    const userId = req.user?._id;
    console.log(req.user)
    if(!userId){
        throw new ApiError(400, "unauthorized")
    }
    await User.findByIdAndUpdate(userId, {$unset:{refreshToken:1}})

    res.clearCookie("accessToken")
    res.clearCookie("refreshToken")

    return res.status(200).json(
        new ApiResponse(200, {}, "logged out successfully")
    )
})



export { registerUser, loginUser, logout };