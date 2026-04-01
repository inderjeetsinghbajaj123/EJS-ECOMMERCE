import mongoose from "mongoose";

const ownerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      trim: true,
    },

    email: {
      type: String,
    },

    password: {
      type: String,
    },
   product: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: "Product"
}],
  },
  {
    timestamps: true,
  }
);

export const Owner = mongoose.model("Owner", ownerSchema);