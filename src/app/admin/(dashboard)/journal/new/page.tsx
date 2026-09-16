import { AdminPageHeader, AdminCard } from "../../_components/ui";
import { JournalForm } from "../JournalForm";

export default function NewJournalPostPage() {
  return (
    <div>
      <AdminPageHeader title="New Journal Post" />
      <AdminCard>
        <JournalForm />
      </AdminCard>
    </div>
  );
}
