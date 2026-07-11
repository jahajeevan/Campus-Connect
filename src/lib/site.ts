/** Central site metadata used across SEO, branding and the shell. */
export const site = {
  name: "Campus Connect",
  tagline: "Live canteen menus, before you leave the hostel.",
  university: "Amrita Vishwa Vidyapeetham",
  accreditation: "Deemed to be University",
  campus: "Ettimadai, Coimbatore",
  description:
    "Campus Connect shows the live menu of every canteen at Amrita Vishwa Vidyapeetham, Ettimadai. See what's available and what it costs before you walk over — updated in real time by canteen staff.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en_IN",
  themeColor: "#c1391f",
  ogImage: "/opengraph-image",
} as const;

export type SiteConfig = typeof site;
