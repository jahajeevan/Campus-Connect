import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer id="about" className="mt-24 border-t border-line bg-ivory">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Logo subtitle />
            <p className="mt-4 text-sm leading-relaxed text-ink-muted text-pretty">
              {site.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <FooterCol title="Explore">
              <FooterLink href="/#canteens">Canteens</FooterLink>
              <FooterLink href="/#how">How it works</FooterLink>
            </FooterCol>
            <FooterCol title="Staff">
              <FooterLink href="/login">Staff Login</FooterLink>
              <FooterLink href="/dashboard">Dashboard</FooterLink>
            </FooterCol>
            <FooterCol title="University">
              <li className="text-sm text-ink-muted">{site.university}</li>
              <li className="text-sm text-ink-subtle">{site.accreditation}</li>
              <li className="text-sm text-ink-muted">{site.campus}</li>
            </FooterCol>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-line pt-6 text-xs text-ink-subtle sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {site.name} · {site.university}
          </p>
          <p>Built for students, faculty, visitors & canteen staff.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-ink-subtle">
        {title}
      </h4>
      <ul className="mt-3.5 space-y-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm text-ink-muted transition-colors hover:text-primary"
      >
        {children}
      </Link>
    </li>
  );
}
