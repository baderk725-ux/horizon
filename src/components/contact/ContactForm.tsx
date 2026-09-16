"use client";

import { useState } from "react";
import { Button } from "@/components/Button";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="border border-line p-8 text-center">
        <h3 className="font-serif text-xl">Message sent.</h3>
        <p className="mt-2 text-sm text-stone">
          Thank you for reaching out — our team typically responds within 1–2 business days.
        </p>
      </div>
    );
  }

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Name" name="name" required />
        <FormField label="Email" type="email" name="email" required />
      </div>
      <FormField label="Subject" name="subject" required />
      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-xs uppercase tracking-[0.1em] text-stone">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="border border-line bg-ivory px-4 py-3 text-sm text-charcoal focus:outline-none"
        />
      </div>
      <Button type="submit" className="w-full sm:w-auto">
        Send Message
      </Button>
    </form>
  );
}

function FormField({
  label,
  ...rest
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = `contact-${rest.name}`;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-xs uppercase tracking-[0.1em] text-stone">
        {label}
      </label>
      <input
        id={id}
        {...rest}
        className="border border-line bg-ivory px-4 py-3 text-sm text-charcoal focus:outline-none"
      />
    </div>
  );
}
