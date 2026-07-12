"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowLeft, Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { useAuth } from "@/lib/auth-context";
import { dataMode } from "@/lib/data";
import { loginSchema, type LoginValues } from "@/lib/schemas";
import { DEMO_PASSWORD } from "@/lib/seed";

const DEMO_ACCOUNTS = [
  { label: "Super Admin", email: "admin@amrita.edu" },
  { label: "Central Canteen", email: "central@amrita.edu" },
  { label: "Adithya Food Court", email: "adithya@amrita.edu" },
  { label: "Nila Night Canteen", email: "nila@amrita.edu" },
];

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginValues) => {
    try {
      const user = await signIn(values.email, values.password);
      toast.success(`Welcome back, ${user.name.split(" ")[0]}`);
      router.push(user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not sign you in.",
      );
    }
  };

  const fillDemo = (email: string) => {
    setValue("email", email);
    setValue("password", DEMO_PASSWORD);
  };

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-aurora" />
      <div className="pointer-events-none absolute inset-0 bg-grid" />

      <Link
        href="/"
        className="absolute left-5 top-5 inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to site
      </Link>

      <div className="relative w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo subtitle priority />
          <h1 className="mt-6 text-2xl font-semibold tracking-tight text-ink">
            Staff sign in
          </h1>
          <p className="mt-1.5 text-sm text-ink-muted">
            Manage your canteen&rsquo;s live menu.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-4 rounded-2xl border border-line bg-surface p-6 shadow-card sm:p-7"
          noValidate
        >
          <Field label="Email" htmlFor="email" error={errors.email?.message}>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@amrita.edu"
              aria-invalid={Boolean(errors.email)}
              {...register("email")}
            />
          </Field>

          <Field
            label="Password"
            htmlFor="password"
            error={errors.password?.message}
          >
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                aria-invalid={Boolean(errors.password)}
                className="pr-11"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-subtle transition-colors hover:text-ink"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </Field>

          <Button type="submit" size="lg" disabled={isSubmitting} className="mt-1">
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogIn className="h-4 w-4" />
            )}
            {isSubmitting ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        {dataMode === "demo" && (
          <div className="mt-5 rounded-2xl border border-dashed border-line-strong bg-ivory p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-ink-subtle">
              Demo accounts · password{" "}
              <code className="rounded bg-cream px-1.5 py-0.5 font-mono text-[0.7rem] text-primary">
                {DEMO_PASSWORD}
              </code>
            </p>
            <div className="mt-3 grid gap-1.5 sm:grid-cols-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  onClick={() => fillDemo(acc.email)}
                  className="flex flex-col items-start rounded-lg border border-line bg-surface px-3 py-2 text-left transition-colors hover:border-primary/40 hover:bg-cream"
                >
                  <span className="text-xs font-medium text-ink">
                    {acc.label}
                  </span>
                  <span className="text-[0.7rem] text-ink-subtle">
                    {acc.email}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
