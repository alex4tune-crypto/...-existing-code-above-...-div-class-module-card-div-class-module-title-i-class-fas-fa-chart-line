CREATE TABLE `community_reports` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`location` text NOT NULL,
	`report` text NOT NULL,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `economic_indicators` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`year` integer NOT NULL,
	`gdp_growth` real NOT NULL,
	`inflation_rate` real NOT NULL,
	`exports` real,
	`imports` real,
	`exchange_rate` real,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `social_metrics` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`year` integer NOT NULL,
	`literacy_rate` real NOT NULL,
	`population` integer,
	`healthcare_access` real,
	`employment_rate` real,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `system_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`time` text NOT NULL,
	`message` text NOT NULL,
	`type` text NOT NULL,
	`created_at` integer
);
