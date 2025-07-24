// src/app/lib/restaurantModel.js
import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  location: String,
  city: String,
  contactNo: String,
  restaurantName: { type: String, required: true },
}, { timestamps: true });

// ✅ Prevent model overwrite
const Restaurant = mongoose.models.Restaurant || mongoose.model("Restaurant", restaurantSchema);

export default Restaurant;
