import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ContactForm } from "@/components/contact/ContactForm";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the NOVEL team — shipping, returns, and general enquiries.",
};

const FAQS = [
  {
    id: "shipping-time",
    q: "How long does shipping take?",
    a: "Standard shipping takes 5–7 business days. Express shipping (2–3 business days) is available at checkout. Made-to-order pieces, such as macramé wall hangings, may take an additional 2–3 days to produce before shipping.",
  },
  {
    id: "returns",
    q: "What is your returns policy?",
    a: "We accept returns within 30 days of delivery for unused items in their original packaging. Made-to-order and gift sets are final sale.",
  },
  {
    id: "international",
    q: "Do you ship internationally?",
    a: "We currently ship within the continental United States and Canada, with select international shipping available at checkout.",
  },
];

export default function ContactPage() {
  return (
    <div className="container-editorial py-10 md:py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
      <h1 className="mt-6 font-serif text-4xl md:text-5xl">Contact</h1>
      <p className="mt-4 max-w-xl text-base leading-relaxed text-stone">
        Questions about an order, a piece, or a collaboration? We&rsquo;d love to hear from you.
      </p>

      <div className="mt-14 grid gap-16 lg:grid-cols-[1fr_1fr]">
        <div>
          <h2 className="font-serif text-2xl">Send a Message</h2>
          <div className="mt-6">
            <ContactForm />
          </div>
        </div>

        <div className="flex flex-col gap-10">
          <div>
            <h2 className="font-serif text-2xl">Reach Us Directly</h2>
            <dl className="mt-6 flex flex-col gap-4 text-sm">
              <div>
                <dt className="text-xs uppercase tracking-[0.1em] text-stone">Email</dt>
                <dd className="mt-1">
                  <a href="mailto:hello@novel-home.com" className="text-charcoal hover:text-espresso">
                    hello@novel-home.com
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.1em] text-stone">Phone</dt>
                <dd className="mt-1">
                  <a href="tel:+18005550142" className="text-charcoal hover:text-espresso">
                    +1 (800) 555-0142
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.1em] text-stone">Studio</dt>
                <dd className="mt-1 text-charcoal">
                  142 Wharton Street, Studio 4<br />Brooklyn, NY 11222
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.1em] text-stone">Follow</dt>
                <dd className="mt-1 flex gap-4 text-charcoal">
                  <a href="https://instagram.com" target="_blank" rel="noreferrer noopener" className="hover:text-espresso">
                    Instagram
                  </a>
                  <a href="https://facebook.com" target="_blank" rel="noreferrer noopener" className="hover:text-espresso">
                    Facebook
                  </a>
                  <a href="https://tiktok.com" target="_blank" rel="noreferrer noopener" className="hover:text-espresso">
                    TikTok
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          <div id="faq">
            <SectionHeading eyebrow="Support" title="Frequently Asked" />
            <div className="mt-6 flex flex-col divide-y divide-line border-t border-line">
              {FAQS.map((faq) => (
                <details key={faq.id} id={faq.id} className="group py-4">
                  <summary className="flex cursor-pointer items-center justify-between font-serif text-base">
                    {faq.q}
                    <span aria-hidden="true" className="text-stone transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-stone">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
