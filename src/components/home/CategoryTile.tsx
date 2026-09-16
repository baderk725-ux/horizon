import Link from "next/link";
import type { Category } from "@/lib/types";
import { EditorialImage } from "@/components/EditorialImage";

export function CategoryTile({ category }: { category: Category }) {
  return (
    <Link href={`/shop/${category.slug}`} className="group relative block aspect-[3/4] overflow-hidden bg-cream">
      <div className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105">
        <EditorialImage icon={category.slug} tone="sand" alt={category.name} className="h-full w-full" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-espresso/60 via-transparent to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6">
        <h3 className="font-serif text-2xl text-ivory">{category.name}</h3>
        <span className="mt-2 inline-block text-xs uppercase tracking-[0.14em] text-ivory/80 transition-transform duration-300 group-hover:translate-x-1">
          Explore →
        </span>
      </div>
    </Link>
  );
}
