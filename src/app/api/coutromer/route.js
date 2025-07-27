import { ConnectionDb } from "@/app/lib/bd";
import Restaurant from "@/app/lib/restaurantModel";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  await ConnectionDb();
  try {
    const qry = req.nextUrl.searchParams;
    let filter = {};

    if (qry.get("location")) {
      const city = qry.get("location");
      filter = { city: { $regex: new RegExp(city, "i") } };
    } else if (qry.get("restaurantName")) {
      const name = qry.get("restaurantName");
      filter = { restaurantName: { $regex: new RegExp(name, "i") } };
    }

    const results = await Restaurant.find(filter).select("-password");
    return NextResponse.json({ success: true, data: results }, { status: 200 });
  } catch (err) {
    console.error("GET error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};
