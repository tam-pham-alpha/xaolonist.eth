export const normalizeNotionFrontMatter = (frontmatter: any) => {
  return {
    slug: frontmatter.slug,
    status: frontmatter.status?.name || "published",
    title: frontmatter.title,
    author: frontmatter.author?.name || "anh4gs",
    category: frontmatter.category?.name || "uncategorized",
    cover: frontmatter.cover?.[0]?.file?.url,
    date: frontmatter.publish_date?.start || new Date().toISOString(),
    summary: frontmatter.summary || "",
  };
};
