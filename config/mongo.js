import mongoose from "mongoose";
import { config } from "dotenv"
import dotenv from "dotenv"
dotenv.config()
export const connectDB = async()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}`)
        console.log("mongodb connected")
    } catch (error) {
        console.log("Error from mongodb : " , error)
    }
}