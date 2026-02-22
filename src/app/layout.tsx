import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";

export const metadata: Metadata = {
  title: "Uganda Insights - Sovereign Command Centre",
  description: "Subscription-based Business Intelligence & Market Sentiment SaaS platform focused on Ugandan businesses and analysts. Real-time market intelligence for the Bank of Uganda.",
  keywords: ["Uganda", "Business Intelligence", "Market Sentiment", "Analytics", "Africa", "Finance", "Retail", "Telecom", "Agriculture", "GDP", "Bank of Uganda"],
  authors: [{ name: "Uganda Insights" }],
  openGraph: {
    title: "Uganda Insights - Sovereign Command Centre",
    description: "Real-time market intelligence for Ugandan businesses",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
