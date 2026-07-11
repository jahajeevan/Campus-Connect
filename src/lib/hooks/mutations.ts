"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getRepository } from "@/lib/data";
import type {
  Availability,
  CanteenInput,
  CategoryInput,
  FoodItemInput,
  StaffInput,
} from "@/lib/types";

const repo = () => getRepository();

/** Invalidate everything the mutation could have touched. */
function useInvalidateAll() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries();
}

/* ------------------------------- categories ------------------------------ */

export function useCreateCategory() {
  const invalidate = useInvalidateAll();
  return useMutation({
    mutationFn: ({ canteenId, input }: { canteenId: string; input: CategoryInput }) =>
      repo().createCategory(canteenId, input),
    onSuccess: invalidate,
  });
}

export function useUpdateCategory() {
  const invalidate = useInvalidateAll();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<CategoryInput> }) =>
      repo().updateCategory(id, input),
    onSuccess: invalidate,
  });
}

export function useDeleteCategory() {
  const invalidate = useInvalidateAll();
  return useMutation({
    mutationFn: (id: string) => repo().deleteCategory(id),
    onSuccess: invalidate,
  });
}

/* ------------------------------- food items ------------------------------ */

export function useCreateItem() {
  const invalidate = useInvalidateAll();
  return useMutation({
    mutationFn: ({ canteenId, input }: { canteenId: string; input: FoodItemInput }) =>
      repo().createItem(canteenId, input),
    onSuccess: invalidate,
  });
}

export function useUpdateItem() {
  const invalidate = useInvalidateAll();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<FoodItemInput> }) =>
      repo().updateItem(id, input),
    onSuccess: invalidate,
  });
}

export function useSetAvailability() {
  const invalidate = useInvalidateAll();
  return useMutation({
    mutationFn: ({ id, availability }: { id: string; availability: Availability }) =>
      repo().setAvailability(id, availability),
    onSuccess: invalidate,
  });
}

export function useDeleteItem() {
  const invalidate = useInvalidateAll();
  return useMutation({
    mutationFn: (id: string) => repo().deleteItem(id),
    onSuccess: invalidate,
  });
}

/* --------------------------------- canteen ------------------------------- */

export function useSetCanteenOpen() {
  const invalidate = useInvalidateAll();
  return useMutation({
    mutationFn: ({ id, isOpen }: { id: string; isOpen: boolean }) =>
      repo().setCanteenOpen(id, isOpen),
    onSuccess: invalidate,
  });
}

export function useCreateCanteen() {
  const invalidate = useInvalidateAll();
  return useMutation({
    mutationFn: (input: CanteenInput) => repo().createCanteen(input),
    onSuccess: invalidate,
  });
}

export function useUpdateCanteen() {
  const invalidate = useInvalidateAll();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<CanteenInput> }) =>
      repo().updateCanteen(id, input),
    onSuccess: invalidate,
  });
}

export function useDeleteCanteen() {
  const invalidate = useInvalidateAll();
  return useMutation({
    mutationFn: (id: string) => repo().deleteCanteen(id),
    onSuccess: invalidate,
  });
}

/* ---------------------------------- staff -------------------------------- */

export function useCreateStaff() {
  const invalidate = useInvalidateAll();
  return useMutation({
    mutationFn: (input: StaffInput) => repo().createStaff(input),
    onSuccess: invalidate,
  });
}

export function useUpdateStaff() {
  const invalidate = useInvalidateAll();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<StaffInput> }) =>
      repo().updateStaff(id, input),
    onSuccess: invalidate,
  });
}

export function useDeleteStaff() {
  const invalidate = useInvalidateAll();
  return useMutation({
    mutationFn: (id: string) => repo().deleteStaff(id),
    onSuccess: invalidate,
  });
}
