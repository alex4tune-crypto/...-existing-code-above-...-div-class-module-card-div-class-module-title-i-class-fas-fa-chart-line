CREATE TABLE `data_reports` (
	`id` text PRIMARY KEY NOT NULL,
	`sector_id` text,
	`title` text NOT NULL,
	`content` text,
	`source` text,
	`sentiment` real,
	`keywords` text,
	`uploaded_by` text,
	`uploaded_at` integer,
	FOREIGN KEY (`sector_id`) REFERENCES `sectors`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`uploaded_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);

CREATE TABLE `email_subscriptions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`sector_id` text NOT NULL,
	`frequency` text DEFAULT 'weekly',
	`is_active` integer DEFAULT true,
	`created_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`sector_id`) REFERENCES `sectors`(`id`) ON UPDATE no action ON DELETE no action
);

CREATE TABLE `generated_reports` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`sector_id` text NOT NULL,
	`title` text NOT NULL,
	`report_type` text NOT NULL,
	`pdf_path` text,
	`summary` text,
	`risk_level` text,
	`generated_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`sector_id`) REFERENCES `sectors`(`id`) ON UPDATE no action ON DELETE no action
);

CREATE TABLE `historical_trends` (
	`id` text PRIMARY KEY NOT NULL,
	`sector_id` text NOT NULL,
	`date` integer NOT NULL,
	`metric_name` text NOT NULL,
	`value` real NOT NULL,
	FOREIGN KEY (`sector_id`) REFERENCES `sectors`(`id`) ON UPDATE no action ON DELETE no action
);

CREATE TABLE `keywords` (
	`id` text PRIMARY KEY NOT NULL,
	`sector_id` text NOT NULL,
	`keyword` text NOT NULL,
	`frequency` integer DEFAULT 1,
	`sentiment` real,
	`last_mentioned` integer,
	FOREIGN KEY (`sector_id`) REFERENCES `sectors`(`id`) ON UPDATE no action ON DELETE no action
);

CREATE TABLE `payments` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`stripe_payment_id` text,
	`amount` integer NOT NULL,
	`currency` text DEFAULT 'USD',
	`status` text NOT NULL,
	`plan` text NOT NULL,
	`created_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);

CREATE TABLE `sectors` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`icon` text,
	`is_active` integer DEFAULT true
);

CREATE UNIQUE INDEX `sectors_slug_unique` ON `sectors` (`slug`);
CREATE TABLE `sentiment_data` (
	`id` text PRIMARY KEY NOT NULL,
	`sector_id` text NOT NULL,
	`date` integer NOT NULL,
	`positive_percent` real NOT NULL,
	`neutral_percent` real NOT NULL,
	`negative_percent` real NOT NULL,
	`overall_score` real NOT NULL,
	`total_articles` integer DEFAULT 0,
	`created_at` integer,
	FOREIGN KEY (`sector_id`) REFERENCES `sectors`(`id`) ON UPDATE no action ON DELETE no action
);

CREATE TABLE `sessions` (
	`session_token` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);

CREATE TABLE `topics` (
	`id` text PRIMARY KEY NOT NULL,
	`sector_id` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`sentiment` real,
	`article_count` integer DEFAULT 0,
	`last_updated` integer,
	FOREIGN KEY (`sector_id`) REFERENCES `sectors`(`id`) ON UPDATE no action ON DELETE no action
);

CREATE TABLE `user_dashboard_access` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`sector_id` text NOT NULL,
	`access_level` text DEFAULT 'limited',
	`created_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`sector_id`) REFERENCES `sectors`(`id`) ON UPDATE no action ON DELETE no action
);

CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`name` text,
	`role` text DEFAULT 'free' NOT NULL,
	`subscription_tier` text DEFAULT 'free',
	`subscription_status` text DEFAULT 'inactive',
	`stripe_customer_id` text,
	`stripe_subscription_id` text,
	`email_verified` integer DEFAULT false,
	`created_at` integer,
	`updated_at` integer
);

CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);
CREATE TABLE `verification_tokens` (
	`identifier` text NOT NULL,
	`token` text NOT NULL,
	`expires` integer NOT NULL
);

CREATE TABLE `weekly_summaries` (
	`id` text PRIMARY KEY NOT NULL,
	`sector_id` text NOT NULL,
	`week_start` integer NOT NULL,
	`summary` text NOT NULL,
	`key_highlights` text,
	`risk_level` text,
	`performance_score` real,
	`generated_at` integer,
	FOREIGN KEY (`sector_id`) REFERENCES `sectors`(`id`) ON UPDATE no action ON DELETE no action
);
