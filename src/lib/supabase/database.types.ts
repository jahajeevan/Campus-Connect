/**
 * Hand-authored to match supabase/migrations. Regenerate with:
 *   supabase gen types typescript --project-id <id> > src/lib/supabase/database.types.ts
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      canteens: {
        Row: {
          id: string;
          slug: string;
          name: string;
          tagline: string;
          location: string;
          opens_at: string;
          closes_at: string;
          is_open: boolean;
          accent: "maroon" | "gold" | "green";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          tagline?: string;
          location?: string;
          opens_at?: string;
          closes_at?: string;
          is_open?: boolean;
          accent?: "maroon" | "gold" | "green";
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["canteens"]["Insert"]>;
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          canteen_id: string;
          name: string;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          canteen_id: string;
          name: string;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["categories"]["Insert"]>;
        Relationships: [];
      };
      food_items: {
        Row: {
          id: string;
          canteen_id: string;
          category_id: string;
          name: string;
          description: string | null;
          price: number;
          availability: "available" | "sold_out" | "coming_soon";
          dietary: "veg" | "non_veg" | "egg";
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          canteen_id: string;
          category_id: string;
          name: string;
          description?: string | null;
          price: number;
          availability?: "available" | "sold_out" | "coming_soon";
          dietary?: "veg" | "non_veg" | "egg";
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["food_items"]["Insert"]>;
        Relationships: [];
      };
      staff_users: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: "staff" | "admin";
          canteen_id: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          role?: "staff" | "admin";
          canteen_id?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["staff_users"]["Insert"]>;
        Relationships: [];
      };
      activity_logs: {
        Row: {
          id: string;
          actor_id: string | null;
          actor_name: string;
          canteen_id: string | null;
          action: string;
          entity: string;
          entity_name: string;
          detail: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          actor_id?: string | null;
          actor_name: string;
          canteen_id?: string | null;
          action: string;
          entity: string;
          entity_name: string;
          detail?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["activity_logs"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      availability: "available" | "sold_out" | "coming_soon";
      dietary_tag: "veg" | "non_veg" | "egg";
      staff_role: "staff" | "admin";
      canteen_accent: "maroon" | "gold" | "green";
    };
    CompositeTypes: Record<string, never>;
  };
}
