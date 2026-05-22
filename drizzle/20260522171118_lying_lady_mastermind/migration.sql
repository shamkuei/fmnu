CREATE TABLE `category` (
	`id` text PRIMARY KEY,
	`restaurant_id` text NOT NULL,
	`name` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	CONSTRAINT `fk_category_restaurant_id_restaurant_id_fk` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurant`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `product` (
	`id` text PRIMARY KEY,
	`category_id` text NOT NULL,
	`restaurant_id` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`price` integer NOT NULL,
	`image_url` text,
	`available` integer DEFAULT true NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	CONSTRAINT `fk_product_category_id_category_id_fk` FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_product_restaurant_id_restaurant_id_fk` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurant`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `restaurant_admin` (
	`restaurant_id` text NOT NULL,
	`user_id` text NOT NULL,
	CONSTRAINT `restaurant_admin_pk` PRIMARY KEY(`restaurant_id`, `user_id`),
	CONSTRAINT `fk_restaurant_admin_restaurant_id_restaurant_id_fk` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurant`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_restaurant_admin_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `restaurant` (
	`id` text PRIMARY KEY,
	`slug` text NOT NULL UNIQUE,
	`name` text NOT NULL,
	`brand_text` text,
	`description` text,
	`logo_url` text,
	`hero_image_url` text,
	`theme` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY,
	`user_id` text NOT NULL,
	`expire_at` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`revoked_at` integer,
	CONSTRAINT `fk_session_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY,
	`phone` text NOT NULL UNIQUE,
	`name` text,
	`hasLogined` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `verification` (
	`id` text PRIMARY KEY,
	`code` text NOT NULL,
	`phone` text,
	`reason` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`expire_at` integer NOT NULL,
	`next_resend` integer NOT NULL,
	`resend_count` integer DEFAULT 0 NOT NULL,
	`used_at` integer
);
--> statement-breakpoint
CREATE INDEX `idx_categories_restaurant` ON `category` (`restaurant_id`);--> statement-breakpoint
CREATE INDEX `idx_products_category` ON `product` (`category_id`);--> statement-breakpoint
CREATE INDEX `idx_products_restaurant` ON `product` (`restaurant_id`);--> statement-breakpoint
CREATE INDEX `idx_restaurant_admins_user` ON `restaurant_admin` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_sessions_user` ON `session` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_verifications_phone` ON `verification` (`phone`);