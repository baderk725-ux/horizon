"use client";

import { useActionState } from "react";
import { submitContactAction, type FormState } from "@/app/actions";

const initialState: FormState = { status: "idle" };

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContactAction, initialState);

  if (state.status === "success") {
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
    <form action={formAction} className="flex flex-col gap-5">
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
      {state.status === "error" ? <p className="text-sm text-red-700">{state.message}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center gap-2 bg-charcoal px-8 py-4 text-xs font-medium uppercase tracking-[0.14em] text-ivory transition-colors duration-300 hover:bg-espresso disabled:opacity-50 sm:w-auto"
      >
        {pending ? "Sending…" : "Send Message"}
      </button>
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
