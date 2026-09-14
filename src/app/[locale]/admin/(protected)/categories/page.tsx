import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getAllCategories } from "@/lib/data/admin/categories";
import { CategoryForm } from "@/components/admin/category-form";
import { DeleteCategoryButton } from "@/components/admin/delete-category-button";

export default async function AdminCategoriesPage() {
  const t = await getTranslations("adminCategories");
  const locale = await getLocale();
  const categories = await getAllCategories();
  const byId = new Map(categories.map((c) => [c.id, c]));

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-display-sm text-brand-900">{t("title")}</h1>

        {categories.length === 0 ? (
          <p className="mt-6 text-sm text-brand-500">{t("empty")}</p>
        ) : (
          <div className="mt-6 overflow-hidden rounded-(--radius-card) border border-brand-200 bg-paper">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-brand-200">
                {categories.map((category) => {
                  const parent = category.parent_id
                    ? byId.get(category.parent_id)
                    : null;
                  const name = locale === "ar" ? category.name_ar : category.name_en;
                  const parentName = parent
                    ? locale === "ar"
                      ? parent.name_ar
                      : parent.name_en
                    : null;

                  return (
                    <tr key={category.id}>
                      <td className="px-5 py-4">
                        <p className="font-medium text-brand-900">{name}</p>
                        <p className="text-xs text-brand-500">
                          /{category.slug}
                          {parentName ? ` · ${t("subcategoryOf", { parent: parentName })}` : ""}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-end">
                        <div className="inline-flex items-center gap-4">
                          <Link
                            href={`/admin/categories/${category.id}`}
                            className="text-sm font-medium text-brand-700 hover:underline"
                          >
                            {t("edit")}
                          </Link>
                          <DeleteCategoryButton id={category.id} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="max-w-lg rounded-(--radius-card) border border-brand-200 bg-paper p-6">
        <h2 className="font-display text-lg text-brand-900">{t("newCategory")}</h2>
        <div className="mt-4">
          <CategoryForm parentOptions={categories} />
        </div>
      </div>
    </div>
  );
}
