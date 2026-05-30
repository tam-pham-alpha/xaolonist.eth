import { visit } from 'unist-util-visit';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Remark plugin that strips image nodes with relative src paths
 * pointing to files that don't exist on disk.
 * 
 * This handles legacy content migrated from Notion where image
 * references may be broken (images were never downloaded).
 */
export function remarkStripMissingImages() {
  return (tree, file) => {
    const filePath = file.history[0];
    if (!filePath) return;

    const fileDir = path.dirname(filePath);

    visit(tree, 'image', (node, index, parent) => {
      const src = node.url;
      // Only check relative paths (not external URLs or absolute paths)
      if (src && !src.startsWith('http') && !src.startsWith('/')) {
        const absPath = path.resolve(fileDir, src);
        if (!fs.existsSync(absPath)) {
          // Replace the image node with a paragraph containing the alt text
          // or remove it entirely if no alt text
          if (parent && typeof index === 'number') {
            parent.children.splice(index, 1);
            return index; // revisit at same index since we removed
          }
        }
      }
    });
  };
}
