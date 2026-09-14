"use client";

import { Fragment, useState, useTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { setCollectionActiveAction, deleteCollectionAction } from "@/lib/actions/collections";
import { CollectionForm } from "@/components/admin/collection-form";
import { Button } from "@/components/ui/button";
import type { AdminCollectionRow, AdminCollectionDetail } from "@/lib/data/admin/collections";

export function CollectionsManager({
  collections,
  loadDetail,
}: {
  collections: AdminCollectionRow[];
  loadDetail: (id: string) => Promise<AdminCollectionDetail | null>;
}) {
  const t = useTranslations("adminCollections");
  const locale = useLocale();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingDetail, setEditingDetail] = useState<AdminCollectionDetail | null>(null);
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

  function toggleActive(collection: AdminCollectionRow) {
    setActionError(null);
    startTransition(async () => {
      const result = await setCollectionActiveAction(collection.id, !collection.is_active);
      if (result.error) setActionError(result.error);
      else router.refresh();
    });
  }

  function remove(collection: AdminCollectionRow) {
    if (!window.confirm(t("deleteConfirm", { name: collection.name_en }))) return;
    setActionError(null);
    startTransition(async () => {
      const result = await deleteCollectionAction(collection.id);
      if (result.error) setActionError(result.error);
      else router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg text-brand-900">{t("title")}</h2>
        <Button type="button" size="sm" variant="secondary" onClick={() => setCreating((v) => !v)}>
          {creating ? t("cancel") : t("newCollection")}
        </Button>
      </div>

      {creating && (
        <div className="rounded-(--radius-card) border border-brand-200 bg-paper-muted p-5">
          <CollectionForm
            onDone={() => {
              setCreating(false);
              router.refresh();
            }}
          />
        </div>
      )}

      {actionError && <p className="text-sm text-danger">{t(actionError)}</p>}

      {collections.length === 0 ? (
        <p className="text-sm text-brand-500">{t("empty")}</p>
      ) : (
        <div className="overflow-x-auto rounded-(--radius-card) border border-brand-200 bg-paper">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-200 text-start text-xs uppercase tracking-wider text-brand-500">
                <th className="px-5 py-3 text-start">{t("name")}</th>
                <th className="px-5 py-3 text-start">{t("slug")}</th>
                <th className="px-5 py-3 text-start">{t("placement")}</th>
                <th className="px-5 py-3 text-start">{t("status")}</th>
                <th className="px-5 py-3 text-end">{t("actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-200">
              {collections.map((collection) => (
                <Fragment key={collection.id}>
                  <tr>
                    <td className="px-5 py-3 font-medium text-brand-900">
                      {locale === "ar" ? collection.name_ar : collection.name_en}
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-brand-500">{collection.slug}</td>
                    <td className="px-5 py-3 text-brand-700">{t(`placement${collection.placement === "shop_top" ? "ShopTop" : collection.placement === "hidden" ? "Hidden" : "Home"}`)}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-(--radius-pill) px-2.5 py-0.5 text-xs ${
                          collection.is_active ? "bg-green-100 text-green-800" : "bg-brand-200 text-brand-700"
                        }`}
                      >
                        {collection.is_active ? t("active") : t("inactive")}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-end">
                      <div className="inline-flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => startEdit(collection.id)}
                          className="text-sm font-medium text-brand-700 hover:underline"
                        >
                          {t("edit")}
                        </button>
                        <button
                          type="button"
                          disabled={pending}
                          onClick={() => toggleActive(collection)}
                          className="text-sm font-medium text-brand-700 hover:underline disabled:opacity-50"
                        >
                          {collection.is_active ? t("deactivate") : t("activate")}
                        </button>
                        <button
                          type="button"
                          disabled={pending}
                          onClick={() => remove(collection)}
                          className="text-sm font-medium text-danger hover:underline disabled:opacity-50"
                        >
                          {t("delete")}
                        </button>
                      </div>
                    </td>
                  </tr>
                  {editingId === collection.id && (
                    <tr>
                      <td colSpan={5} className="bg-paper-muted p-5">
                        {editingDetail ? (
                          <CollectionForm
                            collection={editingDetail}
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
