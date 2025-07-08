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

    const project = await Project.findById(projectId);
    if(!project){
        throw new ApiError(404, "Project not found")
    }   
    project.tasks.push(task._id);
    await project.save();
    if(!task){
        throw new ApiError(404,"Task not created")
    }

    return res.status(200).json(
        new ApiResponse(200, task," task creation successfull")
    )

})

const getTasksByProject = asyncHandler(async(req,res)=>{
    const {projectId} = req.params;
    if(!projectId){
        throw new ApiError(404, "Project Id not found")
    }
    const tasks = await Task.find({projectId: projectId}).populate("members", "fullName email username");
    if(!tasks || tasks.length === 0){
        throw new ApiError(404, "No tasks found for this project")
    }
    return res.status(200).json(
        new ApiResponse(200, tasks, "Tasks retrieved successfully")
    )
})

const getAllTasks = asyncHandler(async(req,res)=>{
    const {startUpId} = req.body;
    console.log("StartUp Id:", startUpId);
    if(!startUpId){
        throw new ApiError(404, "StartUp Id not found")
    }
    const projects = await Project.find({startUpId: startUpId}).select("_id title");
    if(!projects || projects.length === 0){
        throw new ApiError(404, "No projects found for this startup")
    }
    const projectIds = projects.map(project => project._id);
    const tasks = await Task.find({projectId: {$in: projectIds}}).populate("members", "fullName email username");
    if(!tasks || tasks.length === 0){
        throw new ApiError(404, "No tasks found for this startup")
    }
    return res.status(200).json(
        new ApiResponse(200, tasks, "Tasks retrieved successfully")
    )
})
const assignMember = asyncHandler(async(req , res)=>{
    
    const {memberEmail, taskId} = req.body;
    if(!memberEmail || !taskId){
        throw new ApiError(400, "Member email and task id are required")
    }
    const task = await Task.findById(taskId);
    if(!task){
        throw new ApiError(404, "Proper task id is required");
    }
    const User = (await import("../models/user.models.js")).default;
    const member = await User.findOne({ email: memberEmail });
    if(!member){
        throw new ApiError(404, "Member not found");
    }
    if(task.members.includes(member._id)){
        throw new ApiError(400, "Member is already assigned to this task");
    }
    
    task.members.push(member._id);
    await task.save();
    return res.status(200).json(
        new ApiResponse(200, task, "Member addition completed")
    )
})

const deAssignMember = asyncHandler(async(req,res)=>{
    const {memberEmail, taskId} = req.body;
    if(!memberEmail || !taskId){
        throw new ApiError(400, "Member email and task id are required")
    }
    const task = await Task.findById(taskId);
    if(!task){
        throw new ApiError(404, "Proper task id is required");
    }
    const User = (await import("../models/user.models.js")).default;
    const member = await User.findOne({ email: memberEmail });
    if(!member){
        throw new ApiError(404, "Member not found");
    }
    task.members = task.members.filter(memberId => memberId.toString() !== member._id.toString());
    await task.save();
    return res.status(200).json(
        new ApiResponse(200, task, "Member de-assignment completed")
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


export {createTask, assignMember, updateTask, deAssignMember, getAllTasks,getTasksByProject}