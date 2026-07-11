import type {
  ActivityLog,
  Canteen,
  Category,
  FoodItem,
  StaffUser,
} from "@/lib/types";

/**
 * Timestamps below are anchored to SEED_ANCHOR. The demo repository shifts
 * every timestamp by (now - SEED_ANCHOR) on first load, so the menus always
 * feel freshly updated. The newest updatedAt equals the anchor.
 */
export const SEED_ANCHOR = Date.parse("2026-07-11T12:00:00.000Z");

const created = "2026-06-01T06:00:00.000Z";

/** minutes before the anchor -> ISO string */
const mAgo = (mins: number) =>
  new Date(SEED_ANCHOR - mins * 60_000).toISOString();

export const seedCanteens: Canteen[] = [
  {
    id: "c-central",
    slug: "central-canteen",
    name: "Central Canteen",
    tagline: "The heart of campus dining — full meals all day.",
    location: "Academic Block · Ground Floor",
    opensAt: "07:30",
    closesAt: "21:00",
    isOpen: true,
    accent: "maroon",
    createdAt: created,
    updatedAt: mAgo(2),
  },
  {
    id: "c-adithya",
    slug: "adithya-food-court",
    name: "Adithya Food Court",
    tagline: "Quick bites, chaats and cold brews between classes.",
    location: "Near Adithya Hostel · Food Street",
    opensAt: "08:00",
    closesAt: "22:30",
    isOpen: true,
    accent: "gold",
    createdAt: created,
    updatedAt: mAgo(11),
  },
  {
    id: "c-nila",
    slug: "nila-night-canteen",
    name: "Nila Night Canteen",
    tagline: "Late-night Maggi, chai and comfort food for hostellers.",
    location: "Nila Hostel Block · Courtyard",
    opensAt: "17:00",
    closesAt: "01:30",
    isOpen: false,
    accent: "green",
    createdAt: created,
    updatedAt: mAgo(140),
  },
];

export const seedCategories: Category[] = [
  // Central Canteen
  { id: "cat-c1", canteenId: "c-central", name: "Breakfast", sortOrder: 0, createdAt: created, updatedAt: mAgo(200) },
  { id: "cat-c2", canteenId: "c-central", name: "South Indian", sortOrder: 1, createdAt: created, updatedAt: mAgo(200) },
  { id: "cat-c3", canteenId: "c-central", name: "Lunch Meals", sortOrder: 2, createdAt: created, updatedAt: mAgo(200) },
  { id: "cat-c4", canteenId: "c-central", name: "Beverages", sortOrder: 3, createdAt: created, updatedAt: mAgo(200) },
  { id: "cat-c5", canteenId: "c-central", name: "Desserts", sortOrder: 4, createdAt: created, updatedAt: mAgo(200) },
  // Adithya Food Court
  { id: "cat-a1", canteenId: "c-adithya", name: "Snacks", sortOrder: 0, createdAt: created, updatedAt: mAgo(200) },
  { id: "cat-a2", canteenId: "c-adithya", name: "Chaat Corner", sortOrder: 1, createdAt: created, updatedAt: mAgo(200) },
  { id: "cat-a3", canteenId: "c-adithya", name: "Rolls & Wraps", sortOrder: 2, createdAt: created, updatedAt: mAgo(200) },
  { id: "cat-a4", canteenId: "c-adithya", name: "Cold Brews", sortOrder: 3, createdAt: created, updatedAt: mAgo(200) },
  // Nila Night Canteen
  { id: "cat-n1", canteenId: "c-nila", name: "Maggi & Noodles", sortOrder: 0, createdAt: created, updatedAt: mAgo(200) },
  { id: "cat-n2", canteenId: "c-nila", name: "Late-night Bites", sortOrder: 1, createdAt: created, updatedAt: mAgo(200) },
  { id: "cat-n3", canteenId: "c-nila", name: "Hot Beverages", sortOrder: 2, createdAt: created, updatedAt: mAgo(200) },
];

export const seedItems: FoodItem[] = [
  // ---- Central · Breakfast ----
  { id: "i-c-1", canteenId: "c-central", categoryId: "cat-c1", name: "Masala Dosa", description: "Crisp dosa with spiced potato masala & chutney", price: 55, availability: "available", dietary: "veg", sortOrder: 0, createdAt: created, updatedAt: mAgo(2) },
  { id: "i-c-2", canteenId: "c-central", categoryId: "cat-c1", name: "Idli Vada Combo", description: "Two idlis, one medu vada, sambar & chutney", price: 45, availability: "available", dietary: "veg", sortOrder: 1, createdAt: created, updatedAt: mAgo(12) },
  { id: "i-c-3", canteenId: "c-central", categoryId: "cat-c1", name: "Poha", description: "Flattened rice with peanuts & curry leaves", price: 35, availability: "sold_out", dietary: "veg", sortOrder: 2, createdAt: created, updatedAt: mAgo(40) },
  { id: "i-c-4", canteenId: "c-central", categoryId: "cat-c1", name: "Bread Omelette", description: "Fluffy omelette with toasted bread", price: 40, availability: "available", dietary: "egg", sortOrder: 3, createdAt: created, updatedAt: mAgo(20) },
  // ---- Central · South Indian ----
  { id: "i-c-5", canteenId: "c-central", categoryId: "cat-c2", name: "Ghee Podi Idli", description: "Idlis tossed in ghee & gunpowder", price: 50, availability: "available", dietary: "veg", sortOrder: 0, createdAt: created, updatedAt: mAgo(60) },
  { id: "i-c-6", canteenId: "c-central", categoryId: "cat-c2", name: "Onion Uttapam", description: "Thick pancake topped with onions & chillies", price: 55, availability: "available", dietary: "veg", sortOrder: 1, createdAt: created, updatedAt: mAgo(60) },
  { id: "i-c-7", canteenId: "c-central", categoryId: "cat-c2", name: "Rava Kesari", description: "Warm semolina sweet with cashews", price: 30, availability: "coming_soon", dietary: "veg", sortOrder: 2, createdAt: created, updatedAt: mAgo(60) },
  // ---- Central · Lunch Meals ----
  { id: "i-c-8", canteenId: "c-central", categoryId: "cat-c3", name: "South Indian Meals", description: "Rice, sambar, rasam, poriyal, curd & appalam", price: 90, availability: "available", dietary: "veg", sortOrder: 0, createdAt: created, updatedAt: mAgo(15) },
  { id: "i-c-9", canteenId: "c-central", categoryId: "cat-c3", name: "Curd Rice", description: "Comforting tempered curd rice", price: 45, availability: "available", dietary: "veg", sortOrder: 1, createdAt: created, updatedAt: mAgo(15) },
  { id: "i-c-10", canteenId: "c-central", categoryId: "cat-c3", name: "Chicken Biryani", description: "Fragrant seeraga samba rice with chicken", price: 130, availability: "sold_out", dietary: "non_veg", sortOrder: 2, createdAt: created, updatedAt: mAgo(5) },
  { id: "i-c-11", canteenId: "c-central", categoryId: "cat-c3", name: "Veg Fried Rice", description: "Wok-tossed rice with garden vegetables", price: 80, availability: "available", dietary: "veg", sortOrder: 3, createdAt: created, updatedAt: mAgo(15) },
  // ---- Central · Beverages ----
  { id: "i-c-12", canteenId: "c-central", categoryId: "cat-c4", name: "Filter Coffee", description: "Strong South-Indian degree coffee", price: 20, availability: "available", dietary: "veg", sortOrder: 0, createdAt: created, updatedAt: mAgo(2) },
  { id: "i-c-13", canteenId: "c-central", categoryId: "cat-c4", name: "Masala Chai", description: "Spiced milk tea", price: 15, availability: "available", dietary: "veg", sortOrder: 1, createdAt: created, updatedAt: mAgo(2) },
  { id: "i-c-14", canteenId: "c-central", categoryId: "cat-c4", name: "Fresh Lime Soda", description: "Sweet & salt, your choice", price: 30, availability: "available", dietary: "veg", sortOrder: 2, createdAt: created, updatedAt: mAgo(2) },
  // ---- Central · Desserts ----
  { id: "i-c-15", canteenId: "c-central", categoryId: "cat-c5", name: "Gulab Jamun", description: "Two warm jamuns in saffron syrup", price: 35, availability: "available", dietary: "veg", sortOrder: 0, createdAt: created, updatedAt: mAgo(90) },
  { id: "i-c-16", canteenId: "c-central", categoryId: "cat-c5", name: "Fruit Custard", description: "Chilled custard with seasonal fruit", price: 40, availability: "coming_soon", dietary: "veg", sortOrder: 1, createdAt: created, updatedAt: mAgo(90) },

  // ---- Adithya · Snacks ----
  { id: "i-a-1", canteenId: "c-adithya", categoryId: "cat-a1", name: "Masala Vada", description: "Crunchy lentil fritters", price: 25, availability: "available", dietary: "veg", sortOrder: 0, createdAt: created, updatedAt: mAgo(11) },
  { id: "i-a-2", canteenId: "c-adithya", categoryId: "cat-a1", name: "Veg Puff", description: "Flaky puff with spiced veg filling", price: 20, availability: "available", dietary: "veg", sortOrder: 1, createdAt: created, updatedAt: mAgo(11) },
  { id: "i-a-3", canteenId: "c-adithya", categoryId: "cat-a1", name: "Egg Puff", description: "Flaky puff with masala egg", price: 25, availability: "sold_out", dietary: "egg", sortOrder: 2, createdAt: created, updatedAt: mAgo(30) },
  { id: "i-a-4", canteenId: "c-adithya", categoryId: "cat-a1", name: "French Fries", description: "Salted crispy fries", price: 60, availability: "available", dietary: "veg", sortOrder: 3, createdAt: created, updatedAt: mAgo(11) },
  // ---- Adithya · Chaat Corner ----
  { id: "i-a-5", canteenId: "c-adithya", categoryId: "cat-a2", name: "Pani Puri", description: "Six puris with spiced water", price: 40, availability: "available", dietary: "veg", sortOrder: 0, createdAt: created, updatedAt: mAgo(18) },
  { id: "i-a-6", canteenId: "c-adithya", categoryId: "cat-a2", name: "Sev Puri", description: "Crisp puris, chutneys & sev", price: 45, availability: "available", dietary: "veg", sortOrder: 1, createdAt: created, updatedAt: mAgo(18) },
  { id: "i-a-7", canteenId: "c-adithya", categoryId: "cat-a2", name: "Samosa Chaat", description: "Crushed samosa with curd & chutneys", price: 55, availability: "coming_soon", dietary: "veg", sortOrder: 2, createdAt: created, updatedAt: mAgo(18) },
  // ---- Adithya · Rolls & Wraps ----
  { id: "i-a-8", canteenId: "c-adithya", categoryId: "cat-a3", name: "Paneer Kathi Roll", description: "Grilled paneer wrapped in paratha", price: 85, availability: "available", dietary: "veg", sortOrder: 0, createdAt: created, updatedAt: mAgo(22) },
  { id: "i-a-9", canteenId: "c-adithya", categoryId: "cat-a3", name: "Chicken Kathi Roll", description: "Spiced chicken wrapped in paratha", price: 95, availability: "available", dietary: "non_veg", sortOrder: 1, createdAt: created, updatedAt: mAgo(22) },
  { id: "i-a-10", canteenId: "c-adithya", categoryId: "cat-a3", name: "Veg Schezwan Wrap", description: "Spicy veg & noodles wrap", price: 75, availability: "sold_out", dietary: "veg", sortOrder: 2, createdAt: created, updatedAt: mAgo(50) },
  // ---- Adithya · Cold Brews ----
  { id: "i-a-11", canteenId: "c-adithya", categoryId: "cat-a4", name: "Cold Coffee", description: "Blended iced coffee with cream", price: 60, availability: "available", dietary: "veg", sortOrder: 0, createdAt: created, updatedAt: mAgo(11) },
  { id: "i-a-12", canteenId: "c-adithya", categoryId: "cat-a4", name: "Oreo Shake", description: "Thick shake with cookie crumble", price: 70, availability: "available", dietary: "veg", sortOrder: 1, createdAt: created, updatedAt: mAgo(11) },
  { id: "i-a-13", canteenId: "c-adithya", categoryId: "cat-a4", name: "Watermelon Cooler", description: "Fresh pressed watermelon juice", price: 45, availability: "available", dietary: "veg", sortOrder: 2, createdAt: created, updatedAt: mAgo(11) },

  // ---- Nila · Maggi & Noodles ----
  { id: "i-n-1", canteenId: "c-nila", categoryId: "cat-n1", name: "Masala Maggi", description: "Classic masala Maggi with veggies", price: 40, availability: "available", dietary: "veg", sortOrder: 0, createdAt: created, updatedAt: mAgo(140) },
  { id: "i-n-2", canteenId: "c-nila", categoryId: "cat-n1", name: "Cheese Maggi", description: "Loaded with melted cheese", price: 55, availability: "available", dietary: "veg", sortOrder: 1, createdAt: created, updatedAt: mAgo(140) },
  { id: "i-n-3", canteenId: "c-nila", categoryId: "cat-n1", name: "Veg Hakka Noodles", description: "Stir-fried noodles with veg", price: 70, availability: "available", dietary: "veg", sortOrder: 2, createdAt: created, updatedAt: mAgo(140) },
  { id: "i-n-4", canteenId: "c-nila", categoryId: "cat-n1", name: "Egg Noodles", description: "Wok noodles with scrambled egg", price: 80, availability: "coming_soon", dietary: "egg", sortOrder: 3, createdAt: created, updatedAt: mAgo(140) },
  // ---- Nila · Late-night Bites ----
  { id: "i-n-5", canteenId: "c-nila", categoryId: "cat-n2", name: "Cheese Garlic Bread", description: "Toasted bread with garlic butter & cheese", price: 65, availability: "available", dietary: "veg", sortOrder: 0, createdAt: created, updatedAt: mAgo(140) },
  { id: "i-n-6", canteenId: "c-nila", categoryId: "cat-n2", name: "Chicken Momos", description: "Steamed dumplings with spicy chutney", price: 90, availability: "available", dietary: "non_veg", sortOrder: 1, createdAt: created, updatedAt: mAgo(140) },
  { id: "i-n-7", canteenId: "c-nila", categoryId: "cat-n2", name: "Paneer Momos", description: "Steamed paneer dumplings", price: 80, availability: "sold_out", dietary: "veg", sortOrder: 2, createdAt: created, updatedAt: mAgo(140) },
  // ---- Nila · Hot Beverages ----
  { id: "i-n-8", canteenId: "c-nila", categoryId: "cat-n3", name: "Ginger Chai", description: "Strong chai with fresh ginger", price: 18, availability: "available", dietary: "veg", sortOrder: 0, createdAt: created, updatedAt: mAgo(140) },
  { id: "i-n-9", canteenId: "c-nila", categoryId: "cat-n3", name: "Hot Chocolate", description: "Rich cocoa with steamed milk", price: 50, availability: "available", dietary: "veg", sortOrder: 1, createdAt: created, updatedAt: mAgo(140) },
];

export const seedStaff: StaffUser[] = [
  {
    id: "u-admin",
    email: "admin@amrita.edu",
    name: "Campus Admin",
    role: "admin",
    canteenId: null,
    createdAt: created,
  },
  {
    id: "u-central",
    email: "central@amrita.edu",
    name: "Central Canteen Staff",
    role: "staff",
    canteenId: "c-central",
    createdAt: created,
  },
  {
    id: "u-adithya",
    email: "adithya@amrita.edu",
    name: "Adithya Food Court Staff",
    role: "staff",
    canteenId: "c-adithya",
    createdAt: created,
  },
  {
    id: "u-nila",
    email: "nila@amrita.edu",
    name: "Nila Canteen Staff",
    role: "staff",
    canteenId: "c-nila",
    createdAt: created,
  },
];

/** Demo credentials (password is the same for every seeded account). */
export const DEMO_PASSWORD = "campus123";

export const seedActivity: ActivityLog[] = [
  { id: "log-1", actorId: "u-central", actorName: "Central Canteen Staff", canteenId: "c-central", action: "toggle_availability", entity: "food_item", entityName: "Chicken Biryani", detail: "Marked Sold Out", createdAt: mAgo(5) },
  { id: "log-2", actorId: "u-central", actorName: "Central Canteen Staff", canteenId: "c-central", action: "update", entity: "food_item", entityName: "Masala Dosa", detail: "Price updated to ₹55", createdAt: mAgo(2) },
  { id: "log-3", actorId: "u-adithya", actorName: "Adithya Food Court Staff", canteenId: "c-adithya", action: "toggle_availability", entity: "food_item", entityName: "Egg Puff", detail: "Marked Sold Out", createdAt: mAgo(30) },
  { id: "log-4", actorId: "u-nila", actorName: "Nila Canteen Staff", canteenId: "c-nila", action: "toggle_open", entity: "canteen", entityName: "Nila Night Canteen", detail: "Closed for the day", createdAt: mAgo(140) },
];
