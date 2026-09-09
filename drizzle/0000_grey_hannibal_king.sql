CREATE TABLE `branches` (
	`id` text PRIMARY KEY NOT NULL,
	`universe_id` text NOT NULL,
	`parent_node_id` text NOT NULL,
	`choice` text NOT NULL,
	`node` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`universe_id`) REFERENCES `universes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `branches_universe_id_unique` ON `branches` (`universe_id`);--> statement-breakpoint
CREATE TABLE `generation_limits` (
	`id` text PRIMARY KEY NOT NULL,
	`count` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `universes` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`guest_hash` text,
	`answers` text NOT NULL,
	`story` text NOT NULL,
	`source` text NOT NULL,
	`saved` integer DEFAULT 0 NOT NULL,
	`share_token` text,
	`created_at` text NOT NULL,
	`expires_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `universes_share_token_unique` ON `universes` (`share_token`);--> statement-breakpoint
CREATE INDEX `idx_universes_user_saved` ON `universes` (`user_id`,`saved`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`display_name` text NOT NULL,
	`created_at` text NOT NULL
);
