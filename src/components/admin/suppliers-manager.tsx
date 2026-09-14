"use client";

import { Fragment, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { deleteSupplierAction } from "@/lib/actions/suppliers";
import { SupplierForm } from "@/components/admin/supplier-form";
import { Button } from "@/components/ui/button";
import type { SupplierRow } from "@/lib/data/admin/suppliers";

export function SuppliersManager({ suppliers }: { suppliers: SupplierRow[] }) {
  const t = useTranslations("adminSuppliers");
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  function remove(supplier: SupplierRow) {
    if (!window.confirm(t("deleteConfirm", { name: supplier.name }))) return;
    setActionError(null);
    startTransition(async () => {
      const result = await deleteSupplierAction(supplier.id);
      if (result.error) setActionError(result.error);
      else router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg text-brand-900">{t("title")}</h2>
        <Button type="button" size="sm" variant="secondary" onClick={() => setCreating((v) => !v)}>
          {creating ? t("cancel") : t("newSupplier")}
        </Button>
      </div>

      {creating && (
        <div className="rounded-(--radius-card) border border-brand-200 bg-paper-muted p-5">
          <SupplierForm
            onDone={() => {
              setCreating(false);
              router.refresh();
            }}
          />
        </div>
      )}

      {actionError && <p className="text-sm text-danger">{t(actionError)}</p>}

      {suppliers.length === 0 ? (
        <p className="text-sm text-brand-500">{t("empty")}</p>
      ) : (
        <div className="overflow-x-auto rounded-(--radius-card) border border-brand-200 bg-paper">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-200 text-start text-xs uppercase tracking-wider text-brand-500">
                <th className="px-5 py-3 text-start">{t("name")}</th>
                <th className="px-5 py-3 text-start">{t("contactPerson")}</th>
                <th className="px-5 py-3 text-start">{t("phone")}</th>
                <th className="px-5 py-3 text-start">{t("email")}</th>
                <th className="px-5 py-3 text-end">{t("actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-200">
              {suppliers.map((supplier) => (
                <Fragment key={supplier.id}>
                  <tr>
                    <td className="px-5 py-3 font-medium text-brand-900">{supplier.name}</td>
                    <td className="px-5 py-3 text-brand-700">{supplier.contact_person ?? "—"}</td>
                    <td className="px-5 py-3 text-brand-700">{supplier.phone ?? "—"}</td>
                    <td className="px-5 py-3 text-brand-700">{supplier.email ?? "—"}</td>
                    <td className="px-5 py-3 text-end">
                      <div className="inline-flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => setEditingId(editingId === supplier.id ? null : supplier.id)}
                          className="text-sm font-medium text-brand-700 hover:underline"
                        >
                          {t("edit")}
                        </button>
                        <button
                          type="button"
                          disabled={pending}
                          onClick={() => remove(supplier)}
                          className="text-sm font-medium text-danger hover:underline disabled:opacity-50"
                        >
                          {t("delete")}
                        </button>
                      </div>
                    </td>
                  </tr>
                  {editingId === supplier.id && (
                    <tr>
                      <td colSpan={5} className="bg-paper-muted p-5">
                        <SupplierForm
                          supplier={supplier}
                          onDone={() => {
                            setEditingId(null);
                            router.refresh();
                          }}
                        />
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
