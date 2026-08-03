import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const quizProgress = sqliteTable("quiz_progress", {
  userEmail: text("user_email").primaryKey(),
  payload: text("payload").notNull(),
  updatedAt: text("updated_at").notNull(),
});
