/* ------------------------------------------------------------------ *
 *  Domain model for Campus Connect
 *  Note: food items intentionally have NO image — the menu is text-only
 *  by product decision (name, price, availability, dietary tag).
 * ------------------------------------------------------------------ */

export type Availability = "available" | "sold_out" | "coming_soon";

export type DietaryTag = "veg" | "non_veg" | "egg";

export type StaffRole = "staff" | "admin";

export type CanteenAccent = "maroon" | "gold" | "green";

export interface Canteen {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  location: string;
  /** "HH:MM" 24-hour local time */
  opensAt: string;
  closesAt: string;
  /** Whether the canteen is currently serving (staff-controlled). */
  isOpen: boolean;
  accent: CanteenAccent;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  canteenId: string;
  name: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface FoodItem {
  id: string;
  canteenId: string;
  categoryId: string;
  name: string;
  description: string | null;
  price: number;
  availability: Availability;
  dietary: DietaryTag;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface StaffUser {
  id: string;
  email: string;
  name: string;
  role: StaffRole;
  /** null for super admins (they oversee every canteen). */
  canteenId: string | null;
  createdAt: string;
}

export type ActivityAction =
  | "create"
  | "update"
  | "delete"
  | "toggle_availability"
  | "toggle_open"
  | "login";

export type ActivityEntity =
  | "canteen"
  | "category"
  | "food_item"
  | "staff"
  | "session";

export interface ActivityLog {
  id: string;
  actorId: string;
  actorName: string;
  canteenId: string | null;
  action: ActivityAction;
  entity: ActivityEntity;
  entityName: string;
  detail: string | null;
  createdAt: string;
}

/* ----------------------------- View models ------------------------------ */

export interface MenuData {
  canteen: Canteen;
  categories: Category[];
  items: FoodItem[];
}

export interface CanteenSummary extends Canteen {
  availableCount: number;
  totalCount: number;
  lastUpdated: string;
}

/* ----------------------------- Input types ------------------------------ */

export interface CategoryInput {
  name: string;
  sortOrder?: number;
}

export interface FoodItemInput {
  categoryId: string;
  name: string;
  description?: string | null;
  price: number;
  availability: Availability;
  dietary: DietaryTag;
  sortOrder?: number;
}

export interface CanteenInput {
  name: string;
  tagline: string;
  location: string;
  opensAt: string;
  closesAt: string;
  accent: CanteenAccent;
  isOpen?: boolean;
}

export interface StaffInput {
  name: string;
  email: string;
  role: StaffRole;
  canteenId: string | null;
  /** Temporary login password — required only when creating a new account. */
  password?: string;
}

/* --------------------------- Display helpers ---------------------------- */

export const AVAILABILITY_META: Record<
  Availability,
  { label: string; tone: "available" | "sold" | "soon" }
> = {
  available: { label: "Available", tone: "available" },
  sold_out: { label: "Sold Out", tone: "sold" },
  coming_soon: { label: "Coming Soon", tone: "soon" },
};

export const DIETARY_META: Record<
  DietaryTag,
  { label: string; color: string }
> = {
  veg: { label: "Veg", color: "#1c8049" },
  non_veg: { label: "Non-veg", color: "#b23a2e" },
  egg: { label: "Egg", color: "#c08a2d" },
};
