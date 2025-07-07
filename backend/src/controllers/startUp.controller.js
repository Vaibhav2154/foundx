import { asyncHandler } from "../utils/asyncHandler.js";
import StartUp from "../models/startup.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const createStartUp = asyncHandler(async(req,res)=>{
    const {companyName, password} = req.body;
    if(!companyName || !password){
        throw new ApiError(404,"Company name and password are required");
    }
    const existedCompany = await StartUp.findOne({companyName:companyName})
    console.log("existedCompany:", existedCompany);
    if(existedCompany){
        throw new ApiError(409, "Company with this name already exists")
    }
        const startUp = await StartUp.create({
            companyName,
            password,
            ownerId:req.user._id
        })
    
    const createdStartUp = await StartUp.findById(startUp._id).select("-password")
    if(!createdStartUp){
        throw new ApiError(500, "Something went wrong while creating the startup")
    }
    return res.status(201).json(
        new ApiResponse(200, createdStartUp, "Startup created successfully"
    ))
   
})

const getStartUp = asyncHandler(async(req,res)=>{
    const startUp = await StartUp.find({ownerId:req.user._id}).select("-password")
    if(!startUp){
        throw new ApiError(404, "Startup not found")
    }
    console.log("startUp:", startUp);
    return res.status(200).json(
        new ApiResponse(200, startUp, "Startup retrieved successfully")
    )
})

//https://foundx.com/register?startup=665cd2e8e5ae623fda91c010
//const queryParams = new URLSearchParams(window.location.search);
//const startupId = queryParams.get("startup");


//in frontend, whent the user clicks on the startup, the user will be redirected to the getAccessStartUp route where from frontend companyName and password will be sent
const getAccessStartUp = asyncHandler(async(req,res)=>{
    const {companyName,password} = req.body;
    if(!companyName || !password){
        throw new ApiError(400, "company name and password are required");
    }
    const startUp = await StartUp.findOne({companyName:companyName})
    if(!startUp){
        throw new ApiError(404, "Startup not found")
    }
    if(!(await startUp.comparePassword(password))){
        throw new ApiError(401, "Invalid password");
    }
    return res.status(200).json(
        new ApiResponse(200, startUp, "Startup accessed successfully")
    )
})
//after accessing the startup, the user needs to register as an employee and the startup id should be saved in the user model and startup model should contain the employess array

//this route will be used to get all the employees of a startup
//the companyName will be sent from the frontend and the employees will be populated with the user no authMiddleware
const getEmployees = asyncHandler(async(req,res)=>{
    const {companyName} = req.body;
    if(!companyName){
        throw new ApiError(400, "company name is required")
    }
    const AllEmployees = await StartUp.find({companyName:companyName}).populate("employees", "-password -refreshToken")
    if(!AllEmployees || AllEmployees.length === 0){
        throw new ApiError(404, "No employees found for this startup")
    }
    return res.status(200).json(
        new ApiResponse(200, AllEmployees, "Employees retrieved successfully")
    )
})

const addEmployee = asyncHandler(async(req,res)=>{
    const {companyName, employeeId} = req.body;
    if(!companyName || !employeeId){
        throw new ApiError(400, "company name and employee ID are required")
    }
    const startUp = await StartUp.findOne({companyName:companyName})
    if(!startUp){
        throw new ApiError(404, "Startup not found")
    }
    if(startUp.employees.includes(employeeId)){
        throw new ApiError(409, "Employee already added")
    }
    startUp.employees.push(employeeId)
    await startUp.save()
    return res.status(200).json(
        new ApiResponse(200, startUp, "Employee added successfully")
    )
})

const addEmployeeToStartUp = asyncHandler(async(req,res)=>{
    const {email} = req.body;
    if(!email){
        throw new ApiError(400, "Email is required")
    }
    const User = (await import("../models/user.models.js")).default;
    const user = await User.findOne({email:email}).select("-password -refreshToken");
    if(!user){
        throw new ApiError(404, "User not found")
    }
    const startUp = await StartUp.findById(user.startUpId);
    if(!startUp){
        throw new ApiError(404, "Startup not found for this user")  
    }
    if(startUp.employees.includes(user._id)){
        throw new ApiError(409, "User is already an employee of this startup")
    }
    startUp.employees.push(user._id);
    await startUp.save();
    return res.status(200).json(
        new ApiResponse(200, startUp, "User added as employee successfully")
    )
})
const accessAndJoinStartUp = asyncHandler(async (req, res) => {
  const { companyName, password } = req.body;

  if (!companyName || !password) {
    throw new ApiError(400, "Company name and password are required");
  }

  const startUp = await StartUp.findOne({ companyName });
  if (!startUp) {
    throw new ApiError(404, "Startup not found");
  }

  const isMatch = await startUp.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid password");
  }

  const userId = req.user._id;

  if (!startUp.employees.includes(userId)) {
    startUp.employees.push(userId);
    await startUp.save();
  }

  const User = (await import("../models/user.models.js")).default;
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.startUpId = startUp._id;
  await user.save();

  return res.status(200).json(
    new ApiResponse(200, startUp, "Access granted and user added as employee")
  );
});

const removeEmployeeFromStartUp = asyncHandler(async (req, res) => {
    const { employeeId} = req.body;
    if(!employeeId){
        throw new ApiError(400, "Employee ID is required")
    }
    const User = (await import("../models/user.models.js")).default;
    const user = await User.findById(employeeId);
    if(!user){
        throw new ApiError(404, "User not found")
    }
    const startUp = await StartUp.findById(user.startUpId);
    if(!startUp){
        throw new ApiError(404, "Startup not found for this user")
    }
    if(!startUp.employees.includes(employeeId)){
        throw new ApiError(404, "User is not an employee of this startup")
    }
    startUp.employees = startUp.employees.filter(emp => emp.toString() !== employeeId.toString());
    await startUp.save();
    user.startUpId = null;
    await user.save();
    return res.status(200).json(
        new ApiResponse(200, startUp, "User removed from startup successfully")
    )
})


export {createStartUp, getStartUp, getAccessStartUp, getEmployees, addEmployee, accessAndJoinStartUp, addEmployeeToStartUp, removeEmployeeFromStartUp};