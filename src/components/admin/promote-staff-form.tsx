"use client";

import { useActionState, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { promoteToStaffAction, type StaffActionState } from "@/lib/actions/staff";
import { searchPromotableCustomersAction } from "@/lib/actions/staff-search";
import { STAFF_ROLES } from "@/lib/validation/staff";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { StaffProfile } from "@/lib/data/admin/staff";

const initialState: StaffActionState = { error: null };

export function PromoteStaffForm() {
  const t = useTranslations("adminStaff");
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<StaffProfile[]>([]);
  const [selected, setSelected] = useState<StaffProfile | null>(null);
  const [searching, startSearchTransition] = useTransition();

  const action = selected ? promoteToStaffAction.bind(null, selected.id) : null;
  const [state, formAction, pending] = useActionState(
    async (prev: StaffActionState, formData: FormData) => {
      if (!action) return prev;
      const result = await action(prev, formData);
      if (!result.error) {
        setSelected(null);
        setQuery("");
        setResults([]);
        router.refresh();
      }
      return result;
    },
    initialState,
  );

  function search(term: string) {
    setQuery(term);
    setSelected(null);
    if (!term.trim()) {
      setResults([]);
      return;
    }
    startSearchTransition(async () => {
      setResults(await searchPromotableCustomersAction(term));
    });
  }

  return (
    <div className="space-y-3">
      <Input
        value={query}
        onChange={(e) => search(e.target.value)}
        placeholder={t("searchCustomers")}
      />
      {searching && <p className="text-xs text-brand-500">{t("searching")}</p>}

      {!selected && results.length > 0 && (
        <ul className="divide-y divide-brand-200 rounded-(--radius-card) border border-brand-200 bg-paper">
          {results.map((customer) => (
            <li key={customer.id}>
              <button
                type="button"
                onClick={() => setSelected(customer)}
                className="flex w-full items-center justify-between px-4 py-2.5 text-start text-sm hover:bg-paper-muted"
              >
                <span className="text-brand-900">{customer.full_name ?? "—"}</span>
                <span className="text-brand-500">{customer.email}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {selected && (
        <form action={formAction} className="flex flex-wrap items-end gap-3 rounded-(--radius-card) border border-brand-200 bg-paper-muted p-4">
          <p className="w-full text-sm text-brand-900">
            {t("promoting")} <strong>{selected.full_name ?? selected.email}</strong>
          </p>
          <select
            name="staffRole"
            defaultValue="sales"
            className="rounded-(--radius-button) border border-brand-300 bg-paper px-3 py-2 text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-accent-500"
          >
            {STAFF_ROLES.map((role) => (
              <option key={role} value={role}>
                {t(`roles.${role}`)}
              </option>
            ))}
          </select>
          <Button type="submit" size="sm" disabled={pending}>
            {pending ? t("saving") : t("grantAccess")}
          </Button>
          <Button type="button" size="sm" variant="ghost" onClick={() => setSelected(null)}>
            {t("cancel")}
          </Button>
          {state.error && <span className="w-full text-xs text-danger">{t(state.error)}</span>}
        </form>
      )}
    </div>
  );
}
