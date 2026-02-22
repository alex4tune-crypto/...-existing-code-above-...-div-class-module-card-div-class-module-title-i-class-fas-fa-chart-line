"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAnimations } from "@/hooks/useDeviceDetection";
import LanguageToggle from "@/components/LanguageToggle";
import { 
  TrendingUp, 
  Shield, 
  Activity, 
  BarChart3, 
  Globe, 
  ArrowRight,
  ChevronRight,
  Zap,
  Lock,
  Users
} from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    description: "Live market sentiment analysis across all sectors",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/20",
  },
  {
    icon: Globe,
    title: "Multi-Language Support",
    description: "English, Luganda, and Swahili interfaces",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
  },
  {
    icon: Shield,
    title: "Sentinel Security",
    description: "Enterprise-grade protection for your data",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
  },
];

const stats = [
  { value: "6.3%", label: "GDP Growth" },
  { value: "2,847", label: "Articles Analyzed" },
  { value: "1,234", label: "Active Users" },
  { value: "99.9%", label: "Uptime" },
];

export default function LandingPage() {
  const { t } = useLanguage();
  const { shouldAnimate, animationDuration } = useAnimations();

  return (
    <div className="min-h-screen hero-gradient">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <span className="text-2xl">🇺🇬</span>
              <div>
                <h1 className="font-bold text-yellow-500 tracking-wider text-lg">UGANDA</h1>
                <p className="text-xs text-slate-500 tracking-widest">INSIGHTS</p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-slate-400 hover:text-white transition-colors text-sm">
                Features
              </a>
              <a href="#sectors" className="text-slate-400 hover:text-white transition-colors text-sm">
                Sectors
              </a>
              <a href="#pricing" className="text-slate-400 hover:text-white transition-colors text-sm">
                Pricing
              </a>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <LanguageToggle />
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-slate-900 font-semibold rounded-lg hover:bg-yellow-400 transition-colors text-sm"
              >
                Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 sentinel-grid">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            {/* Status Badge */}
            <motion.div
              initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
              animate={shouldAnimate ? { opacity: 1, y: 0 } : false}
              transition={{ duration: animationDuration }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full mb-8"
            >
              <Activity className="w-4 h-4 text-yellow-500 animate-pulse" />
              <span className="text-sm font-mono text-yellow-500">{t("dashboard.sentinelActive")}</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
              animate={shouldAnimate ? { opacity: 1, y: 0 } : false}
              transition={{ duration: animationDuration, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 gold-glow">
                {t("hero.gdpSurge")}
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
              animate={shouldAnimate ? { opacity: 1, y: 0 } : false}
              transition={{ duration: animationDuration, delay: 0.2 }}
              className="text-xl text-slate-400 max-w-3xl mx-auto mb-10"
            >
              {t("hero.subtitle")}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
              animate={shouldAnimate ? { opacity: 1, y: 0 } : false}
              transition={{ duration: animationDuration, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-8 py-4 bg-yellow-500 text-slate-900 font-semibold rounded-xl hover:bg-yellow-400 transition-all hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/20 group"
              >
                <BarChart3 className="w-5 h-5" />
                {t("hero.cta")}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/pricing"
                className="flex items-center gap-2 px-8 py-4 bg-slate-800/50 text-white font-semibold rounded-xl border border-slate-700/50 hover:bg-slate-800 hover:border-yellow-500/30 transition-all"
              >
                {t("hero.ctaSecondary")}
              </Link>
            </motion.div>
          </div>

          {/* Stats Row */}
          <motion.div
            initial={shouldAnimate ? { opacity: 0, y: 40 } : false}
            animate={shouldAnimate ? { opacity: 1, y: 0 } : false}
            transition={{ duration: animationDuration, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20"
          >
            {stats.map((stat, index) => (
              <div
                key={index}
                className="glass-card p-6 text-center"
              >
                <p className="text-3xl font-bold text-yellow-500 mb-1">{stat.value}</p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Sovereign Command Centre
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Enterprise-grade business intelligence platform built for the modern Ugandan enterprise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
                  animate={shouldAnimate ? { opacity: 1, y: 0 } : false}
                  transition={{ duration: animationDuration, delay: index * 0.1 }}
                  className={`glass-card p-6 ${feature.borderColor} hover:scale-[1.02] transition-transform`}
                >
                  <div className={`w-12 h-12 ${feature.bgColor} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-400">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sectors Preview */}
      <section id="sectors" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Key Sectors
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Real-time intelligence across Uganda&apos;s most important industries.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Retail", color: "from-amber-500/20 to-orange-500/20", iconColor: "text-amber-400" },
              { name: "Telecom", color: "from-blue-500/20 to-cyan-500/20", iconColor: "text-blue-400" },
              { name: "Finance", color: "from-purple-500/20 to-pink-500/20", iconColor: "text-purple-400" },
              { name: "Agriculture", color: "from-emerald-500/20 to-green-500/20", iconColor: "text-emerald-400" },
            ].map((sector, index) => (
              <motion.div
                key={index}
                initial={shouldAnimate ? { opacity: 0, scale: 0.95 } : false}
                animate={shouldAnimate ? { opacity: 1, scale: 1 } : false}
                transition={{ duration: animationDuration, delay: index * 0.1 }}
                className="glass-card p-6 text-center hover:border-yellow-500/30 transition-colors cursor-pointer group"
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${sector.color} flex items-center justify-center mx-auto mb-4 border border-slate-700/50 group-hover:border-yellow-500/30 transition-colors`}>
                  <TrendingUp className={`w-8 h-8 ${sector.iconColor}`} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">{sector.name}</h3>
                <div className="flex items-center justify-center gap-1 text-yellow-500 text-sm">
                  <span>View Analysis</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800/50 text-white font-semibold rounded-lg border border-slate-700/50 hover:bg-slate-800 hover:border-yellow-500/30 transition-all"
            >
              Explore All Sectors
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-8 sm:p-12 text-center relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-emerald-500/5" />
            
            <div className="relative">
              <div className="flex items-center justify-center gap-2 mb-6">
                <Lock className="w-5 h-5 text-yellow-500" />
                <span className="text-yellow-500 font-mono text-sm">SECURE ACCESS</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Transform Your Business Intelligence?
              </h2>
              
              <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                Join over 1,200 Ugandan businesses using our platform to make data-driven decisions.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-8 py-4 bg-yellow-500 text-slate-900 font-semibold rounded-xl hover:bg-yellow-400 transition-all hover:scale-105"
                >
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/pricing"
                  className="flex items-center gap-2 px-8 py-4 bg-slate-800/50 text-white font-semibold rounded-xl border border-slate-700/50 hover:bg-slate-800 hover:border-yellow-500/30 transition-all"
                >
                  View Pricing
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🇺🇬</span>
              <div>
                <h1 className="font-bold text-yellow-500 tracking-wider text-lg">UGANDA INSIGHTS</h1>
                <p className="text-xs text-slate-500">Sovereign Command Centre</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-500" />
                <span>Powered by AI</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-yellow-500" />
                <span>Bank-Grade Security</span>
              </div>
            </div>
            
            <p className="text-sm text-slate-500">
              © 2026 Uganda Insights. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
