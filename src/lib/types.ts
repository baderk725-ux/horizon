export type CategorySlug = string;

export type PlaceholderIcon =
  | "kitchen"
  | "macrame"
  | "rugs"
  | "home-decor"
  | "tableware"
  | "textiles"
  | "gifts";

export type PlaceholderTone = "ivory" | "sand" | "taupe" | "charcoal";

export interface Category {
  id: string;
  slug: CategorySlug;
  name: string;
  description: string;
  placeholderIcon: PlaceholderIcon;
  placeholderTone: PlaceholderTone;
  imageUrl?: string | null;
  sortOrder: number;
}

export interface ProductVariant {
  id: string;
  label: string;
  swatch?: string | null;
  priceModifier?: number;
  inStock: boolean;
}

export interface ProductImage {
  id?: string;
  url?: string | null;
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
  categoryId?: string;
  price: number;
  compareAtPrice?: number | null;
  currency: string;
  shortDescription: string;
  description: string;
  images: ProductImage[];
  variants?: ProductVariant[];
  materials: string[];
  dimensions: string;
  care: string[];
  shipping: string;
  badge?: "New" | "Best Seller" | "Limited" | null;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isFeatured?: boolean;
  isPublished?: boolean;
  inStock: boolean;
  review?: Review;
  seoTitle?: string | null;
  seoDescription?: string | null;
}

export interface JournalPost {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image: PlaceholderIcon;
  content: string[];
  isPublished?: boolean;
  seoTitle?: string | null;
  seoDescription?: string | null;
}

export interface CartItem {
  productId: string;
  variantId?: string;
  quantity: number;
  name: string;
  slug: string;
  price: number;
  currency: string;
  variantLabel?: string;
  image: ProductImage;
}

export interface HeroContent {
  eyebrow: string;
  heading: string;
  primaryCta: string;
  primaryHref: string;
  secondaryCta: string;
  secondaryHref: string;
}

export interface EditorialSectionContent {
  eyebrow: string;
  heading: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface HomepageContent {
  hero: HeroContent;
  featured_collection: EditorialSectionContent;
  brand_story: EditorialSectionContent;
  editorial: EditorialSectionContent;
}

export interface SiteSettings {
  siteName: string;
  seoTitle: string;
  seoDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  instagramUrl: string;
  facebookUrl: string;
  tiktokUrl: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  createdAt: string;
}
