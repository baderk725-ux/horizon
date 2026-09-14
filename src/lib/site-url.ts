/**
 * Absolute production origin, used only where an absolute URL is required
 * (sitemap.xml entries, robots.txt's Sitemap: line — canonical/OG tags
 * elsewhere use relative paths, which Next.js resolves against the actual
 * deployment origin on its own). Must be set via NEXT_PUBLIC_SITE_URL in
 * production; falls back to localhost only for local dev, where an
 * incorrect sitemap has no real consequence.
 */
export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";
}
