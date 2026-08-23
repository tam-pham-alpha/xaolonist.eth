export type RealmSlug = "forge" | "pentacles" | "the-way" | "all-blue";

export type Realm = {
  slug: RealmSlug;
  emoji: string;
  name: string;
  /** Muted accent for dark UI (cards, chips) — readable, not loud */
  accent: string;
  description: { vn: string; en: string };
};

export const REALMS: Realm[] = [
  {
    slug: "forge",
    emoji: "⚒️",
    name: "Forge",
    // Silver primary with a cool ice-blue undertone for chips/cards
    accent: "#9aa6b4",
    description: {
      vn: "Nơi rèn năng lực: kỹ thuật, phần mềm, AI, kiến trúc hệ thống và mọi công cụ giúp con người xây dựng thế giới",
      en: "Where capability is forged: software, AI, systems architecture, and every tool that helps people build the world",
    },
  },
  {
    slug: "pentacles",
    emoji: "🪙",
    name: "Pentacles",
    accent: "#9a9568",
    description: {
      vn: "Thế giới vật chất: tiền bạc, đầu tư, crypto, kinh tế và dòng tiền, nơi công cụ chuyển hóa thành tài sản",
      en: "The material realm: money, investing, crypto, economics, and cash flow, where tools become assets",
    },
  },
  {
    slug: "the-way",
    emoji: "☯️",
    name: "The Way",
    // Soft muted violet — matches the-way cover accent (hat-giong-moi)
    accent: "#9a88a8",
    description: {
      vn: "Con đường tu dưỡng nội lực: tu tâm, nhân quả, tỉnh thức, năng lượng và hành trình trở thành người đủ sáng để nhìn mọi việc rõ ràng",
      en: "The path of inner cultivation: mindfulness, karma, awakening, energy, and becoming clear-eyed enough to see things as they are",
    },
  },
  {
    slug: "all-blue",
    emoji: "🌊",
    name: "All Blue",
    accent: "#788ea0",
    description: {
      vn: "Đích đến cuối cùng: tân thế giới - Đông Hải Đại Đồ - Tiểu thuyết",
      en: "The final destination: new world - The East Sea Grand Order - Fiction",
    },
  },
];

export function getRealm(slug: RealmSlug): Realm {
  const realm = REALMS.find((r) => r.slug === slug);
  if (!realm) throw new Error(`Unknown realm: ${slug}`);
  return realm;
}
