"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
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
import { useCreateCanteen, useUpdateCanteen } from "@/lib/hooks/mutations";
import { canteenSchema, type CanteenValues } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import type { Canteen, CanteenAccent } from "@/lib/types";

const ACCENTS: { value: CanteenAccent; label: string; dot: string }[] = [
  { value: "maroon", label: "Maroon", dot: "bg-primary" },
  { value: "gold", label: "Gold", dot: "bg-gold" },
  { value: "green", label: "Green", dot: "bg-available" },
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  canteen?: Canteen | null;
}

export function CanteenFormDialog({ open, onOpenChange, canteen }: Props) {
  const createCanteen = useCreateCanteen();
  const updateCanteen = useUpdateCanteen();
  const isEdit = Boolean(canteen);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CanteenValues>({
    resolver: zodResolver(canteenSchema),
    defaultValues: buildDefaults(canteen),
  });

  useEffect(() => {
    if (open) reset(buildDefaults(canteen));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, canteen]);

  const onSubmit = async (values: CanteenValues) => {
    try {
      if (canteen) {
        await updateCanteen.mutateAsync({ id: canteen.id, input: values });
        toast.success(`Updated ${values.name}`);
      } else {
        await createCanteen.mutateAsync(values);
        toast.success(`Created ${values.name}`);
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
          <DialogTitle>{isEdit ? "Edit canteen" : "Create canteen"}</DialogTitle>
          <DialogDescription>
            Basic details students see on the landing page.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4" noValidate>
          <Field label="Name" htmlFor="c-name" error={errors.name?.message}>
            <Input
              id="c-name"
              placeholder="e.g. Central Canteen"
              autoFocus
              aria-invalid={Boolean(errors.name)}
              {...register("name")}
            />
          </Field>

          <Field label="Tagline" htmlFor="c-tagline" error={errors.tagline?.message}>
            <Input
              id="c-tagline"
              placeholder="Short line describing the canteen"
              aria-invalid={Boolean(errors.tagline)}
              {...register("tagline")}
            />
          </Field>

          <Field label="Location" htmlFor="c-location" error={errors.location?.message}>
            <Input
              id="c-location"
              placeholder="e.g. Academic Block · Ground Floor"
              aria-invalid={Boolean(errors.location)}
              {...register("location")}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Opens at" htmlFor="c-opens" error={errors.opensAt?.message}>
              <Input id="c-opens" type="time" {...register("opensAt")} />
            </Field>
            <Field label="Closes at" htmlFor="c-closes" error={errors.closesAt?.message}>
              <Input id="c-closes" type="time" {...register("closesAt")} />
            </Field>
          </div>

          <Field label="Accent colour" htmlFor="c-accent" error={errors.accent?.message}>
            <Controller
              control={control}
              name="accent"
              render={({ field }) => (
                <div className="flex flex-wrap gap-2">
                  {ACCENTS.map((a) => {
                    const active = field.value === a.value;
                    return (
                      <button
                        key={a.value}
                        type="button"
                        onClick={() => field.onChange(a.value)}
                        aria-pressed={active}
                        className={cn(
                          "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                          active
                            ? "border-primary/40 bg-primary-soft text-ink"
                            : "border-line-strong bg-surface text-ink-muted hover:bg-cream",
                        )}
                      >
                        <span className={cn("h-3.5 w-3.5 rounded-full", a.dot)} />
                        {a.label}
                      </button>
                    );
                  })}
                </div>
              )}
            />
          </Field>

          <DialogFooter className="mt-1">
            <DialogClose asChild>
              <Button type="button" variant="secondary" disabled={isSubmitting}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEdit ? "Save changes" : "Create canteen"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function buildDefaults(canteen: Canteen | null | undefined): CanteenValues {
  return {
    name: canteen?.name ?? "",
    tagline: canteen?.tagline ?? "",
    location: canteen?.location ?? "",
    opensAt: canteen?.opensAt ?? "08:00",
    closesAt: canteen?.closesAt ?? "21:00",
    accent: canteen?.accent ?? "maroon",
    isOpen: canteen?.isOpen ?? true,
  };
}
