
import express from "express"
import { addProductToUser, productRouter } from "../controllers/auth.controller.js"
import { loginnedUser } from "../utils/isLoginned.js"
import { User } from "../models/User.js"
const Prodrouter = express.Router()


Prodrouter.post("/add",  loginnedUser ,addProductToUser)
Prodrouter.get("/",  loginnedUser ,productRouter)

Prodrouter.delete('/cart/remove/:id', loginnedUser, async (req, res) => {
  const productId = req.params.id;
  const userId = req.user._id;

  try {
    await User.updateOne(
      { _id: userId },
      { $pull: { Cart: { id: productId } } }
    );

    res.status(200).json({ message: 'Removed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to remove product' });
  }
});
export default Prodrouter

