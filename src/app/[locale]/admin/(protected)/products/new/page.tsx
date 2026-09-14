import { getTranslations } from "next-intl/server";
import { getAllCategories } from "@/lib/data/admin/categories";
import { ProductForm } from "@/components/admin/product-form";

export default async function NewProductPage() {
  const t = await getTranslations("adminProducts");
  const categories = await getAllCategories();

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-display-sm text-brand-900">{t("newProduct")}</h1>
      <div className="mt-6 rounded-(--radius-card) border border-brand-200 bg-paper p-6">
        <ProductForm categories={categories} />
        <p className="mt-4 text-xs text-brand-500">{t("imagesHintAfterCreate")}</p>
      </div>
    </div>
  );
}
