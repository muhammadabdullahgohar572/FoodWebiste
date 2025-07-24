import mongoose from "mongoose";
import { NextResponse } from "next/server";

export const ConnectionDb = async () => {
  const MongobdUrl = process.env.MONGO_URI;

  if (!MongobdUrl) {
    return NextResponse.json("MONGO_URI Is Missing");
  }

  await mongoose.connect(MongobdUrl, {
    dbName: "restaurant",
  });

  console.log("Connection successfully Done");
};
