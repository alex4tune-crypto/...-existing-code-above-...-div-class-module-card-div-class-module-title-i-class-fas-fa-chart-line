"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { chartColors } from "@/lib/chart-config";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/dashboard/retail", label: "Retail", icon: "🛒" },
  { href: "/dashboard/telecom", label: "Telecom", icon: "📱" },
  { href: "/dashboard/finance", label: "Finance", icon: "🏦" },
  { href: "/dashboard/agriculture", label: "Agriculture", icon: "🌾" },
  { href: "/pricing", label: "Pricing", icon: "💰" },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center gap-2">
              <span className="text-2xl">🇺🇬</span>
              <span className="text-xl font-bold" style={{ color: chartColors.primary }}>
                Uganda Insights
              </span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== "/dashboard" && pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  style={isActive ? { backgroundColor: chartColors.primary } : {}}
                >
                  <span className="mr-1">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
              Sign In
            </button>
            <Link
              href="/pricing"
              className="px-4 py-2 text-sm font-medium text-white rounded-lg hover:opacity-90 transition-opacity"
              style={{ backgroundColor: chartColors.primary }}
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
