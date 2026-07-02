import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("[migrate] DATABASE_URL is not set");
  process.exit(1);
}

const sqlite = new Database(url);
const db = drizzle({ client: sqlite });

console.log(`[migrate] applying migrations to ${url}`);
migrate(db, { migrationsFolder: "./drizzle" });
sqlite.close();
console.log("[migrate] done");
