// Runs once per server lifecycle (next start / next dev), after the DB module is
// available but before requests are served. Kept out of db/index.ts so it does
// not fire on every module import — which races across next build's static
// generation workers ("table already exists").
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const { migrate } = await import("drizzle-orm/better-sqlite3/migrator");
  const { db } = await import("./db/index");
  migrate(db, { migrationsFolder: "./drizzle" });
  console.log("migration completed");

  // Ensure the permanent platform superadmin exists (env-driven, idempotent).
  // Runs after migrations so the role/password columns are present.
  const { ensureRootSuperadmin } = await import(
    "./modules/auth/bootstrap.service"
  );
  await ensureRootSuperadmin();
}
