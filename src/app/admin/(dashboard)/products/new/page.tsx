import { AdminPageHeader, AdminCard } from "../../_components/ui";
import { ProductForm } from "../ProductForm";
import { getCategories } from "@/lib/categories";

export default async function NewProductPage() {
  const categories = await getCategories();
  return (
    <div>
      <AdminPageHeader title="Add Product" description="Create a new product. You can add photos after saving." />
      <AdminCard>
        <ProductForm categories={categories} />
      </AdminCard>
    </div>
  );
}
