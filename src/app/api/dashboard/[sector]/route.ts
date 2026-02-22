import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { 
  sectors, 
  sentimentData, 
  keywords, 
  topics, 
  historicalTrends,
  weeklySummaries 
} from "@/db/schema";
import { eq, desc, and, gte, lte } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sector: string }> }
) {
  try {
    const { sector } = await params;
    
    // Get sector info
    const sectorList = await db
      .select()
      .from(sectors)
      .where(eq(sectors.slug, sector))
      .limit(1);

    if (sectorList.length === 0) {
      return NextResponse.json(
        { success: false, error: "Sector not found" },
        { status: 404 }
      );
    }

    const sectorInfo = sectorList[0];

    // Get latest sentiment data
    const sentimentRecords = await db
      .select()
      .from(sentimentData)
      .where(eq(sentimentData.sectorId, sectorInfo.id))
      .orderBy(desc(sentimentData.date))
      .limit(30);

    // Get top keywords
    const topKeywords = await db
      .select()
      .from(keywords)
      .where(eq(keywords.sectorId, sectorInfo.id))
      .orderBy(desc(keywords.frequency))
      .limit(20);

    // Get topics
    const sectorTopics = await db
      .select()
      .from(topics)
      .where(eq(topics.sectorId, sectorInfo.id))
      .orderBy(desc(topics.articleCount))
      .limit(10);

    // Get historical trends (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const trends = await db
      .select()
      .from(historicalTrends)
      .where(
        and(
          eq(historicalTrends.sectorId, sectorInfo.id),
          gte(historicalTrends.date, thirtyDaysAgo)
        )
      )
      .orderBy(historicalTrends.date);

    // Get latest weekly summary
    const summaries = await db
      .select()
      .from(weeklySummaries)
      .where(eq(weeklySummaries.sectorId, sectorInfo.id))
      .orderBy(desc(weeklySummaries.weekStart))
      .limit(1);

    // Calculate sentiment score (latest)
    const latestSentiment = sentimentRecords[0] || {
      positivePercent: 45,
      neutralPercent: 35,
      negativePercent: 20,
      overallScore: 0.25,
    };

    // Format trend data for charts
    const sentimentTrend = trends
      .filter(t => t.metricName === "sentiment")
      .map(t => ({
        date: t.date,
        value: t.value,
      }));

    const volumeTrend = trends
      .filter(t => t.metricName === "volume")
      .map(t => ({
        date: t.date,
        value: t.value,
      }));

    return NextResponse.json({
      success: true,
      data: {
        sector: sectorInfo,
        sentiment: {
          current: latestSentiment,
          history: sentimentRecords.slice(0, 30),
        },
        keywords: topKeywords,
        topics: sectorTopics,
        trends: {
          sentiment: sentimentTrend,
          volume: volumeTrend,
        },
        weeklySummary: summaries[0] || null,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
