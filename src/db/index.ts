import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import { relations } from "./relations";

const sqlite = new Database(process.env.DATABASE_URL || "dev.db");
export const db = drizzle({
	client: sqlite,
	schema,
	relations,
});
