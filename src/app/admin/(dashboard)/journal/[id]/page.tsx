import { notFound } from "next/navigation";
import { AdminPageHeader, AdminCard } from "../../_components/ui";
import { JournalForm } from "../JournalForm";
import { DeleteJournalPostButton } from "./DeleteJournalPostButton";
import { getJournalPostById } from "@/lib/journal";

export default async function EditJournalPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getJournalPostById(id);
  if (!post) notFound();

  return (
    <div>
      <AdminPageHeader title={post.title} action={<DeleteJournalPostButton postId={post.id!} />} />
      <AdminCard>
        <JournalForm post={post} />
      </AdminCard>
    </div>
  );
}
