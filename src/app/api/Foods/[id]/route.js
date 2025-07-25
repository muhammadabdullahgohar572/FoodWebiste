import { ConnectionDb } from "@/app/lib/bd";
import { FoodModel } from "@/app/lib/FoodModel";
import { NextResponse } from "next/server";

export const GET = async (request, { params }) => {
  try {
    await ConnectionDb();
    console.log("Params object:", params);
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { message: "Restaurant ID is required" },
        { status: 400 }
      );
    }
    const foodItems = await FoodModel.find({ res_id: id });

    return NextResponse.json(foodItems, { status: 200 });
  } catch (error) {
    console.error("Full error:", error);
    return NextResponse.json(
      { message: error.message || "Server error" },
      { status: 500 }
    );
  }
};

export const DELETE = async (request, { params }) => {
  try {
    await ConnectionDb();
    console.log("Params object:", params);
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { message: "Restaurant ID is required" },
        { status: 400 }
      );
    }
    const foodItems = await FoodModel.findByIdAndDelete(id);

    return NextResponse.json(foodItems, { status: 200 });
  } catch (error) {
    console.error("Full error:", error);
    return NextResponse.json(
      { message: error.message || "Server error" },
      { status: 500 }
    );
  }
};
