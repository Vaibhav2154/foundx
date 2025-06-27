import Task from "../models/task.model.js";
import Project from "../models/projects.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const createTask = asyncHandler(async(req,res)=>{
    const {title, description,status } = req.body;
    const {projectId} = req.params;

//projectId must be sent from the frontend
    if(!title || !description ){
        throw new ApiError(404, "Title and description not found")
    }

    if(!projectId){
        throw new ApiError(404, "projectId needed")
    }

    const task = await Task.create({
        title,
        description,
        status,
        projectId
    })

    if(!task){
        throw new ApiError(404,"Task not created")
    }

    return res.status(200).json(
        new ApiResponse(200, task," task creation successfull")
    )

})

const assignMember = asyncHandler(async(req , res)=>{
    console.log(req.body);
    const {memberId, taskId} = req.body;
    if(!memberId){
        throw new ApiError(404, "Member Id not found");
    }
    const task = await Task.findById(taskId);
    if(!task){
        throw new ApiError(404, "Not found task")
    }
    task.members.push(memberId);
    await task.save();
    return res.status(200).json(
        new ApiResponse(200, task, "Member addition completed")
    )
})

const deAssignMember = asyncHandler(async(req,res)=>{
    const {memberId, taskId} = req.body;
    if(!memberId){
        throw new ApiError(400, "Member id is not specified")
    }
    const task = await Task.findById(taskId);
    if(!task){
        throw new ApiError(404, "Proper task id is required");
    }
    task.members.pull(memberId);
    await task.save();

    return res.status(200).json(
        new ApiResponse(200, task, "Member deletion completed")
    )

})

// from frontend only the words present in task database must be sent to update tasks "not-started", "in-progress", "completed" 
// same route for editing or updating changes also
const updateTask = asyncHandler(async(req,res)=>{
    const {updateStatus, taskId, description,title} = req.body;
    if(!updateStatus){
        throw new ApiError(404, "Task status needs to be provided")
    }
    const task = await Task.findById(taskId);
    if(!task){
        throw new ApiError(404, "task not found");
    }
    if(updateStatus === task.status){
        throw new ApiError(400, "the task is already updated")
    }
    task.status = updateStatus;
    task.description = description;
    task.title = title;
    await task.save();

    return res.status(200).json(
        new ApiResponse(200, task,"updated status of the task")
    )
})


export {createTask, assignMember, updateTask, deAssignMember}