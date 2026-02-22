"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAnimations } from "@/hooks/useDeviceDetection";
import Navigation from "@/components/Navigation";
import { 
  Shield, 
  Lock, 
  Activity, 
  Cpu, 
  HardDrive, 
  Wifi, 
  Server, 
  Eye, 
  EyeOff,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  RefreshCw,
  Terminal,
  Database,
  Network
} from "lucide-react";

// Simulated network resilience data
const networkData = [
  { time: "00:00", latency: 12, packetLoss: 0.1, uptime: 99.9 },
  { time: "04:00", latency: 8, packetLoss: 0.0, uptime: 100 },
  { time: "08:00", latency: 15, packetLoss: 0.2, uptime: 99.8 },
  { time: "12:00", latency: 22, packetLoss: 0.1, uptime: 99.9 },
  { time: "16:00", latency: 18, packetLoss: 0.0, uptime: 100 },
  { time: "20:00", latency: 14, packetLoss: 0.1, uptime: 99.9 },
  { time: "24:00", latency: 10, packetLoss: 0.0, uptime: 100 },
];

// Simulated resource audit data
const resourceData = [
  { resource: "CPU", used: 45, total: 100, status: "optimal" },
  { resource: "Memory", used: 62, total: 100, status: "optimal" },
  { resource: "Storage", used: 78, total: 100, status: "warning" },
  { resource: "Network", used: 34, total: 100, status: "optimal" },
];

// System logs
const systemLogs = [
  { time: "23:45:12", level: "info", message: "Sentinel node connected successfully" },
  { time: "23:44:58", level: "info", message: "Data synchronization completed" },
  { time: "23:44:32", level: "warning", message: "High latency detected in region EU-West" },
  { time: "23:43:15", level: "info", message: "Backup completed: 2.4GB archived" },
  { time: "23:42:01", level: "info", message: "Security scan completed - no threats detected" },
  { time: "23:40:45", level: "info", message: "Cache cleared - performance optimized" },
  { time: "23:38:22", level: "error", message: "Connection timeout - retry initiated" },
  { time: "23:35:10", level: "info", message: "System health check: PASSED" },
];

export default function SentinelPortal() {
  const { shouldAnimate, animationDuration } = useAnimations();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "network" | "resources" | "logs">("overview");

  // SENTINEL_ACCESS_CODE - In production, use environment variable
  const SENTINEL_CODE = "UGANDA2026";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate authentication delay
    setTimeout(() => {
      if (password === SENTINEL_CODE) {
        setIsAuthenticated(true);
      } else {
        setError("Invalid access code. Please try again.");
      }
      setIsLoading(false);
    }, 1000);
  };

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center p-4">
        <motion.div
          initial={shouldAnimate ? { opacity: 0, scale: 0.95 } : false}
          animate={shouldAnimate ? { opacity: 1, scale: 1 } : false}
          transition={{ duration: animationDuration }}
          className="w-full max-w-md"
        >
          <div className="glass-card p-8 text-center">
            {/* Logo */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-red-500/20 to-yellow-500/20 flex items-center justify-center border border-red-500/30">
                <Shield className="w-8 h-8 text-red-500" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-white mb-2">Sentinel Portal</h1>
            <p className="text-slate-400 mb-6">Restricted access - Authorized personnel only</p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Sentinel Access Code"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:border-yellow-500/50 focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm">
                  <AlertTriangle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !password}
                className="w-full py-3 bg-yellow-500 text-slate-900 font-semibold rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Access Portal
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-800">
              <p className="text-xs text-slate-500">
                This is a restricted system. All access attempts are logged and monitored.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Authenticated Portal
  return (
    <div className="min-h-screen hero-gradient">
      <Navigation />
      
      <main className="lg:pl-64 pt-16 lg:pt-0">
        <div className="p-4 lg:p-6">
          {/* Header */}
          <motion.div
            initial={shouldAnimate ? { opacity: 0, y: -20 } : false}
            animate={shouldAnimate ? { opacity: 1, y: 0 } : false}
            transition={{ duration: animationDuration }}
            className="glass-card p-6 mb-6"
          >
            <div className="flex items-center justify-between flex-col lg:flex-row gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500/20 to-yellow-500/20 flex items-center justify-center border border-red-500/30">
                  <Shield className="w-7 h-7 text-red-500" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Sentinel Command Center</h1>
                  <p className="text-slate-400">Network Resilience & Resource Audit</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-sm text-emerald-400 font-mono">SYSTEM ONLINE</span>
                </div>
                <button
                  onClick={() => setIsAuthenticated(false)}
                  className="px-4 py-2 bg-slate-800/50 text-slate-400 rounded-lg hover:text-white hover:bg-slate-800 transition-colors text-sm"
                >
                  Lock
                </button>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto">
            {[
              { id: "overview", label: "Overview", icon: Activity },
              { id: "network", label: "Network", icon: Network },
              { id: "resources", label: "Resources", icon: Server },
              { id: "logs", label: "Logs", icon: Terminal },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-yellow-500/20 text-yellow-500 border border-yellow-500/30"
                      : "bg-slate-800/30 text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <motion.div
              initial={shouldAnimate ? { opacity: 0 } : false}
              animate={shouldAnimate ? { opacity: 1 } : false}
              transition={{ duration: animationDuration }}
              className="space-y-6"
            >
              {/* Status Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "System Status", value: "Operational", icon: CheckCircle, color: "text-emerald-400" },
                  { label: "Active Nodes", value: "12/12", icon: Cpu, color: "text-blue-400" },
                  { label: "Avg Latency", value: "14ms", icon: Zap, color: "text-yellow-400" },
                  { label: "Uptime", value: "99.97%", icon: Clock, color: "text-purple-400" },
                ].map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="glass-card p-4">
                      <div className="flex items-center gap-3">
                        <Icon className={`w-5 h-5 ${stat.color}`} />
                        <div>
                          <p className="text-xs text-slate-500">{stat.label}</p>
                          <p className="text-lg font-bold text-white">{stat.value}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-card p-6">
                  <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                    <Network className="w-5 h-5 text-blue-400" />
                    Network Status
                  </h3>
                  <div className="space-y-4">
                    {[
                      { region: "EU-West", status: "Optimal", latency: "12ms" },
                      { region: "US-East", status: "Optimal", latency: "18ms" },
                      { region: "AP-South", status: "Warning", latency: "45ms" },
                      { region: "AF-East", status: "Optimal", latency: "8ms" },
                    ].map((node, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                        <span className="text-slate-300">{node.region}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-slate-500">{node.latency}</span>
                          <span className={`text-sm px-2 py-0.5 rounded ${
                            node.status === "Optimal" ? "bg-emerald-500/20 text-emerald-400" : "bg-yellow-500/20 text-yellow-400"
                          }`}>
                            {node.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-card p-6">
                  <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                    <Database className="w-5 h-5 text-purple-400" />
                    Resource Usage
                  </h3>
                  <div className="space-y-4">
                    {resourceData.map((resource, i) => (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-slate-300">{resource.resource}</span>
                          <span className="text-sm text-slate-500">{resource.used}%</span>
                        </div>
                        <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full"
                            style={{ 
                              width: `${resource.used}%`,
                              backgroundColor: resource.status === "warning" ? sentinelColors.gold : sentinelColors.emerald,
                              boxShadow: `0 0 10px ${resource.status === "warning" ? sentinelColors.goldGlow : sentinelColors.emeraldGlow}`
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Network Tab */}
          {activeTab === "network" && (
            <motion.div
              initial={shouldAnimate ? { opacity: 0 } : false}
              animate={shouldAnimate ? { opacity: 1 } : false}
              transition={{ duration: animationDuration }}
              className="glass-card p-6"
            >
              <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                <Network className="w-5 h-5 text-blue-400" />
                Network Resilience Metrics
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {[
                  { label: "Latency", value: "14ms", trend: "-2ms", icon: Zap },
                  { label: "Packet Loss", value: "0.05%", trend: "-0.02%", icon: Wifi },
                  { label: "Uptime", value: "99.97%", trend: "+0.01%", icon: CheckCircle },
                ].map((metric, i) => {
                  const Icon = metric.icon;
                  return (
                    <div key={i} className="bg-slate-800/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm text-slate-500">{metric.label}</span>
                      </div>
                      <div className="flex items-end justify-between">
                        <span className="text-2xl font-bold text-white">{metric.value}</span>
                        <span className="text-sm text-emerald-400">{metric.trend}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Resources Tab */}
          {activeTab === "resources" && (
            <motion.div
              initial={shouldAnimate ? { opacity: 0 } : false}
              animate={shouldAnimate ? { opacity: 1 } : false}
              transition={{ duration: animationDuration }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {resourceData.map((resource, i) => (
                  <div key={i} className="glass-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <HardDrive className="w-5 h-5 text-yellow-500" />
                        {resource.resource}
                      </h3>
                      <span className={`text-sm px-2 py-1 rounded ${
                        resource.status === "optimal" ? "bg-emerald-500/20 text-emerald-400" : "bg-yellow-500/20 text-yellow-400"
                      }`}>
                        {resource.status}
                      </span>
                    </div>
                    <div className="relative h-4 bg-slate-700/50 rounded-full overflow-hidden">
                      <div 
                        className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${resource.used}%`,
                          backgroundColor: resource.status === "warning" ? sentinelColors.gold : sentinelColors.emerald,
                        }}
                      />
                    </div>
                    <div className="flex justify-between mt-2 text-sm">
                      <span className="text-slate-500">{resource.used} used</span>
                      <span className="text-slate-500">{resource.total - resource.used} available</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Logs Tab */}
          {activeTab === "logs" && (
            <motion.div
              initial={shouldAnimate ? { opacity: 0 } : false}
              animate={shouldAnimate ? { opacity: 1 } : false}
              transition={{ duration: animationDuration }}
              className="glass-card p-6"
            >
              <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                <Terminal className="w-5 h-5 text-yellow-500" />
                System Logs
              </h3>
              <div className="bg-slate-900/50 rounded-lg p-4 font-mono text-sm max-h-[500px] overflow-y-auto">
                {systemLogs.map((log, i) => (
                  <div 
                    key={i} 
                    className={`flex gap-4 py-2 border-b border-slate-800 last:border-0 ${
                      log.level === "error" ? "text-red-400" : 
                      log.level === "warning" ? "text-yellow-400" : "text-slate-400"
                    }`}
                  >
                    <span className="text-slate-600 shrink-0">{log.time}</span>
                    <span className={`uppercase shrink-0 w-16 ${
                      log.level === "error" ? "text-red-500" : 
                      log.level === "warning" ? "text-yellow-500" : "text-blue-500"
                    }`}>
                      [{log.level}]
                    </span>
                    <span className="text-slate-300">{log.message}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}

// Sentinel colors (defined inline since we can't import)
const sentinelColors = {
  gold: "#eab308",
  goldGlow: "rgba(234, 179, 8, 0.5)",
  emerald: "#10b981",
  emeraldGlow: "rgba(16, 185, 129, 0.5)",
};
