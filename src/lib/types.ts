export type CategorySlug =
  | "kitchen"
  | "macrame"
  | "rugs"
  | "home-decor"
  | "tableware"
  | "textiles"
  | "gifts";

export interface Category {
  slug: CategorySlug;
  name: string;
  description: string;
  image: string;
}

export interface ProductVariant {
  id: string;
  label: string;
  swatch?: string;
  priceModifier?: number;
  inStock: boolean;
}

export type PlaceholderIcon =
  | "kitchen"
  | "macrame"
  | "rugs"
  | "home-decor"
  | "tableware"
  | "textiles"
  | "gifts";

export type PlaceholderTone = "ivory" | "sand" | "taupe" | "charcoal";

export interface ProductImage {
  alt: string;
  icon: PlaceholderIcon;
  tone: PlaceholderTone;
}

export interface Review {
  rating: number;
  count: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  price: number;
  compareAtPrice?: number;
  currency: string;
  shortDescription: string;
  description: string;
  images: ProductImage[];
  variants?: ProductVariant[];
  materials: string[];
  dimensions: string;
  care: string[];
  shipping: string;
  badge?: "New" | "Best Seller" | "Limited";
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  inStock: boolean;
  review?: Review;
}

export interface JournalPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image: PlaceholderIcon;
  content: string[];
}

export interface CartLine {
  productId: string;
  variantId?: string;
  quantity: number;
}
