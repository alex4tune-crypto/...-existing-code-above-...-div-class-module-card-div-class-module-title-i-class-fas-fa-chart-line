import { NextResponse } from "next/server";
import { db } from "@/db";
import { economicIndicators, socialMetrics } from "@/db/schema";

export async function GET() {
  try {
    // Get the latest economic indicators
    const latestEconomic = await db
      .select()
      .from(economicIndicators)
      .orderBy(economicIndicators.year)
      .limit(1);

    // Get all economic data for charts
    const allEconomic = await db
      .select()
      .from(economicIndicators)
      .orderBy(economicIndicators.year);

    // Get the latest social metrics
    const latestSocial = await db
      .select()
      .from(socialMetrics)
      .orderBy(socialMetrics.year)
      .limit(1);

    // Get all social data
    const allSocial = await db
      .select()
      .from(socialMetrics)
      .orderBy(socialMetrics.year);

    return NextResponse.json({
      economic: {
        latest: latestEconomic[0] || null,
        history: allEconomic,
      },
      social: {
        latest: latestSocial[0] || null,
        history: allSocial,
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
