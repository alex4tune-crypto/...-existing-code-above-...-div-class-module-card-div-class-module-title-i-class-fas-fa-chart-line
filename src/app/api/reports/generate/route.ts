import { NextRequest, NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import { db } from "@/db";
import { sectors, sentimentData, keywords, topics, weeklySummaries, generatedReports } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sectorSlug, reportType, userId } = body;

    if (!sectorSlug || !userId) {
      return NextResponse.json(
        { success: false, error: "Sector and user ID are required" },
        { status: 400 }
      );
    }

    // Get sector data
    const sectorList = await db
      .select()
      .from(sectors)
      .where(eq(sectors.slug, sectorSlug))
      .limit(1);

    if (sectorList.length === 0) {
      return NextResponse.json(
        { success: false, error: "Sector not found" },
        { status: 404 }
      );
    }

    const sector = sectorList[0];

    // Get sentiment data
    const sentimentRecords = await db
      .select()
      .from(sentimentData)
      .where(eq(sentimentData.sectorId, sector.id))
      .orderBy(desc(sentimentData.date))
      .limit(7);

    // Get top keywords
    const topKeywords = await db
      .select()
      .from(keywords)
      .where(eq(keywords.sectorId, sector.id))
      .orderBy(desc(keywords.frequency))
      .limit(10);

    // Get topics
    const sectorTopics = await db
      .select()
      .from(topics)
      .where(eq(topics.sectorId, sector.id))
      .orderBy(desc(topics.articleCount))
      .limit(5);

    // Get weekly summary
    const summaries = await db
      .select()
      .from(weeklySummaries)
      .where(eq(weeklySummaries.sectorId, sector.id))
      .orderBy(desc(weeklySummaries.weekStart))
      .limit(1);

    const summary = summaries[0];

    // Determine risk level based on sentiment
    let riskLevel = "Medium";
    if (sentimentRecords.length > 0) {
      const latest = sentimentRecords[0];
      if (latest.overallScore > 0.3) riskLevel = "Low";
      else if (latest.overallScore < -0.3) riskLevel = "High";
    }

    // Generate PDF
    return new Promise((resolve) => {
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];

      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", async () => {
        const pdfBuffer = Buffer.concat(chunks);
        const pdfBase64 = pdfBuffer.toString("base64");

        // Save report record
        const reportId = uuidv4();
        await db.insert(generatedReports).values({
          id: reportId,
          userId,
          sectorId: sector.id,
          title: `${sector.name} ${reportType || "Weekly"} Report`,
          reportType: reportType || "weekly",
          summary: summary?.summary || "No summary available",
          riskLevel,
          generatedAt: new Date(),
        });

        resolve(NextResponse.json({
          success: true,
          data: {
            reportId,
            pdf: pdfBase64,
            fileName: `${sector.name.replace(/\s+/g, "_")}_${reportType || "report"}_${new Date().toISOString().split("T")[0]}.pdf`,
          },
        }));
      });

      // PDF Content
      doc.fontSize(24).fillColor("#1a365d").text("Uganda Insights", { align: "center" });
      doc.moveDown();
      doc.fontSize(18).fillColor("#2d3748").text(`${sector.name} Sector Report`, { align: "center" });
      doc.fontSize(12).fillColor("#718096").text(`Generated: ${new Date().toLocaleDateString()}`, { align: "center" });
      doc.moveDown(2);

      // Executive Summary
      doc.fontSize(16).fillColor("#1a365d").text("Executive Summary");
      doc.moveDown(0.5);
      doc.fontSize(11).fillColor("#2d3748");
      
      if (summary?.summary) {
        doc.text(summary.summary);
      } else {
        doc.text(`The ${sector.name} sector in Uganda shows ${sentimentRecords.length > 0 && sentimentRecords[0].overallScore > 0 ? "positive" : "moderate"} market sentiment based on recent analysis.`);
      }
      doc.moveDown();

      // Risk Level
      doc.fontSize(14).fillColor("#1a365d").text("Risk Assessment");
      doc.moveDown(0.5);
      doc.fontSize(12).fillColor(riskLevel === "Low" ? "#38a169" : riskLevel === "High" ? "#e53e3e" : "#d69e2e")
        .text(`Risk Level: ${riskLevel}`);
      doc.moveDown();

      // Sentiment Overview
      if (sentimentRecords.length > 0) {
        const latest = sentimentRecords[0];
        doc.fontSize(14).fillColor("#1a365d").text("Sentiment Overview");
        doc.moveDown(0.5);
        doc.fontSize(11).fillColor("#2d3748");
        doc.text(`Positive: ${latest.positivePercent?.toFixed(1)}%`);
        doc.text(`Neutral: ${latest.neutralPercent?.toFixed(1)}%`);
        doc.text(`Negative: ${latest.negativePercent?.toFixed(1)}%`);
        doc.moveDown();
      }

      // Top Keywords
      if (topKeywords.length > 0) {
        doc.fontSize(14).fillColor("#1a365d").text("Top Keywords");
        doc.moveDown(0.5);
        doc.fontSize(10).fillColor("#2d3748");
        const keywordText = topKeywords.map(k => k.keyword).join(", ");
        doc.text(keywordText);
        doc.moveDown();
      }

      // Key Topics
      if (sectorTopics.length > 0) {
        doc.fontSize(14).fillColor("#1a365d").text("Key Topics");
        doc.moveDown(0.5);
        doc.fontSize(11).fillColor("#2d3748");
        sectorTopics.forEach((topic, i) => {
          doc.text(`${i + 1}. ${topic.name}`);
        });
        doc.moveDown();
      }

      // Footer
      doc.moveDown(2);
      doc.fontSize(9).fillColor("#718096")
        .text("© Uganda Insights - Business Intelligence Platform", { align: "center" })
        .text("www.ugandainsights.com", { align: "center" });

      doc.end();
    });
  } catch (error) {
    console.error("Error generating report:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate report" },
      { status: 500 }
    );
  }
}

// Get user's generated reports
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    const reports = await db
      .select()
      .from(generatedReports)
      .where(eq(generatedReports.userId, userId))
      .orderBy(desc(generatedReports.generatedAt))
      .limit(20);

    return NextResponse.json({
      success: true,
      data: reports,
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch reports" },
      { status: 500 }
    );
  }
}
