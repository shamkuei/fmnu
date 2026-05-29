ALTER TABLE `user` ADD `first_name` text NOT NULL DEFAULT '';--> statement-breakpoint
ALTER TABLE `user` ADD `last_name` text NOT NULL DEFAULT '';--> statement-breakpoint
ALTER TABLE `user` ADD `email` text;--> statement-breakpoint
UPDATE `user` SET `first_name` = COALESCE(`name`, '') WHERE `name` IS NOT NULL AND `name` != '';--> statement-breakpoint
ALTER TABLE `restaurant` ADD `province` text;
