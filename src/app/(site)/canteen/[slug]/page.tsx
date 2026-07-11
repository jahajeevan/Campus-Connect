import type { Metadata } from "next";
import { MenuView } from "@/components/menu/menu-view";
import { site } from "@/lib/site";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function prettify(slug: string) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const name = prettify(slug);
  return {
    title: `${name} — Live Menu`,
    description: `See the live menu, prices and availability for ${name} at ${site.university}, ${site.campus}.`,
    openGraph: {
      title: `${name} — Live Menu · ${site.name}`,
      description: `Live menu, prices and availability for ${name}.`,
    },
  };
}

export default async function CanteenMenuPage({ params }: PageProps) {
  const { slug } = await params;
  return <MenuView slug={slug} />;
}
