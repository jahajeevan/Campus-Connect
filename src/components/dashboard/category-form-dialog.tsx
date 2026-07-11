"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
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
import { useCreateCategory, useUpdateCategory } from "@/lib/hooks/mutations";
import { categorySchema, type CategoryValues } from "@/lib/schemas";
import type { Category } from "@/lib/types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  canteenId: string;
  category?: Category | null;
}

export function CategoryFormDialog({
  open,
  onOpenChange,
  canteenId,
  category,
}: Props) {
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const isEdit = Boolean(category);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: category?.name ?? "" },
  });

  useEffect(() => {
    if (open) reset({ name: category?.name ?? "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, category]);

  const onSubmit = async (values: CategoryValues) => {
    try {
      if (category) {
        await updateCategory.mutateAsync({ id: category.id, input: values });
        toast.success(`Renamed to “${values.name}”`);
      } else {
        await createCategory.mutateAsync({ canteenId, input: values });
        toast.success(`Added category “${values.name}”`);
      }
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Rename category" : "Add category"}</DialogTitle>
          <DialogDescription>
            Categories group your menu, e.g. Breakfast, Lunch, Beverages.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4" noValidate>
          <Field label="Category name" htmlFor="cat-name" error={errors.name?.message}>
            <Input
              id="cat-name"
              placeholder="e.g. Snacks"
              autoFocus
              aria-invalid={Boolean(errors.name)}
              {...register("name")}
            />
          </Field>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary" disabled={isSubmitting}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEdit ? "Save" : "Add category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
