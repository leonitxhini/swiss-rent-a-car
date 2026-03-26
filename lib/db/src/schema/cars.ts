import { pgTable, serial, text, integer, numeric, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const carCategoryEnum = pgEnum("car_category", ["economy", "standard", "suv", "luxury", "van"]);
export const transmissionEnum = pgEnum("transmission", ["automatic", "manual"]);
export const fuelTypeEnum = pgEnum("fuel_type", ["petrol", "diesel", "hybrid", "electric"]);

export const carsTable = pgTable("cars", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  brand: text("brand").notNull(),
  model: text("model").notNull(),
  category: carCategoryEnum("category").notNull(),
  pricePerDay: numeric("price_per_day", { precision: 10, scale: 2 }).notNull(),
  seats: integer("seats").notNull(),
  transmission: transmissionEnum("transmission").notNull(),
  fuelType: fuelTypeEnum("fuel_type").notNull(),
  imageUrl: text("image_url").notNull(),
  features: text("features").array().notNull().default([]),
  available: boolean("available").notNull().default(true),
  rating: numeric("rating", { precision: 3, scale: 2 }).notNull().default("4.5"),
  reviewCount: integer("review_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertCarSchema = createInsertSchema(carsTable).omit({ id: true, createdAt: true });
export type InsertCar = z.infer<typeof insertCarSchema>;
export type Car = typeof carsTable.$inferSelect;
