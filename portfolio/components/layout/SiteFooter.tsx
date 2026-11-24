import Link from "next/link";
import { Monogram } from "@/components/brand/Monogram";
import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="relative border-t border-line">
      <div className="container-site flex flex-col gap-8 py-10 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Monogram size={22} />
          <p className="label text-muted">
            © {new Date().getFullYear()} {site.name} · {site.concept}
          </p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-3">
          <Link href="/#work" className="label py-2 text-muted hover:text-silver">Work</Link>
          <Link href="/start" className="label py-2 text-muted hover:text-silver">Start a project</Link>
          {site.socials.map((s) => (
            <a key={s.href} href={s.href} className="label py-2 text-muted hover:text-silver" rel="me noopener" target="_blank">
              {s.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
