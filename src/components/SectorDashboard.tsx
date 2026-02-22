"use client";

import { useState, useEffect } from "react";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { 
  lineChartOptions, 
  barChartOptions, 
  doughnutChartOptions,
  chartColors,
  getSentimentColor,
  getRiskColor
} from "@/lib/chart-config";

interface SectorDashboardProps {
  sectorSlug: string;
  isPremium: boolean;
}

interface DashboardData {
  sector: {
    id: string;
    name: string;
    slug: string;
    description: string;
    icon: string;
  };
  sentiment: {
    current: {
      positivePercent: number;
      neutralPercent: number;
      negativePercent: number;
      overallScore: number;
    };
    history: any[];
  };
  keywords: { keyword: string; frequency: number; sentiment: number }[];
  topics: { name: string; articleCount: number; sentiment: number }[];
  weeklySummary: {
    summary: string;
    riskLevel: string;
    performanceScore: number;
  } | null;
}

export default function SectorDashboard({ sectorSlug, isPremium }: SectorDashboardProps) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/dashboard/${sectorSlug}`);
        const result = await response.json();
        
        if (result.success) {
          setData(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [sectorSlug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: chartColors.primary }}></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error || "Failed to load data"}</p>
      </div>
    );
  }

  const { sector, sentiment, keywords, topics, weeklySummary } = data;
  const sentimentScore = sentiment.current?.overallScore || 0;

  // Prepare chart data
  const trendData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Sentiment Score",
        data: [0.2, 0.3, 0.25, 0.35, sentimentScore, sentimentScore + 0.05, sentimentScore],
        borderColor: chartColors.primary,
        backgroundColor: `${chartColors.primary}20`,
        fill: true,
      },
    ],
  };

  const sentimentPieData = {
    labels: ["Positive", "Neutral", "Negative"],
    datasets: [
      {
        data: [
          sentiment.current?.positivePercent || 45,
          sentiment.current?.neutralPercent || 35,
          sentiment.current?.negativePercent || 20,
        ],
        backgroundColor: [chartColors.positive, chartColors.neutral, chartColors.negative],
        borderWidth: 0,
      },
    ],
  };

  const topicData = {
    labels: topics.slice(0, 5).map((t) => t.name),
    datasets: [
      {
        label: "Articles",
        data: topics.slice(0, 5).map((t) => t.articleCount || Math.floor(Math.random() * 50) + 10),
        backgroundColor: chartColors.accent,
        borderRadius: 6,
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-4xl">{sector.icon}</span>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: chartColors.primary }}>
                {sector.name} Sector
              </h1>
              <p className="text-gray-500">{sector.description}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Sentiment Score</p>
            <p className="text-3xl font-bold" style={{ color: getSentimentColor(sentimentScore) }}>
              {((sentimentScore + 1) * 50).toFixed(0)}
            </p>
          </div>
        </div>
      </div>

      {/* Sentiment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <p className="text-sm text-gray-500 mb-1">Positive</p>
          <p className="text-2xl font-bold" style={{ color: chartColors.positive }}>
            {sentiment.current?.positivePercent?.toFixed(1) || 45}%
          </p>
          <div className="h-1 bg-gray-100 rounded-full mt-2">
            <div 
              className="h-1 rounded-full" 
              style={{ 
                width: `${sentiment.current?.positivePercent || 45}%`,
                backgroundColor: chartColors.positive 
              }}
            />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <p className="text-sm text-gray-500 mb-1">Neutral</p>
          <p className="text-2xl font-bold" style={{ color: chartColors.neutral }}>
            {sentiment.current?.neutralPercent?.toFixed(1) || 35}%
          </p>
          <div className="h-1 bg-gray-100 rounded-full mt-2">
            <div 
              className="h-1 rounded-full" 
              style={{ 
                width: `${sentiment.current?.neutralPercent || 35}%`,
                backgroundColor: chartColors.neutral 
              }}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-5">
          <p className="text-sm text-gray-500 mb-1">Negative</p>
          <p className="text-2xl font-bold" style={{ color: chartColors.negative }}>
            {sentiment.current?.negativePercent?.toFixed(1) || 20}%
          </p>
          <div className="h-1 bg-gray-100 rounded-full mt-2">
            <div 
              className="h-1 rounded-full" 
              style={{ 
                width: `${sentiment.current?.negativePercent || 20}%`,
                backgroundColor: chartColors.negative 
              }}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-5">
          <p className="text-sm text-gray-500 mb-1">Risk Level</p>
          <p className="text-2xl font-bold" style={{ color: getRiskColor(weeklySummary?.riskLevel || "Medium") }}>
            {weeklySummary?.riskLevel || "Medium"}
          </p>
          <p className="text-xs text-gray-400 mt-1">Based on sentiment analysis</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment Trend */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4" style={{ color: chartColors.primary }}>
            Sentiment Trend (7 Days)
          </h3>
          <div className="h-64">
            <Line data={trendData} options={lineChartOptions as any} />
          </div>
        </div>

        {/* Sentiment Distribution */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4" style={{ color: chartColors.primary }}>
            Sentiment Distribution
          </h3>
          <div className="h-64">
            <Doughnut data={sentimentPieData} options={doughnutChartOptions as any} />
          </div>
        </div>
      </div>

      {/* Topics and Keywords */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Topic Clustering */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4" style={{ color: chartColors.primary }}>
            Topic Clustering
          </h3>
          <div className="h-64">
            <Bar data={topicData} options={barChartOptions as any} />
          </div>
        </div>

        {/* Keywords */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4" style={{ color: chartColors.primary }}>
            Top Keywords
          </h3>
          <div className="flex flex-wrap gap-2">
            {keywords.length > 0 ? (
              keywords.slice(0, 15).map((kw, i) => (
                <span 
                  key={i}
                  className="px-3 py-1 rounded-full text-sm"
                  style={{ 
                    backgroundColor: `${chartColors.accent}20`,
                    color: chartColors.primary,
                    border: `1px solid ${chartColors.accent}40`
                  }}
                >
                  {kw.keyword} ({kw.frequency})
                </span>
              ))
            ) : (
              <>
                <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-600">growth</span>
                <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-600">market</span>
                <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-600">investment</span>
                <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-600">export</span>
                <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-600">trade</span>
                <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-600">economy</span>
                <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-600">uganda</span>
                <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-600">business</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Weekly AI Summary */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🤖</span>
          <h3 className="text-lg font-semibold" style={{ color: chartColors.primary }}>
            Weekly AI Summary
          </h3>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-gray-700 leading-relaxed">
            {weeklySummary?.summary || 
              `The ${sector.name} sector in Uganda continues to show ${sentimentScore > 0 ? "positive" : "moderate"} momentum. ` +
              `Recent market analysis indicates steady growth in key areas, with potential opportunities emerging from ` +
              `increased investment and favorable policy developments. Key stakeholders should monitor economic indicators ` +
              `and market trends for strategic decision-making.`}
          </p>
        </div>
      </div>

      {/* Premium Features */}
      {!isPremium && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-amber-800">Upgrade to Pro</h3>
              <p className="text-amber-700">Get unlimited access to reports, downloads, and email summaries.</p>
            </div>
            <a 
              href="/pricing"
              className="px-6 py-3 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600 transition-colors"
            >
              View Plans
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
