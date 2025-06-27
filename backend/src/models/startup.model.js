import mongoose from "mongoose";
import bcrypt from "bcrypt";

const startupSchema = new mongoose.Schema({
    companyName:{
        type:String,
        required:true,
        trim:true,
    },
    ownerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    password:{
        type:String,
        required:true,
        trim:true,
    },
    employees:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }],
    projects:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Project",
    }]

})
startupSchema.pre("save", async function (next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password,10)
    next();
})
startupSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password);
}
export default mongoose.model("StartUp",startupSchema);