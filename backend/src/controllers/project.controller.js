import Project from "../models/projects.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";    
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const createProject = asyncHandler(async(req , res)=>{
    const {name, description,startDate, endDate, status} = req.body;

    if(!name || !description){
        throw new ApiError(400, "Project name and description are required")
    }

    const project  = await Project.create({
        name, 
        description,
        startDate:startDate ? new Date(startDate):new Date(),
        endDate:endDate ? new Date(endDate):null,
        status:status?status:"not-started",
        owner:req.user._id,
        startUpId:req.user.startUpId,
        members:[req.user._id] //initially the project will have only the owner as a member
    })

    if(!project){
        throw new ApiError(500, "something went wrong while creating the project")
    }
    return res.status(201).json(
        new ApiResponse(200, project, "Project created successfully")
    )
})

{/*{
    "statusCode": 200,
    "data": {
        "name": "abc",
        "description": "learn abc",
        "startDate": "2025-06-22T14:22:26.240Z",
        "endDate": null,
        "status": "not-started",
        "owner": "685801915eb89d79e5f63b6b",
        "startUpId": "6857e0a2daede50d35746e18",
        "members": [
            "685801915eb89d79e5f63b6b"
        ],
        "tasks": [],
        "_id": "685811a2a825dd14877b86ff",
        "__v": 0
    },
    "message": "Project created successfully",
    "success": true
}*/}


const getProjects = asyncHandler(async(req,res)=>{
    const getAllProjects = await Project.find({startUpId:req.user.startUpId})
    if(!getAllProjects || !getAllProjects.length){
        throw new ApiError(404, "No project found for this startup")
    }
    return res.status(200).json(
        new ApiResponse(200, getAllProjects, "projects retrieved successfully")
    )
})

//const projectId = res.data.data._id; at the frontend, this will be passed as a parameter in the delete request

const deleteProject = asyncHandler(async(req,res)=>{
    const {projectId} = req.params;
    console.log("projectId:", projectId);
    console.log("req.params:", req.params);
    if(!projectId){
        throw new ApiError(400, "Project Id is required")
    }
    const project = await Project.findByIdAndDelete(projectId);
    if(!project){           
        throw new ApiError(404, "Project not found")
    }
    return res.status(200).json(
        new ApiResponse(200, null, "Project deleted successfully")
    )
})


const updateProject = asyncHandler(async(req,res)=>{
    const {projectId} = req.params;
    const {name, description, startDate, endDate, status} = req.body;
    if(!projectId){
        throw new ApiError(400, "ProjectId not provided")
    }
    if(!name || !description){
        throw new ApiError(400, "Project name and description are required")
    }
    const project = await Project.findByIdAndUpdate(projectId,{
        name,
        description,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : null,            
        status: status ? status : "not-started",
    }, {new: true});
    if(!project){
        throw new ApiError(404, "Project not found")
    }
    return res.status(200).json(
        new ApiResponse(200, project, "Project updated successfully")
    )
})

const getProjectById = asyncHandler(async(req,res)=>{
    const {projectId} = req.params;
    if(!projectId){
        throw new ApiError(400, "Project Id is required")
    }
    const project = await Project.findById(projectId).populate("members", "-password -refreshToken").populate("owner", "-password -refreshToken").populate("tasks"); //check once again
    if(!project){   
        throw new ApiError(404, "Project not found")
    }   
    return res.status(200).json(
        new ApiResponse(200, project, "Project retrieved successfully")
    )
})


//carefull while integration proper projectId and memberId should be passed from the frontend and onClick listener should be added to the button that calls the send function in frontend and pass user id thorugh it
const addMembersToProject = asyncHandler(async(req,res)=>{
    const {projectId, memberId} = req.body;
    if(!projectId || !memberId){
        throw new ApiError(400, "Project Id and Member Id are required")
    }
    const project = await Project.findById(projectId);
    if(!project){
        throw new ApiError(404, "project not found")
    }
    project.members.push(memberId);
    await project.save();
    return res.status(200).json(
        new ApiResponse(200, project, "Member added to project successfully")
    )
})

const removeMembers = asyncHandler(async(req,res)=>{
    const {projectId, memberId} = req.body;

    if(!projectId || !memberId){
        throw new ApiError(400, "Project Id and Member Id are required")
    }
    const project = await Project.findById(projectId);
    if(!project){
        throw new ApiError(404, "Project not found")
    }
    const memberIndex = project.members.indexOf(memberId);
    if(memberIndex === -1){     
        throw new ApiError(404, "Member not found in project")
    }
    project.members.splice(memberIndex, 1);
    await project.save();
    return res.status(200).json(
        new ApiResponse(200, project, "Member removed from project successfully")
    )
    
})

export {createProject, getProjects, deleteProject, updateProject, getProjectById, addMembersToProject, removeMembers}
