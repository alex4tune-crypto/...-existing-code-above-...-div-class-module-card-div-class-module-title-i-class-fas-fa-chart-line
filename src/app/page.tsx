"use client";

import { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface LogEntry {
  id: number;
  time: string;
  message: string;
  type: "success" | "info" | "error";
}

export default function Home() {
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: 1, time: "10:00:01", message: "System Initialized.", type: "success" },
  ]);

  const chartData = {
    labels: ["2020", "2021", "2022", "2023", "2024", "2025"],
    datasets: [
      {
        label: "GDP Growth %",
        data: [3.0, 3.5, 4.7, 5.2, 6.0, 6.3],
        borderColor: "#64ffda",
        backgroundColor: "rgba(100, 255, 218, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#ccd6f6",
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#8892b0" },
        grid: { color: "rgba(136, 146, 176, 0.1)" },
      },
      y: {
        ticks: { color: "#8892b0" },
        grid: { color: "rgba(136, 146, 176, 0.1)" },
      },
    },
  };

  const updateData = () => {
    const newLog: LogEntry = {
      id: Date.now(),
      time: new Date().toLocaleTimeString("en-US", { hour12: false }),
      message: "Fetching latest Uganda Bureau of Statistics data...",
      type: "info",
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  return (
    <main className="min-h-screen bg-neutral-900 text-slate-300">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-slate-100">
          Uganda Economic Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* GDP Growth Trend Card */}
          <div className="bg-neutral-800 rounded-lg p-6 shadow-lg border border-neutral-700">
            <div className="flex items-center gap-2 mb-4">
              <svg
                className="w-5 h-5 text-teal-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                />
              </svg>
              <h2 className="text-xl font-semibold text-slate-100">
                GDP Growth Trend
              </h2>
            </div>
            <div className="h-64">
              <Line data={chartData} options={chartOptions} />
            </div>
            <button
              onClick={updateData}
              className="mt-4 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-neutral-900 font-semibold rounded transition-colors"
            >
              Refresh Live Data
            </button>
          </div>

          {/* Additional Module Cards */}
          <div className="bg-neutral-800 rounded-lg p-6 shadow-lg border border-neutral-700">
            <div className="flex items-center gap-2 mb-4">
              <svg
                className="w-5 h-5 text-teal-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h2 className="text-xl font-semibold text-slate-100">
                Inflation Rate
              </h2>
            </div>
            <div className="text-4xl font-bold text-teal-400 mb-2">4.2%</div>
            <p className="text-sm text-slate-400">Current inflation rate</p>
          </div>

          <div className="bg-neutral-800 rounded-lg p-6 shadow-lg border border-neutral-700">
            <div className="flex items-center gap-2 mb-4">
              <svg
                className="w-5 h-5 text-teal-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
              <h2 className="text-xl font-semibold text-slate-100">
                Export Volume
              </h2>
            </div>
            <div className="text-4xl font-bold text-teal-400 mb-2">$2.4B</div>
            <p className="text-sm text-slate-400">Quarterly export value</p>
          </div>
        </div>

        {/* Terminal Log */}
        <div className="bg-neutral-950 rounded-lg p-4 border border-neutral-700 font-mono text-sm">
          <h3 className="text-slate-400 mb-2">System Log</h3>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {logs.map((log) => (
              <div key={log.id} className="flex gap-2">
                <span className="text-slate-500">[{log.time}]</span>
                <span
                  className={
                    log.type === "success"
                      ? "text-teal-400"
                      : log.type === "error"
                      ? "text-red-400"
                      : "text-blue-400"
                  }
                >
                  {log.message}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
