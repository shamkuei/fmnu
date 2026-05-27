import Database from "better-sqlite3";
import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./db/schema.js";

const sqlite = new Database("dev.db");
const db = drizzle({ client: sqlite, schema });

async function seed() {
  const phone = "+98912290985";

  // Create user (idempotent)
  const [existingUser] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.phone, phone))
    .limit(1);

  let user = existingUser;
  if (!user) {
    [user] = await db
      .insert(schema.users)
      .values({ phone, name: "احسان", hasLogined: true })
      .returning();
    console.log(`Created user: ${user.id} (${user.phone})`);
  } else {
    console.log(`User exists: ${user.id} (${user.phone})`);
  }

  // Create restaurant (idempotent by slug)
  const [existingRestaurant] = await db
    .select()
    .from(schema.restaurants)
    .where(eq(schema.restaurants.slug, "dolopi"))
    .limit(1);

  let restaurant = existingRestaurant;
  if (!restaurant) {
    [restaurant] = await db
      .insert(schema.restaurants)
      .values({
        slug: "dolopi",
        name: "دلوپی",
        brandText: "برگر و ساندویچ",
        description: "بهترین برگرهای شهر با مواد اولیه تازه",
        theme: {
          "--text-primary": "#1a1a2e",
          "--text-secondary": "#555",
          "--bg-base": "#fafafa",
          "--bg-card": "#ffffff",
          "--border": "#e0e0e0",
          "--text-accent": "#e63946",
        },
      })
      .returning();
    console.log(`Created restaurant: ${restaurant.id} (${restaurant.slug})`);
  } else {
    console.log(`Restaurant exists: ${restaurant.id} (${restaurant.slug})`);
  }

  // Make user admin of restaurant (idempotent)
  const [existingAdmin] = await db
    .select()
    .from(schema.restaurantAdmins)
    .where(
      and(
        eq(schema.restaurantAdmins.restaurantId, restaurant.id),
        eq(schema.restaurantAdmins.userId, user.id),
      ),
    )
    .limit(1);

  if (!existingAdmin) {
    await db.insert(schema.restaurantAdmins).values({
      restaurantId: restaurant.id,
      userId: user.id,
    });
    console.log(`Made user admin of restaurant`);
  } else {
    console.log(`User already admin of restaurant`);
  }

  // Create categories (idempotent by name within restaurant)
  const existingCategories = await db
    .select()
    .from(schema.categories)
    .where(eq(schema.categories.restaurantId, restaurant.id));

  const existingCatNames = new Set(existingCategories.map((c) => c.name));

  const catData = [
    { name: "برگرها", sortOrder: 0 },
    { name: "نوشیدنی‌ها", sortOrder: 1 },
    { name: "پیش‌غذا", sortOrder: 2 },
  ];

  const cats: Record<string, (typeof existingCategories)[number]> = {};
  for (const c of existingCategories) cats[c.name] = c;

  for (const c of catData) {
    if (!existingCatNames.has(c.name)) {
      const [created] = await db
        .insert(schema.categories)
        .values({
          restaurantId: restaurant.id,
          name: c.name,
          sortOrder: c.sortOrder,
        })
        .returning();
      cats[c.name] = created;
      console.log(`Created category: ${c.name}`);
    }
  }
  console.log(`Categories ready (${Object.keys(cats).length})`);

  // Create products (idempotent by name within category)
  const productsData = [
    {
      cat: "برگرها",
      name: "برگر کلاسیک",
      description: "گوشت ۱۵۰ گرمی، پنیر چدار، کاهو، گوجه",
      price: 185000,
      sortOrder: 0,
    },
    {
      cat: "برگرها",
      name: "برگر دوبل",
      description: "دو لایه گوشت ۱۵۰ گرمی، پنیر، سس مخصوص",
      price: 265000,
      sortOrder: 1,
    },
    {
      cat: "برگرها",
      name: "برگر مرغ",
      description: "سینه مرغ گریل شده، سس باربیکیو",
      price: 155000,
      sortOrder: 2,
    },
    { cat: "نوشیدنی‌ها", name: "نوشابه قوطی", price: 25000, sortOrder: 0 },
    { cat: "نوشیدنی‌ها", name: "دوغ محلی", price: 30000, sortOrder: 1 },
    { cat: "نوشیدنی‌ها", name: "آب معدنی", price: 15000, sortOrder: 2 },
    {
      cat: "پیش‌غذا",
      name: "سیب زمینی سرخ کرده",
      description: "همراه سس مخصوص",
      price: 65000,
      sortOrder: 0,
    },
    {
      cat: "پیش‌غذا",
      name: "سالاد سزار",
      description: "کاهو، مرغ، پنیر پارمزان",
      price: 95000,
      sortOrder: 1,
    },
    { cat: "پیش‌غذا", name: "پیاز سوخاری", price: 55000, sortOrder: 2 },
  ];

  let created = 0;
  for (const p of productsData) {
    const category = cats[p.cat];
    if (!category) continue;

    const [exists] = await db
      .select()
      .from(schema.products)
      .where(
        and(
          eq(schema.products.categoryId, category.id),
          eq(schema.products.name, p.name),
        ),
      )
      .limit(1);
    if (exists) continue;

    await db.insert(schema.products).values({
      restaurantId: restaurant.id,
      categoryId: category.id,
      name: p.name,
      description: p.description ?? null,
      price: p.price,
      sortOrder: p.sortOrder,
    });
    created++;
  }

  if (created > 0) console.log(`Created ${created} products`);
  else console.log("All products already exist");

  console.log("\nDone! Visit:");
  console.log("  Menu:    http://localhost:3000/dolopi");
  console.log("  Admin:   http://localhost:3000/admin");
}

seed().catch(console.error);
