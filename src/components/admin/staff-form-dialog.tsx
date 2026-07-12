"use client";

import { useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateStaff, useUpdateStaff } from "@/lib/hooks/mutations";
import { staffSchema, type StaffValues } from "@/lib/schemas";
import type { Canteen, StaffUser } from "@/lib/types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  canteens: Canteen[];
  staff?: StaffUser | null;
}

export function StaffFormDialog({ open, onOpenChange, canteens, staff }: Props) {
  const createStaff = useCreateStaff();
  const updateStaff = useUpdateStaff();
  const isEdit = Boolean(staff);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<StaffValues>({
    resolver: zodResolver(staffSchema),
    defaultValues: buildDefaults(staff),
  });

  const role = useWatch({ control, name: "role" });

  useEffect(() => {
    if (open) reset(buildDefaults(staff));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, staff]);

  const onSubmit = async (values: StaffValues) => {
    // Password is required to create a login, but not to edit an existing one.
    if (!staff && !values.password) {
      setError("password", { message: "Set a temporary password" });
      return;
    }
    const canteenId = values.role === "admin" ? null : values.canteenId;
    try {
      if (staff) {
        await updateStaff.mutateAsync({
          id: staff.id,
          input: { name: values.name, email: values.email, role: values.role, canteenId },
        });
        toast.success(`Updated ${values.name}`);
      } else {
        await createStaff.mutateAsync({
          name: values.name,
          email: values.email,
          role: values.role,
          canteenId,
          password: values.password,
        });
        toast.success(`Added ${values.name}`);
      }
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit staff account" : "Add staff account"}</DialogTitle>
          <DialogDescription>
            Staff manage one canteen; super admins oversee everything.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4" noValidate>
          <Field label="Full name" htmlFor="s-name" error={errors.name?.message}>
            <Input
              id="s-name"
              placeholder="e.g. Anita Rao"
              autoFocus
              aria-invalid={Boolean(errors.name)}
              {...register("name")}
            />
          </Field>

          <Field label="Email" htmlFor="s-email" error={errors.email?.message}>
            <Input
              id="s-email"
              type="email"
              placeholder="name@amrita.edu"
              aria-invalid={Boolean(errors.email)}
              {...register("email")}
            />
          </Field>

          {!isEdit && (
            <Field
              label="Temporary password"
              htmlFor="s-password"
              error={errors.password?.message}
              hint="Share this with the staff member; they can change it after signing in."
            >
              <Input
                id="s-password"
                type="password"
                placeholder="At least 8 characters"
                autoComplete="new-password"
                aria-invalid={Boolean(errors.password)}
                {...register("password")}
              />
            </Field>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Role" htmlFor="s-role" error={errors.role?.message}>
              <Controller
                control={control}
                name="role"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="s-role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="staff">Canteen staff</SelectItem>
                      <SelectItem value="admin">Super admin</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>

            <Field
              label="Canteen"
              htmlFor="s-canteen"
              error={errors.canteenId?.message}
            >
              <Controller
                control={control}
                name="canteenId"
                render={({ field }) => (
                  <Select
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                    disabled={role === "admin"}
                  >
                    <SelectTrigger id="s-canteen" aria-invalid={Boolean(errors.canteenId)}>
                      <SelectValue
                        placeholder={role === "admin" ? "All canteens" : "Assign canteen"}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {canteens.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
          </div>

          <DialogFooter className="mt-1">
            <DialogClose asChild>
              <Button type="button" variant="secondary" disabled={isSubmitting}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEdit ? "Save changes" : "Add staff"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function buildDefaults(staff: StaffUser | null | undefined): StaffValues {
  return {
    name: staff?.name ?? "",
    email: staff?.email ?? "",
    role: staff?.role ?? "staff",
    canteenId: staff?.canteenId ?? null,
    password: "",
  };
}
