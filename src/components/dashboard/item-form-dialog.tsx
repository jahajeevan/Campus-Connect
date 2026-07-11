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
import { Input, Textarea } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AvailabilityPicker } from "@/components/dashboard/availability-picker";
import { DietaryMark } from "@/components/menu/indicators";
import { useCreateItem, useUpdateItem } from "@/lib/hooks/mutations";
import { foodItemSchema, type FoodItemValues } from "@/lib/schemas";
import { DIETARY_META, type Category, type DietaryTag, type FoodItem } from "@/lib/types";
import { cn } from "@/lib/utils";

const DIETARY_ORDER: DietaryTag[] = ["veg", "non_veg", "egg"];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  canteenId: string;
  categories: Category[];
  item?: FoodItem | null;
  defaultCategoryId?: string;
}

export function ItemFormDialog({
  open,
  onOpenChange,
  canteenId,
  categories,
  item,
  defaultCategoryId,
}: Props) {
  const createItem = useCreateItem();
  const updateItem = useUpdateItem();
  const isEdit = Boolean(item);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FoodItemValues>({
    resolver: zodResolver(foodItemSchema),
    defaultValues: buildDefaults(item, defaultCategoryId, categories),
  });

  useEffect(() => {
    if (open) reset(buildDefaults(item, defaultCategoryId, categories));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, item, defaultCategoryId]);

  const onSubmit = async (values: FoodItemValues) => {
    const payload = {
      categoryId: values.categoryId,
      name: values.name,
      description: values.description || null,
      price: values.price,
      availability: values.availability,
      dietary: values.dietary,
    };
    try {
      if (item) {
        await updateItem.mutateAsync({ id: item.id, input: payload });
        toast.success(`Updated “${values.name}”`);
      } else {
        await createItem.mutateAsync({ canteenId, input: payload });
        toast.success(`Added “${values.name}”`);
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
          <DialogTitle>{isEdit ? "Edit item" : "Add food item"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the name, price, category or availability."
              : "Add a dish to your menu. It appears on the public site instantly."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4" noValidate>
          <Field label="Food name" htmlFor="name" error={errors.name?.message}>
            <Input
              id="name"
              placeholder="e.g. Masala Dosa"
              autoFocus
              aria-invalid={Boolean(errors.name)}
              {...register("name")}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Category"
              htmlFor="category"
              error={errors.categoryId?.message}
            >
              <Controller
                control={control}
                name="categoryId"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="category" aria-invalid={Boolean(errors.categoryId)}>
                      <SelectValue placeholder="Choose category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>

            <Field label="Price (₹)" htmlFor="price" error={errors.price?.message}>
              <Input
                id="price"
                type="number"
                inputMode="decimal"
                min={0}
                step="1"
                placeholder="55"
                aria-invalid={Boolean(errors.price)}
                {...register("price", { valueAsNumber: true })}
              />
            </Field>
          </div>

          <Field
            label="Description"
            htmlFor="description"
            hint="Optional — a short line shown under the name."
            error={errors.description?.message}
          >
            <Textarea
              id="description"
              placeholder="Crisp dosa with spiced potato masala & chutney"
              {...register("description")}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Dietary" htmlFor="dietary" error={errors.dietary?.message}>
              <Controller
                control={control}
                name="dietary"
                render={({ field }) => (
                  <div className="flex flex-wrap gap-1.5">
                    {DIETARY_ORDER.map((d) => {
                      const active = field.value === d;
                      return (
                        <button
                          key={d}
                          type="button"
                          onClick={() => field.onChange(d)}
                          aria-pressed={active}
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                            active
                              ? "border-primary/40 bg-primary-soft text-ink"
                              : "border-line-strong bg-surface text-ink-muted hover:bg-cream",
                          )}
                        >
                          <DietaryMark dietary={d} />
                          {DIETARY_META[d].label}
                        </button>
                      );
                    })}
                  </div>
                )}
              />
            </Field>

            <Field
              label="Availability"
              htmlFor="availability"
              error={errors.availability?.message}
            >
              <Controller
                control={control}
                name="availability"
                render={({ field }) => (
                  <div className="flex">
                    <AvailabilityPicker
                      value={field.value}
                      onChange={field.onChange}
                      size="sm"
                    />
                  </div>
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
              {isEdit ? "Save changes" : "Add item"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function buildDefaults(
  item: FoodItem | null | undefined,
  defaultCategoryId: string | undefined,
  categories: Category[],
): FoodItemValues {
  return {
    name: item?.name ?? "",
    categoryId: item?.categoryId ?? defaultCategoryId ?? categories[0]?.id ?? "",
    description: item?.description ?? "",
    price: item?.price ?? 0,
    availability: item?.availability ?? "available",
    dietary: item?.dietary ?? "veg",
  };
}
