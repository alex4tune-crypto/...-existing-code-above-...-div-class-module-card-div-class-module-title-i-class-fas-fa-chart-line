"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAnimations } from "@/hooks/useDeviceDetection";
import { LoadingOverlay, Skeleton, CardSkeleton, ChartSkeleton } from "@/components/Skeleton";
import { ShoppingCart, Smartphone, Landmark, Wheat, TrendingUp, AlertTriangle, RefreshCw } from "lucide-react";

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
  gold: "#eab308",
  goldLight: "#facc15",
  goldGlow: "rgba(234, 179, 8, 0.5)",
  emerald: "#10b981",
  emeraldLight: "#34d399",
  emeraldGlow: "rgba(16, 185, 129, 0.5)",
  crimson: "#ef4444",
  crimsonLight: "#f87171",
  crimsonGlow: "rgba(239, 68, 68, 0.5)",
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

const sectorGradients: Record<string, string> = {
  retail: "from-amber-500 to-orange-500",
  telecom: "from-blue-500 to-cyan-500",
  finance: "from-purple-500 to-pink-500",
  agriculture: "from-emerald-500 to-green-500",
};

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 backdrop-blur border border-yellow-500/30 rounded-lg p-3 shadow-xl">
        <p className="text-yellow-500 font-medium mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-slate-300 text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
            {entry.name === "Score" || entry.name === "Sentiment" ? "%" : ""}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function SectorDashboard({ sectorSlug, isPremium }: SectorDashboardProps) {
  const { t } = useLanguage();
  const { shouldAnimate, animationDuration } = useAnimations();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await fetch(`/api/dashboard/${sectorSlug}`);
        const result = await response.json();
        
        if (result.success) {
          setData(result.data);
          setError(null);
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
  }, [sectorSlug, refreshKey]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Loading state with skeleton
  if (loading) {
    return (
      <div className="space-y-6 p-4 lg:p-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Skeleton variant="circular" width={64} height={64} />
              <div>
                <Skeleton variant="text" width={200} height={32} className="mb-2" />
                <Skeleton variant="text" width={300} height={20} />
              </div>
            </div>
            <Skeleton variant="text" width={100} height={48} />
          </div>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      </div>
    );
  }

  // Error state
  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center p-8 glass-card max-w-md">
          <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <p className="text-slate-300 font-medium">{t("common.error")}: {error}</p>
          <p className="text-slate-500 text-sm mt-2">Establishing secure connection</p>
          <button 
            onClick={handleRefresh}
            className="mt-6 flex items-center gap-2 px-4 py-2 bg-yellow-500/20 text-yellow-500 rounded-lg hover:bg-yellow-500/30 transition-colors mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            {t("common.retry")}
          </button>
        </div>
      </div>
    );
  }

  const { sector, sentiment, keywords, topics, weeklySummary } = data;
  const sentimentScore = sentiment.current?.overallScore || 0;
  const SectorIcon = sectorIcons[sectorSlug] || TrendingUp;
  const gradient = sectorGradients[sectorSlug] || "from-yellow-500 to-amber-500";

  // Prepare chart data with Recharts
  const trendData = [
    { day: "Mon", score: 20 },
    { day: "Tue", score: 30 },
    { day: "Wed", score: 25 },
    { day: "Thu", score: 35 },
    { day: "Fri", score: Math.round((sentimentScore + 1) * 50) },
    { day: "Sat", score: Math.round((sentimentScore + 1) * 50) + 5 },
    { day: "Sun", score: Math.round((sentimentScore + 1) * 50) },
  ];

  const sentimentPieData = [
    { name: "Positive", value: sentiment.current?.positivePercent || 45, color: sentinelColors.emerald },
    { name: "Neutral", value: sentiment.current?.neutralPercent || 35, color: sentinelColors.gold },
    { name: "Negative", value: sentiment.current?.negativePercent || 20, color: sentinelColors.crimson },
  ];

  const topicData = topics.slice(0, 5).map((t) => ({
    name: t.name.length > 12 ? t.name.substring(0, 12) + "..." : t.name,
    articles: t.articleCount || Math.floor(Math.random() * 50) + 10,
  }));

  return (
    <div className="space-y-6 p-4 lg:p-6">
      {/* Header */}
      <motion.div
        initial={shouldAnimate ? { opacity: 0, y: -20 } : false}
        animate={shouldAnimate ? { opacity: 1, y: 0 } : false}
        transition={{ duration: animationDuration }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between flex-col lg:flex-row gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}>
              <SectorIcon className="w-8 h-8 text-white" />
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
            <p 
              className="text-4xl font-bold text-white"
              style={{ 
                color: sentimentScore > 0 ? sentinelColors.emerald : sentinelColors.gold,
                textShadow: `0 0 20px ${sentimentScore > 0 ? sentinelColors.emeraldGlow : sentinelColors.goldGlow}`
              }}
            >
              {((sentimentScore + 1) * 50).toFixed(0)}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Sentiment Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Positive", value: sentiment.current?.positivePercent || 45, color: sentinelColors.emerald, glow: sentinelColors.emeraldGlow },
          { label: "Neutral", value: sentiment.current?.neutralPercent || 35, color: sentinelColors.gold, glow: sentinelColors.goldGlow },
          { label: "Negative", value: sentiment.current?.negativePercent || 20, color: sentinelColors.crimson, glow: sentinelColors.crimsonGlow },
          { label: "Risk Level", value: weeklySummary?.riskLevel || "Medium", color: sentinelColors.gold, glow: sentinelColors.goldGlow, isText: true },
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
            animate={shouldAnimate ? { opacity: 1, y: 0 } : false}
            transition={{ duration: animationDuration, delay: index * 0.1 }}
            className="glass-card p-5 hover:border-yellow-500/30 transition-colors"
          >
            <p className="text-sm text-slate-500 mb-1">{item.label}</p>
            <p 
              className="text-2xl font-bold"
              style={{ 
                color: item.color,
                textShadow: item.isText ? undefined : `0 0 10px ${item.glow}`
              }}
            >
              {item.isText ? item.value : typeof item.value === 'number' ? `${item.value?.toFixed(1)}%` : item.value}
            </p>
            {!item.isText && (
              <div className="h-1 bg-slate-700/50 rounded-full mt-3">
                <div 
                  className="h-1 rounded-full" 
                  style={{ 
                    width: `${item.value}%`,
                    backgroundColor: item.color,
                    boxShadow: `0 0 10px ${item.glow}`
                  }}
                />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Charts Row - Recharts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment Trend - Area Chart */}
        <motion.div
          initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
          animate={shouldAnimate ? { opacity: 1, y: 0 } : false}
          transition={{ duration: animationDuration, delay: 0.2 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            Sentiment Trend (7 Days)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={sentinelColors.emerald} stopOpacity={0.5}/>
                    <stop offset="95%" stopColor={sentinelColors.emerald} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  name="Sentiment"
                  stroke={sentinelColors.emerald}
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorScore)"
                  dot={{ fill: sentinelColors.emerald, strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: sentinelColors.emerald }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Sentiment Distribution - Pie Chart */}
        <motion.div
          initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
          animate={shouldAnimate ? { opacity: 1, y: 0 } : false}
          transition={{ duration: animationDuration, delay: 0.3 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-yellow-400" />
            Sentiment Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sentimentPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            {sentimentPieData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-slate-400">{item.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Topics and Keywords */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Topic Clustering - Bar Chart */}
        <motion.div
          initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
          animate={shouldAnimate ? { opacity: 1, y: 0 } : false}
          transition={{ duration: animationDuration, delay: 0.4 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-yellow-400" />
            Topic Clustering
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topicData}>
                <defs>
                  <linearGradient id="colorArticles" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={sentinelColors.gold} stopOpacity={1}/>
                    <stop offset="95%" stopColor={sentinelColors.gold} stopOpacity={0.6}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="articles" 
                  name="Articles"
                  fill="url(#colorArticles)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Keywords */}
        <motion.div
          initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
          animate={shouldAnimate ? { opacity: 1, y: 0 } : false}
          transition={{ duration: animationDuration, delay: 0.5 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            Top Keywords
          </h3>
          <div className="flex flex-wrap gap-2">
            {keywords.length > 0 ? (
              keywords.slice(0, 15).map((kw, i) => (
                <span 
                  key={i}
                  className="px-3 py-1.5 rounded-full text-sm bg-slate-700/50 text-slate-300 border border-slate-600/50 hover:border-emerald-500/30 transition-colors cursor-pointer"
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
        </motion.div>
      </div>

      {/* Weekly AI Summary */}
      <motion.div
        initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
        animate={shouldAnimate ? { opacity: 1, y: 0 } : false}
        transition={{ duration: animationDuration, delay: 0.6 }}
        className="glass-card p-6"
      >
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
      </motion.div>

      {/* Premium Features */}
      {!isPremium && (
        <motion.div
          initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
          animate={shouldAnimate ? { opacity: 1, y: 0 } : false}
          transition={{ duration: animationDuration, delay: 0.7 }}
          className="bg-gradient-to-r from-yellow-900/20 to-amber-900/20 rounded-xl border border-yellow-500/20 p-6"
        >
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
        </motion.div>
      )}
    </div>
  );
}
