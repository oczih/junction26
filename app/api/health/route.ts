import mongoose from "mongoose";
import { connectDB } from "@/lib/mongoose";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const readyState = mongoose.connection.readyState;
    const isConnected = readyState === 1;

    if (!isConnected) {
      return NextResponse.json(
        {
          status: "unhealthy",
          database: "disconnected",
          timestamp: new Date().toISOString(),
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      status: "healthy",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        status: "unhealthy",
        database: "disconnected",
        error: message,
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
