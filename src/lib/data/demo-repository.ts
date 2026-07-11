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
import {
  DEMO_PASSWORD,
  SEED_ANCHOR,
  seedActivity,
  seedCanteens,
  seedCategories,
  seedItems,
  seedStaff,
} from "@/lib/seed";
import { slugify } from "@/lib/utils";
import { AuthError, type PlatformStats, type Repository } from "./repository";

const DB_KEY = "campus-connect:db:v3";
const SESSION_KEY = "campus-connect:session:v3";
const CHANNEL = "campus-connect:changes";

interface DemoState {
  canteens: Canteen[];
  categories: Category[];
  items: FoodItem[];
  staff: StaffUser[];
  activity: ActivityLog[];
}

const nowIso = () => new Date().toISOString();

const genId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

/** Shift a seed timestamp so the dataset looks freshly updated. */
function reanchor<T extends { createdAt: string; updatedAt: string }>(
  rows: T[],
  shift: number,
): T[] {
  return rows.map((row) => ({
    ...row,
    createdAt: new Date(Date.parse(row.createdAt) + shift).toISOString(),
    updatedAt: new Date(Date.parse(row.updatedAt) + shift).toISOString(),
  }));
}

function freshSeed(): DemoState {
  const shift = Date.now() - SEED_ANCHOR;
  return {
    canteens: reanchor(seedCanteens, shift),
    categories: reanchor(seedCategories, shift),
    items: reanchor(seedItems, shift),
    staff: seedStaff.map((s) => ({ ...s })),
    activity: seedActivity.map((a) => ({
      ...a,
      createdAt: new Date(Date.parse(a.createdAt) + shift).toISOString(),
    })),
  };
}

/**
 * A fully functional in-browser backend. Persists to localStorage and
 * broadcasts changes across tabs so the public site reflects staff edits live.
 */
export class DemoRepository implements Repository {
  readonly mode = "demo" as const;

  private state: DemoState;
  private listeners = new Set<() => void>();
  private channel: BroadcastChannel | null = null;

  constructor() {
    this.state = this.load();

    if (typeof window !== "undefined") {
      if ("BroadcastChannel" in window) {
        this.channel = new BroadcastChannel(CHANNEL);
        this.channel.onmessage = () => {
          this.state = this.load();
          this.emitLocal();
        };
      }
      window.addEventListener("storage", (e) => {
        if (e.key === DB_KEY) {
          this.state = this.load();
          this.emitLocal();
        }
      });
    }
  }

  /* ------------------------------ persistence ----------------------------- */

  private load(): DemoState {
    if (typeof window === "undefined") return freshSeed();
    try {
      const raw = window.localStorage.getItem(DB_KEY);
      if (!raw) {
        const seeded = freshSeed();
        window.localStorage.setItem(DB_KEY, JSON.stringify(seeded));
        return seeded;
      }
      return JSON.parse(raw) as DemoState;
    } catch {
      return freshSeed();
    }
  }

  private persist() {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(DB_KEY, JSON.stringify(this.state));
    }
    this.emitLocal();
    this.channel?.postMessage("changed");
  }

  private emitLocal() {
    this.listeners.forEach((fn) => fn());
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /* -------------------------------- session ------------------------------- */

  private getSessionId(): string | null {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(SESSION_KEY);
  }

  private setSessionId(id: string | null) {
    if (typeof window === "undefined") return;
    if (id) window.localStorage.setItem(SESSION_KEY, id);
    else window.localStorage.removeItem(SESSION_KEY);
  }

  async getCurrentUser(): Promise<StaffUser | null> {
    const id = this.getSessionId();
    if (!id) return null;
    return this.state.staff.find((s) => s.id === id) ?? null;
  }

  private requireUser(): StaffUser {
    const id = this.getSessionId();
    const user = id ? this.state.staff.find((s) => s.id === id) : null;
    if (!user) throw new AuthError("Please sign in to continue.");
    return user;
  }

  private assertCanManage(canteenId: string) {
    const user = this.requireUser();
    if (user.role === "admin") return;
    if (user.canteenId !== canteenId) {
      throw new AuthError("You can only manage your own canteen.");
    }
  }

  private assertAdmin() {
    const user = this.requireUser();
    if (user.role !== "admin") {
      throw new AuthError("This action requires a super admin account.");
    }
  }

  async signIn(email: string, password: string): Promise<StaffUser> {
    await delay();
    const user = this.state.staff.find(
      (s) => s.email.toLowerCase() === email.trim().toLowerCase(),
    );
    if (!user || password !== DEMO_PASSWORD) {
      throw new AuthError("Invalid email or password.");
    }
    this.setSessionId(user.id);
    this.log(user, user.canteenId, "login", "session", user.name, "Signed in");
    this.persist();
    return user;
  }

  async signOut(): Promise<void> {
    this.setSessionId(null);
    this.emitLocal();
  }

  /* -------------------------------- reads --------------------------------- */

  private lastUpdatedFor(canteenId: string): string {
    const stamps = [
      this.state.canteens.find((c) => c.id === canteenId)?.updatedAt,
      ...this.state.categories
        .filter((c) => c.canteenId === canteenId)
        .map((c) => c.updatedAt),
      ...this.state.items
        .filter((i) => i.canteenId === canteenId)
        .map((i) => i.updatedAt),
    ].filter(Boolean) as string[];
    return stamps.sort().at(-1) ?? nowIso();
  }

  async getCanteenSummaries(): Promise<CanteenSummary[]> {
    return this.state.canteens
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((canteen) => {
        const items = this.state.items.filter((i) => i.canteenId === canteen.id);
        return {
          ...canteen,
          availableCount: items.filter((i) => i.availability === "available")
            .length,
          totalCount: items.length,
          lastUpdated: this.lastUpdatedFor(canteen.id),
        };
      });
  }

  async getCanteenBySlug(slug: string): Promise<Canteen | null> {
    return this.state.canteens.find((c) => c.slug === slug) ?? null;
  }

  async getMenu(canteenId: string): Promise<MenuData> {
    const canteen = this.state.canteens.find((c) => c.id === canteenId);
    if (!canteen) throw new Error("Canteen not found");
    return {
      canteen,
      categories: this.state.categories
        .filter((c) => c.canteenId === canteenId)
        .sort((a, b) => a.sortOrder - b.sortOrder),
      items: this.state.items
        .filter((i) => i.canteenId === canteenId)
        .sort((a, b) => a.sortOrder - b.sortOrder),
    };
  }

  /* ------------------------------ categories ------------------------------ */

  async createCategory(
    canteenId: string,
    input: CategoryInput,
  ): Promise<Category> {
    this.assertCanManage(canteenId);
    const siblings = this.state.categories.filter(
      (c) => c.canteenId === canteenId,
    );
    const category: Category = {
      id: genId("cat"),
      canteenId,
      name: input.name.trim(),
      sortOrder: input.sortOrder ?? siblings.length,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    this.state.categories.push(category);
    this.log(
      this.requireUser(),
      canteenId,
      "create",
      "category",
      category.name,
      "New category added",
    );
    this.persist();
    return category;
  }

  async updateCategory(
    id: string,
    input: Partial<CategoryInput>,
  ): Promise<Category> {
    const category = this.state.categories.find((c) => c.id === id);
    if (!category) throw new Error("Category not found");
    this.assertCanManage(category.canteenId);
    Object.assign(category, {
      name: input.name?.trim() ?? category.name,
      sortOrder: input.sortOrder ?? category.sortOrder,
      updatedAt: nowIso(),
    });
    this.log(
      this.requireUser(),
      category.canteenId,
      "update",
      "category",
      category.name,
      "Category renamed",
    );
    this.persist();
    return category;
  }

  async deleteCategory(id: string): Promise<void> {
    const category = this.state.categories.find((c) => c.id === id);
    if (!category) return;
    this.assertCanManage(category.canteenId);
    this.state.categories = this.state.categories.filter((c) => c.id !== id);
    this.state.items = this.state.items.filter((i) => i.categoryId !== id);
    this.log(
      this.requireUser(),
      category.canteenId,
      "delete",
      "category",
      category.name,
      "Category & its items removed",
    );
    this.persist();
  }

  /* ------------------------------ food items ------------------------------ */

  async createItem(
    canteenId: string,
    input: FoodItemInput,
  ): Promise<FoodItem> {
    this.assertCanManage(canteenId);
    const siblings = this.state.items.filter(
      (i) => i.categoryId === input.categoryId,
    );
    const item: FoodItem = {
      id: genId("item"),
      canteenId,
      categoryId: input.categoryId,
      name: input.name.trim(),
      description: input.description?.trim() || null,
      price: input.price,
      availability: input.availability,
      dietary: input.dietary,
      sortOrder: input.sortOrder ?? siblings.length,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    this.state.items.push(item);
    this.log(
      this.requireUser(),
      canteenId,
      "create",
      "food_item",
      item.name,
      "New item added",
    );
    this.persist();
    return item;
  }

  async updateItem(
    id: string,
    input: Partial<FoodItemInput>,
  ): Promise<FoodItem> {
    const item = this.state.items.find((i) => i.id === id);
    if (!item) throw new Error("Item not found");
    this.assertCanManage(item.canteenId);
    Object.assign(item, {
      categoryId: input.categoryId ?? item.categoryId,
      name: input.name?.trim() ?? item.name,
      description:
        input.description === undefined
          ? item.description
          : input.description?.trim() || null,
      price: input.price ?? item.price,
      availability: input.availability ?? item.availability,
      dietary: input.dietary ?? item.dietary,
      sortOrder: input.sortOrder ?? item.sortOrder,
      updatedAt: nowIso(),
    });
    this.log(
      this.requireUser(),
      item.canteenId,
      "update",
      "food_item",
      item.name,
      "Item details updated",
    );
    this.persist();
    return item;
  }

  async setAvailability(
    id: string,
    availability: Availability,
  ): Promise<FoodItem> {
    const item = this.state.items.find((i) => i.id === id);
    if (!item) throw new Error("Item not found");
    this.assertCanManage(item.canteenId);
    item.availability = availability;
    item.updatedAt = nowIso();
    const label =
      availability === "available"
        ? "Available"
        : availability === "sold_out"
          ? "Sold Out"
          : "Coming Soon";
    this.log(
      this.requireUser(),
      item.canteenId,
      "toggle_availability",
      "food_item",
      item.name,
      `Marked ${label}`,
    );
    this.persist();
    return item;
  }

  async deleteItem(id: string): Promise<void> {
    const item = this.state.items.find((i) => i.id === id);
    if (!item) return;
    this.assertCanManage(item.canteenId);
    this.state.items = this.state.items.filter((i) => i.id !== id);
    this.log(
      this.requireUser(),
      item.canteenId,
      "delete",
      "food_item",
      item.name,
      "Item removed",
    );
    this.persist();
  }

  /* ------------------------------- canteen -------------------------------- */

  async setCanteenOpen(id: string, isOpen: boolean): Promise<Canteen> {
    const canteen = this.state.canteens.find((c) => c.id === id);
    if (!canteen) throw new Error("Canteen not found");
    this.assertCanManage(id);
    canteen.isOpen = isOpen;
    canteen.updatedAt = nowIso();
    this.log(
      this.requireUser(),
      id,
      "toggle_open",
      "canteen",
      canteen.name,
      isOpen ? "Marked Open" : "Marked Closed",
    );
    this.persist();
    return canteen;
  }

  async createCanteen(input: CanteenInput): Promise<Canteen> {
    this.assertAdmin();
    const canteen: Canteen = {
      id: genId("c"),
      slug: this.uniqueSlug(input.name),
      name: input.name.trim(),
      tagline: input.tagline.trim(),
      location: input.location.trim(),
      opensAt: input.opensAt,
      closesAt: input.closesAt,
      isOpen: input.isOpen ?? true,
      accent: input.accent,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    this.state.canteens.push(canteen);
    this.log(
      this.requireUser(),
      canteen.id,
      "create",
      "canteen",
      canteen.name,
      "New canteen created",
    );
    this.persist();
    return canteen;
  }

  async updateCanteen(
    id: string,
    input: Partial<CanteenInput>,
  ): Promise<Canteen> {
    const canteen = this.state.canteens.find((c) => c.id === id);
    if (!canteen) throw new Error("Canteen not found");
    this.assertCanManage(id);
    Object.assign(canteen, {
      name: input.name?.trim() ?? canteen.name,
      tagline: input.tagline?.trim() ?? canteen.tagline,
      location: input.location?.trim() ?? canteen.location,
      opensAt: input.opensAt ?? canteen.opensAt,
      closesAt: input.closesAt ?? canteen.closesAt,
      accent: input.accent ?? canteen.accent,
      isOpen: input.isOpen ?? canteen.isOpen,
      updatedAt: nowIso(),
    });
    this.log(
      this.requireUser(),
      id,
      "update",
      "canteen",
      canteen.name,
      "Canteen details updated",
    );
    this.persist();
    return canteen;
  }

  async deleteCanteen(id: string): Promise<void> {
    this.assertAdmin();
    const canteen = this.state.canteens.find((c) => c.id === id);
    if (!canteen) return;
    this.state.canteens = this.state.canteens.filter((c) => c.id !== id);
    this.state.categories = this.state.categories.filter(
      (c) => c.canteenId !== id,
    );
    this.state.items = this.state.items.filter((i) => i.canteenId !== id);
    this.state.staff = this.state.staff.map((s) =>
      s.canteenId === id ? { ...s, canteenId: null } : s,
    );
    this.log(
      this.requireUser(),
      null,
      "delete",
      "canteen",
      canteen.name,
      "Canteen removed",
    );
    this.persist();
  }

  private uniqueSlug(name: string): string {
    const base = slugify(name) || "canteen";
    let slug = base;
    let n = 2;
    while (this.state.canteens.some((c) => c.slug === slug)) {
      slug = `${base}-${n++}`;
    }
    return slug;
  }

  /* -------------------------------- staff --------------------------------- */

  async getStaff(): Promise<StaffUser[]> {
    this.assertAdmin();
    return this.state.staff
      .slice()
      .sort((a, b) => a.role.localeCompare(b.role) || a.name.localeCompare(b.name));
  }

  async createStaff(input: StaffInput): Promise<StaffUser> {
    this.assertAdmin();
    if (
      this.state.staff.some(
        (s) => s.email.toLowerCase() === input.email.trim().toLowerCase(),
      )
    ) {
      throw new Error("A staff account with that email already exists.");
    }
    const staff: StaffUser = {
      id: genId("u"),
      email: input.email.trim().toLowerCase(),
      name: input.name.trim(),
      role: input.role,
      canteenId: input.role === "admin" ? null : input.canteenId,
      createdAt: nowIso(),
    };
    this.state.staff.push(staff);
    this.log(
      this.requireUser(),
      staff.canteenId,
      "create",
      "staff",
      staff.name,
      `Added ${staff.role}`,
    );
    this.persist();
    return staff;
  }

  async updateStaff(
    id: string,
    input: Partial<StaffInput>,
  ): Promise<StaffUser> {
    this.assertAdmin();
    const staff = this.state.staff.find((s) => s.id === id);
    if (!staff) throw new Error("Staff not found");
    const role = input.role ?? staff.role;
    Object.assign(staff, {
      name: input.name?.trim() ?? staff.name,
      email: input.email?.trim().toLowerCase() ?? staff.email,
      role,
      canteenId:
        role === "admin"
          ? null
          : input.canteenId !== undefined
            ? input.canteenId
            : staff.canteenId,
    });
    this.log(
      this.requireUser(),
      staff.canteenId,
      "update",
      "staff",
      staff.name,
      "Staff account updated",
    );
    this.persist();
    return staff;
  }

  async deleteStaff(id: string): Promise<void> {
    this.assertAdmin();
    const staff = this.state.staff.find((s) => s.id === id);
    if (!staff) return;
    if (staff.id === this.getSessionId()) {
      throw new Error("You cannot delete the account you are signed in with.");
    }
    this.state.staff = this.state.staff.filter((s) => s.id !== id);
    this.log(
      this.requireUser(),
      staff.canteenId,
      "delete",
      "staff",
      staff.name,
      "Staff account removed",
    );
    this.persist();
  }

  /* -------------------------------- stats --------------------------------- */

  async getStats(): Promise<PlatformStats> {
    this.assertAdmin();
    const { canteens, categories, items, staff } = this.state;
    return {
      totalCanteens: canteens.length,
      openCanteens: canteens.filter((c) => c.isOpen).length,
      totalItems: items.length,
      availableItems: items.filter((i) => i.availability === "available").length,
      soldOutItems: items.filter((i) => i.availability === "sold_out").length,
      comingSoonItems: items.filter((i) => i.availability === "coming_soon")
        .length,
      totalCategories: categories.length,
      totalStaff: staff.length,
      perCanteen: canteens
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((canteen) => {
          const cItems = items.filter((i) => i.canteenId === canteen.id);
          return {
            canteen,
            availableCount: cItems.filter((i) => i.availability === "available")
              .length,
            totalCount: cItems.length,
            categoryCount: categories.filter((c) => c.canteenId === canteen.id)
              .length,
          };
        }),
    };
  }

  async getActivity(canteenId?: string | null): Promise<ActivityLog[]> {
    this.requireUser();
    return this.state.activity
      .filter((a) => (canteenId ? a.canteenId === canteenId : true))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 40);
  }

  /* ------------------------------- logging -------------------------------- */

  private log(
    actor: StaffUser,
    canteenId: string | null,
    action: ActivityAction,
    entity: ActivityEntity,
    entityName: string,
    detail: string | null,
  ) {
    this.state.activity.unshift({
      id: genId("log"),
      actorId: actor.id,
      actorName: actor.name,
      canteenId,
      action,
      entity,
      entityName,
      detail,
      createdAt: nowIso(),
    });
    this.state.activity = this.state.activity.slice(0, 200);
  }
}

/** Small artificial latency so loading states are visible in the demo. */
function delay(ms = 260) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
