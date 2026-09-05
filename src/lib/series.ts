import { getCollection, type CollectionEntry } from 'astro:content';

type Post = CollectionEntry<'blog'>;

export const SERIES: Record<string, {
  title: string;
  titleEn?: string;
  sourceUrl?: string;
  sourceLabel?: string;
  sourceLabelEn?: string;
}> = {
  'nhan-thuc-tinh-the': {
    title: 'Nhận thức tình thế',
    titleEn: 'Situational Awareness',
    sourceUrl: 'https://situational-awareness.ai/wp-content/uploads/2024/06/situationalawareness.pdf',
    sourceLabel: 'Bản Gốc - Situational Awareness',
    sourceLabelEn: 'Original - Situational Awareness',
  },
};

export function seriesTitle(id: string, lang: Post['data']['lang'] = 'vn'): string {
  const series = SERIES[id];
  if (!series) return id;
  return lang === 'en' ? (series.titleEn ?? series.title) : series.title;
}

export function seriesSource(id: string, lang: Post['data']['lang'] = 'vn') {
  const series = SERIES[id];
  if (!series?.sourceUrl) return undefined;
  return {
    url: series.sourceUrl,
    label: lang === 'en'
      ? (series.sourceLabelEn ?? series.sourceLabel ?? 'Read the original')
      : (series.sourceLabel ?? 'Đọc bản gốc'),
  };
}

export function navLabel(post: Post): string {
  return post.data.navTitle ?? post.data.title;
}

export async function getSeriesPosts(series: string, lang: Post['data']['lang']): Promise<Post[]> {
  const posts = await getCollection(
    'blog',
    ({ data }) =>
      data.status === 'published' && data.series === series && data.lang === lang,
  );

  return posts.sort((a, b) => {
    const aOrder = a.data.seriesOrder ?? Number.MAX_SAFE_INTEGER;
    const bOrder = b.data.seriesOrder ?? Number.MAX_SAFE_INTEGER;
    if (aOrder !== bOrder) return aOrder - bOrder;
    return a.data.date.localeCompare(b.data.date);
  });
}

export function seriesItems(posts: Post[], currentSlug: string) {
  return posts.map((post) => ({
    href: post.data.lang === 'en' ? `/en/blog/${post.data.slug}/` : `/blog/${post.data.slug}/`,
    label: navLabel(post),
    current: post.data.slug === currentSlug,
  }));
}
