import { ConnectionDb } from "@/app/lib/bd";
import Restaurant from "@/app/lib/restaurantModel";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    await ConnectionDb();

    let result = await Restaurant.find();
    result = result.map(
      (item) => item.city.charAt(0).toUpperCase() + item.city.slice(1)
    );
    result = [...new Set(result)];
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({
      message: error.message,
    });
  }
};
