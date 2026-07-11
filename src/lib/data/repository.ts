import type {
  ActivityLog,
  Canteen,
  CanteenInput,
  CanteenSummary,
  Category,
  CategoryInput,
  FoodItem,
  FoodItemInput,
  MenuData,
  StaffInput,
  StaffUser,
  Availability,
} from "@/lib/types";

export interface PlatformStats {
  totalCanteens: number;
  openCanteens: number;
  totalItems: number;
  availableItems: number;
  soldOutItems: number;
  comingSoonItems: number;
  totalCategories: number;
  totalStaff: number;
  perCanteen: {
    canteen: Canteen;
    availableCount: number;
    totalCount: number;
    categoryCount: number;
  }[];
}

/**
 * The single data seam for the whole app. Two implementations exist:
 *   - DemoRepository       (localStorage, works with zero backend)
 *   - SupabaseRepository   (production, Postgres + Auth + Realtime)
 * The active one is chosen by `getRepository()` based on env config.
 */
export interface Repository {
  readonly mode: "demo" | "supabase";

  /* ---- Public reads ---- */
  getCanteenSummaries(): Promise<CanteenSummary[]>;
  getCanteenBySlug(slug: string): Promise<Canteen | null>;
  getMenu(canteenId: string): Promise<MenuData>;

  /* ---- Auth ---- */
  getCurrentUser(): Promise<StaffUser | null>;
  signIn(email: string, password: string): Promise<StaffUser>;
  signOut(): Promise<void>;

  /* ---- Categories (staff) ---- */
  createCategory(canteenId: string, input: CategoryInput): Promise<Category>;
  updateCategory(id: string, input: Partial<CategoryInput>): Promise<Category>;
  deleteCategory(id: string): Promise<void>;

  /* ---- Food items (staff) ---- */
  createItem(canteenId: string, input: FoodItemInput): Promise<FoodItem>;
  updateItem(id: string, input: Partial<FoodItemInput>): Promise<FoodItem>;
  setAvailability(id: string, availability: Availability): Promise<FoodItem>;
  deleteItem(id: string): Promise<void>;

  /* ---- Canteen controls ---- */
  setCanteenOpen(id: string, isOpen: boolean): Promise<Canteen>;
  createCanteen(input: CanteenInput): Promise<Canteen>;
  updateCanteen(id: string, input: Partial<CanteenInput>): Promise<Canteen>;
  deleteCanteen(id: string): Promise<void>;

  /* ---- Staff management (admin) ---- */
  getStaff(): Promise<StaffUser[]>;
  createStaff(input: StaffInput): Promise<StaffUser>;
  updateStaff(id: string, input: Partial<StaffInput>): Promise<StaffUser>;
  deleteStaff(id: string): Promise<void>;

  /* ---- Insights (admin) ---- */
  getStats(): Promise<PlatformStats>;
  getActivity(canteenId?: string | null): Promise<ActivityLog[]>;

  /* ---- Realtime ---- */
  subscribe(listener: () => void): () => void;
}

/** Thrown when a mutation is attempted the current session may not perform. */
export class AuthError extends Error {
  constructor(message = "You are not authorised to perform this action.") {
    super(message);
    this.name = "AuthError";
  }
}

/** Thrown when Supabase mode is selected but not configured. */
export class NotConfiguredError extends Error {
  constructor(message = "Supabase is not configured.") {
    super(message);
    this.name = "NotConfiguredError";
  }
}
