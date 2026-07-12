"use client";

import Link from "next/link";
import { ArrowRight, BellRing, MapPinned, RefreshCw, Salad } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CanteenCard, CanteenCardSkeleton } from "@/components/canteen-card";
import { HeroPreview } from "@/components/landing/hero-preview";
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

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 pt-16 sm:px-6 sm:pt-20 lg:grid-cols-12 lg:gap-8 lg:pb-24 lg:pt-24">
          {/* left — thesis */}
          <div className="animate-rise text-center lg:col-span-6 lg:text-left xl:col-span-7">
            <div className="flex justify-center lg:justify-start">
              <Badge tone="primary" className="gap-1.5 px-3 py-1.5 text-[0.8125rem]">
                <MapPinned className="h-3.5 w-3.5" />
                {site.university} · {site.campus}
              </Badge>
            </div>

            <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.03] tracking-tight text-ink sm:text-5xl xl:text-6xl">
              Know what&rsquo;s cooking{" "}
              <span className="bg-gradient-to-r from-primary to-gold bg-clip-text text-transparent">
                before you leave the hostel.
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-ink-muted sm:text-lg lg:mx-0">
              The live menu of every canteen on campus — what&rsquo;s available and
              what it costs, updated in real time by the staff serving it. No more
              walking over to a sold-out counter.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
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

            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-7 gap-y-4 lg:justify-start">
              <InlineStat value={canteens ? String(canteens.length) : "—"} label="canteens" />
              <Divider />
              <InlineStat
                value={canteens ? String(totalAvailable) : "—"}
                label="dishes available"
              />
              <Divider />
              <InlineStat
                value={canteens ? String(openCount) : "—"}
                label="open now"
                live={openCount > 0}
              />
            </div>
          </div>

          {/* right — live product */}
          <div className="animate-rise lg:col-span-6 xl:col-span-5">
            <HeroPreview />
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

function InlineStat({
  value,
  label,
  live = false,
}: {
  value: string;
  label: string;
  live?: boolean;
}) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="font-display text-3xl font-semibold tracking-tight text-ink">
        {value}
      </span>
      <span className="flex items-center gap-1.5 text-sm text-ink-muted">
        {live && (
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-available opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-available" />
          </span>
        )}
        {label}
      </span>
    </div>
  );
}

function Divider() {
  return <span className="hidden h-8 w-px bg-line-strong sm:block" aria-hidden />;
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
