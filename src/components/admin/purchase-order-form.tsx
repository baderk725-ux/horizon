"use client";

import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import {
  createPurchaseOrderAction,
  updatePurchaseOrderItemsAction,
  type PurchaseOrderActionState,
} from "@/lib/actions/purchase-orders";
import { POItemPicker, type POLine } from "@/components/admin/po-item-picker";
import { Field, Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { SupplierRow } from "@/lib/data/admin/suppliers";
import type { AdminPurchaseOrderDetail } from "@/lib/data/admin/purchase-orders";

const initialState: PurchaseOrderActionState = { error: null };

export function PurchaseOrderForm({
  suppliers,
  purchaseOrder,
}: {
  suppliers: SupplierRow[];
  purchaseOrder?: AdminPurchaseOrderDetail;
}) {
  const t = useTranslations("adminPurchaseOrders");
  const router = useRouter();

  const [lines, setLines] = useState<POLine[]>(
    purchaseOrder?.items
      .filter((i) => i.productId)
      .map((i) => ({
        product: { id: i.productId!, nameEn: i.nameEn ?? "", nameAr: i.nameAr ?? "", cost: i.unitCost },
        quantity: i.quantity,
        unitCost: i.unitCost,
      })) ?? [],
  );

  const action = purchaseOrder
    ? updatePurchaseOrderItemsAction.bind(null, purchaseOrder.id)
    : createPurchaseOrderAction;

  const [state, formAction, pending] = useActionState(
    async (prev: PurchaseOrderActionState, formData: FormData) => {
      const result = await action(prev, formData);
      if (!result.error) router.refresh();
      return result;
    },
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <input
        type="hidden"
        name="itemsJson"
        value={JSON.stringify(lines.map((l) => ({ productId: l.product.id, quantity: l.quantity, unitCost: l.unitCost })))}
      />

      <Field label={t("supplier")} htmlFor="po-supplierId">
        <select
          id="po-supplierId"
          name="supplierId"
          defaultValue={purchaseOrder?.supplier?.id ?? ""}
          className="w-full rounded-(--radius-button) border border-brand-300 bg-paper px-4 py-3 text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-accent-500"
        >
          <option value="">{t("noSupplier")}</option>
          {suppliers.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label={t("notes")} htmlFor="po-notes">
        <Input id="po-notes" name="notes" defaultValue={purchaseOrder?.notes ?? ""} />
      </Field>

      <POItemPicker lines={lines} onChange={setLines} />

      {state.error && <p className="text-sm text-danger">{t(state.error)}</p>}

      <Button type="submit" size="sm" disabled={pending}>
        {pending ? t("saving") : purchaseOrder ? t("save") : t("createDraft")}
      </Button>
    </form>
  );
}
