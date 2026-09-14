"use client";

import { useState, useTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { deleteDeliveryAreaAction } from "@/lib/actions/shipping";
import { DeliveryAreaForm } from "@/components/admin/delivery-area-form";
import { Button } from "@/components/ui/button";
import type { GovernorateWithAreas } from "@/lib/data/admin/shipping";

export function ShippingZonesManager({ zones }: { zones: GovernorateWithAreas[] }) {
  const t = useTranslations("adminShipping");
  const locale = useLocale();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [editingAreaId, setEditingAreaId] = useState<string | null>(null);
  const [addingToGovernorate, setAddingToGovernorate] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const allGovernorates = zones.map((z) => ({
    id: z.id,
    name_en: z.name_en,
    name_ar: z.name_ar,
    created_at: z.created_at,
  }));

  function removeArea(id: string) {
    if (!window.confirm(t("deleteAreaConfirm"))) return;
    setDeleteError(null);
    startTransition(async () => {
      const result = await deleteDeliveryAreaAction(id);
      if (result.error) setDeleteError(result.error);
      else router.refresh();
    });
  }

  return (
    <div className="space-y-8">
      {zones.map((governorate) => (
        <section key={governorate.id} className="rounded-(--radius-card) border border-brand-200 bg-paper">
          <div className="flex items-center justify-between border-b border-brand-200 px-5 py-3">
            <h2 className="font-display text-lg text-brand-900">
              {locale === "ar" ? governorate.name_ar : governorate.name_en}
            </h2>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() =>
                setAddingToGovernorate(addingToGovernorate === governorate.id ? null : governorate.id)
              }
            >
              {t("addArea")}
            </Button>
          </div>

          {addingToGovernorate === governorate.id && (
            <div className="border-b border-brand-200 bg-paper-muted p-5">
              <DeliveryAreaForm
                governorates={allGovernorates}
                defaultGovernorateId={governorate.id}
                onDone={() => {
                  setAddingToGovernorate(null);
                  router.refresh();
                }}
              />
            </div>
          )}

          {governorate.areas.length === 0 ? (
            <p className="px-5 py-4 text-sm text-brand-500">{t("noAreas")}</p>
          ) : (
            <table className="w-full text-sm">
              <tbody className="divide-y divide-brand-200">
                {governorate.areas.map((area) => (
                  <tr key={area.id}>
                    {editingAreaId === area.id ? (
                      <td colSpan={5} className="bg-paper-muted p-5">
                        <DeliveryAreaForm
                          area={area}
                          governorates={allGovernorates}
                          onDone={() => {
                            setEditingAreaId(null);
                            router.refresh();
                          }}
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="mt-2"
                          onClick={() => setEditingAreaId(null)}
                        >
                          {t("cancel")}
                        </Button>
                      </td>
                    ) : (
                      <>
                        <td className="px-5 py-3 text-brand-900">
                          {locale === "ar" ? area.name_ar : area.name_en}
                        </td>
                        <td className="px-5 py-3 text-brand-700">
                          {area.delivery_fee > 0 ? `${area.delivery_fee.toFixed(2)} ${t("currency")}` : t("free")}
                        </td>
                        <td className="px-5 py-3">
                          {!area.is_active && (
                            <span className="rounded-(--radius-pill) bg-brand-200 px-2.5 py-0.5 text-xs text-brand-700">
                              {t("inactive")}
                            </span>
                          )}
                          {area.is_active && !area.is_configured && (
                            <span className="rounded-(--radius-pill) bg-amber-100 px-2.5 py-0.5 text-xs text-amber-800">
                              {t("notConfigured")}
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3 text-end">
                          <div className="inline-flex items-center gap-4">
                            <button
                              type="button"
                              onClick={() => setEditingAreaId(area.id)}
                              className="text-sm font-medium text-brand-700 hover:underline"
                            >
                              {t("edit")}
                            </button>
                            <button
                              type="button"
                              disabled={pending}
                              onClick={() => removeArea(area.id)}
                              className="text-sm font-medium text-danger hover:underline disabled:opacity-50"
                            >
                              {t("delete")}
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      ))}
      {deleteError && <p className="text-sm text-danger">{t(deleteError)}</p>}
    </div>
  );
}
