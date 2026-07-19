/**
 * Registry of utility tools hosted under /tools.
 *
 * Adding a tool = one entry here + a page under src/pages/tools/. The gallery
 * (src/pages/tools/index.astro) renders from this list. `runtime` documents
 * where the work happens, which decides the wiring:
 *   - client → runs entirely in the browser (no backend)
 *   - edge   → handled in the CF Worker
 *   - nuc    → proxied to the brain on the NUC (heavy binaries / CLI)
 */
export type ToolRuntime = 'client' | 'edge' | 'nuc';

export type ToolCategory = 'media' | 'dev' | 'ai' | 'finance' | 'creator' | 'life';

export type ToolStatus = 'live' | 'beta' | 'soon';

export type Tool = {
  slug: string;
  emoji: string;
  name: { vn: string; en: string };
  description: { vn: string; en: string };
  category: ToolCategory;
  runtime: ToolRuntime;
  status: ToolStatus;
  /** Surface this tool in the home-page "featured tools" row. */
  featured?: boolean;
};

export const TOOLS: Tool[] = [
  {
    slug: 'image-resizer',
    emoji: '🖼️',
    name: { vn: 'Resize ảnh hàng loạt', en: 'Batch Image Resizer' },
    description: {
      vn: 'Kéo thả nhiều ảnh, resize theo kích thước hoặc %, đổi định dạng, tải về dạng zip',
      en: 'Drop many images, resize by size or %, convert format, download as a zip',
    },
    category: 'media',
    runtime: 'nuc',
    status: 'live',
    featured: true,
  },
];

export const FEATURED_TOOLS = TOOLS.filter((t) => t.featured && t.status !== 'soon');

export const CATEGORY_LABEL: Record<ToolCategory, { vn: string; en: string }> = {
  media: { vn: 'Ảnh & Media', en: 'Image & Media' },
  dev: { vn: 'Lập trình', en: 'Developer' },
  ai: { vn: 'AI', en: 'AI' },
  finance: { vn: 'Tài chính', en: 'Finance' },
  creator: { vn: 'Sáng tạo', en: 'Creator' },
  life: { vn: 'Cuộc sống', en: 'Life' },
};

export function getTool(slug: string): Tool | undefined {
  return TOOLS.find((t) => t.slug === slug);
}
