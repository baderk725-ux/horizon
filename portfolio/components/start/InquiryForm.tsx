"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { budgets, contactMethods, inquirySchema, projectTypes, timelines } from "@/content/inquiry";
import { buttonClass } from "@/components/ui/Button";

type Errors = Partial<Record<string, string>>;
type Status = "idle" | "sending" | "sent" | "mailto" | "unconfigured" | "error";

const chip =
  "label flex min-h-11 cursor-pointer items-center gap-2 rounded-pill border border-line px-4 py-2.5 text-silver transition-colors " +
  "hover:border-silver has-[:checked]:border-accent has-[:checked]:bg-accent has-[:checked]:text-obsidian has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent";
const field =
  "w-full rounded-sm border border-line bg-graphite/40 px-4 py-3.5 text-silver placeholder:text-dim transition-colors focus:border-accent focus:outline-none aria-[invalid=true]:border-danger";

function Group({ n, title, hint, children, error, id }: { n: string; title: string; hint?: string; children: React.ReactNode; error?: string; id: string }) {
  return (
    <fieldset className="border-t border-line pt-8" aria-describedby={error ? `${id}-err` : undefined}>
      <legend className="flex w-full items-baseline gap-4">
        <span className="label text-accent">{n}</span>
        <span className="text-title text-silver">{title}</span>
      </legend>
      {hint && <p className="mt-2 pl-10 text-sm text-muted">{hint}</p>}
      <div className="mt-6">{children}</div>
      {error && (
        <p id={`${id}-err`} className="mt-3 text-sm text-danger" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}

export function InquiryForm() {
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [desc, setDesc] = useState("");
  const [mailto, setMailto] = useState<string | null>(null);

  function read(form: HTMLFormElement) {
    const fd = new FormData(form);
    const opt = (k: string) => {
      const v = fd.get(k);
      return typeof v === "string" && v.length ? v : undefined;
    };
    return {
      projectTypes: fd.getAll("projectTypes"),
      budget: opt("budget"),
      timeline: opt("timeline"),
      description: fd.get("description") ?? "",
      links: fd.get("links") ?? "",
      name: fd.get("name") ?? "",
      email: fd.get("email") ?? "",
      company: fd.get("company") ?? "",
      contactMethod: opt("contactMethod") ?? "Email",
      website: fd.get("website") ?? "",
    };
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const parsed = inquirySchema.safeParse(read(form));
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        next[key] ??= issue.message;
      }
      setErrors(next);
      const first = form.querySelector<HTMLElement>(`[data-field="${Object.keys(next)[0]}"]`);
      first?.focus();
      return;
    }
    setErrors({});
    setStatus("sending");
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = (await res.json().catch(() => ({}))) as { status?: string; mailto?: string; errors?: Errors };
      if (res.ok && data.status === "sent") return setStatus("sent");
      if (res.ok && data.status === "mailto" && data.mailto) {
        setMailto(data.mailto);
        setStatus("mailto");
        window.location.href = data.mailto;
        return;
      }
      if (data.status === "unconfigured") return setStatus("unconfigured");
      if (data.errors) setErrors(data.errors);
      setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent" || status === "mailto") {
    return (
      <div role="status" className="rounded-sm border border-line p-8 md:p-12">
        <span className="grid size-12 place-items-center rounded-full bg-accent text-obsidian">
          <Check aria-hidden="true" />
        </span>
        <h2 className="display wdth-118 mt-8 text-display-m text-silver">
          {status === "sent" ? "Inquiry received." : "Almost there."}
        </h2>
        <p className="mt-4 max-w-[48ch] text-muted">
          {status === "sent"
            ? "Thank you. I'll read it carefully and reply by email with next steps."
            : "Your email app should have opened with everything filled in. Just press send."}
        </p>
        {mailto && (
          <a href={mailto} className={buttonClass("secondary", "mt-8")}>
            Open email again
          </a>
        )}
      </div>
    );
  }

  const err = (k: string) => errors[k];
  const errProps = (k: string) =>
    err(k) ? { "aria-invalid": true as const, "aria-describedby": `${uid}-${k}-err` } : { "aria-invalid": false as const };

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} className="flex flex-col gap-12" aria-describedby={`${uid}-req`}>
      <p id={`${uid}-req`} className="text-sm text-muted">
        Fields marked <span className="text-accent">*</span> are required.
      </p>

      <Group n="01" id={`${uid}-types`} title="What are we building? *" hint="Choose all that apply." error={err("projectTypes")}>
        <div className="flex flex-wrap gap-2">
          {projectTypes.map((t, i) => (
            <label key={t} className={chip}>
              <input type="checkbox" name="projectTypes" value={t} className="sr-only" data-field={i === 0 ? "projectTypes" : undefined} />
              {t}
            </label>
          ))}
        </div>
      </Group>

      <Group n="02" id={`${uid}-budget`} title="Budget range *" error={err("budget")}>
        <div className="flex flex-wrap gap-2">
          {budgets.map((b, i) => (
            <label key={b} className={chip}>
              <input type="radio" name="budget" value={b} className="sr-only" data-field={i === 0 ? "budget" : undefined} />
              {b}
            </label>
          ))}
        </div>
        <p className="label mt-8 text-muted">Timeline (optional)</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {timelines.map((t) => (
            <label key={t} className={chip}>
              <input type="radio" name="timeline" value={t} className="sr-only" />
              {t}
            </label>
          ))}
        </div>
      </Group>

      <Group n="03" id={`${uid}-details`} title="Tell me about the project">
        <label htmlFor={`${uid}-description`} className="label text-muted">
          Description <span className="text-accent">*</span>
        </label>
        <textarea
          id={`${uid}-description`}
          name="description"
          data-field="description"
          rows={7}
          maxLength={4000}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Goals, audience, what success looks like, any references you love…"
          className={`${field} mt-2 resize-y`}
          {...errProps("description")}
        />
        <div className="mt-2 flex justify-between gap-4 text-sm">
          <span id={`${uid}-description-err`} className="text-danger" role={err("description") ? "alert" : undefined}>
            {err("description")}
          </span>
          <span className="label shrink-0 text-muted" aria-live="polite">
            {desc.length} / 4000
          </span>
        </div>
        <label htmlFor={`${uid}-links`} className="label mt-6 block text-muted">
          Existing website or links (optional)
        </label>
        <input id={`${uid}-links`} name="links" type="text" maxLength={500} className={`${field} mt-2`} placeholder="https://" />
      </Group>

      <Group n="04" id={`${uid}-contact`} title="Your details">
        <div className="grid gap-6 md:grid-cols-2">
          {(
            [
              ["name", "Name", "text", "name", true],
              ["email", "Email", "email", "email", true],
              ["company", "Company or brand (optional)", "text", "organization", false],
            ] as const
          ).map(([k, label, type, auto, req]) => (
            <div key={k} className={k === "company" ? "md:col-span-2" : ""}>
              <label htmlFor={`${uid}-${k}`} className="label text-muted">
                {label} {req && <span className="text-accent">*</span>}
              </label>
              <input
                id={`${uid}-${k}`}
                name={k}
                type={type}
                autoComplete={auto}
                data-field={k}
                required={req}
                className={`${field} mt-2`}
                {...errProps(k)}
              />
              {err(k) && (
                <p id={`${uid}-${k}-err`} className="mt-2 text-sm text-danger" role="alert">
                  {err(k)}
                </p>
              )}
            </div>
          ))}
        </div>
        <p className="label mt-8 text-muted">Preferred contact</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {contactMethods.map((m, i) => (
            <label key={m} className={chip}>
              <input type="radio" name="contactMethod" value={m} defaultChecked={i === 0} className="sr-only" />
              {m}
            </label>
          ))}
        </div>
        {/* Honeypot: hidden from people and assistive tech */}
        <div aria-hidden="true" className="sr-only">
          <label>
            Website
            <input type="text" name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
      </Group>

      <div className="flex flex-col gap-4 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-[44ch] text-sm text-muted">
          Your details are only used to reply to your inquiry.
        </p>
        <button type="submit" disabled={status === "sending"} className={buttonClass("primary", "justify-center disabled:opacity-60")}>
          {status === "sending" ? "Sending…" : "Send inquiry"}
          <ArrowUpRight aria-hidden="true" size={18} strokeWidth={1.75} />
        </button>
      </div>

      <div aria-live="assertive" className="text-sm">
        {status === "unconfigured" && (
          <p className="rounded-sm border border-line p-4 text-silver">
            Online inquiries aren&apos;t connected yet. Please try again soon.
          </p>
        )}
        {status === "error" && (
          <p className="rounded-sm border border-danger/50 p-4 text-silver">
            Something went wrong sending your inquiry. Please check the highlighted fields or try again.
          </p>
        )}
      </div>
    </form>
  );
}
