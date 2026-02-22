"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Chart colors
export const chartColors = {
  primary: "#1a365d",
  secondary: "#2d3748",
  accent: "#38b2ac",
  positive: "#38a169",
  neutral: "#d69e2e",
  negative: "#e53e3e",
  background: "#f7fafc",
  text: "#2d3748",
  border: "#e2e8f0",
};

// Line chart options
export const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: "#1a365d",
      titleColor: "#fff",
      bodyColor: "#fff",
      padding: 12,
      cornerRadius: 8,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: "#718096",
      },
    },
    y: {
      grid: {
        color: "#e2e8f0",
      },
      ticks: {
        color: "#718096",
      },
    },
  },
  elements: {
    line: {
      tension: 0.4,
    },
  },
};

// Bar chart options
export const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: "#1a365d",
      titleColor: "#fff",
      bodyColor: "#fff",
      padding: 12,
      cornerRadius: 8,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: "#718096",
      },
    },
    y: {
      grid: {
        color: "#e2e8f0",
      },
      ticks: {
        color: "#718096",
      },
    },
  },
};

// Doughnut chart options
export const doughnutChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom" as const,
      labels: {
        padding: 20,
        usePointStyle: true,
        pointStyle: "circle",
        color: "#2d3748",
      },
    },
    tooltip: {
      backgroundColor: "#1a365d",
      titleColor: "#fff",
      bodyColor: "#fff",
      padding: 12,
      cornerRadius: 8,
    },
  },
  cutout: "60%",
};

// Sentiment score colors
export function getSentimentColor(score: number): string {
  if (score > 0.3) return chartColors.positive;
  if (score < -0.3) return chartColors.negative;
  return chartColors.neutral;
}

// Risk level colors
export function getRiskColor(level: string): string {
  switch (level.toLowerCase()) {
    case "low":
      return chartColors.positive;
    case "high":
      return chartColors.negative;
    default:
      return chartColors.neutral;
  }
}
