import { AdminPageHeader, AdminCard } from "../../_components/ui";
import { CategoryForm } from "../CategoryForm";

export default function NewCategoryPage() {
  return (
    <div>
      <AdminPageHeader title="Add Category" />
      <AdminCard>
        <CategoryForm />
      </AdminCard>
    </div>
  );
}
