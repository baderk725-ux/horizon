import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getAllCategories, getCategoryById } from "@/lib/data/admin/categories";
import { CategoryForm } from "@/components/admin/category-form";

export default async function EditCategoryPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const [category, categories] = await Promise.all([
    getCategoryById(id),
    getAllCategories(),
  ]);

  if (!category) notFound();

  const t = await getTranslations("adminCategories");

  return (
    <div className="max-w-lg">
      <h1 className="font-display text-display-sm text-brand-900">
        {t("editCategory")}
      </h1>
      <div className="mt-6 rounded-(--radius-card) border border-brand-200 bg-paper p-6">
        <CategoryForm category={category} parentOptions={categories} />
      </div>
    </div>
  );
}
