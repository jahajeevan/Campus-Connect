import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { StaffUser } from "@/lib/types";

/**
 * POST /api/admin/staff — provision a new staff member.
 *
 * Creating a login requires a Supabase Auth user, which is a service-role
 * operation that must not run in the browser. So the admin console posts here:
 * we verify the caller is a signed-in admin, then use the service-role key to
 * create the auth user and its `staff_users` profile row in one shot.
 */

const bodySchema = z
  .object({
    name: z.string().trim().min(2, "Name is too short").max(60),
    email: z.string().trim().min(1, "Email is required").email("Enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    role: z.enum(["staff", "admin"]),
    canteenId: z.string().nullable(),
  })
  .refine((v) => v.role === "admin" || Boolean(v.canteenId), {
    message: "Assign a canteen for staff accounts",
    path: ["canteenId"],
  });

export async function POST(request: NextRequest) {
  // 1. Authenticate the caller from their session cookie.
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  // 2. Authorise: only super admins may provision staff.
  const { data: caller } = await supabase
    .from("staff_users")
    .select("name, role")
    .eq("id", user.id)
    .maybeSingle();
  if (caller?.role !== "admin") {
    return NextResponse.json(
      { error: "Only admins can add staff accounts." },
      { status: 403 },
    );
  }

  // 3. Validate the payload.
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request." },
      { status: 400 },
    );
  }
  const { name, email, password, role } = parsed.data;
  const canteenId = role === "admin" ? null : parsed.data.canteenId;
  const normalizedEmail = email.toLowerCase();

  const admin = getSupabaseAdminClient();

  // 4. Create the Auth user (email pre-confirmed so they can sign in at once).
  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email: normalizedEmail,
    password,
    email_confirm: true,
    user_metadata: { name },
  });
  if (createErr || !created.user) {
    const message = /already been registered|already registered|exists/i.test(
      createErr?.message ?? "",
    )
      ? "A staff account with that email already exists."
      : createErr?.message ?? "Could not create the auth user.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  // 5. Insert the profile row (id mirrors the auth user id).
  const { data: row, error: insertErr } = await admin
    .from("staff_users")
    .insert({
      id: created.user.id,
      email: normalizedEmail,
      name: name.trim(),
      role,
      canteen_id: canteenId,
    })
    .select()
    .single();

  if (insertErr || !row) {
    // Roll back the orphaned auth user so a retry can succeed.
    await admin.auth.admin.deleteUser(created.user.id);
    return NextResponse.json(
      { error: insertErr?.message ?? "Could not save the staff profile." },
      { status: 400 },
    );
  }

  // 6. Best-effort activity log (never blocks the response).
  await admin
    .from("activity_logs")
    .insert({
      actor_id: user.id,
      actor_name: caller.name,
      canteen_id: canteenId,
      action: "create",
      entity: "staff",
      entity_name: row.name,
      detail: `Added ${role}`,
    })
    .then(undefined, () => {});

  const staff: StaffUser = {
    id: row.id,
    email: row.email,
    name: row.name,
    role: row.role,
    canteenId: row.canteen_id,
    createdAt: row.created_at,
  };
  return NextResponse.json(staff, { status: 201 });
}
