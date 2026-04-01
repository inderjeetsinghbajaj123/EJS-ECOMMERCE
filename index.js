import express from "express"
import cookieParser from "cookie-parser"
import path from "path"
import { config } from "dotenv"
import session from "express-session"
import dotenv from "dotenv"
import router from "./routes/userRouter.js"
import Prodrouter from "./routes/productRouter.js"
import mainRouter from "./routes/router.js"
import {connectDB} from "./config/mongo.js"
import flash from "connect-flash"

dotenv.config()
import { fileURLToPath } from "url";
import Ownerrouter from "./routes/ownerRouter.js"
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000
const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))


app.use(session({
    resave:false,
    saveUninitialized:false,
    secret: process.env.SESSION_SECRET
}))

app.use(flash())
app.use((req, res, next) => {
    res.locals.error = req.flash("error") || [];
    next();
});

app.set("view engine" , "ejs")
app.use(express.static(path.join(__dirname , "public")))

app.use("/user" , router)
app.use("/products",Prodrouter)
app.use("/owner",Ownerrouter)


app.use("/", mainRouter);
connectDB()
app.listen(PORT , ()=>{
    console.log(`app running on ${PORT}`)
})