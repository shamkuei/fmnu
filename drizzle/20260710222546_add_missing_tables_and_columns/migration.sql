CREATE TABLE `page_view` (
	`id` text PRIMARY KEY,
	`restaurant_id` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	CONSTRAINT `fk_page_view_restaurant_id_restaurant_id_fk` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurant`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `site_settings` (
	`id` integer PRIMARY KEY DEFAULT 1,
	`show_social_proof` integer DEFAULT true NOT NULL,
	`show_testimonials` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE `testimonial` (
	`id` text PRIMARY KEY,
	`name` text NOT NULL,
	`role` text NOT NULL,
	`text` text NOT NULL,
	`rating` integer DEFAULT 5 NOT NULL,
	`is_visible` integer DEFAULT true NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
ALTER TABLE `restaurant` ADD `address` text;--> statement-breakpoint
ALTER TABLE `restaurant` ADD `phone` text;--> statement-breakpoint
ALTER TABLE `restaurant` ADD `city` text;--> statement-breakpoint
ALTER TABLE `restaurant` ADD `social_media` text;--> statement-breakpoint
ALTER TABLE `restaurant` ADD `is_available` integer DEFAULT true NOT NULL;--> statement-breakpoint
CREATE INDEX `idx_page_views_restaurant` ON `page_view` (`restaurant_id`);