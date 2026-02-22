import { NextResponse } from "next/server";
import { db } from "@/db";
import { sectors } from "@/db/schema";

export async function GET() {
  try {
    const allSectors = await db.select().from(sectors);
    
    return NextResponse.json({
      success: true,
      data: allSectors,
    });
  } catch (error) {
    console.error("Error fetching sectors:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch sectors" },
      { status: 500 }
    );
  }
}
