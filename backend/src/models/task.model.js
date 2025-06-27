import mongoose from "mongoose";

const taskSchema = await new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true,  
    },
    description:{
        type:String,
        trim:true,
    },
    members:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }],
    status:{
        type:String,
        enum:["not-started", "in-progress", "completed"],
        default:"not-started"
    },
    projectId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Project",
        required:true,
    }
})

export default mongoose.model("Task",taskSchema);