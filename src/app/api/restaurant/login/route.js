// src/app/api/restaurant/login/route.js

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import Restaurant from "@/app/lib/restaurantModel"; // ✅ default import
import { ConnectionDb } from "@/app/lib/bd";

export const POST = async (req) => {
  try {
    await ConnectionDb();

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const user = await Restaurant.findOne({ email }); // ✅ now it works!

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }

    const { password: _, ...userSafe } = user.toObject();

    return NextResponse.json({ message: "Login successful", data: userSafe }, { status: 200 });

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};
