import { ConnectionDb } from "@/app/lib/bd";
import { FoodModel } from "@/app/lib/FoodModel";
import Restaurant from "@/app/lib/restaurantModel";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    await ConnectionDb();
    const { id } = params;
    
    const restaurantDetails = await Restaurant.findOne({ _id: id });
    const foodDetails = await FoodModel.find({ res_id: id });
    
    return NextResponse.json({
      success: true,
      restaurant: restaurantDetails,
      foods: foodDetails
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}