
import express from "express"
import { loginUser, logout , registerUser } from "../controllers/auth.controller.js"

const router = express.Router()
router.post("/create" , registerUser)
router.post("/login" , loginUser)
router.get("/logout",logout)
export default router