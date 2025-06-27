import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Schema } from "mongoose";
const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    role:{
        type:String,
        enum:["team-member","team-lead","CEO"],
        default:"team-member"
    },
    startUpId:{
        type:Schema.Types.ObjectId,
        ref:"StartUp",
    },
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: { type: String }
},
    {
        timestamps: true
    }
);
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};
userSchema.methods.generateAccessToken = function () {
    console.log(process.env.ACCESS_TOKEN_SECRET);
    const token = jwt.sign({ _id: this._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
    return token;
};
userSchema.methods.generateRefreshToken = function () {
    const refreshToken = jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });
    this.refreshToken = refreshToken;
    return refreshToken;
}
export default mongoose.model("User", userSchema);