import type { Category } from "./types";

export const categories: Category[] = [
  {
    slug: "kitchen",
    name: "Kitchen",
    description:
      "Considered tools for the everyday ritual of cooking — cast iron, olive wood, and hand-glazed stoneware.",
    image: "kitchen",
  },
  {
    slug: "macrame",
    name: "Macramé",
    description:
      "Hand-knotted cotton and jute, each piece carrying the texture of the hands that made it.",
    image: "macrame",
  },
  {
    slug: "rugs",
    name: "Rugs",
    description:
      "Natural fibre rugs woven in small batches — the quiet foundation of a considered room.",
    image: "rugs",
  },
  {
    slug: "home-decor",
    name: "Home Decor",
    description:
      "Sculptural objects and vessels that give a room its character, one surface at a time.",
    image: "home-decor",
  },
  {
    slug: "tableware",
    name: "Tableware",
    description:
      "Stoneware, glass and linen for a table set with intention, from breakfast to the last course.",
    image: "tableware",
  },
  {
    slug: "textiles",
    name: "Textiles",
    description:
      "Washed linen and brushed cotton — throws, cushions and bedding made to soften with time.",
    image: "textiles",
  },
  {
    slug: "gifts",
    name: "Gifts",
    description:
      "Thoughtfully wrapped pieces for the people who notice the details.",
    image: "gifts",
  },
];

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}
