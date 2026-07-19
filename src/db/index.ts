import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { relations } from "./relations";
import * as schema from "./schema";

const sqlite = new Database(process.env.DATABASE_URL || "dev.db");
export const db = drizzle({
  client: sqlite,
  schema,
  relations,
});
