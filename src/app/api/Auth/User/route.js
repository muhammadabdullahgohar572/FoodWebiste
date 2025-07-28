// src/app/api/restaurant/route.js
import { ConnectionDb } from "@/app/lib/bd";
import Restaurant from "@/app/lib/restaurantModel";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export const POST = async (req) => {
  try {
    // Connect to DB first
    await ConnectionDb();

    const body = await req.json();
    const { name, email, location, password, city, contactNo, restaurantName } =
      body;

    // Validate required fields
    if (
      !name ||
      !email ||
      !location ||
      !password ||
      !city ||
      !contactNo ||
      !restaurantName
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if email exists
    const existingRestaurant = await Restaurant.findOne({ email });
    if (existingRestaurant) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new restaurant
    const newRestaurant = new Restaurant({
      name,
      location,
      email,
      password: hashedPassword,
      city,
      contactNo,
      restaurantName,
    });

    // Save to database
    const savedRestaurant = await newRestaurant.save();

    return NextResponse.json(
      {
        success: true,
        data: {
          id: savedRestaurant._id,
          name: savedRestaurant.name,
          email: savedRestaurant.email,
          restaurantName: savedRestaurant.restaurantName,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
};
