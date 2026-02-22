import { createDatabase } from "@kilocode/app-builder-db";
import * as schema from "./schema";

export const db = createDatabase(schema);

// Export all schema tables
export * from "./schema";
