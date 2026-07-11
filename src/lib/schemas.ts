import { z } from "zod";

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(4, "Password is too short"),
});
export type LoginValues = z.infer<typeof loginSchema>;

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Category name is too short")
    .max(40, "Keep it under 40 characters"),
});
export type CategoryValues = z.infer<typeof categorySchema>;

export const foodItemSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Item name is too short")
    .max(60, "Keep it under 60 characters"),
  categoryId: z.string().min(1, "Choose a category"),
  description: z
    .string()
    .trim()
    .max(160, "Keep the description under 160 characters")
    .optional()
    .or(z.literal("")),
  price: z
    .number({ message: "Enter a valid price" })
    .min(0, "Price cannot be negative")
    .max(100000, "That price looks too high"),
  availability: z.enum(["available", "sold_out", "coming_soon"]),
  dietary: z.enum(["veg", "non_veg", "egg"]),
});
export type FoodItemValues = z.infer<typeof foodItemSchema>;

export const canteenSchema = z
  .object({
    name: z.string().trim().min(2, "Name is too short").max(50),
    tagline: z.string().trim().min(4, "Add a short tagline").max(90),
    location: z.string().trim().min(2, "Add a location").max(80),
    opensAt: z.string().regex(timeRegex, "Use HH:MM (24h)"),
    closesAt: z.string().regex(timeRegex, "Use HH:MM (24h)"),
    accent: z.enum(["maroon", "gold", "green"]),
    isOpen: z.boolean().optional(),
  });
export type CanteenValues = z.infer<typeof canteenSchema>;

export const staffSchema = z
  .object({
    name: z.string().trim().min(2, "Name is too short").max(60),
    email: z.string().min(1, "Email is required").email("Enter a valid email"),
    role: z.enum(["staff", "admin"]),
    canteenId: z.string().nullable(),
  })
  .refine((v) => v.role === "admin" || Boolean(v.canteenId), {
    message: "Assign a canteen for staff accounts",
    path: ["canteenId"],
  });
export type StaffValues = z.infer<typeof staffSchema>;
