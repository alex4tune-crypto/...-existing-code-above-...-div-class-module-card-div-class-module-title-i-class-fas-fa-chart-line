import { NextResponse } from "next/server";
import { db } from "@/db";
import { communityReports } from "@/db/schema";

export async function GET() {
  try {
    // Get all reports ordered by most recent first
    const reports = await db
      .select()
      .from(communityReports)
      .orderBy(communityReports.id);

    return NextResponse.json({ reports });
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { location, report } = body;

    if (!location || !report) {
      return NextResponse.json(
        { error: "Location and report are required" },
        { status: 400 }
      );
    }

    // Insert the new report
    const [newReport] = await db
      .insert(communityReports)
      .values({
        location,
        report,
      })
      .returning();

    return NextResponse.json({ report: newReport });
  } catch (error) {
    console.error("Error creating report:", error);
    return NextResponse.json(
      { error: "Failed to create report" },
      { status: 500 }
    );
  }
}
