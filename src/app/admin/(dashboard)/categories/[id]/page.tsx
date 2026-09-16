import { notFound } from "next/navigation";
import { AdminPageHeader, AdminCard } from "../../_components/ui";
import { CategoryForm } from "../CategoryForm";
import { DeleteCategoryButton } from "./DeleteCategoryButton";
import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/lib/types";

async function getCategoryById(id: string): Promise<Category | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("categories").select("*").eq("id", id).maybeSingle();
  if (error || !data) return null;
  return {
    id: data.id,
    slug: data.slug,
    name: data.name,
    description: data.description,
    placeholderIcon: data.placeholder_icon,
    placeholderTone: data.placeholder_tone,
    imageUrl: data.image_url,
    sortOrder: data.sort_order,
  };
}

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = await getCategoryById(id);
  if (!category) notFound();

  return (
    <div>
      <AdminPageHeader
        title={category.name}
        action={<DeleteCategoryButton categoryId={category.id} />}
      />
      <AdminCard>
        <CategoryForm category={category} />
      </AdminCard>
    </div>
  );
}
