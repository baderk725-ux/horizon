import type { JournalPost } from "./types";

export const journalPosts: JournalPost[] = [
  {
    slug: "warm-timeless-kitchen",
    title: "How to Create a Warm and Timeless Kitchen",
    excerpt:
      "The kitchen is where a home is used most. Here is how to furnish it with pieces that only get better with age.",
    category: "Kitchen",
    date: "2026-08-14",
    image: "kitchen",
    content: [
      "A kitchen that feels timeless rarely relies on trend. It relies on material — the way olive wood darkens with oil, the way stoneware wears at the glaze, the way linen softens with every wash.",
      "Start with the tools you touch daily: a jug for water, a board for bread, a towel for hands. Choose these in materials that age rather than degrade, and the room will feel considered without trying.",
      "Colour follows the same logic. A palette of ivory, sand and charcoal lets natural materials do the talking, and never competes with the food on the table.",
    ],
  },
  {
    slug: "beauty-of-handmade-textures",
    title: "The Beauty of Handmade Textures",
    excerpt:
      "From hand-knotted macramé to hand-thrown ceramics, imperfection is where character lives.",
    category: "Craft",
    date: "2026-07-30",
    image: "macrame",
    content: [
      "Machine-made objects are perfect in a way that handmade objects never try to be. That imperfection — a slightly uneven knot, a glaze that pools differently each time — is what gives a handmade piece its warmth.",
      "When you bring handmade textures into a room, you're not just adding texture. You're adding a record of the hands that made it.",
    ],
  },
  {
    slug: "style-neutral-interior",
    title: "5 Ways to Style a Neutral Interior",
    excerpt:
      "Neutral doesn't mean plain. Here are five ways to build depth into a room without reaching for colour.",
    category: "Interiors",
    date: "2026-07-12",
    image: "home-decor",
    content: [
      "1. Layer textures — pair a jute rug with a linen throw and a stoneware vase.",
      "2. Vary tone within the neutral family — ivory, sand and charcoal read as rich together.",
      "3. Let one sculptural object anchor a shelf.",
      "4. Use natural light as your fourth material.",
      "5. Leave room for negative space — restraint is what makes a neutral room feel intentional rather than empty.",
    ],
  },
  {
    slug: "behind-the-pieces",
    title: "Behind the Pieces",
    excerpt:
      "A closer look at how our stoneware is thrown, glazed and finished before it reaches your table.",
    category: "Craft",
    date: "2026-06-25",
    image: "tableware",
    content: [
      "Every stoneware piece in the NOVEL collection begins on the wheel, thrown by hand in small batches. No two glazes fire quite the same way, which is exactly the point.",
      "We work with makers who value process over speed — which means smaller runs, longer lead times, and pieces that feel made rather than manufactured.",
    ],
  },
];

export function getJournalPost(slug: string) {
  return journalPosts.find((p) => p.slug === slug);
}
