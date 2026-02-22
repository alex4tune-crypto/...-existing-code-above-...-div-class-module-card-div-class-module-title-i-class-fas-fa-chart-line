import { NextResponse } from "next/server";
import { db } from "@/db";
import { systemLogs } from "@/db/schema";

export async function GET() {
  try {
    // Get all logs ordered by most recent first
    const logs = await db
      .select()
      .from(systemLogs)
      .orderBy(systemLogs.id);

    return NextResponse.json({ logs });
  } catch (error) {
    console.error("Error fetching logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch logs" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, type } = body;

    if (!message || !type) {
      return NextResponse.json(
        { error: "Message and type are required" },
        { status: 400 }
      );
    }

    // Get current time
    const now = new Date();
    const time = now.toLocaleTimeString("en-US", { hour12: false });

    // Insert the new log
    const [newLog] = await db
      .insert(systemLogs)
      .values({
        time,
        message,
        type,
      })
      .returning();

    return NextResponse.json({ log: newLog });
  } catch (error) {
    console.error("Error creating log:", error);
    return NextResponse.json(
      { error: "Failed to create log" },
      { status: 500 }
    );
  }
}
