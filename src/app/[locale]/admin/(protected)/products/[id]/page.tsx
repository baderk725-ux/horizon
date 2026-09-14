import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getAdminProductById } from "@/lib/data/admin/products";
import { getAllCategories } from "@/lib/data/admin/categories";
import { ProductForm } from "@/components/admin/product-form";
import { ProductImageManager } from "@/components/admin/product-image-manager";

export default async function EditProductPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const [product, categories] = await Promise.all([
    getAdminProductById(id),
    getAllCategories(),
  ]);

  if (!product) notFound();

  const t = await getTranslations("adminProducts");

  return (
    <div className="max-w-3xl space-y-10">
      <div>
        <h1 className="font-display text-display-sm text-brand-900">{t("editProduct")}</h1>
        <div className="mt-6 rounded-(--radius-card) border border-brand-200 bg-paper p-6">
          <ProductForm product={product} categories={categories} />
        </div>
      </div>

      <div className="rounded-(--radius-card) border border-brand-200 bg-paper p-6">
        <ProductImageManager productId={product.id} images={product.product_images} />
      </div>
    </div>
  );
}
