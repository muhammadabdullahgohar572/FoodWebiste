

import { ConnectionDb } from "@/app/lib/bd";
import { FoodModel } from "@/app/lib/FoodModel";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  await ConnectionDb();

  try {
    const body = await req.json();
    const { foodName, price, imagePath, description, res_id } = body;

    if (!foodName || !price || !imagePath || !description || !res_id) {
      return new NextResponse(
        JSON.stringify({ message: "Please fill all fields" }),
        { status: 400 }
      );
    }

    const newFood = new FoodModel({
      foodName,
      price,
      imagePath,
      description,
      res_id,
    });

    const savedFood = await newFood.save();

    return new NextResponse(
      JSON.stringify({
        data: savedFood,
        message: "Data successfully posted",
      }),
      { status: 201 }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: error.message }),
      { status: 500 }
    );
  }
};