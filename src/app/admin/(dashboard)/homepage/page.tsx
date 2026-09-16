import { AdminPageHeader, AdminCard } from "../_components/ui";
import { HeroSectionForm } from "./HeroSectionForm";
import { EditorialSectionForm } from "./EditorialSectionForm";
import { getHomepageContent } from "@/lib/homepage";

export default async function AdminHomepagePage() {
  const content = await getHomepageContent();

  return (
    <div>
      <AdminPageHeader
        title="Homepage Content"
        description="Edit the copy and links used across the homepage sections. Changes appear on the live site immediately."
      />

      <div className="flex flex-col gap-6">
        <AdminCard>
          <h2 className="mb-4 font-serif text-xl text-[#1a1714]">Hero</h2>
          <HeroSectionForm content={content.hero} />
        </AdminCard>

        <AdminCard>
          <EditorialSectionForm
            title="Featured Collection"
            sectionKey="featured_collection"
            content={content.featured_collection}
          />
        </AdminCard>

        <AdminCard>
          <EditorialSectionForm title="Editorial Section" sectionKey="editorial" content={content.editorial} />
        </AdminCard>

        <AdminCard>
          <EditorialSectionForm title="Brand Story" sectionKey="brand_story" content={content.brand_story} />
        </AdminCard>
      </div>
    </div>
  );
}
