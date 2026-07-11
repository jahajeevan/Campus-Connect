"use client";

import Link from "next/link";
import {
  ArrowRight,
  BellRing,
  MapPinned,
  RefreshCw,
  Salad,
  Store,
  UtensilsCrossed,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CanteenCard,
  CanteenCardSkeleton,
} from "@/components/canteen-card";
import { useCanteenSummaries } from "@/lib/hooks/queries";
import { site } from "@/lib/site";

export default function LandingPage() {
  const { data: canteens, isLoading } = useCanteenSummaries();

  const totalAvailable =
    canteens?.reduce((sum, c) => sum + c.availableCount, 0) ?? 0;
  const openCount = canteens?.filter((c) => c.isOpen).length ?? 0;

  return (
    <div className="flex flex-col">
      {/* ------------------------------- Hero ------------------------------ */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-aurora" />
        <div className="pointer-events-none absolute inset-0 bg-grid" />

        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-20 sm:px-6 sm:pt-28">
          <div className="mx-auto max-w-3xl text-center animate-rise">
            <div className="flex justify-center">
              <Badge
                tone="primary"
                className="gap-1.5 px-3 py-1.5 text-[0.8125rem]"
              >
                <MapPinned className="h-3.5 w-3.5" />
                {site.university} · {site.campus}
              </Badge>
            </div>

            <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl">
              Know what&rsquo;s cooking
              <br className="hidden sm:block" />{" "}
              <span className="bg-gradient-to-r from-primary to-gold bg-clip-text text-transparent">
                before you leave the hostel.
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-ink-muted sm:text-lg">
              Campus Connect shows the live menu of every canteen on campus —
              what&rsquo;s available and what it costs, updated in real time by
              canteen staff. No more walking over to a sold-out counter.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="#canteens">
                  Browse canteens
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/login">Staff login</Link>
              </Button>
            </div>

            <dl className="mx-auto mt-12 grid max-w-lg grid-cols-3 gap-4">
              <Stat
                icon={<Store className="h-4 w-4" />}
                value={canteens ? String(canteens.length) : "—"}
                label="Canteens"
              />
              <Stat
                icon={<UtensilsCrossed className="h-4 w-4" />}
                value={canteens ? String(totalAvailable) : "—"}
                label="Items available"
              />
              <Stat
                icon={<BellRing className="h-4 w-4" />}
                value={canteens ? `${openCount} open` : "—"}
                label="Right now"
              />
            </dl>
          </div>
        </div>
      </section>

      {/* ----------------------------- Canteens ---------------------------- */}
      <section
        id="canteens"
        className="mx-auto w-full max-w-6xl scroll-mt-24 px-4 py-12 sm:px-6"
      >
        <div className="mb-8 flex flex-col gap-2">
          <h2 className="text-2xl font-medium tracking-tight text-ink sm:text-3xl">
            The three campus canteens
          </h2>
          <p className="max-w-2xl text-pretty text-ink-muted">
            Tap any canteen to see its full live menu, categorised and searchable.
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <CanteenCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {canteens?.map((canteen) => (
              <CanteenCard key={canteen.id} canteen={canteen} />
            ))}
          </div>
        )}
      </section>

      {/* ---------------------------- How it works ------------------------- */}
      <section
        id="how"
        className="mx-auto w-full max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6"
      >
        <div className="rounded-3xl border border-line bg-ivory p-8 sm:p-12">
          <div className="mb-10 max-w-2xl">
            <Badge tone="gold">How it works</Badge>
            <h2 className="mt-4 text-2xl font-medium tracking-tight text-ink sm:text-3xl">
              Live menus, kept honest by the people serving the food.
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <Step
              index="01"
              icon={<Salad className="h-5 w-5" />}
              title="Students check the menu"
              body="Open Campus Connect from anywhere and see exactly what each canteen is serving and at what price — before making the walk."
            />
            <Step
              index="02"
              icon={<RefreshCw className="h-5 w-5" />}
              title="Staff update in real time"
              body="Canteen staff mark items sold out, change prices or add dishes in a couple of taps. No technical skills required."
            />
            <Step
              index="03"
              icon={<BellRing className="h-5 w-5" />}
              title="Everyone stays in sync"
              body="Every change appears on the public site instantly, so the menu you see is the menu on the counter."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-surface/70 px-3 py-4 text-center shadow-soft backdrop-blur-sm">
      <dt className="mx-auto mb-2 grid h-8 w-8 place-items-center rounded-lg bg-cream text-primary">
        {icon}
      </dt>
      <dd className="text-xl font-semibold text-ink">{value}</dd>
      <dd className="text-xs text-ink-subtle">{label}</dd>
    </div>
  );
}

function Step({
  index,
  icon,
  title,
  body,
}: {
  index: string;
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="relative">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary-soft text-primary">
          {icon}
        </span>
        <span className="font-mono text-sm text-ink-subtle">{index}</span>
      </div>
      <h3 className="mt-4 text-lg font-medium text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted text-pretty">
        {body}
      </p>
    </div>
  );
}
