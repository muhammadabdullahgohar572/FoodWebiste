
import { ConnectionDb } from "@/app/lib/bd";
import { FoodModel } from "@/app/lib/FoodModel";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: "Food item ID is required" },
        { status: 400 }
      );
    }

    await ConnectionDb();
    
    const foodItem = await FoodModel.findById(id);
    
    if (!foodItem) {
      return NextResponse.json(
        { error: "Food item not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: {
        _id: foodItem._id,
        foodName: foodItem.foodName,
        price: foodItem.price,
        imagePath: foodItem.imagePath,
        description: foodItem.description,
        res_id: foodItem.res_id
      }
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Server error: " + error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: "Food item ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    if (!body) {
      return NextResponse.json(
        { error: "Request body is required" },
        { status: 400 }
      );
    }

    await ConnectionDb();

    const updatedItem = await FoodModel.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return NextResponse.json(
        { error: "Food item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Food item updated successfully",
      data: {
        _id: updatedItem._id,
        foodName: updatedItem.foodName,
        price: updatedItem.price,
        imagePath: updatedItem.imagePath,
        description: updatedItem.description
      }
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Server error: " + error.message },
      { status: 500 }
    );
  }
}

