import type { Metadata } from "next";
import { CartPageClient } from "@/components/cart/CartPageClient";

export const metadata: Metadata = {
  title: "Your Bag",
  description: "Review the items in your NOVEL shopping bag before checkout.",
};

export default function CartPage() {
  return <CartPageClient />;
}
