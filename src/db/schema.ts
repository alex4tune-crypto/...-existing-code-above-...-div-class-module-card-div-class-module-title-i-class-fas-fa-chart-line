import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

// Economic Indicators Table
export const economicIndicators = sqliteTable("economic_indicators", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  year: integer("year").notNull(),
  gdpGrowth: real("gdp_growth").notNull(), // GDP Growth %
  inflationRate: real("inflation_rate").notNull(), // Inflation %
  exports: real("exports"), // Exports in billions USD
  imports: real("imports"), // Imports in billions USD
  exchangeRate: real("exchange_rate"), // UGX per USD
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Social Metrics Table
export const socialMetrics = sqliteTable("social_metrics", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  year: integer("year").notNull(),
  literacyRate: real("literacy_rate").notNull(), // Literacy Rate %
  population: integer("population"), // Total population
  healthcareAccess: real("healthcare_access"), // Healthcare access %
  employmentRate: real("employment_rate"), // Employment rate %
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// System Logs Table
export const systemLogs = sqliteTable("system_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  time: text("time").notNull(), // Time string
  message: text("message").notNull(), // Log message
  type: text("type", { enum: ["info", "success", "warning", "error", "debug"] }).notNull(), // Log type
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Community Reports Table
export const communityReports = sqliteTable("community_reports", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  location: text("location").notNull(), // Location (e.g., Kampala, Mbarara)
  report: text("report").notNull(), // Report content
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Export type inference
export type EconomicIndicator = typeof economicIndicators.$inferSelect;
export type NewEconomicIndicator = typeof economicIndicators.$inferInsert;
export type SocialMetric = typeof socialMetrics.$inferSelect;
export type NewSocialMetric = typeof socialMetrics.$inferInsert;
export type SystemLog = typeof systemLogs.$inferSelect;
export type NewSystemLog = typeof systemLogs.$inferInsert;
export type CommunityReport = typeof communityReports.$inferSelect;
export type NewCommunityReport = typeof communityReports.$inferInsert;
