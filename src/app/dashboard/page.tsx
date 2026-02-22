"use client";

import Link from "next/link";
import { ShoppingCart, Smartphone, Landmark, Wheat, TrendingUp, Users, FileText, ArrowRight, Activity, Shield } from "lucide-react";

const sectors = [
  {
    slug: "retail",
    name: "Retail",
    icon: ShoppingCart,
    color: "from-amber-500/20 to-orange-500/20",
    borderColor: "border-amber-500/30",
    iconColor: "text-amber-400",
    description: "Supermarkets, shops, and e-commerce market analysis",
    sentiment: "Positive",
    score: 72,
  },
  {
    slug: "telecom",
    name: "Telecom",
    icon: Smartphone,
    color: "from-blue-500/20 to-cyan-500/20",
    borderColor: "border-blue-500/30",
    iconColor: "text-blue-400",
    description: "MTN, Airtel, and internet provider insights",
    sentiment: "Moderate",
    score: 58,
  },
  {
    slug: "finance",
    name: "Finance",
    icon: Landmark,
    color: "from-purple-500/20 to-pink-500/20",
    borderColor: "border-purple-500/30",
    iconColor: "text-purple-400",
    description: "Banking, insurance, and microfinance trends",
    sentiment: "Positive",
    score: 75,
  },
  {
    slug: "agriculture",
    name: "Agriculture",
    icon: Wheat,
    color: "from-emerald-500/20 to-green-500/20",
    borderColor: "border-emerald-500/30",
    iconColor: "text-emerald-400",
    description: "Crops, livestock, and agribusiness intelligence",
    sentiment: "Moderate",
    score: 62,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8 p-4 lg:p-6">
      {/* Header */}
      <div className="text-center py-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full mb-4">
          <Activity className="w-4 h-4 text-yellow-500 animate-pulse" />
          <span className="text-sm font-mono text-yellow-500">SENTINEL ACTIVE</span>
        </div>
        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">
          Uganda Business Intelligence
        </h1>
        <p className="text-slate-400 mt-2 max-w-2xl mx-auto">
          Real-time market sentiment analysis and business insights across key Ugandan industries.
          Select a sector below to explore detailed analytics.
        </p>
      </div>

      {/* Sector Cards - Glassmorphism */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {sectors.map((sector) => {
          const Icon = sector.icon;
          return (
            <Link
              key={sector.slug}
              href={`/dashboard/${sector.slug}`}
              className={`bg-slate-800/40 backdrop-blur border border-slate-700/50 rounded-xl p-6 group hover:${sector.borderColor} transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-yellow-500/10`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${sector.color} flex items-center justify-center border ${sector.borderColor}`}>
                  <Icon className={`w-7 h-7 ${sector.iconColor}`} />
                </div>
                <span 
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{ 
                    backgroundColor: sector.sentiment === "Positive" 
                      ? "rgba(16, 185, 129, 0.2)" 
                      : "rgba(251, 191, 36, 0.2)",
                    color: sector.sentiment === "Positive" 
                      ? "#10b981" 
                      : "#fbbf24"
                  }}
                >
                  {sector.sentiment}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white group-hover:text-yellow-500 transition-colors">
                {sector.name}
              </h3>
              <p className="text-sm text-slate-500 mt-1">{sector.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex-1 mr-4">
                  <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                    <div 
                      className="h-2 rounded-full"
                      style={{ 
                        width: `${sector.score}%`,
                        backgroundColor: sector.sentiment === "Positive" ? "#10b981" : "#fbbf24",
                        boxShadow: sector.sentiment === "Positive" 
                          ? "0 0 10px rgba(16, 185, 129, 0.5)" 
                          : "0 0 10px rgba(251, 191, 36, 0.5)"
                      }}
                    />
                  </div>
                </div>
                <span className="text-sm font-bold" style={{ color: sector.sentiment === "Positive" ? "#10b981" : "#fbbf24" }}>
                  {sector.score}%
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
        <div className="bg-slate-800/40 backdrop-blur border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
              <FileText className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">2,847</p>
              <p className="text-sm text-slate-500">Articles Analyzed</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/40 backdrop-blur border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
              <Users className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">1,234</p>
              <p className="text-sm text-slate-500">Active Users</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/40 backdrop-blur border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
              <TrendingUp className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">156</p>
              <p className="text-sm text-slate-500">Reports Generated</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-yellow-900/30 to-amber-900/30 rounded-xl p-8 text-center border border-yellow-500/20">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Shield className="w-5 h-5 text-yellow-500" />
          <span className="text-yellow-500 font-mono text-sm">SECURE ACCESS</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Unlock Full Access</h2>
        <p className="text-slate-400 mb-6 max-w-xl mx-auto">
          Get unlimited access to all sectors, downloadable PDF reports, weekly email summaries, 
          and priority support.
        </p>
        <Link
          href="/pricing"
          className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 text-slate-900 font-semibold rounded-lg hover:bg-yellow-400 transition-colors group"
        >
          View Pricing Plans
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
