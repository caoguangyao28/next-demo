import {pgTable, serial, text} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

// 创建一个类型，用于表示插入的用户数据
export type InterUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;