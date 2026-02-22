"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Smartphone, 
  Landmark, 
  Wheat, 
  CreditCard,
  Menu,
  X,
  Activity,
  Shield
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/retail", label: "Retail", icon: ShoppingCart, color: "text-amber-400" },
  { href: "/dashboard/telecom", label: "Telecom", icon: Smartphone, color: "text-blue-400" },
  { href: "/dashboard/finance", label: "Finance", icon: Landmark, color: "text-purple-400" },
  { href: "/dashboard/agriculture", label: "Agriculture", icon: Wheat, color: "text-emerald-400" },
  { href: "/pricing", label: "Pricing", icon: CreditCard, color: "text-yellow-400" },
];

export default function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="flex items-center justify-between px-4 h-16">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-2xl">🇺🇬</span>
            <span className="font-bold text-yellow-500 tracking-wider text-sm">UGANDA INSIGHTS</span>
          </Link>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-slate-900/95 backdrop-blur-md pt-20 px-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== "/dashboard" && pathname.startsWith(item.href));
              const Icon = item.icon;
              
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? "bg-yellow-500/20 text-yellow-500"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    <Icon size={20} className={isActive ? "text-yellow-500" : item.color || "text-slate-400"} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Desktop Sidebar */}
      <nav className="hidden lg:flex fixed left-0 top-0 h-screen w-64 bg-slate-900/80 backdrop-blur-md border-r border-slate-800 p-6 flex-col z-40">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <span className="text-3xl">🇺🇬</span>
          <div>
            <h1 className="font-bold text-yellow-500 tracking-wider text-lg">UGANDA</h1>
            <p className="text-xs text-slate-500 tracking-widest">INSIGHTS</p>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 mb-8 px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-700/50">
          <Activity size={14} className="text-emerald-400 animate-pulse" />
          <span className="text-xs text-emerald-400 font-mono">SENTINEL ACTIVE</span>
        </div>

        {/* Navigation Items */}
        <ul className="space-y-2 flex-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-yellow-500/20 text-yellow-500 border-l-2 border-yellow-500"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <Icon size={20} className={isActive ? "text-yellow-500" : item.color || "text-slate-400"} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Shield size={14} />
            <span>Secure Connection</span>
          </div>
        </div>
      </nav>

      {/* Main Content Wrapper */}
      <div className="lg:pl-64">
        {/* Top Status Bar for Desktop */}
        <div className="hidden lg:flex fixed top-0 right-0 h-16 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 items-center justify-end px-6 z-30">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm text-slate-400 font-mono">Status: SENTINEL ACTIVE</span>
          </div>
        </div>
      </div>
    </>
  );
}
