import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Uganda Insights - Business Intelligence & Market Sentiment",
  description: "Subscription-based Business Intelligence & Market Sentiment SaaS platform focused on Ugandan businesses and analysts.",
  keywords: ["Uganda", "Business Intelligence", "Market Sentiment", "Analytics", "Africa", "Finance", "Retail", "Telecom", "Agriculture"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
