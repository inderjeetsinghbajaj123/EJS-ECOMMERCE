import express from "express";
import { loginnedUser } from "../utils/isLoginned.js";
import flash from "connect-flash"
const router = express.Router();
import { Product } from "../models/Product.js";

router.get("/", (req, res) => {
    let error = req.flash("error")
    res.render("index");
});

router.get("/shop", loginnedUser, async(req, res) => {
   const products = await Product.find(); 

    res.render("shop", {
        user: req.user,
        products ,
    });
});

export default router;