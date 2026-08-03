CREATE TABLE `quiz_progress` (
	`user_email` text PRIMARY KEY NOT NULL,
	`payload` text NOT NULL,
	`updated_at` text NOT NULL
);
