"use client";

import { useQuery } from "@tanstack/react-query";
import { getRepository } from "@/lib/data";

const repo = () => getRepository();

export const queryKeys = {
  canteens: ["canteens"] as const,
  canteen: (slug: string) => ["canteen", slug] as const,
  menu: (canteenId: string) => ["menu", canteenId] as const,
  staff: ["staff"] as const,
  stats: ["stats"] as const,
  activity: (canteenId?: string | null) => ["activity", canteenId ?? "all"] as const,
};

export function useCanteenSummaries() {
  return useQuery({
    queryKey: queryKeys.canteens,
    queryFn: () => repo().getCanteenSummaries(),
  });
}

export function useCanteenBySlug(slug: string) {
  return useQuery({
    queryKey: queryKeys.canteen(slug),
    queryFn: () => repo().getCanteenBySlug(slug),
    enabled: Boolean(slug),
  });
}

export function useMenu(canteenId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.menu(canteenId ?? ""),
    queryFn: () => repo().getMenu(canteenId as string),
    enabled: Boolean(canteenId),
  });
}

export function useStaff(enabled = true) {
  return useQuery({
    queryKey: queryKeys.staff,
    queryFn: () => repo().getStaff(),
    enabled,
  });
}

export function useStats(enabled = true) {
  return useQuery({
    queryKey: queryKeys.stats,
    queryFn: () => repo().getStats(),
    enabled,
  });
}

export function useActivity(canteenId?: string | null, enabled = true) {
  return useQuery({
    queryKey: queryKeys.activity(canteenId),
    queryFn: () => repo().getActivity(canteenId),
    enabled,
  });
}
