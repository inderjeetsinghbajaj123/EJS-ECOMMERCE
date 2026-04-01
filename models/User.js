import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        minLength:3,
        trim:true
    },
    email:String,
    password:String,
    Cart:{
        type:Array,
        default:[]
    },
    orders:{
        type:Array,
        default:[]
    },
    contact:Number,
    picture:String
})


export const User = mongoose.model("User" , UserSchema)