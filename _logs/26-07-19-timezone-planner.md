# Timezone Planner — client tool (World Time Buddy–style)

> **Status: BUILT 26-07-19 — chờ QA + deploy.** Second tool on the platform; validates the `runtime: 'client'` path from [`00-00-00-tools-platform-architecture.md`](./00-00-00-tools-platform-architecture.md). Reference UX: [worldtimebuddy.com](https://www.worldtimebuddy.com/).
>
> **Decisions taken at build (plan defaults):** featured **on** · default cities **HCM + London + New York** · range-select **in v1** · name **Lịch timezone / Timezone Planner** · default clock **24h** (VN convention; toggle to 12h). Landed: `src/lib/tools.ts`, `src/lib/timezone-cities.ts` (~100 hubs + IANA fallback search), `src/components/tools/TimezonePlanner.astro`, `src/pages/tools/timezone-planner.astro`, `src/pages/en/tools/timezone-planner.astro`. `yarn typecheck` + `yarn build` green; DST math verified (London −6 summer/−7 winter, India −1.5, spring-forward skips 01:00, fall-back repeats 01:00).

## Goal

Một planner timezone cho team quốc tế: xếp nhiều thành phố theo hàng, mỗi hàng một dải 24 giờ thẳng hàng dọc, hover/click một cột là thấy giờ tương ứng ở mọi nơi — chọn khung giờ họp chung nhanh, không login, không backend.

## Tier

| Field | Value |
|-------|--------|
| `runtime` | **`client`** (browser only — `Intl` / IANA TZDB trong engine) |
| `category` | `life` |
| `slug` | `timezone-planner` |
| `status` | `live` (sau khi ship) |
| `featured` | `true` (candidate — xác nhận khi approve) |

Không đụng Worker / brain / NUC.

## UX (MVP = core của WTB, không clone branding)

```text
[+ Place or timezone]     [date strip: -3 … today … +3]     [12h|24h]  [Copy link]

┌─ Ho Chi Minh · GMT+7 · 9:56p · Sun Jul 19  🏠 ─────┐
│  … |10p|11p|12a|1a|…|8a|9a|…|8p|9p*|10p|…          │  ← night / day shading
└────────────────────────────────────────────────────┘
┌─ London · BST · −6 · 3:56p · Sun Jul 19 ───────────┐
│  … |3p|4p|5p|…|2p|3p*|4p|…                         │  ← same column highlighted
└────────────────────────────────────────────────────┘
```

### In scope (v1)

1. **Add / remove cities** — combobox search trên curated city list (~80–120 hubs: HN, HCM, SG, Tokyo, London, NYC, SF, Berlin, Dubai, Sydney…) map → IANA (`Asia/Ho_Chi_Minh`, …)
2. **Home city** — hàng đầu (hoặc icon 🏠); offset các hàng khác tính relative so với home
3. **Reorder** — nút ↑↓ (kéo thả optional nếu rẻ; không bắt buộc v1)
4. **Synced 24h grid** — mỗi hàng 24 ô giờ; hover + click highlight **cột dọc** đồng bộ mọi hàng; hiện giờ local của từng ô
5. **Day / night shading** — đêm tối hơn (vd. 22:00–06:00 local), ngày sáng hơn; optional band “giờ làm việc” 09–18 hơi nhấn (settings toggle, default on)
6. **Date strip** — chọn ngày quanh hôm nay; DST theo ngày đã chọn (không chỉ “now”)
7. **12h / 24h toggle**
8. **Shareable URL** — `?z=Asia/Ho_Chi_Minh,Europe/London&d=2026-07-19&home=0&fmt=12` + nút copy; mở link khôi phục view
9. **localStorage** — nhớ danh sách + prefs khi không có query
10. **Bilingual** — `/tools/timezone-planner` + `/en/tools/timezone-planner`, island `lang` prop (pattern ImageResizer)
11. **Range select (nhẹ)** — click-drag hoặc click start→end một khối giờ trên home row → hiện summary “HCM 9–11p = London 3–5p” + copy text / giữ trong share URL (`&from=21&to=23`)

### Out of scope (v1)

- Sign-in, Google/Outlook calendar export
- Full world geonames dump (chỉ curated hubs + raw IANA zone search fallback)
- Widget embed, mobile native app
- Meeting “best slot” AI scoring
- NavBar `/tools` link (đã có open item riêng trên north-star)

## Technical approach

| Piece | Choice |
|-------|--------|
| Time math | Native `Intl` + `Temporal` if available, else `Date` + `Intl.DateTimeFormat` with `timeZone` — **no moment/luxon** unless DST edge cases force a tiny helper |
| City data | Static JSON/TS module `src/lib/timezone-cities.ts` — `{ name, country, tz, aliases[] }` |
| Component | `src/components/tools/TimezonePlanner.astro` — markup + `<script>` island (same pattern as ImageResizer) |
| Layout width | Page `max-w` wider than image-resizer (~1100–1200px) vì grid ngang |
| Mobile | Label cột sticky trái; hour grid `overflow-x-auto`; tap = highlight cột |
| Persistence | `localStorage` key `anh4gs.tz-planner.v1` |
| A11y | keyboard: ←/→ move highlight hour; Esc clear selection |

### Files to add / touch

```text
src/lib/tools.ts                              # registry entry
src/lib/timezone-cities.ts                    # curated cities (+ IANA fallback list)
src/components/tools/TimezonePlanner.astro    # island UI + logic
src/pages/tools/timezone-planner.astro        # VN page
src/pages/en/tools/timezone-planner.astro     # EN page
_logs/00-00-00-tools-platform-architecture.md # tick next-tool item / note shipped
```

No worker / brain changes.

## Implementation steps

- [x] **1.** Registry entry in `tools.ts` (`life`, `client`, `featured: true`)
- [x] **2.** `timezone-cities.ts` — ~100 curated hubs + `searchZones` (name / country / alias / tz id) with IANA fallback
- [x] **3.** Island shell — add/remove/reorder(↑↓)/home(★), live clock tick 30s
- [x] **4.** Hour grid — 24 cells/row for selected date; day/night/work shading; synced hover + click, keyboard ←/→ + Esc
- [x] **5.** Date strip (−1…+3) + native date input + 12h/24h + work-hours toggle
- [x] **6.** Range select (click/drag on any row) + meeting summary + copy summary
- [x] **7.** URL ↔ state (`z,d,home,fmt,from,to`, live `replaceState`) + localStorage (`anh4gs.tz-planner.v1`)
- [x] **8.** VN + EN pages; gallery + home featured row pick up automatically
- [ ] **9.** Manual QA matrix (DST London summer/winter, HCM↔SF, share link round-trip, mobile scroll) — DST/offset math auto-verified in Node; browser interaction QA pending
- [x] **10.** Update north-star open item: second tool = timezone-planner

## Design notes (site fit)

- Dark canvas `#0b0b0f`, accent `#ffc436` — không copy palette xanh của WTB
- Không card-stack nặng; một composition: toolbar + stacked rows
- Hour cells: subtle night tint, day tint, selected column border/glow nhẹ (không neon tím)
- Typography theo site hiện tại (Inter trong theme) — tool UI pragmatic, không hero marketing

## Open questions (cần trả lời trước khi code)

1. **Featured trên homepage?** Default đề xuất: **có** (tool viral, zero cost)
2. **Default cities khi lần đầu mở?** Đề xuất: `Asia/Ho_Chi_Minh` + `Europe/London` + `America/New_York` (team quốc tế hay gặp)
3. **Range select trong v1 hay để v1.1?** Đề xuất: **có trong v1** — đây là lý do người ta dùng WTB để book họp
4. **Tên hiển thị:** `Timezone planner` / `Lịch timezone` — OK hay muốn tên khác (vd. `Meeting timezone`)?

## Verify

```bash
yarn typecheck
yarn build
# manual: /tools/timezone-planner — add cities, hover sync, DST date, copy link, EN mirror
```

## Deploy

Client-only → push `main` đủ (Workers Builds). Không cần `git pull` / pm2 trên NUC cho tool này.
