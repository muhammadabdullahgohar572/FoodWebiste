import mongoose from "mongoose";

const FoodSchema = mongoose.Schema({
  foodName: String,
  price: String,
  imagePath: String,
  description: String,
  res_id: mongoose.Schema.Types.ObjectId,
});

export const FoodModel =
  mongoose.models.Food || mongoose.model("Food", FoodSchema);