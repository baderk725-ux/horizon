import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";

export function ProductRail({ products }: { products: Product[] }) {
  return (
    <div className="-mx-4 flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-4 no-scrollbar md:mx-0 md:grid md:grid-cols-4 md:gap-8 md:overflow-visible md:px-0">
      {products.map((product) => (
        <div key={product.id} className="w-[70vw] shrink-0 snap-start sm:w-[42vw] md:w-auto">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
