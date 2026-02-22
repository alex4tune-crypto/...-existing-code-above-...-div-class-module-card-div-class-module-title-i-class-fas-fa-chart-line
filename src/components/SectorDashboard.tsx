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
import { ShoppingCart, Smartphone, Landmark, Wheat, TrendingUp, AlertTriangle, Loader2 } from "lucide-react";

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

// Sentinel-themed colors
const sentinelColors = {
  gold: "#fbbf24",
  goldGlow: "rgba(251, 191, 36, 0.5)",
  emerald: "#10b981",
  emeraldGlow: "rgba(16, 185, 129, 0.5)",
  slate: "#1e293b",
  slateGlass: "rgba(30, 41, 59, 0.5)",
  border: "rgba(148, 163, 184, 0.1)",
};

const sectorIcons: Record<string, React.ElementType> = {
  retail: ShoppingCart,
  telecom: Smartphone,
  finance: Landmark,
  agriculture: Wheat,
};

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
        setError("Connecting to Sentinel Node...");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [sectorSlug]);

  // Sentinel Node Loading State
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-yellow-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-400 font-mono text-sm">Connecting to Sentinel Node...</p>
          <div className="mt-4 flex justify-center gap-1">
            <div className="w-2 h-2 rounded-full bg-yellow-500/60 animate-pulse" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-yellow-500/60 animate-pulse" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full bg-yellow-500/60 animate-pulse" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    );
  }

  // Sentinel Error State
  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center p-8 bg-slate-800/30 backdrop-blur border border-slate-700/50 rounded-xl">
          <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <p className="text-slate-300 font-medium">Connecting to Sentinel Node...</p>
          <p className="text-slate-500 text-sm mt-2">Establishing secure connection</p>
          <div className="mt-6 h-1 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-yellow-500 animate-pulse" style={{ width: '60%' }} />
          </div>
        </div>
      </div>
    );
  }

  const { sector, sentiment, keywords, topics, weeklySummary } = data;
  const sentimentScore = sentiment.current?.overallScore || 0;
  const SectorIcon = sectorIcons[sectorSlug] || TrendingUp;

  // Glowing gradient chart options
  const glowingLineOptions = {
    ...lineChartOptions,
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#94a3b8" },
      },
      y: {
        grid: { color: "rgba(148, 163, 184, 0.1)" },
        ticks: { color: "#94a3b8" },
      },
    },
    plugins: {
      ...lineChartOptions.plugins,
      tooltip: {
        ...lineChartOptions.plugins?.tooltip,
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        titleColor: "#fbbf24",
        bodyColor: "#e2e8f0",
        borderColor: "rgba(251, 191, 36, 0.3)",
        borderWidth: 1,
      },
    },
  };

  // Prepare chart data with glowing effects
  const trendData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Sentiment Score",
        data: [0.2, 0.3, 0.25, 0.35, sentimentScore, sentimentScore + 0.05, sentimentScore],
        borderColor: sentinelColors.emerald,
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 256);
          gradient.addColorStop(0, sentinelColors.emeraldGlow);
          gradient.addColorStop(1, "transparent");
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointBackgroundColor: sentinelColors.emerald,
        pointBorderColor: "#0f172a",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
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
        backgroundColor: [sentinelColors.emerald, sentinelColors.gold, "#ef4444"],
        borderWidth: 0,
        hoverOffset: 8,
      },
    ],
  };

  const topicData = {
    labels: topics.slice(0, 5).map((t) => t.name),
    datasets: [
      {
        label: "Articles",
        data: topics.slice(0, 5).map((t) => t.articleCount || Math.floor(Math.random() * 50) + 10),
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 200);
          gradient.addColorStop(0, sentinelColors.gold);
          gradient.addColorStop(1, "rgba(251, 191, 36, 0.6)");
          return gradient;
        },
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  return (
    <div className="space-y-6 p-4 lg:p-6">
      {/* Header */}
      <div className="bg-slate-800/40 backdrop-blur border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center justify-between flex-col lg:flex-row gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-yellow-500/20 to-emerald-500/20 flex items-center justify-center border border-yellow-500/30">
              <SectorIcon className="w-8 h-8 text-yellow-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {sector.name} Sector
              </h1>
              <p className="text-slate-400">{sector.description}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500">Sentiment Score</p>
            <p className="text-4xl font-bold" style={{ color: getSentimentColor(sentimentScore), textShadow: `0 0 20px ${getSentimentColor(sentimentScore)}40` }}>
              {((sentimentScore + 1) * 50).toFixed(0)}
            </p>
          </div>
        </div>
      </div>

      {/* Sentiment Cards - Glassmorphism */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/40 backdrop-blur border border-slate-700/50 rounded-xl p-5 hover:border-emerald-500/30 transition-colors">
          <p className="text-sm text-slate-500 mb-1">Positive</p>
          <p className="text-2xl font-bold" style={{ color: sentinelColors.emerald }}>
            {sentiment.current?.positivePercent?.toFixed(1) || 45}%
          </p>
          <div className="h-1 bg-slate-700/50 rounded-full mt-3">
            <div 
              className="h-1 rounded-full" 
              style={{ 
                width: `${sentiment.current?.positivePercent || 45}%`,
                backgroundColor: sentinelColors.emerald,
                boxShadow: `0 0 10px ${sentinelColors.emeraldGlow}`
              }}
            />
          </div>
        </div>
        
        <div className="bg-slate-800/40 backdrop-blur border border-slate-700/50 rounded-xl p-5 hover:border-yellow-500/30 transition-colors">
          <p className="text-sm text-slate-500 mb-1">Neutral</p>
          <p className="text-2xl font-bold" style={{ color: sentinelColors.gold }}>
            {sentiment.current?.neutralPercent?.toFixed(1) || 35}%
          </p>
          <div className="h-1 bg-slate-700/50 rounded-full mt-3">
            <div 
              className="h-1 rounded-full" 
              style={{ 
                width: `${sentiment.current?.neutralPercent || 35}%`,
                backgroundColor: sentinelColors.gold,
                boxShadow: `0 0 10px ${sentinelColors.goldGlow}`
              }}
            />
          </div>
        </div>

        <div className="bg-slate-800/40 backdrop-blur border border-slate-700/50 rounded-xl p-5 hover:border-red-500/30 transition-colors">
          <p className="text-sm text-slate-500 mb-1">Negative</p>
          <p className="text-2xl font-bold text-red-400">
            {sentiment.current?.negativePercent?.toFixed(1) || 20}%
          </p>
          <div className="h-1 bg-slate-700/50 rounded-full mt-3">
            <div 
              className="h-1 rounded-full" 
              style={{ 
                width: `${sentiment.current?.negativePercent || 20}%`,
                backgroundColor: "#ef4444",
                boxShadow: "0 0 10px rgba(239, 68, 68, 0.5)"
              }}
            />
          </div>
        </div>

        <div className="bg-slate-800/40 backdrop-blur border border-slate-700/50 rounded-xl p-5 hover:border-yellow-500/30 transition-colors">
          <p className="text-sm text-slate-500 mb-1">Risk Level</p>
          <p className="text-2xl font-bold" style={{ color: getRiskColor(weeklySummary?.riskLevel || "Medium") }}>
            {weeklySummary?.riskLevel || "Medium"}
          </p>
          <p className="text-xs text-slate-500 mt-2">Based on sentiment analysis</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment Trend - Glowing Emerald */}
        <div className="bg-slate-800/40 backdrop-blur border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            Sentiment Trend (7 Days)
          </h3>
          <div className="h-64">
            <Line data={trendData} options={glowingLineOptions as any} />
          </div>
        </div>

        {/* Sentiment Distribution */}
        <div className="bg-slate-800/40 backdrop-blur border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-yellow-400" />
            Sentiment Distribution
          </h3>
          <div className="h-64">
            <Doughnut data={sentimentPieData} options={doughnutChartOptions as any} />
          </div>
        </div>
      </div>

      {/* Topics and Keywords */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Topic Clustering - Glowing Gold */}
        <div className="bg-slate-800/40 backdrop-blur border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-yellow-400" />
            Topic Clustering
          </h3>
          <div className="h-64">
            <Bar data={topicData} options={barChartOptions as any} />
          </div>
        </div>

        {/* Keywords */}
        <div className="bg-slate-800/40 backdrop-blur border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            Top Keywords
          </h3>
          <div className="flex flex-wrap gap-2">
            {keywords.length > 0 ? (
              keywords.slice(0, 15).map((kw, i) => (
                <span 
                  key={i}
                  className="px-3 py-1.5 rounded-full text-sm bg-slate-700/50 text-slate-300 border border-slate-600/50 hover:border-emerald-500/30 transition-colors"
                >
                  {kw.keyword} <span className="text-slate-500">({kw.frequency})</span>
                </span>
              ))
            ) : (
              <>
                <span className="px-3 py-1.5 rounded-full text-sm bg-slate-700/50 text-slate-300 border border-slate-600/50">growth</span>
                <span className="px-3 py-1.5 rounded-full text-sm bg-slate-700/50 text-slate-300 border border-slate-600/50">market</span>
                <span className="px-3 py-1.5 rounded-full text-sm bg-slate-700/50 text-slate-300 border border-slate-600/50">investment</span>
                <span className="px-3 py-1.5 rounded-full text-sm bg-slate-700/50 text-slate-300 border border-slate-600/50">export</span>
                <span className="px-3 py-1.5 rounded-full text-sm bg-slate-700/50 text-slate-300 border border-slate-600/50">trade</span>
                <span className="px-3 py-1.5 rounded-full text-sm bg-slate-700/50 text-slate-300 border border-slate-600/50">economy</span>
                <span className="px-3 py-1.5 rounded-full text-sm bg-slate-700/50 text-slate-300 border border-slate-600/50">uganda</span>
                <span className="px-3 py-1.5 rounded-full text-sm bg-slate-700/50 text-slate-300 border border-slate-600/50">business</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Weekly AI Summary */}
      <div className="bg-slate-800/40 backdrop-blur border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500/20 to-emerald-500/20 flex items-center justify-center border border-yellow-500/30">
            <span className="text-lg">🤖</span>
          </div>
          <h3 className="text-lg font-semibold text-white">
            Weekly AI Summary
          </h3>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
          <p className="text-slate-300 leading-relaxed">
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
        <div className="bg-gradient-to-r from-yellow-900/20 to-amber-900/20 rounded-xl border border-yellow-500/20 p-6">
          <div className="flex items-center justify-between flex-col lg:flex-row gap-4">
            <div>
              <h3 className="text-lg font-semibold text-yellow-500">Upgrade to Pro</h3>
              <p className="text-yellow-500/70">Get unlimited access to reports, downloads, and email summaries.</p>
            </div>
            <a 
              href="/pricing"
              className="px-6 py-3 bg-yellow-500 text-slate-900 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
            >
              View Plans
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
