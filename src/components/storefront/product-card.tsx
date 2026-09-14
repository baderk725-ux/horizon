import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

/** Minimal shape ProductCard needs — satisfied structurally by both the
 * homepage's ProductCard type and the shop's ShopProduct type, so neither
 * data-layer module has to import the other's full row shape. */
export type ProductCardData = {
  id: string;
  slug: string;
  name_en: string;
  name_ar: string;
  retail_price: number;
  original_price: number | null;
  stock_quantity: number;
  images: { url: string; sort_order: number }[];
};

export function ProductCard({ product }: { product: ProductCardData }) {
  const t = useTranslations("product");
  const locale = useLocale();
  const name = locale === "ar" ? product.name_ar : product.name_en;
  const image = [...product.images].sort(
    (a, b) => a.sort_order - b.sort_order,
  )[0];
  const outOfStock = product.stock_quantity <= 0;
  const onSale =
    product.original_price !== null &&
    product.original_price > product.retail_price;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block overflow-hidden rounded-(--radius-card) bg-paper shadow-(--shadow-card) transition-shadow duration-300 hover:shadow-(--shadow-card-hover)"
    >
      <div className="relative aspect-square overflow-hidden bg-brand-100">
        {image ? (
          <Image
            src={image.url}
            alt={name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-brand-400">
            {name}
          </div>
        )}
        {onSale && (
          <span className="absolute start-3 top-3 rounded-(--radius-pill) bg-accent-500 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-paper">
            {locale === "ar" ? "تخفيض" : "Sale"}
          </span>
        )}
        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-brand-950/40">
            <span className="rounded-(--radius-pill) bg-paper px-3 py-1 text-xs font-medium text-brand-900">
              {t("outOfStock")}
            </span>
          </div>
        )}
      </div>
      <div className="space-y-1 p-4">
        <h3 className="font-display text-lg text-brand-900">{name}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-medium text-brand-900">
            {product.retail_price.toFixed(2)} {t("currency")}
          </span>
          {onSale && (
            <span className="text-xs text-brand-400 line-through">
              {product.original_price!.toFixed(2)} {t("currency")}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
