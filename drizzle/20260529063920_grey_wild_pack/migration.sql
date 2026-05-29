ALTER TABLE `restaurant` ADD `updated_at` integer NOT NULL DEFAULT 0;--> statement-breakpoint
UPDATE `restaurant` SET `updated_at` = unixepoch() WHERE `updated_at` = 0;
