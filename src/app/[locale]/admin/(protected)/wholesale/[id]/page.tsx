import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getAdminWholesaleApplicationById, getWholesaleDocumentUrl } from "@/lib/data/admin/wholesale";
import { WholesaleDecisionActions } from "@/components/admin/wholesale-decision-actions";

export default async function AdminWholesaleDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const application = await getAdminWholesaleApplicationById(id);
  if (!application) notFound();

  const t = await getTranslations("adminWholesale");
  const documentUrl = await getWholesaleDocumentUrl(application.commercial_document_path);
  const dateFormatter = new Intl.DateTimeFormat("en-JO", { dateStyle: "medium", timeStyle: "short" });

  return (
    <div className="max-w-2xl space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-display-sm text-brand-900">{application.company_name}</h1>
        <span
          className={`rounded-(--radius-pill) px-3 py-1 text-xs font-medium ${
            application.status === "approved"
              ? "bg-green-100 text-green-800"
              : application.status === "rejected"
                ? "bg-red-100 text-red-800"
                : "bg-amber-100 text-amber-800"
          }`}
        >
          {t(`status.${application.status}`)}
        </span>
      </div>

      <WholesaleDecisionActions applicationId={application.id} currentStatus={application.status} />

      <section className="rounded-(--radius-card) border border-brand-200 bg-paper p-6">
        <h2 className="font-display text-lg text-brand-900">{t("applicationDetails")}</h2>
        <dl className="mt-3 space-y-1 text-sm">
          <div className="flex justify-between">
            <dt className="text-brand-500">{t("contactName")}</dt>
            <dd className="text-brand-900">{application.full_name}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-brand-500">{t("phone")}</dt>
            <dd className="text-brand-900">{application.phone}</dd>
          </div>
          {application.email && (
            <div className="flex justify-between">
              <dt className="text-brand-500">{t("email")}</dt>
              <dd className="text-brand-900">{application.email}</dd>
            </div>
          )}
          <div className="pt-1">
            <dt className="text-brand-500">{t("address")}</dt>
            <dd className="mt-0.5 text-brand-900">
              {application.address}
              {application.area_text ? `, ${application.area_text}` : ""}
            </dd>
          </div>
          <div className="flex justify-between pt-1">
            <dt className="text-brand-500">{t("commercialRegistrationNumber")}</dt>
            <dd className="text-brand-900">{application.commercial_registration_number}</dd>
          </div>
          {documentUrl && (
            <div className="flex justify-between pt-1">
              <dt className="text-brand-500">{t("commercialDocument")}</dt>
              <dd>
                <a href={documentUrl} target="_blank" rel="noopener noreferrer" className="text-brand-700 underline">
                  {t("viewDocument")}
                </a>
              </dd>
            </div>
          )}
          {application.notes && (
            <div className="pt-1">
              <dt className="text-brand-500">{t("wholesaleNotes")}</dt>
              <dd className="mt-0.5 text-brand-900">{application.notes}</dd>
            </div>
          )}
          <div className="flex justify-between border-t border-brand-200 pt-2 text-xs text-brand-500">
            <span>{t("submitted")}</span>
            <span>{dateFormatter.format(new Date(application.created_at))}</span>
          </div>
          {application.reviewed_at && (
            <div className="flex justify-between text-xs text-brand-500">
              <span>{t("reviewed")}</span>
              <span>{dateFormatter.format(new Date(application.reviewed_at))}</span>
            </div>
          )}
        </dl>
      </section>

      {application.status === "approved" && application.user_id && (
        <Link
          href={`/admin/wholesale/customers/${application.user_id}`}
          className="inline-block text-sm font-medium text-brand-700 hover:underline"
        >
          {t("viewLedger")}
        </Link>
      )}
    </div>
  );
}
