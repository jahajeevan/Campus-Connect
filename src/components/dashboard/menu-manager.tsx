"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CircleCheck,
  CircleSlash,
  Clock,
  FolderPlus,
  Layers,
  Pencil,
  Plus,
  Store,
  Trash2,
  UtensilsCrossed,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Reveal } from "@/components/ui/reveal";
import { StatTile } from "@/components/dashboard/stat-tile";
import { AvailabilityPicker } from "@/components/dashboard/availability-picker";
import { ItemFormDialog } from "@/components/dashboard/item-form-dialog";
import { CategoryFormDialog } from "@/components/dashboard/category-form-dialog";
import { DietaryMark } from "@/components/menu/indicators";
import { useMenu } from "@/lib/hooks/queries";
import {
  useDeleteCategory,
  useDeleteItem,
  useSetAvailability,
  useSetCanteenOpen,
} from "@/lib/hooks/mutations";
import { toast } from "sonner";
import { cn, formatHours, formatPrice } from "@/lib/utils";
import type { Availability, Category, FoodItem } from "@/lib/types";

export function MenuManager({ canteenId }: { canteenId: string }) {
  const { data: menu, isLoading } = useMenu(canteenId);

  const setOpen = useSetCanteenOpen();
  const setAvailability = useSetAvailability();
  const deleteItem = useDeleteItem();
  const deleteCategory = useDeleteCategory();

  const [itemDialog, setItemDialog] = useState<{
    open: boolean;
    item: FoodItem | null;
    categoryId?: string;
  }>({ open: false, item: null });
  const [categoryDialog, setCategoryDialog] = useState<{
    open: boolean;
    category: Category | null;
  }>({ open: false, category: null });
  const [confirmItem, setConfirmItem] = useState<FoodItem | null>(null);
  const [confirmCategory, setConfirmCategory] = useState<Category | null>(null);

  if (isLoading || !menu) return <ManagerSkeleton />;

  const { canteen, categories, items } = menu;
  const available = items.filter((i) => i.availability === "available").length;
  const soldOut = items.filter((i) => i.availability === "sold_out").length;
  const soon = items.filter((i) => i.availability === "coming_soon").length;

  const handleToggleOpen = async (next: boolean) => {
    try {
      await setOpen.mutateAsync({ id: canteenId, isOpen: next });
      toast.success(next ? "Canteen marked Open" : "Canteen marked Closed");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update.");
    }
  };

  const handleAvailability = async (item: FoodItem, next: Availability) => {
    if (item.availability === next) return;
    try {
      await setAvailability.mutateAsync({ id: item.id, availability: next });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update.");
    }
  };

  const handleDeleteItem = async () => {
    if (!confirmItem) return;
    try {
      await deleteItem.mutateAsync(confirmItem.id);
      toast.success(`Deleted “${confirmItem.name}”`);
      setConfirmItem(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete.");
    }
  };

  const handleDeleteCategory = async () => {
    if (!confirmCategory) return;
    try {
      await deleteCategory.mutateAsync(confirmCategory.id);
      toast.success(`Deleted “${confirmCategory.name}”`);
      setConfirmCategory(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete.");
    }
  };

  return (
    <div className="space-y-6">
      {/* ---------------------------- Canteen header --------------------------- */}
      <div className="rounded-2xl border border-line bg-surface p-6 shadow-card">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft text-primary">
              <Store className="h-6 w-6" />
            </span>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-ink">
                {canteen.name}
              </h1>
              <p className="text-sm text-ink-muted">
                {formatHours(canteen.opensAt, canteen.closesAt)} · {canteen.location}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-line bg-canvas px-4 py-3">
            <div className="text-right">
              <p className="text-sm font-medium text-ink">
                {canteen.isOpen ? "Open now" : "Closed"}
              </p>
              <p className="text-xs text-ink-subtle">Serving status</p>
            </div>
            <Switch
              checked={canteen.isOpen}
              onCheckedChange={handleToggleOpen}
              aria-label="Toggle open status"
            />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatTile
            tone="available"
            icon={<CircleCheck className="h-5 w-5" />}
            label="Available"
            value={available}
          />
          <StatTile
            tone="sold"
            icon={<CircleSlash className="h-5 w-5" />}
            label="Sold out"
            value={soldOut}
          />
          <StatTile
            tone="soon"
            icon={<Clock className="h-5 w-5" />}
            label="Coming soon"
            value={soon}
          />
          <StatTile
            tone="primary"
            icon={<Layers className="h-5 w-5" />}
            label="Categories"
            value={categories.length}
          />
        </div>
      </div>

      {/* ------------------------------- Toolbar ------------------------------- */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-medium text-ink">Menu</h2>
          <p className="text-sm text-ink-muted">
            Changes go live on the public site instantly.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => setCategoryDialog({ open: true, category: null })}
          >
            <FolderPlus className="h-4 w-4" />
            Add category
          </Button>
          <Button
            onClick={() => setItemDialog({ open: true, item: null })}
            disabled={categories.length === 0}
          >
            <Plus className="h-4 w-4" />
            Add item
          </Button>
        </div>
      </div>

      {/* ------------------------------- Body ------------------------------- */}
      {categories.length === 0 ? (
        <EmptyState onAdd={() => setCategoryDialog({ open: true, category: null })} />
      ) : (
        <div className="space-y-5">
          {categories.map((category, ci) => {
            const catItems = items.filter((i) => i.categoryId === category.id);
            return (
              <Reveal key={category.id} delay={Math.min(ci, 5) * 55}>
              <section
                className="overflow-hidden rounded-2xl border border-line bg-surface shadow-soft"
              >
                <header className="flex items-center justify-between gap-3 border-b border-line bg-ivory px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-medium text-ink">{category.name}</h3>
                    <Badge tone="neutral" size="sm">
                      {catItems.length}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setItemDialog({
                          open: true,
                          item: null,
                          categoryId: category.id,
                        })
                      }
                    >
                      <Plus className="h-4 w-4" />
                      Item
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Rename ${category.name}`}
                      onClick={() =>
                        setCategoryDialog({ open: true, category })
                      }
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Delete ${category.name}`}
                      className="text-ink-subtle hover:text-sold"
                      onClick={() => setConfirmCategory(category)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </header>

                {catItems.length === 0 ? (
                  <p className="px-5 py-6 text-sm text-ink-subtle">
                    No items yet. Use “Item” to add the first dish.
                  </p>
                ) : (
                  <ul className="divide-y divide-line">
                    <AnimatePresence initial={false}>
                      {catItems.map((item) => (
                        <ManageRow
                          key={item.id}
                          item={item}
                          onAvailability={(next) => handleAvailability(item, next)}
                          onEdit={() => setItemDialog({ open: true, item })}
                          onDelete={() => setConfirmItem(item)}
                          busy={
                            setAvailability.isPending &&
                            setAvailability.variables?.id === item.id
                          }
                        />
                      ))}
                    </AnimatePresence>
                  </ul>
                )}
              </section>
              </Reveal>
            );
          })}
        </div>
      )}

      {/* ------------------------------ Dialogs ------------------------------ */}
      <ItemFormDialog
        open={itemDialog.open}
        onOpenChange={(open) => setItemDialog((s) => ({ ...s, open }))}
        canteenId={canteenId}
        categories={categories}
        item={itemDialog.item}
        defaultCategoryId={itemDialog.categoryId}
      />
      <CategoryFormDialog
        open={categoryDialog.open}
        onOpenChange={(open) => setCategoryDialog((s) => ({ ...s, open }))}
        canteenId={canteenId}
        category={categoryDialog.category}
      />
      <ConfirmDialog
        open={Boolean(confirmItem)}
        onOpenChange={(open) => !open && setConfirmItem(null)}
        title={`Delete “${confirmItem?.name}”?`}
        description="This removes the item from your menu and the public site. This cannot be undone."
        onConfirm={handleDeleteItem}
        loading={deleteItem.isPending}
      />
      <ConfirmDialog
        open={Boolean(confirmCategory)}
        onOpenChange={(open) => !open && setConfirmCategory(null)}
        title={`Delete “${confirmCategory?.name}”?`}
        description="Deleting a category also removes every item inside it. This cannot be undone."
        confirmLabel="Delete category"
        onConfirm={handleDeleteCategory}
        loading={deleteCategory.isPending}
      />
    </div>
  );
}

function ManageRow({
  item,
  onAvailability,
  onEdit,
  onDelete,
  busy,
}: {
  item: FoodItem;
  onAvailability: (next: Availability) => void;
  onEdit: () => void;
  onDelete: () => void;
  busy: boolean;
}) {
  return (
    <motion.li
      layout
      initial={false}
      exit={{ opacity: 0, height: 0 }}
      className="flex flex-col gap-3 px-5 py-4 lg:flex-row lg:items-center lg:justify-between"
    >
      <div className="flex min-w-0 items-start gap-2.5">
        <DietaryMark dietary={item.dietary} className="mt-0.5" />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate font-medium text-ink">{item.name}</p>
            <span className="shrink-0 text-sm font-semibold tabular-nums text-ink-muted">
              {formatPrice(item.price)}
            </span>
          </div>
          {item.description && (
            <p className="mt-0.5 line-clamp-1 text-sm text-ink-subtle">
              {item.description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 lg:shrink-0">
        <div className={cn("overflow-x-auto no-scrollbar", busy && "opacity-60")}>
          <AvailabilityPicker
            value={item.availability}
            onChange={onAvailability}
            size="sm"
            disabled={busy}
          />
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Edit ${item.name}`}
          onClick={onEdit}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Delete ${item.name}`}
          className="text-ink-subtle hover:text-sold"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </motion.li>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-line-strong bg-ivory px-6 py-16 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-cream text-ink-subtle">
        <UtensilsCrossed className="h-7 w-7" />
      </span>
      <h3 className="mt-5 text-lg font-medium text-ink">
        Let&rsquo;s build your menu
      </h3>
      <p className="mt-1.5 max-w-sm text-sm text-ink-muted">
        Start by adding a category like Breakfast or Beverages, then add items
        under it.
      </p>
      <Button className="mt-5" onClick={onAdd}>
        <FolderPlus className="h-4 w-4" />
        Add your first category
      </Button>
    </div>
  );
}

function ManagerSkeleton() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-line bg-surface p-6">
        <Skeleton className="h-8 w-56" />
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      </div>
      {Array.from({ length: 2 }).map((_, i) => (
        <Skeleton key={i} className="h-48 rounded-2xl" />
      ))}
    </div>
  );
}
