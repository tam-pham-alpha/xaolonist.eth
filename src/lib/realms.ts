export type RealmSlug = 'forge' | 'pentacles' | 'oracle' | 'all-blue';

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
    slug: 'forge',
    emoji: '⚒️',
    name: 'Forge',
    accent: '#a89070',
    description: {
      vn: 'Nơi rèn năng lực: kỹ thuật, phần mềm, AI, kiến trúc hệ thống và mọi công cụ giúp con người xây dựng thế giới',
      en: 'Where capability is forged: software, AI, systems architecture, and every tool that helps people build the world',
    },
  },
  {
    slug: 'pentacles',
    emoji: '🪙',
    name: 'Pentacles',
    accent: '#9a9568',
    description: {
      vn: 'Thế giới vật chất: tiền bạc, đầu tư, crypto, kinh tế và dòng tiền, nơi công cụ chuyển hóa thành tài sản',
      en: 'The material realm: money, investing, crypto, economics, and cash flow, where tools become assets',
    },
  },
  {
    slug: 'oracle',
    emoji: '🔮',
    name: 'Oracle',
    accent: '#9088a0',
    description: {
      vn: 'Nơi mở rộng nhận thức: hội thoại với LLM, giả thuyết, triết học và những câu hỏi kỳ lạ',
      en: 'Where cognition expands: LLM dialogues, hypotheses, philosophy, and strange questions',
    },
  },
  {
    slug: 'all-blue',
    emoji: '🌊',
    name: 'All Blue',
    accent: '#788ea0',
    description: {
      vn: 'Đích đến cuối cùng: tiểu thuyết, world building và mọi ý tưởng hội tụ thành một thế giới riêng',
      en: 'The final destination: fiction, world building, and every idea converging into a world of your own',
    },
  },
];

export function getRealm(slug: RealmSlug): Realm {
  const realm = REALMS.find((r) => r.slug === slug);
  if (!realm) throw new Error(`Unknown realm: ${slug}`);
  return realm;
}
