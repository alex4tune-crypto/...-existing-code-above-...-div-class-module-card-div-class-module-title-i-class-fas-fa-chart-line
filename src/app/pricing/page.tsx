"use client";

import { useState } from "react";
import Link from "next/link";
import { chartColors } from "@/lib/chart-config";

const plans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    period: "forever",
    description: "Get started with basic market insights",
    features: [
      "Basic dashboard access",
      "Limited data history (7 days)",
      "Single sector view",
      "Basic sentiment analysis",
      "Community support",
    ],
    notIncluded: [
      "Report downloads",
      "Email summaries",
      "Full history access",
      "Priority support",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    id: "starter",
    name: "Starter",
    price: 19,
    period: "month",
    description: "Perfect for small businesses and analysts",
    features: [
      "Full dashboard access",
      "30-day data history",
      "All 4 sectors",
      "Sentiment analysis",
      "Keyword extraction",
      "Weekly email summaries",
      "Email support",
    ],
    notIncluded: [
      "PDF report downloads",
      "Priority support",
      "API access",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: 29,
    period: "month",
    description: "For professionals and enterprises",
    features: [
      "Unlimited dashboard access",
      "Complete history view",
      "All 4 sectors + future",
      "Advanced sentiment analysis",
      "Unlimited PDF downloads",
      "Weekly AI insights",
      "Email summaries",
      "Priority support",
      "Custom alerts",
      "API access",
    ],
    notIncluded: [],
    cta: "Start Pro Trial",
    popular: true,
  },
];

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (planId: string) => {
    if (planId === "free") {
      window.location.href = "/dashboard";
      return;
    }

    setLoading(planId);
    
    try {
      const response = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: planId,
          userId: "user-demo", // In production, get from session
          email: "demo@ugandainsights.com",
        }),
      });

      const result = await response.json();

      if (result.success) {
        if (result.demo) {
          alert(`Demo payment processed! Plan: ${planId.toUpperCase()}`);
          window.location.href = "/dashboard";
        } else if (result.data?.url) {
          window.location.href = result.data.url;
        }
      } else {
        alert("Payment failed: " + result.error);
      }
    } catch (error) {
      alert("Payment error occurred");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/dashboard" className="flex items-center gap-2">
              <span className="text-2xl">🇺🇬</span>
              <span className="text-xl font-bold" style={{ color: chartColors.primary }}>
                Uganda Insights
              </span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold" style={{ color: chartColors.primary }}>
            Simple, Transparent Pricing
          </h1>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Choose the plan that fits your business needs. All plans include a 14-day free trial.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl shadow-sm border-2 ${
                plan.popular ? "border-blue-500 relative" : "border-gray-200"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-8">
                <h3 className="text-xl font-bold" style={{ color: chartColors.primary }}>
                  {plan.name}
                </h3>
                <p className="text-gray-500 text-sm mt-1">{plan.description}</p>

                <div className="mt-6">
                  <span className="text-4xl font-bold" style={{ color: chartColors.primary }}>
                    ${plan.price}
                  </span>
                  <span className="text-gray-500">/{plan.period}</span>
                </div>

                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={loading === plan.id}
                  className={`w-full mt-6 py-3 px-6 rounded-lg font-semibold transition-all ${
                    plan.popular
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  } ${loading === plan.id ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {loading === plan.id ? "Processing..." : plan.cta}
                </button>

                <div className="mt-8">
                  <h4 className="font-medium text-gray-900 mb-4">What&apos;s included:</h4>
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-green-500 mt-0.5">✓</span>
                        {feature}
                      </li>
                    ))}
                    {plan.notIncluded.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                        <span className="mt-0.5">×</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Payment Methods */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 mb-4">Accepted payment methods</p>
          <div className="flex justify-center gap-4">
            <div className="bg-white px-4 py-2 rounded-lg border text-gray-600 font-medium">
              💳 Visa/Mastercard
            </div>
            <div className="bg-white px-4 py-2 rounded-lg border text-gray-600 font-medium">
              📱 MTN MoMo
            </div>
            <div className="bg-white px-4 py-2 rounded-lg border text-gray-600 font-medium">
              🏦 Bank Transfer
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8" style={{ color: chartColors.primary }}>
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border">
              <h3 className="font-semibold mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-600 text-sm">
                Yes, you can cancel your subscription at any time. You&apos;ll continue to have access until the end of your billing period.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border">
              <h3 className="font-semibold mb-2">Is there a free trial?</h3>
              <p className="text-gray-600 text-sm">
                Yes! All paid plans come with a 14-day free trial. No credit card required to start.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border">
              <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600 text-sm">
                We accept all major credit cards, MTN Mobile Money, and bank transfers for annual plans.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
