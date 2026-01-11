import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  imageUrl: text("image_url").notNull(),
});

export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").references(() => categories.id).notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // stored in cents
  imageUrl: text("image_url").notNull(),
  isAvailable: boolean("is_available").default(true).notNull(),
});

export const reservations = pgTable("reservations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  date: timestamp("date").notNull(),
  partySize: integer("party_size").notNull(),
  status: text("status").default("pending").notNull(), // pending, confirmed, cancelled
});

export const categoryRelations = relations(categories, ({ many }) => ({
  items: many(menuItems),
}));

export const menuItemRelations = relations(menuItems, ({ one }) => ({
  category: one(categories, {
    fields: [menuItems.categoryId],
    references: [categories.id],
  }),
}));

export const insertCategorySchema = createInsertSchema(categories).omit({ id: true });
export const insertMenuItemSchema = createInsertSchema(menuItems).omit({ id: true });
export const insertReservationSchema = createInsertSchema(reservations, {
  date: z.coerce.date(),
}).omit({ id: true, status: true });

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  itemId: integer("item_id").references(() => menuItems.id).notNull(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  deliveryAddress: text("delivery_address").notNull(),
  totalAmount: integer("total_amount").notNull(),
  status: text("status").default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orderRelations = relations(orders, ({ one }) => ({
  item: one(menuItems, {
    fields: [orders.itemId],
    references: [menuItems.id],
  }),
}));

export const insertOrderSchema = createInsertSchema(orders, {
  customerEmail: z.string().email("Invalid email address"),
  customerPhone: z.string().min(10, "Phone number must be at least 10 digits").max(15, "Phone number too long"),
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  deliveryAddress: z.string().min(10, "Please provide a complete delivery address"),
}).omit({ id: true, status: true, createdAt: true });

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type MenuItem = typeof menuItems.$inferSelect;
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;
export type Reservation = typeof reservations.$inferSelect;
export type InsertReservation = z.infer<typeof insertReservationSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
