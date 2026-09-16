import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { getProducts } from "@/lib/products";
import { getCategories } from "@/lib/categories";

export default async function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-charcoal focus:px-4 focus:py-2 focus:text-ivory"
      >
        Skip to content
      </a>
      <Header searchProducts={products} searchCategories={categories} />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
