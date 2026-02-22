import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

// User authentication and subscription management
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  name: text('name'),
  role: text('role').notNull().default('free'), // free | paid | admin
  subscriptionTier: text('subscription_tier').default('free'), // free | starter | pro
  subscriptionStatus: text('subscription_status').default('inactive'), // active | inactive | cancelled
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  emailVerified: integer('email_verified', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Session management for NextAuth
export const sessions = sqliteTable('sessions', {
  sessionToken: text('session_token').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  expires: integer('expires', { mode: 'timestamp' }).notNull(),
});

// Verification tokens for email
export const verificationTokens = sqliteTable('verification_tokens', {
  identifier: text('identifier').notNull(),
  token: text('token').notNull(),
  expires: integer('expires', { mode: 'timestamp' }).notNull(),
});

// Industry sectors for dashboards
export const sectors = sqliteTable('sectors', {
  id: text('id').primaryKey(),
  name: text('name').notNull(), // Retail, Telecom, Finance, Agriculture
  slug: text('slug').notNull().unique(),
  description: text('description'),
  icon: text('icon'),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
});

// Sentiment data per sector
export const sentimentData = sqliteTable('sentiment_data', {
  id: text('id').primaryKey(),
  sectorId: text('sector_id').notNull().references(() => sectors.id),
  date: integer('date', { mode: 'timestamp' }).notNull(),
  positivePercent: real('positive_percent').notNull(),
  neutralPercent: real('neutral_percent').notNull(),
  negativePercent: real('negative_percent').notNull(),
  overallScore: real('overall_score').notNull(), // -1 to 1 scale
  totalArticles: integer('total_articles').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Keywords extracted from news data
export const keywords = sqliteTable('keywords', {
  id: text('id').primaryKey(),
  sectorId: text('sector_id').notNull().references(() => sectors.id),
  keyword: text('keyword').notNull(),
  frequency: integer('frequency').default(1),
  sentiment: real('sentiment'), // average sentiment
  lastMentioned: integer('last_mentioned', { mode: 'timestamp' }),
});

// Topic clusters
export const topics = sqliteTable('topics', {
  id: text('id').primaryKey(),
  sectorId: text('sector_id').notNull().references(() => sectors.id),
  name: text('name').notNull(),
  description: text('description'),
  sentiment: real('sentiment'),
  articleCount: integer('article_count').default(0),
  lastUpdated: integer('last_updated', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Historical trend data
export const historicalTrends = sqliteTable('historical_trends', {
  id: text('id').primaryKey(),
  sectorId: text('sector_id').notNull().references(() => sectors.id),
  date: integer('date', { mode: 'timestamp' }).notNull(),
  metricName: text('metric_name').notNull(), // sentiment, volume, etc.
  value: real('value').notNull(),
});

// AI-generated weekly summaries
export const weeklySummaries = sqliteTable('weekly_summaries', {
  id: text('id').primaryKey(),
  sectorId: text('sector_id').notNull().references(() => sectors.id),
  weekStart: integer('week_start', { mode: 'timestamp' }).notNull(),
  summary: text('summary').notNull(), // AI-generated paragraph
  keyHighlights: text('key_highlights'), // JSON array
  riskLevel: text('risk_level'), // low | medium | high
  performanceScore: real('performance_score'),
  generatedAt: integer('generated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Data ingestion - uploaded reports/news
export const dataReports = sqliteTable('data_reports', {
  id: text('id').primaryKey(),
  sectorId: text('sector_id').references(() => sectors.id),
  title: text('title').notNull(),
  content: text('content'), // Raw text content
  source: text('source'), // URL or file name
  sentiment: real('sentiment'),
  keywords: text('keywords'), // JSON array
  uploadedBy: text('uploaded_by').references(() => users.id),
  uploadedAt: integer('uploaded_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Generated PDF reports for download
export const generatedReports = sqliteTable('generated_reports', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  sectorId: text('sector_id').notNull().references(() => sectors.id),
  title: text('title').notNull(),
  reportType: text('report_type').notNull(), // weekly | monthly | custom
  pdfPath: text('pdf_path'),
  summary: text('summary'),
  riskLevel: text('risk_level'),
  generatedAt: integer('generated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Payment history
export const payments = sqliteTable('payments', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  stripePaymentId: text('stripe_payment_id'),
  amount: integer('amount').notNull(), // in cents
  currency: text('currency').default('USD'),
  status: text('status').notNull(), // pending | completed | failed | refunded
  plan: text('plan').notNull(), // starter | pro
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Email subscriptions for weekly reports
export const emailSubscriptions = sqliteTable('email_subscriptions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  sectorId: text('sector_id').notNull().references(() => sectors.id),
  frequency: text('frequency').default('weekly'), // daily | weekly | monthly
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Dashboard access for users (to track which sectors they can access)
export const userDashboardAccess = sqliteTable('user_dashboard_access', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  sectorId: text('sector_id').notNull().references(() => sectors.id),
  accessLevel: text('access_level').default('limited'), // limited | full
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Type exports
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Sector = typeof sectors.$inferSelect;
export type SentimentData = typeof sentimentData.$inferSelect;
export type WeeklySummary = typeof weeklySummaries.$inferSelect;
export type GeneratedReport = typeof generatedReports.$inferSelect;
export type Payment = typeof payments.$inferSelect;
