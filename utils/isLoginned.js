import dotenv from "dotenv"
import { User } from "../models/User.js"
dotenv.config()
import jwt from "jsonwebtoken"
import flash from "connect-flash"

export const loginnedUser = async(req,res,next)=>{
    let cookie = req.cookies.token
    
    if(!cookie){
        req.flash("error","Please login again")
        return res.redirect("/")
    }
    try {
        let decoded =await jwt.verify(cookie,process.env.JWT_SECRET)

        let user = await User.findOne({_id:decoded.UserId}).select("-password")

        if (!user) {
            req.flash("error", "User not found");
            return res.redirect("/");
        }
        
        req.user = user
        next()
        
    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
}