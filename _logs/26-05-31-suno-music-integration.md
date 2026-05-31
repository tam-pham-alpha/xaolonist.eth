# Suno Music Integration

Add Suno-generated music to every dvvv post. Each post can have a VN and/or EN audio track stored locally. A custom player appears at the bottom of the post. Two new pages (`/music` and `/en/music`) list all tracks as a bilingual playlist.

---

## How Suno Downloads Work

Given a share URL like `https://suno.com/s/71sjtJMj4f6HCeei`:
1. The page HTML contains the canonical UUID (e.g. `1efc23e6-ada6-4fff-880a-44b826073cc4`)
2. The direct CDN URL is `https://cdn1.suno.ai/<uuid>.mp3` — public, no auth needed
3. I fetch the page, grep the UUID from the canonical link, then `curl` the MP3

---

## File Storage Convention

```
src/content/blog/<slug>/
├── index.md          ← VN post (lang: "vn")
├── index.en.md       ← EN post (lang: "en")
├── cover.jpg
├── audio.mp3         ← VN music track (referenced in index.md)
├── audio.en.mp3      ← EN music track (referenced in index.en.md)
├── lyrics.lrc        ← Synced line-by-line subtitles in LRC format (optional)
└── lyrics.json       ← Word/character-level subtitles in JSON format (optional)
```

These files are optional. A post can have only VN, only EN, both, or neither.

---

## Proposed Changes

### 1. Content Schema

#### [MODIFY] content.config.ts

Add one optional field to the Zod schema:

```diff
  date: z.string(),
  cover: image(),
+ music: z.string().optional(),   // relative path, e.g. "./audio.mp3"
  lang: z.enum(['vn', 'en']).default('vn'),
```

Note: `music` is a plain string (not `image()`), so Astro won't try to optimize it. The file is served as a static asset directly from the content folder — Astro copies non-processed files into `dist/` at build time.

---

### 2. MusicPlayer Component

#### [NEW] src/components/MusicPlayer.astro

A self-contained HTML5 audio player. Props: `src` (resolved public URL), `title` (post title).

**Design:** Dark, minimal bar matching the site aesthetic:
```
♪  Hắn lại ngứa nghề          ━━━━━●──────────  1:23 / 3:47   ⟳
   [Suno · anh4gs]
```

- Play/pause toggle with smooth icon swap
- Click-to-seek progress bar (thin, gold `#ffc436` accent)
- Time display (current / total)
- Loop toggle
- Suno attribution link
- Pure vanilla JS `<script>` block — no framework dependency

---

### 3. Post Pages — Inline Player

#### [MODIFY] src/pages/blog/[slug].astro
#### [MODIFY] src/pages/en/blog/[slug].astro

Import `MusicPlayer` and render it after the markdown `<Content />`, only when `data.music` exists.

---

### 4. Music Listing Pages

#### [NEW] src/pages/music.astro — `/music` (VN)
#### [NEW] src/pages/en/music.astro — `/en/music` (EN)

- Queries `anh4gs` + correct `lang` + `status: "published"` posts where `data.music` exists
- Sorted newest first
- Each row: cover thumbnail · title + date · MusicPlayer · link to post

---

### 5. NavBar

#### [MODIFY] src/components/NavBar.astro

Add a `music` nav link between `dvvv` and the language switcher.

---

### 6. Automation Scripts

#### [NEW] [download_suno_lyrics.py](file:///Users/phamtam/projects/xaolonist.eth/scripts/download_suno_lyrics.py)
Unified downloader script that uses the `.env` Clerk token to retrieve aligned lyrics (JSON), standard LRC subtitles, and download the MP3 audio file from Suno CDN directly to the post's folder.

---

### 7. CLAUDE.md Documentation

Document: `music` / `lyrics` frontmatter fields, file naming convention, Suno downloader scripts.

---

## Frontmatter Example

```yaml
# index.md (VN)
music: "./audio.mp3"

# index.en.md (EN)
music: "./audio.en.mp3"
```

---

## What's Already Done

- ✅ `download_suno_lyrics.py` updated to resolve public share URLs (e.g. `suno.com/s/<shortid>`) into canonical UUIDs automatically.
- ✅ VN audio track (`audio.mp3`) and timed lyrics (`lyrics.json`, `lyrics.lrc`) downloaded and integrated for `/blog/han-lai-ngua-nghe`.
- ✅ EN audio track (`audio.en.mp3`) and timed lyrics (`lyrics.en.json`, `lyrics.en.lrc`) downloaded and integrated for `/en/blog/han-lai-ngua-nghe`.
- ✅ Frontmatter `music` fields added to both `index.md` and `index.en.md` for `/blog/han-lai-ngua-nghe`.
- ✅ The Suno CDN pattern confirmed: `https://cdn1.suno.ai/<uuid>.mp3`
- ✅ Automation generation and lyrics downloader scripts implemented in `scripts/`

---

## Open Questions

- **Music page title**: `âm nhạc` / `nhạc nền` / something else?
- **NavBar label**: Follow `bnvc`/`dvvv` pattern, or just `music`?
- **Existing posts**: Batch-add audio after build? (Provide Suno links per post)

---

## Verification Plan

```bash
yarn build   # 0 errors
```

- `/blog/han-lai-ngua-nghe` → player at bottom
- `/music` → VN playlist renders
- `/en/music` → EN-only tracks
- Posts without `music` → no player, no errors
