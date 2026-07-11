import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  ActivityAction,
  ActivityEntity,
  ActivityLog,
  Availability,
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
} from "@/lib/types";
import type { Database } from "@/lib/supabase/database.types";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";
import { AuthError, type PlatformStats, type Repository } from "./repository";

type DB = SupabaseClient<Database>;
type CanteenRow = Database["public"]["Tables"]["canteens"]["Row"];
type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];
type FoodRow = Database["public"]["Tables"]["food_items"]["Row"];
type StaffRow = Database["public"]["Tables"]["staff_users"]["Row"];
type LogRow = Database["public"]["Tables"]["activity_logs"]["Row"];

const toCanteen = (r: CanteenRow): Canteen => ({
  id: r.id,
  slug: r.slug,
  name: r.name,
  tagline: r.tagline,
  location: r.location,
  opensAt: r.opens_at,
  closesAt: r.closes_at,
  isOpen: r.is_open,
  accent: r.accent,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
});

const toCategory = (r: CategoryRow): Category => ({
  id: r.id,
  canteenId: r.canteen_id,
  name: r.name,
  sortOrder: r.sort_order,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
});

const toItem = (r: FoodRow): FoodItem => ({
  id: r.id,
  canteenId: r.canteen_id,
  categoryId: r.category_id,
  name: r.name,
  description: r.description,
  price: Number(r.price),
  availability: r.availability,
  dietary: r.dietary,
  sortOrder: r.sort_order,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
});

const toStaff = (r: StaffRow): StaffUser => ({
  id: r.id,
  email: r.email,
  name: r.name,
  role: r.role,
  canteenId: r.canteen_id,
  createdAt: r.created_at,
});

const toLog = (r: LogRow): ActivityLog => ({
  id: r.id,
  actorId: r.actor_id ?? "",
  actorName: r.actor_name,
  canteenId: r.canteen_id,
  action: r.action as ActivityAction,
  entity: r.entity as ActivityEntity,
  entityName: r.entity_name,
  detail: r.detail,
  createdAt: r.created_at,
});

function unwrap<T>(data: T | null, error: { message: string } | null): T {
  if (error) throw new Error(error.message);
  if (data === null) throw new Error("No data returned");
  return data;
}

/** Production repository backed by Supabase (Postgres + Auth + Realtime). */
export class SupabaseRepository implements Repository {
  readonly mode = "supabase" as const;
  private db: DB;
  private cachedUser: StaffUser | null = null;

  constructor() {
    this.db = getSupabaseBrowserClient();
  }

  /* -------------------------------- auth ---------------------------------- */

  async getCurrentUser(): Promise<StaffUser | null> {
    const {
      data: { user },
    } = await this.db.auth.getUser();
    if (!user) {
      this.cachedUser = null;
      return null;
    }
    const { data } = await this.db
      .from("staff_users")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();
    this.cachedUser = data ? toStaff(data) : null;
    return this.cachedUser;
  }

  async signIn(email: string, password: string): Promise<StaffUser> {
    const { error } = await this.db.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) throw new AuthError(error.message);
    const user = await this.getCurrentUser();
    if (!user) {
      throw new AuthError(
        "Signed in, but no staff profile is linked to this account.",
      );
    }
    return user;
  }

  async signOut(): Promise<void> {
    await this.db.auth.signOut();
    this.cachedUser = null;
  }

  private async requireUser(): Promise<StaffUser> {
    const user = this.cachedUser ?? (await this.getCurrentUser());
    if (!user) throw new AuthError("Please sign in to continue.");
    return user;
  }

  /* -------------------------------- reads --------------------------------- */

  async getCanteenSummaries(): Promise<CanteenSummary[]> {
    const [{ data: canteens }, { data: items }, { data: cats }] =
      await Promise.all([
        this.db.from("canteens").select("*").order("name"),
        this.db.from("food_items").select("canteen_id, availability, updated_at"),
        this.db.from("categories").select("canteen_id, updated_at"),
      ]);

    return (canteens ?? []).map((row) => {
      const canteenItems = (items ?? []).filter(
        (i) => i.canteen_id === row.id,
      );
      const stamps = [
        row.updated_at,
        ...canteenItems.map((i) => i.updated_at),
        ...(cats ?? [])
          .filter((c) => c.canteen_id === row.id)
          .map((c) => c.updated_at),
      ].sort();
      return {
        ...toCanteen(row),
        availableCount: canteenItems.filter(
          (i) => i.availability === "available",
        ).length,
        totalCount: canteenItems.length,
        lastUpdated: stamps.at(-1) ?? row.updated_at,
      };
    });
  }

  async getCanteenBySlug(slug: string): Promise<Canteen | null> {
    const { data } = await this.db
      .from("canteens")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    return data ? toCanteen(data) : null;
  }

  async getMenu(canteenId: string): Promise<MenuData> {
    const [canteenRes, catRes, itemRes] = await Promise.all([
      this.db.from("canteens").select("*").eq("id", canteenId).single(),
      this.db
        .from("categories")
        .select("*")
        .eq("canteen_id", canteenId)
        .order("sort_order"),
      this.db
        .from("food_items")
        .select("*")
        .eq("canteen_id", canteenId)
        .order("sort_order"),
    ]);
    return {
      canteen: toCanteen(unwrap(canteenRes.data, canteenRes.error)),
      categories: (catRes.data ?? []).map(toCategory),
      items: (itemRes.data ?? []).map(toItem),
    };
  }

  /* ------------------------------ categories ------------------------------ */

  async createCategory(
    canteenId: string,
    input: CategoryInput,
  ): Promise<Category> {
    const { count } = await this.db
      .from("categories")
      .select("*", { count: "exact", head: true })
      .eq("canteen_id", canteenId);
    const res = await this.db
      .from("categories")
      .insert({
        canteen_id: canteenId,
        name: input.name.trim(),
        sort_order: input.sortOrder ?? count ?? 0,
      })
      .select()
      .single();
    const category = toCategory(unwrap(res.data, res.error));
    await this.log(canteenId, "create", "category", category.name, "New category added");
    return category;
  }

  async updateCategory(
    id: string,
    input: Partial<CategoryInput>,
  ): Promise<Category> {
    const res = await this.db
      .from("categories")
      .update({
        ...(input.name !== undefined ? { name: input.name.trim() } : {}),
        ...(input.sortOrder !== undefined ? { sort_order: input.sortOrder } : {}),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();
    const category = toCategory(unwrap(res.data, res.error));
    await this.log(category.canteenId, "update", "category", category.name, "Category updated");
    return category;
  }

  async deleteCategory(id: string): Promise<void> {
    const { data } = await this.db
      .from("categories")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    const { error } = await this.db.from("categories").delete().eq("id", id);
    if (error) throw new Error(error.message);
    if (data)
      await this.log(data.canteen_id, "delete", "category", data.name, "Category removed");
  }

  /* ------------------------------ food items ------------------------------ */

  async createItem(canteenId: string, input: FoodItemInput): Promise<FoodItem> {
    const { count } = await this.db
      .from("food_items")
      .select("*", { count: "exact", head: true })
      .eq("category_id", input.categoryId);
    const res = await this.db
      .from("food_items")
      .insert({
        canteen_id: canteenId,
        category_id: input.categoryId,
        name: input.name.trim(),
        description: input.description?.trim() || null,
        price: input.price,
        availability: input.availability,
        dietary: input.dietary,
        sort_order: input.sortOrder ?? count ?? 0,
      })
      .select()
      .single();
    const item = toItem(unwrap(res.data, res.error));
    await this.log(canteenId, "create", "food_item", item.name, "New item added");
    return item;
  }

  async updateItem(id: string, input: Partial<FoodItemInput>): Promise<FoodItem> {
    const res = await this.db
      .from("food_items")
      .update({
        ...(input.categoryId !== undefined ? { category_id: input.categoryId } : {}),
        ...(input.name !== undefined ? { name: input.name.trim() } : {}),
        ...(input.description !== undefined
          ? { description: input.description?.trim() || null }
          : {}),
        ...(input.price !== undefined ? { price: input.price } : {}),
        ...(input.availability !== undefined
          ? { availability: input.availability }
          : {}),
        ...(input.dietary !== undefined ? { dietary: input.dietary } : {}),
        ...(input.sortOrder !== undefined ? { sort_order: input.sortOrder } : {}),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();
    const item = toItem(unwrap(res.data, res.error));
    await this.log(item.canteenId, "update", "food_item", item.name, "Item updated");
    return item;
  }

  async setAvailability(
    id: string,
    availability: Availability,
  ): Promise<FoodItem> {
    const res = await this.db
      .from("food_items")
      .update({ availability, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    const item = toItem(unwrap(res.data, res.error));
    const label =
      availability === "available"
        ? "Available"
        : availability === "sold_out"
          ? "Sold Out"
          : "Coming Soon";
    await this.log(
      item.canteenId,
      "toggle_availability",
      "food_item",
      item.name,
      `Marked ${label}`,
    );
    return item;
  }

  async deleteItem(id: string): Promise<void> {
    const { data } = await this.db
      .from("food_items")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    const { error } = await this.db.from("food_items").delete().eq("id", id);
    if (error) throw new Error(error.message);
    if (data)
      await this.log(data.canteen_id, "delete", "food_item", data.name, "Item removed");
  }

  /* ------------------------------- canteen -------------------------------- */

  async setCanteenOpen(id: string, isOpen: boolean): Promise<Canteen> {
    const res = await this.db
      .from("canteens")
      .update({ is_open: isOpen, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    const canteen = toCanteen(unwrap(res.data, res.error));
    await this.log(
      id,
      "toggle_open",
      "canteen",
      canteen.name,
      isOpen ? "Marked Open" : "Marked Closed",
    );
    return canteen;
  }

  async createCanteen(input: CanteenInput): Promise<Canteen> {
    const res = await this.db
      .from("canteens")
      .insert({
        slug: slugify(input.name),
        name: input.name.trim(),
        tagline: input.tagline.trim(),
        location: input.location.trim(),
        opens_at: input.opensAt,
        closes_at: input.closesAt,
        is_open: input.isOpen ?? true,
        accent: input.accent,
      })
      .select()
      .single();
    const canteen = toCanteen(unwrap(res.data, res.error));
    await this.log(canteen.id, "create", "canteen", canteen.name, "New canteen created");
    return canteen;
  }

  async updateCanteen(
    id: string,
    input: Partial<CanteenInput>,
  ): Promise<Canteen> {
    const res = await this.db
      .from("canteens")
      .update({
        ...(input.name !== undefined ? { name: input.name.trim() } : {}),
        ...(input.tagline !== undefined ? { tagline: input.tagline.trim() } : {}),
        ...(input.location !== undefined ? { location: input.location.trim() } : {}),
        ...(input.opensAt !== undefined ? { opens_at: input.opensAt } : {}),
        ...(input.closesAt !== undefined ? { closes_at: input.closesAt } : {}),
        ...(input.accent !== undefined ? { accent: input.accent } : {}),
        ...(input.isOpen !== undefined ? { is_open: input.isOpen } : {}),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();
    const canteen = toCanteen(unwrap(res.data, res.error));
    await this.log(id, "update", "canteen", canteen.name, "Canteen updated");
    return canteen;
  }

  async deleteCanteen(id: string): Promise<void> {
    const { data } = await this.db
      .from("canteens")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    const { error } = await this.db.from("canteens").delete().eq("id", id);
    if (error) throw new Error(error.message);
    if (data) await this.log(null, "delete", "canteen", data.name, "Canteen removed");
  }

  /* -------------------------------- staff --------------------------------- */

  async getStaff(): Promise<StaffUser[]> {
    const { data, error } = await this.db
      .from("staff_users")
      .select("*")
      .order("role")
      .order("name");
    if (error) throw new Error(error.message);
    return (data ?? []).map(toStaff);
  }

  async createStaff(input: StaffInput): Promise<StaffUser> {
    void input;
    // Auth users must be provisioned through Supabase Auth (a service-role
    // operation). The staff profile row is then linked by auth user id.
    // See README §Staff provisioning for the secure server-side flow.
    return Promise.reject(
      new AuthError(
        "Creating staff accounts requires the Supabase admin flow — see README §Staff provisioning.",
      ),
    );
  }

  async updateStaff(
    id: string,
    input: Partial<StaffInput>,
  ): Promise<StaffUser> {
    const role = input.role;
    const res = await this.db
      .from("staff_users")
      .update({
        ...(input.name !== undefined ? { name: input.name.trim() } : {}),
        ...(input.email !== undefined
          ? { email: input.email.trim().toLowerCase() }
          : {}),
        ...(role !== undefined ? { role } : {}),
        ...(input.canteenId !== undefined
          ? { canteen_id: role === "admin" ? null : input.canteenId }
          : {}),
      })
      .eq("id", id)
      .select()
      .single();
    const staff = toStaff(unwrap(res.data, res.error));
    await this.log(staff.canteenId, "update", "staff", staff.name, "Staff updated");
    return staff;
  }

  async deleteStaff(id: string): Promise<void> {
    const { data } = await this.db
      .from("staff_users")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    const { error } = await this.db.from("staff_users").delete().eq("id", id);
    if (error) throw new Error(error.message);
    if (data) await this.log(data.canteen_id, "delete", "staff", data.name, "Staff removed");
  }

  /* -------------------------------- stats --------------------------------- */

  async getStats(): Promise<PlatformStats> {
    const [{ data: canteens }, { data: items }, { data: cats }, { data: staff }] =
      await Promise.all([
        this.db.from("canteens").select("*").order("name"),
        this.db.from("food_items").select("canteen_id, availability"),
        this.db.from("categories").select("canteen_id"),
        this.db.from("staff_users").select("id"),
      ]);
    const allItems = items ?? [];
    return {
      totalCanteens: (canteens ?? []).length,
      openCanteens: (canteens ?? []).filter((c) => c.is_open).length,
      totalItems: allItems.length,
      availableItems: allItems.filter((i) => i.availability === "available").length,
      soldOutItems: allItems.filter((i) => i.availability === "sold_out").length,
      comingSoonItems: allItems.filter((i) => i.availability === "coming_soon").length,
      totalCategories: (cats ?? []).length,
      totalStaff: (staff ?? []).length,
      perCanteen: (canteens ?? []).map((row) => ({
        canteen: toCanteen(row),
        availableCount: allItems.filter(
          (i) => i.canteen_id === row.id && i.availability === "available",
        ).length,
        totalCount: allItems.filter((i) => i.canteen_id === row.id).length,
        categoryCount: (cats ?? []).filter((c) => c.canteen_id === row.id).length,
      })),
    };
  }

  async getActivity(canteenId?: string | null): Promise<ActivityLog[]> {
    let query = this.db
      .from("activity_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(40);
    if (canteenId) query = query.eq("canteen_id", canteenId);
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return (data ?? []).map(toLog);
  }

  /* ------------------------------- realtime ------------------------------- */

  subscribe(listener: () => void): () => void {
    const channel = this.db
      .channel("campus-connect-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "canteens" }, listener)
      .on("postgres_changes", { event: "*", schema: "public", table: "categories" }, listener)
      .on("postgres_changes", { event: "*", schema: "public", table: "food_items" }, listener)
      .subscribe();
    return () => {
      this.db.removeChannel(channel);
    };
  }

  /* ------------------------------- logging -------------------------------- */

  private async log(
    canteenId: string | null,
    action: ActivityAction,
    entity: ActivityEntity,
    entityName: string,
    detail: string,
  ) {
    const user = this.cachedUser;
    await this.db.from("activity_logs").insert({
      actor_id: user?.id ?? null,
      actor_name: user?.name ?? "System",
      canteen_id: canteenId,
      action,
      entity,
      entity_name: entityName,
      detail,
    });
  }
}
