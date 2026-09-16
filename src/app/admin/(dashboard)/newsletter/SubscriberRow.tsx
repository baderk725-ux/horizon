"use client";

import { useTransition } from "react";
import type { NewsletterSubscriber } from "@/lib/types";
import { deleteSubscriberAction } from "./actions";

export function SubscriberRow({ subscriber }: { subscriber: NewsletterSubscriber }) {
  const [isPending, startTransition] = useTransition();

  return (
    <tr className="border-b border-[#f0e9dc] last:border-0">
      <td className="px-4 py-3 text-[#1a1714]">{subscriber.email}</td>
      <td className="px-4 py-3 text-xs text-[#9a8b73]">
        {new Date(subscriber.createdAt).toLocaleDateString()}
      </td>
      <td className="px-4 py-3 text-right">
        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            if (confirm("Remove this subscriber?")) startTransition(() => deleteSubscriberAction(subscriber.id));
          }}
          className="text-xs uppercase tracking-[0.08em] text-red-700 underline underline-offset-4"
        >
          Remove
        </button>
      </td>
    </tr>
  );
}
