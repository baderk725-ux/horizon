"use client";

import { Fragment, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { setCouponActiveAction, deleteCouponAction } from "@/lib/actions/discounts";
import { CouponForm } from "@/components/admin/coupon-form";
import { Button } from "@/components/ui/button";
import type { AdminCouponRow } from "@/lib/data/admin/discounts";

export function CouponsManager({ coupons }: { coupons: AdminCouponRow[] }) {
  const t = useTranslations("adminDiscounts");
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  function toggleActive(coupon: AdminCouponRow) {
    setActionError(null);
    startTransition(async () => {
      const result = await setCouponActiveAction(coupon.id, !coupon.is_active);
      if (result.error) setActionError(result.error);
      else router.refresh();
    });
  }

  function remove(coupon: AdminCouponRow) {
    if (!window.confirm(t("deleteConfirm", { code: coupon.code }))) return;
    setActionError(null);
    startTransition(async () => {
      const result = await deleteCouponAction(coupon.id);
      if (result.error) setActionError(result.error);
      else router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg text-brand-900">{t("title")}</h2>
        <Button type="button" size="sm" variant="secondary" onClick={() => setCreating((v) => !v)}>
          {creating ? t("cancel") : t("newCoupon")}
        </Button>
      </div>

      {creating && (
        <div className="rounded-(--radius-card) border border-brand-200 bg-paper-muted p-5">
          <CouponForm
            onDone={() => {
              setCreating(false);
              router.refresh();
            }}
          />
        </div>
      )}

      {actionError && <p className="text-sm text-danger">{t(actionError)}</p>}

      {coupons.length === 0 ? (
        <p className="text-sm text-brand-500">{t("empty")}</p>
      ) : (
        <div className="overflow-x-auto rounded-(--radius-card) border border-brand-200 bg-paper">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-200 text-start text-xs uppercase tracking-wider text-brand-500">
                <th className="px-5 py-3 text-start">{t("code")}</th>
                <th className="px-5 py-3 text-start">{t("discount")}</th>
                <th className="px-5 py-3 text-start">{t("usage")}</th>
                <th className="px-5 py-3 text-start">{t("expiresAt")}</th>
                <th className="px-5 py-3 text-start">{t("status")}</th>
                <th className="px-5 py-3 text-end">{t("actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-200">
              {coupons.map((coupon) => (
                <Fragment key={coupon.id}>
                  <tr>
                    <td className="px-5 py-3 font-medium text-brand-900">{coupon.code}</td>
                    <td className="px-5 py-3 text-brand-700">
                      {coupon.discount_type === "percent"
                        ? `${coupon.value}%`
                        : `${coupon.value.toFixed(2)} ${t("currency")}`}
                    </td>
                    <td className="px-5 py-3 text-brand-700">
                      {coupon.used_count}
                      {coupon.max_uses ? ` / ${coupon.max_uses}` : ""}
                    </td>
                    <td className="px-5 py-3 text-brand-700">{coupon.expires_at ?? "—"}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-(--radius-pill) px-2.5 py-0.5 text-xs ${
                          coupon.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-brand-200 text-brand-700"
                        }`}
                      >
                        {coupon.is_active ? t("active") : t("inactive")}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-end">
                      <div className="inline-flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => setEditingId(editingId === coupon.id ? null : coupon.id)}
                          className="text-sm font-medium text-brand-700 hover:underline"
                        >
                          {t("edit")}
                        </button>
                        <button
                          type="button"
                          disabled={pending}
                          onClick={() => toggleActive(coupon)}
                          className="text-sm font-medium text-brand-700 hover:underline disabled:opacity-50"
                        >
                          {coupon.is_active ? t("deactivate") : t("activate")}
                        </button>
                        {coupon.used_count === 0 && (
                          <button
                            type="button"
                            disabled={pending}
                            onClick={() => remove(coupon)}
                            className="text-sm font-medium text-danger hover:underline disabled:opacity-50"
                          >
                            {t("delete")}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                  {editingId === coupon.id && (
                    <tr>
                      <td colSpan={6} className="bg-paper-muted p-5">
                        <CouponForm
                          coupon={coupon}
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
