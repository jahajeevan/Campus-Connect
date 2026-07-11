"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminConsole } from "@/components/admin/admin-console";
import { useAuth } from "@/lib/auth-context";

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && user.role !== "admin") router.replace("/dashboard");
  }, [user, router]);

  if (!user || user.role !== "admin") return null;

  return <AdminConsole />;
}
