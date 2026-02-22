"use client";

import Link from "next/link";
import { chartColors } from "@/lib/chart-config";

const sectors = [
  {
    slug: "retail",
    name: "Retail",
    icon: "🛒",
    description: "Supermarkets, shops, and e-commerce market analysis",
    sentiment: "Positive",
    score: 72,
  },
  {
    slug: "telecom",
    name: "Telecom",
    icon: "📱",
    description: "MTN, Airtel, and internet provider insights",
    sentiment: "Moderate",
    score: 58,
  },
  {
    slug: "finance",
    name: "Finance",
    icon: "🏦",
    description: "Banking, insurance, and microfinance trends",
    sentiment: "Positive",
    score: 75,
  },
  {
    slug: "agriculture",
    name: "Agriculture",
    icon: "🌾",
    description: "Crops, livestock, and agribusiness intelligence",
    sentiment: "Moderate",
    score: 62,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold" style={{ color: chartColors.primary }}>
          Uganda Business Intelligence
        </h1>
        <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
          Real-time market sentiment analysis and business insights across key Ugandan industries.
          Select a sector below to explore detailed analytics.
        </p>
      </div>

      {/* Sector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sectors.map((sector) => (
          <Link
            key={sector.slug}
            href={`/dashboard/${sector.slug}`}
            className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow p-6 group"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-4xl">{sector.icon}</span>
              <span 
                className="px-2 py-1 rounded-full text-xs font-medium"
                style={{ 
                  backgroundColor: sector.sentiment === "Positive" 
                    ? `${chartColors.positive}20` 
                    : `${chartColors.neutral}20`,
                  color: sector.sentiment === "Positive" 
                    ? chartColors.positive 
                    : chartColors.neutral
                }}
              >
                {sector.sentiment}
              </span>
            </div>
            <h3 className="text-lg font-semibold" style={{ color: chartColors.primary }}>
              {sector.name}
            </h3>
            <p className="text-sm text-gray-500 mt-1">{sector.description}</p>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex-1 mr-4">
                <div className="h-2 bg-gray-100 rounded-full">
                  <div 
                    className="h-2 rounded-full"
                    style={{ 
                      width: `${sector.score}%`,
                      backgroundColor: chartColors.primary
                    }}
                  />
                </div>
              </div>
              <span className="text-sm font-medium" style={{ color: chartColors.primary }}>
                {sector.score}%
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <span className="text-xl">📰</span>
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: chartColors.primary }}>2,847</p>
              <p className="text-sm text-gray-500">Articles Analyzed</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100">
              <span className="text-xl">👥</span>
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: chartColors.primary }}>1,234</p>
              <p className="text-sm text-gray-500">Active Users</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100">
              <span className="text-xl">📊</span>
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: chartColors.primary }}>156</p>
              <p className="text-sm text-gray-500">Reports Generated</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-2">Unlock Full Access</h2>
        <p className="text-blue-100 mb-4 max-w-xl mx-auto">
          Get unlimited access to all sectors, downloadable PDF reports, weekly email summaries, 
          and priority support.
        </p>
        <Link
          href="/pricing"
          className="inline-block px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
        >
          View Pricing Plans
        </Link>
      </div>
    </div>
  );
}
