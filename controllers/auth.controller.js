import express from "express"
import { User } from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { Owner } from "../models/Owner.js";
import { Product } from "../models/Product.js";
import { uploadBufferToCloudinary } from "../utils/cloudinary.js"
dotenv.config()

export const addProductToUser = async (req, res) => {
  try {
    const productId = req.body.productId;

    const user = req.user;
    if (!user) return res.status(401).send("User not logged in");

    if (!user.Cart) user.Cart = [];

    const product = await Product.findById(productId);
    if (!product) return res.status(404).send("Product not found");

    user.Cart.push(productId);
    await user.save();

    res.redirect("/shop");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

export const registerUser = async (req, res) => {
  try {
    let { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.render("index", { error: "Fill all details", success: null });
    }

    let existUser = await User.findOne({ email })
    if (existUser) {
      return res.render("index", { error: "User exists with this email", success: null });
    }

    let newpass = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email,
      password: newpass
    })

    const token = await jwt.sign({
      UserId: user._id,
      email
    }, process.env.JWT_SECRET)

    res.cookie("token", token)

    return res.render("index", { error: null, success: "User registered successfully!" });

  } catch (error) {
    res.render("index", { error: "Registration failed. Try again.", success: null });
  }
}

export const loginUser = async (req, res) => {
  let { email, password } = req.body
  let existUser = await User.findOne({ email })

  if (!existUser) {
    return res.render("index", { error: "User not exists", success: null });
  }

  let passwordvalid = await bcrypt.compare(password, existUser.password)

  if (!passwordvalid) {
    return res.render("index", { error: "Password is wrong", success: null });
  }

  let token = await jwt.sign({
    UserId: existUser._id,
    email
  }, process.env.JWT_SECRET)

  res.cookie("token", token)
  res.redirect("/shop")
}

export const logout = (req, res) => {
  res.clearCookie("token");
  res.redirect("/")
}

export const createOwner = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.render("owner", { error: "Please fill all details", success: null });
    }

    const existing = await Owner.findOne({ email });
    if (existing) {
      return res.render("owner", { error: "Owner already exists", success: null });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const owner = await Owner.create({
      name,
      email,
      password: hashedPassword,
    });
    req.owner = owner;
    res.render("owner", { error: null, success: "Owner registered successfully!" });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
};

export const productRouter = async (req, res) => {
  try {
    if (!req.user) {
      return res.redirect("/");
    }

    const user = await User.findById(req.user._id);

    const cartProducts = (await Promise.all(
      user.Cart.map(id => Product.findById(id))
    )).filter(p => p !== null);

    res.render("cart", {
      user: req.user,
      cartProducts: cartProducts
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

export const loginOwner = async (req, res) => {
  try {
    const { email, password } = req.body;

    let owner = await Owner.findOne({ email });
    if (!owner) {
      return res.render("owner", { error: "Owner not found" });
    }

    let isMatch = await bcrypt.compare(password, owner.password);
    if (!isMatch) {
      return res.render("owner", { error: "Invalid credentials" });
    }

    res.redirect(`/owner/admin?ownerId=${owner._id}`);;

  } catch (err) {
    res.render("owner", { error: "Login failed" });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { ownerId } = req.body;

    const owner = await Owner.findById(ownerId);

    if (!owner) {
      return res.status(401).send("Unauthorized");
    }

    let imageUrl = "";
    if (req.file) {
      const result = await uploadBufferToCloudinary(req.file.buffer);
      if (result) {
        imageUrl = result.secure_url;
      }
    }

    const product = await Product.create({
      owner: owner._id,
      name: req.body.name,
      price: req.body.price,
      discount: req.body.discount || 0,
      image: imageUrl,
      bgcolor: req.body.bgcolor || "#ffffff",
      panelcolor: req.body.panelcolor || "#ffffff",
      textcolor: req.body.textcolor || "#000000",
    });

    owner.product.push(product._id);
    await owner.save();

    res.redirect("/shop");

  } catch (err) {
    console.error("Create product error:", err);
    res.render("product", { error: "Failed to create product", owner: null });
  }
};

