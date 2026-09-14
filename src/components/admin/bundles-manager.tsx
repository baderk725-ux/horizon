"use client";

import { Fragment, useState, useTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { setBundleActiveAction, deleteBundleAction } from "@/lib/actions/bundles";
import { BundleForm } from "@/components/admin/bundle-form";
import { Button } from "@/components/ui/button";
import type { AdminBundleListItem, AdminBundleDetail } from "@/lib/data/admin/bundles";

export function BundlesManager({
  bundles,
  loadDetail,
}: {
  bundles: AdminBundleListItem[];
  loadDetail: (id: string) => Promise<AdminBundleDetail | null>;
}) {
  const t = useTranslations("adminBundles");
  const tOrders = useTranslations("adminOrders");
  const locale = useLocale();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingDetail, setEditingDetail] = useState<AdminBundleDetail | null>(null);
  const [creating, setCreating] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  async function startEdit(id: string) {
    if (editingId === id) {
      setEditingId(null);
      return;
    }
    setEditingId(id);
    setEditingDetail(await loadDetail(id));
  }

  function toggleActive(bundle: AdminBundleListItem) {
    setActionError(null);
    startTransition(async () => {
      const result = await setBundleActiveAction(bundle.id, !bundle.is_active);
      if (result.error) setActionError(result.error);
      else router.refresh();
    });
  }

  function remove(bundle: AdminBundleListItem) {
    if (!window.confirm(t("deleteConfirm", { name: bundle.name_en }))) return;
    setActionError(null);
    startTransition(async () => {
      const result = await deleteBundleAction(bundle.id);
      if (result.error) setActionError(result.error);
      else router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg text-brand-900">{t("title")}</h2>
        <Button type="button" size="sm" variant="secondary" onClick={() => setCreating((v) => !v)}>
          {creating ? t("cancel") : t("newBundle")}
        </Button>
      </div>

      {creating && (
        <div className="rounded-(--radius-card) border border-brand-200 bg-paper-muted p-5">
          <BundleForm
            onDone={() => {
              setCreating(false);
              router.refresh();
            }}
          />
        </div>
      )}

      {actionError && <p className="text-sm text-danger">{t(actionError)}</p>}

      {bundles.length === 0 ? (
        <p className="text-sm text-brand-500">{t("empty")}</p>
      ) : (
        <div className="overflow-x-auto rounded-(--radius-card) border border-brand-200 bg-paper">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-200 text-start text-xs uppercase tracking-wider text-brand-500">
                <th className="px-5 py-3 text-start">{t("name")}</th>
                <th className="px-5 py-3 text-start">{t("bundlePrice")}</th>
                <th className="px-5 py-3 text-start">{t("productsCount")}</th>
                <th className="px-5 py-3 text-start">{t("status")}</th>
                <th className="px-5 py-3 text-end">{t("actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-200">
              {bundles.map((bundle) => (
                <Fragment key={bundle.id}>
                  <tr>
                    <td className="px-5 py-3 font-medium text-brand-900">
                      {locale === "ar" ? bundle.name_ar : bundle.name_en}
                    </td>
                    <td className="px-5 py-3 text-brand-700">
                      {bundle.bundle_price.toFixed(2)} {tOrders("currency")}
                    </td>
                    <td className="px-5 py-3 text-brand-700">{bundle.productCount}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-(--radius-pill) px-2.5 py-0.5 text-xs ${
                          bundle.is_active ? "bg-green-100 text-green-800" : "bg-brand-200 text-brand-700"
                        }`}
                      >
                        {bundle.is_active ? t("active") : t("inactive")}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-end">
                      <div className="inline-flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => startEdit(bundle.id)}
                          className="text-sm font-medium text-brand-700 hover:underline"
                        >
                          {t("edit")}
                        </button>
                        <button
                          type="button"
                          disabled={pending}
                          onClick={() => toggleActive(bundle)}
                          className="text-sm font-medium text-brand-700 hover:underline disabled:opacity-50"
                        >
                          {bundle.is_active ? t("deactivate") : t("activate")}
                        </button>
                        <button
                          type="button"
                          disabled={pending}
                          onClick={() => remove(bundle)}
                          className="text-sm font-medium text-danger hover:underline disabled:opacity-50"
                        >
                          {t("delete")}
                        </button>
                      </div>
                    </td>
                  </tr>
                  {editingId === bundle.id && (
                    <tr>
                      <td colSpan={5} className="bg-paper-muted p-5">
                        {editingDetail ? (
                          <BundleForm
                            bundle={editingDetail}
                            onDone={() => {
                              setEditingId(null);
                              router.refresh();
                            }}
                          />
                        ) : (
                          <p className="text-sm text-brand-500">{t("loading")}</p>
                        )}
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
