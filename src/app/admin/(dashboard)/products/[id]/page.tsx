import { notFound } from "next/navigation";
import { AdminPageHeader, AdminCard } from "../../_components/ui";
import { ProductForm } from "../ProductForm";
import { ImageManager } from "../ImageManager";
import { DeleteProductButton } from "./DeleteProductButton";
import { getCategories } from "@/lib/categories";
import { getProductByIdForAdmin } from "@/lib/products";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([getProductByIdForAdmin(id), getCategories()]);
  if (!product) notFound();

  return (
    <div>
      <AdminPageHeader
        title={product.name}
        description="Edit this product's details, variants, and photos."
        action={<DeleteProductButton productId={product.id} />}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <AdminCard>
          <ProductForm product={product} categories={categories} />
        </AdminCard>

        <AdminCard className="h-fit">
          <h2 className="mb-4 font-serif text-xl text-[#1a1714]">Product Images</h2>
          <ImageManager productId={product.id} images={product.images} />
        </AdminCard>
      </div>
    </div>
  );
}
