import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import { createClient } from "@libsql/client";
import path from "path";
import { existsSync, mkdirSync } from "fs";

// Ensure the data directory exists
const dataDir = path.join(process.cwd(), "data");
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

// Create libsql client
const client = createClient({
  url: `file:${path.join(dataDir, "uganda-insights.db")}`,
});

// Create drizzle instance
const db = drizzle(client);

// Run migrations
console.log("Running migrations...");
migrate(db, { migrationsFolder: "./src/db/migrations" });
console.log("Migrations complete!");
