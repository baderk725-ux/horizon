import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ShopClient } from "@/components/shop/ShopClient";
import { products } from "@/lib/products";

export const metadata: Metadata = {
  title: "Shop All",
  description: "Browse the full NOVEL collection — kitchen, macramé, rugs, home decor, tableware, textiles and gifts.",
};

export default function ShopPage() {
  return (
    <div className="container-editorial py-10 md:py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Shop" }]} />
      <div className="mt-6 max-w-2xl">
        <h1 className="font-serif text-4xl md:text-5xl">Shop All</h1>
        <p className="mt-4 text-base leading-relaxed text-stone">
          Every piece in the NOVEL collection, chosen for material, craft and how it lives in a
          home over time.
        </p>
      </div>
      <div className="mt-10">
        <ShopClient products={products} />
      </div>
    </div>
  );
}
