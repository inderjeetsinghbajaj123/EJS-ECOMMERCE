import express from "express";
import multer from "multer";
import { createOwner, createProduct, loginOwner } from "../controllers/auth.controller.js";
import { Owner } from "../models/Owner.js";
const upload = multer({
  storage: multer.memoryStorage()
});
const Ownerrouter = express.Router();

Ownerrouter.post("/create", createOwner);  
Ownerrouter.post("/login", loginOwner);
Ownerrouter.post("/createproduct", upload.single("image"), createProduct);

Ownerrouter.get("/create", (req, res) => {
  res.render("owner" , { error: null, success: null });  // owner.ejs
});

Ownerrouter.get("/admin", async (req, res) => {
  try {
    const { ownerId } = req.query;

    if (!ownerId) {
      return res.send("No ownerId provided");
    }

    const owner = await Owner.findById(ownerId);

    if (!owner) {
      
    }

    res.render("product", { error: null, owner });

  } catch (err) {
    res.send("Server error")
  }
});

export default Ownerrouter;