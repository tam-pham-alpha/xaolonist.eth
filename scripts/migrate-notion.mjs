#!/usr/bin/env node

/**
 * Migrate Notion export → content/blog/<slug>/index.md
 *
 * Reads:
 *   - notion/Anh4gs *.csv  (metadata)
 *   - notion/Anh4gs/*.md   (content)
 *   - notion/Anh4gs/<subfolder>/ (inline images)
 *   - notion/Anh4gs/<cover>.jpg  (cover images)
 *
 * Writes:
 *   - content/blog/<slug>/index.md
 *   - content/blog/<slug>/cover.<ext>
 *   - content/blog/<slug>/images/<file>
 */

import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const NOTION_DIR = path.join(ROOT, "notion", "Anh4gs");
const CSV_PATH = path.join(
  ROOT,
  "notion",
  "Anh4gs 7a88dbfc4f4046918e3e79237a0d986c.csv"
);
const OUTPUT_DIR = path.join(ROOT, "content", "blog");

// ---------- CSV parser (handles quoted fields, multi-line values, BOM) ----------

function parseCSV(text) {
  // Strip BOM
  if (text.charCodeAt(0) === 0xfeff) {
    text = text.slice(1);
  }

  // Collect logical lines (handling quoted multi-line fields)
  const logicalLines = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') {
      if (inQuotes && text[i + 1] === '"') {
        current += '""';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      current += ch === '"' && !inQuotes && text[i] !== '"' ? "" : "";
      // Actually just append the char as-is for re-parsing
      current += "";
    }

    if (ch === '"') {
      // Already handled above, skip
    } else if ((ch === "\n" || ch === "\r") && !inQuotes) {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      if (current.trim()) logicalLines.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  if (current.trim()) logicalLines.push(current);

  // Oops, the above is getting complicated. Let me just re-do with a cleaner approach.
  // Re-parse from scratch.

  return parseCSVClean(text);
}

function parseCSVClean(text) {
  // Strip BOM
  if (text.charCodeAt(0) === 0xfeff) {
    text = text.slice(1);
  }

  const rows = [];
  let i = 0;

  while (i < text.length) {
    const { row, nextIndex } = parseCSVRow(text, i);
    if (row !== null) rows.push(row);
    i = nextIndex;
  }

  if (rows.length < 2) return [];

  const header = rows[0];
  const result = [];
  for (let r = 1; r < rows.length; r++) {
    const obj = {};
    header.forEach((h, idx) => {
      obj[h.trim()] = (rows[r][idx] || "").trim();
    });
    result.push(obj);
  }
  return result;
}

function parseCSVRow(text, start) {
  const fields = [];
  let i = start;

  while (i < text.length) {
    // Skip leading whitespace (but not newlines)
    // Actually don't skip — CSV is positional

    if (text[i] === "\n" || text[i] === "\r") {
      // End of row
      if (text[i] === "\r" && text[i + 1] === "\n") i++;
      i++;
      if (fields.length === 0) {
        return { row: null, nextIndex: i };
      }
      return { row: fields, nextIndex: i };
    }

    if (text[i] === '"') {
      // Quoted field
      let field = "";
      i++; // skip opening quote
      while (i < text.length) {
        if (text[i] === '"') {
          if (text[i + 1] === '"') {
            field += '"';
            i += 2;
          } else {
            i++; // skip closing quote
            break;
          }
        } else {
          field += text[i];
          i++;
        }
      }
      fields.push(field);
      // Skip comma after field
      if (text[i] === ",") i++;
    } else {
      // Unquoted field
      let field = "";
      while (i < text.length && text[i] !== "," && text[i] !== "\n" && text[i] !== "\r") {
        field += text[i];
        i++;
      }
      fields.push(field);
      // Skip comma
      if (text[i] === ",") i++;
    }
  }

  if (fields.length > 0) {
    return { row: fields, nextIndex: i };
  }
  return { row: null, nextIndex: i };
}

// ---------- Find the matching .md file for a slug ----------

function findMdFile(slug) {
  const files = fs.readdirSync(NOTION_DIR).filter((f) => f.endsWith(".md"));

  for (const file of files) {
    const content = fs.readFileSync(path.join(NOTION_DIR, file), "utf-8");
    const slugMatch = content.match(/^slug:\s*(.+)$/m);
    if (slugMatch && slugMatch[1].trim() === slug) {
      return file;
    }
  }
  return null;
}

// ---------- Parse the Notion .md file ----------

function parseMdFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf-8");
  const lines = raw.split("\n");

  let i = 0;

  // Skip title line (# Title)
  if (lines[i] && lines[i].startsWith("# ")) {
    i++;
  }

  // Skip blank lines after title
  while (i < lines.length && lines[i].trim() === "") {
    i++;
  }

  // Skip pseudo-frontmatter lines (key: value pattern)
  const metaKeys = [
    "summary",
    "slug",
    "cover",
    "author",
    "category",
    "status",
    "publish_date",
    "lang",
  ];
  while (i < lines.length) {
    const line = lines[i].trim();
    if (line === "") {
      i++;
      break;
    }
    const colonIdx = line.indexOf(":");
    if (colonIdx > 0) {
      const key = line.substring(0, colonIdx).trim().toLowerCase();
      if (metaKeys.includes(key)) {
        i++;
        continue;
      }
    }
    break;
  }

  const body = lines.slice(i).join("\n").trim();
  return { body };
}

// ---------- Rewrite image references in body ----------

function rewriteImageRefs(body) {
  return body.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    (match, alt, imgPath) => {
      const decoded = decodeURIComponent(imgPath);

      // If it's a remote URL, leave as-is
      if (decoded.startsWith("http://") || decoded.startsWith("https://")) {
        return match;
      }

      // Extract just the filename
      const fileName = path.basename(decoded);
      return `![${alt}](./images/${fileName})`;
    }
  );
}

// ---------- YAML escape ----------

function yamlEscape(str) {
  if (!str) return '""';
  // Always wrap in double quotes for safety
  return `"${str.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

// ---------- Copy file helper ----------

function copyFile(src, dest) {
  const dir = path.dirname(dest);
  fs.mkdirSync(dir, { recursive: true });

  // Verify src is a file, not a directory
  if (!fs.existsSync(src)) {
    console.log(`    File not found: ${src}`);
    return false;
  }
  const stat = fs.statSync(src);
  if (!stat.isFile()) {
    console.log(`    Not a file (skipping): ${src}`);
    return false;
  }

  fs.copyFileSync(src, dest);
  return true;
}

// ---------- Main ----------

function main() {
  console.log("Reading CSV...");
  const csvText = fs.readFileSync(CSV_PATH, "utf-8");
  const rows = parseCSVClean(csvText);

  console.log(`Found ${rows.length} rows in CSV`);
  console.log(`Headers: ${Object.keys(rows[0]).join(", ")}\n`);

  // Debug first row
  const r0 = rows[0];
  console.log("Sample row 0:");
  for (const [k, v] of Object.entries(r0)) {
    console.log(`  ${k}: ${v.substring(0, 80)}`);
  }
  console.log("");

  // Clean output dir
  if (fs.existsSync(OUTPUT_DIR)) {
    fs.rmSync(OUTPUT_DIR, { recursive: true });
  }
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  let processed = 0;
  let skipped = 0;

  for (const row of rows) {
    const slug = row.slug;
    const name = row.Name;

    if (!slug || !name) {
      console.log(`  SKIP: empty row (Name="${name || ""}", slug="${slug || ""}")`);
      skipped++;
      continue;
    }

    console.log(`Processing: ${slug}`);

    // 1. Find matching .md file
    const mdFile = findMdFile(slug);
    if (!mdFile) {
      console.log(`  WARNING: No .md file found for slug "${slug}"`);
      skipped++;
      continue;
    }

    // 2. Parse the .md file
    const mdPath = path.join(NOTION_DIR, mdFile);
    const { body } = parseMdFile(mdPath);

    // 3. Find inline image subfolder
    // Match by finding the directory whose name matches the md file's title prefix
    const mdBaseName = mdFile.replace(/\s+[a-f0-9]{20,}\.md$/i, "");
    const inlineImgDir = path.join(NOTION_DIR, mdBaseName);
    const hasInlineImages =
      fs.existsSync(inlineImgDir) && fs.statSync(inlineImgDir).isDirectory();

    // 4. Rewrite image references in body
    const rewrittenBody = rewriteImageRefs(body);

    // 5. Resolve cover image
    const coverRef = row.cover; // e.g. "Anh4gs/605749121_...jpg"
    const coverFileName = coverRef ? coverRef.replace(/^Anh4gs\//, "") : null;
    const coverSrc = coverFileName ? path.join(NOTION_DIR, coverFileName) : null;
    const coverExt = coverFileName ? path.extname(coverFileName) : "";

    // 6. Create output directory
    const postDir = path.join(OUTPUT_DIR, slug);
    fs.mkdirSync(postDir, { recursive: true });

    // 7. Copy cover image
    let coverCopied = false;
    if (coverSrc) {
      coverCopied = copyFile(coverSrc, path.join(postDir, `cover${coverExt}`));
    }

    // 8. Copy inline images
    if (hasInlineImages) {
      const imgFiles = fs.readdirSync(inlineImgDir);
      for (const img of imgFiles) {
        const imgSrc = path.join(inlineImgDir, img);
        if (fs.statSync(imgSrc).isFile()) {
          copyFile(imgSrc, path.join(postDir, "images", img));
        }
      }
    }

    // 9. Build YAML frontmatter
    const frontmatterLines = [
      "---",
      `slug: ${yamlEscape(slug)}`,
      `title: ${yamlEscape(name)}`,
      `summary: ${yamlEscape(row.summary || "")}`,
      `author: ${yamlEscape(row.author || "Tam Pham")}`,
      `category: ${yamlEscape(row.category || "blog")}`,
      `status: ${yamlEscape(row.status || "published")}`,
      `date: ${yamlEscape(row.publish_date || "")}`,
    ];

    if (coverCopied && coverExt) {
      frontmatterLines.push(`cover: "./cover${coverExt}"`);
    }
    if (row.lang) {
      frontmatterLines.push(`lang: ${yamlEscape(row.lang)}`);
    }
    frontmatterLines.push("---");

    const frontmatter = frontmatterLines.join("\n");

    // 10. Write index.md
    const output = `${frontmatter}\n\n${rewrittenBody}\n`;
    fs.writeFileSync(path.join(postDir, "index.md"), output, "utf-8");

    processed++;
    console.log(`  ✓ ${slug} (cover: ${coverCopied}, inline: ${hasInlineImages})`);
  }

  console.log(`\nDone! Processed: ${processed}, Skipped: ${skipped}`);
}

main();
