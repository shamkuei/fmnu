import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./db/schema.js";
import { relations } from "./db/relations.js";

const sqlite = new Database("dev.db");
const db = drizzle({ client: sqlite, schema, relations });

async function seed() {
	const phone = "+98912290985";

	// Create user
	const [user] = await db
		.insert(schema.users)
		.values({ phone, name: "احسان", hasLogined: true })
		.returning();
	console.log(`Created user: ${user.id} (${user.phone})`);

	// Create restaurant
	const [restaurant] = await db
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

	// Make user admin of restaurant
	await db.insert(schema.restaurantAdmins).values({
		restaurantId: restaurant.id,
		userId: user.id,
	});
	console.log(`Made user admin of restaurant`);

	// Create categories
	const [cat1] = await db
		.insert(schema.categories)
		.values({ restaurantId: restaurant.id, name: "برگرها", sortOrder: 0 })
		.returning();

	const [cat2] = await db
		.insert(schema.categories)
		.values({ restaurantId: restaurant.id, name: "نوشیدنی‌ها", sortOrder: 1 })
		.returning();

	const [cat3] = await db
		.insert(schema.categories)
		.values({ restaurantId: restaurant.id, name: "پیش‌غذا", sortOrder: 2 })
		.returning();

	console.log(`Created 3 categories`);

	// Create products
	await db.insert(schema.products).values([
		{ restaurantId: restaurant.id, categoryId: cat1.id, name: "برگر کلاسیک", description: "گوشت ۱۵۰ گرمی، پنیر چدار، کاهو، گوجه", price: 185000, sortOrder: 0 },
		{ restaurantId: restaurant.id, categoryId: cat1.id, name: "برگر دوبل", description: "دو لایه گوشت ۱۵۰ گرمی، پنیر، سس مخصوص", price: 265000, sortOrder: 1 },
		{ restaurantId: restaurant.id, categoryId: cat1.id, name: "برگر مرغ", description: "سینه مرغ گریل شده، سس باربیکیو", price: 155000, sortOrder: 2 },
		{ restaurantId: restaurant.id, categoryId: cat2.id, name: "نوشابه قوطی", price: 25000, sortOrder: 0 },
		{ restaurantId: restaurant.id, categoryId: cat2.id, name: "دوغ محلی", price: 30000, sortOrder: 1 },
		{ restaurantId: restaurant.id, categoryId: cat2.id, name: "آب معدنی", price: 15000, sortOrder: 2 },
		{ restaurantId: restaurant.id, categoryId: cat3.id, name: "سیب زمینی سرخ کرده", description: "همراه سس مخصوص", price: 65000, sortOrder: 0 },
		{ restaurantId: restaurant.id, categoryId: cat3.id, name: "سالاد سزار", description: "کاهو، مرغ، پنیر پارمزان", price: 95000, sortOrder: 1 },
		{ restaurantId: restaurant.id, categoryId: cat3.id, name: "پیاز سوخاری", price: 55000, sortOrder: 2 },
	]);

	console.log(`Created 9 products`);
	console.log(`\nDone! Visit:`);
	console.log(`  Menu:    http://localhost:3000/dolopi`);
	console.log(`  Admin:   http://localhost:3000/admin`);
}

seed().catch(console.error);
