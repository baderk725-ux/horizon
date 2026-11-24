import type { Metadata } from "next";
import { InquiryForm } from "@/components/start/InquiryForm";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Start a project",
  description: "Tell Khaled about your website, cinematic experience or AI-powered application. Project type, budget, timeline and details.",
  alternates: { canonical: "/start" },
};

export default function StartPage() {
  return (
    <div className="relative overflow-x-clip pb-24 pt-28 md:pt-36">
      {/* Quiet portal ring — the Flow's finale, without heavy 3D on a typing page */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-30vw] top-[-10vh] size-[90vw] max-w-[1100px] rounded-full border border-lime/15 shadow-[0_0_120px_10px_rgba(184,243,74,0.06)_inset] md:right-[-12vw] md:size-[60vw]"
      />
      <div className="container-site relative grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionLabel index="06">Start a project</SectionLabel>
          <h1 className="display wdth-118 mt-8 text-display-l text-silver">
            Let&apos;s build
            <br />
            what&apos;s next<span className="text-lime">.</span>
          </h1>
          <p className="mt-8 max-w-[38ch] text-muted">
            Premium websites, cinematic experiences and AI-powered applications. Share a few details and I&apos;ll get back to you
            with next steps.
          </p>
          <ol className="mt-10 flex flex-col gap-3 border-t border-line pt-6">
            {["Project", "Scope", "Details", "Contact"].map((s, i) => (
              <li key={s} className="label flex gap-4 text-muted">
                <span className="text-lime">0{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
          <p className="mt-10 text-sm text-muted">{site.responseTime}</p>
        </div>
        <div className="lg:col-span-8">
          <InquiryForm />
        </div>
      </div>
    </div>
  );
}
