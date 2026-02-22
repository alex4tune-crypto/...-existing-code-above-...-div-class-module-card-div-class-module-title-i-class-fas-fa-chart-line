import { NextRequest, NextResponse } from "next/server";

// Simple sentiment analysis using keyword matching
// In production, use spaCy or ML model
function analyzeSentiment(text: string): { score: number; label: string } {
  const positiveWords = [
    "growth", "increase", "profit", "success", "positive", "strong",
    "improvement", "expansion", "opportunity", "growth", "boom",
    "surge", "gain", "rise", "up", "good", "excellent", "great"
  ];
  
  const negativeWords = [
    "decline", "loss", "decrease", "negative", "weak", "crisis",
    "problem", "issue", "risk", "fail", "down", "drop", "fall",
    "recession", "inflation", "unemployment", "shortage"
  ];

  const words = text.toLowerCase().split(/\s+/);
  let positiveCount = 0;
  let negativeCount = 0;

  words.forEach(word => {
    if (positiveWords.some(pw => word.includes(pw))) positiveCount++;
    if (negativeWords.some(nw => word.includes(nw))) negativeCount++;
  });

  const total = positiveCount + negativeCount || 1;
  const score = (positiveCount - negativeCount) / total;

  let label = "neutral";
  if (score > 0.2) label = "positive";
  if (score < -0.2) label = "negative";

  return { score, label };
}

function extractKeywords(text: string): string[] {
  const stopWords = new Set([
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "by", "from", "as", "is", "was", "are", "were", "been",
    "be", "have", "has", "had", "do", "does", "did", "will", "would",
    "could", "should", "may", "might", "must", "shall", "can", "need",
    "this", "that", "these", "those", "it", "its", "they", "them", "their"
  ]);

  const words = text.toLowerCase()
    .replace(/[^a-z\s]/g, "")
    .split(/\s+/)
    .filter(w => w.length > 3 && !stopWords.has(w));

  // Count frequency
  const freq: Record<string, number> = {};
  words.forEach(w => {
    freq[w] = (freq[w] || 0) + 1;
  });

  // Return top keywords
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, sectorId } = body;

    if (!text) {
      return NextResponse.json(
        { success: false, error: "Text content is required" },
        { status: 400 }
      );
    }

    // Analyze sentiment
    const sentiment = analyzeSentiment(text);
    
    // Extract keywords
    const keywords = extractKeywords(text);

    // Store in database
    const { db } = await import("@/db");
    const { sentimentData, dataReports } = await import("@/db/schema");
    const { v4: uuidv4 } = await import("uuid");

    const now = new Date();
    
    // Save the report
    if (sectorId) {
      await db.insert(dataReports).values({
        id: uuidv4(),
        sectorId,
        title: `Analysis ${now.toISOString()}`,
        content: text,
        sentiment: sentiment.score,
        keywords: JSON.stringify(keywords),
        uploadedAt: now,
      });

      // Update sentiment data (simplified - in production would aggregate)
      const existingData = await db
        .select()
        .from(sentimentData)
        .where(eq(sentimentData.sectorId, sectorId))
        .orderBy(desc(sentimentData.date))
        .limit(1);

      if (existingData.length > 0) {
        const existing = existingData[0];
        const adjustment = sentiment.score * 0.1;
        
        await db.update(sentimentData).set({
          positivePercent: Math.max(0, Math.min(100, 
            (sentiment.label === "positive" ? existing.positivePercent + 5 : 
             sentiment.label === "negative" ? existing.positivePercent - 5 : 
             existing.positivePercent))),
        }).where(eq(sentimentData.id, existing.id));
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        sentiment: sentiment,
        keywords: keywords,
        analyzedAt: now.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error analyzing sentiment:", error);
    return NextResponse.json(
      { success: false, error: "Failed to analyze sentiment" },
      { status: 500 }
    );
  }
}

// Import needed for eq and desc
import { eq, desc } from "drizzle-orm";
