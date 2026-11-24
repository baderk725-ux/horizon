import { NextResponse } from "next/server";
import { inquirySchema, type Inquiry } from "@/content/inquiry";

export const runtime = "nodejs";

/**
 * Delivery (no paid service connected without approval):
 *  1. INQUIRY_WEBHOOK_URL set → POST JSON to it (Slack/Discord/Make/Zapier/Formspree-style endpoints).
 *  2. else CONTACT_EMAIL / NEXT_PUBLIC_CONTACT_EMAIL set → return a pre-filled mailto for the client.
 *  3. else → 503 "unconfigured" so the client says so honestly (pre-launch only).
 */

// Best-effort, per-instance rate limit (5 requests / 10 min / IP).
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

function summary(d: Inquiry) {
  return [
    `New project inquiry`,
    `Name: ${d.name}`,
    `Email: ${d.email}`,
    d.company && `Company: ${d.company}`,
    `Project: ${d.projectTypes.join(", ")}`,
    `Budget: ${d.budget}`,
    d.timeline && `Timeline: ${d.timeline}`,
    `Preferred contact: ${d.contactMethod}`,
    d.links && `Links: ${d.links}`,
    ``,
    d.description,
  ]
    .filter((l) => l !== undefined && l !== "")
    .join("\n");
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (limited(ip)) return NextResponse.json({ status: "rate-limited" }, { status: 429 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ status: "invalid" }, { status: 400 });
  }

  const parsed = inquirySchema.safeParse(body);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const i of parsed.error.issues) errors[String(i.path[0] ?? "form")] ??= i.message;
    // Honeypot filled → pretend success, drop silently.
    if (errors.website) return NextResponse.json({ status: "sent" });
    return NextResponse.json({ status: "invalid", errors }, { status: 400 });
  }

  const data = parsed.data;
  const webhook = process.env.INQUIRY_WEBHOOK_URL;
  if (webhook) {
    try {
      const r = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: summary(data), inquiry: { ...data, website: undefined } }),
        signal: AbortSignal.timeout(8000),
      });
      if (!r.ok) throw new Error(`webhook ${r.status}`);
      return NextResponse.json({ status: "sent" });
    } catch (e) {
      console.error("[inquiry] webhook delivery failed", e);
      return NextResponse.json({ status: "error" }, { status: 502 });
    }
  }

  const to = process.env.CONTACT_EMAIL ?? process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  if (to) {
    const subject = `Project inquiry — ${data.projectTypes[0]} (${data.budget})`;
    const mailto = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(summary(data))}`;
    return NextResponse.json({ status: "mailto", mailto });
  }

  return NextResponse.json({ status: "unconfigured" }, { status: 503 });
}
