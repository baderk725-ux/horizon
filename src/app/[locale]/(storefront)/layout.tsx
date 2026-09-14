import { Header } from "@/components/storefront/header";
import { Footer } from "@/components/storefront/footer";
import { getCurrentUser } from "@/lib/data/auth";

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const current = await getCurrentUser();

  return (
    <>
      <Header current={current} />
      <main>{children}</main>
      <Footer />
    </>
  );
}
