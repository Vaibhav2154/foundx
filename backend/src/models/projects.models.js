import mongoose from 'mongoose';
import {Schema} from 'mongoose';

const projectSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    description:{
        type:String,
        required:true,
        trim:true,
    },
    startDate:{
        type:Date,
        default:Date.now,
    },
    endDate:{
        type:Date,
        
    },
    status:{
        type:String,
        enum:["not-started", "in-progress", "completed", "on-hold"],
        default:"not-started"
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    startUpId:{
        type:Schema.Types.ObjectId,
        ref:"StartUp",
        required:true,
    },
    members:[{
        type:Schema.Types.ObjectId,
        ref:"User",
    }],
    tasks:[{
       type:Schema.Types.ObjectId,
        ref:"Task",
    }]
})

export default mongoose.model("Project", projectSchema);