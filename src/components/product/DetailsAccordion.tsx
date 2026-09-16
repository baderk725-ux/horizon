"use client";

import { useState, type ReactNode } from "react";

interface AccordionSection {
  title: string;
  content: ReactNode;
}

export function DetailsAccordion({ sections }: { sections: AccordionSection[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-line border-t border-line">
      {sections.map((section, i) => {
        const open = openIndex === i;
        return (
          <div key={section.title}>
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : i)}
              aria-expanded={open}
              className="flex w-full items-center justify-between py-5 text-left"
            >
              <span className="font-serif text-lg">{section.title}</span>
              <span aria-hidden="true" className="text-xl font-light text-stone">
                {open ? "−" : "+"}
              </span>
            </button>
            {open ? <div className="pb-5 text-sm leading-relaxed text-stone">{section.content}</div> : null}
          </div>
        );
      })}
    </div>
  );
}
