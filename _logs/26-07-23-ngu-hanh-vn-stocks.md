# Ngũ hành × Chứng khoán VN — Atlas micro-module

> **Status: IDEA / module note.** Dated log — không dùng prefix `00-00-00` (reserved for evergreen north-stars).
>
> **Parent:** [`00-00-00-interactive-architecture-atlas.md`](./00-00-00-interactive-architecture-atlas.md) — Interactive Architecture Atlas.
>
> Module này chỉ là **một phần nhỏ** trong Atlas: cùng pattern “chọn → xem kết quả”, dùng để thử UX / Oracle flavor. Catalog kiến trúc hệ thống (chat, notification, market-data, …) vẫn là trọng tâm Atlas.
>
> Date: 2026-07-23

## Positioning (trong Atlas)

> **Chọn hành. Xem vốn chảy vào ngành nào.**

Một micro-atlas kết hợp **ngũ hành** (Kim · Mộc · Thủy · Hỏa · Thổ) với **thị trường chứng khoán Việt Nam** — không phải bói toán giá, không phải khuyến nghị mua bán. Mục tiêu: trực quan hóa ánh xạ ngành → hành, rồi xếp hạng bằng market cap thực.

## Interaction model (MVP)

```text
┌─ Vận Ly Hỏa ────────────────────────────────┐
│  火 + mô tả + link All-in trên câu Neo VIC + bảng 20 mã │
└─────────────────────────────────────────────┘
┌─ Ngũ hành ──────────────────────────────────┐
│   [Kim]  [Mộc]  [Thủy]  [Hỏa]  [Thổ]        │
│   → Top 10 mã theo hành đã chọn             │
└─────────────────────────────────────────────┘
```

1. **Trên:** basket Vận Ly Hỏa (luôn hiện).
2. **Dưới:** năm biểu tượng ngũ hành — chọn một → bảng 10 mã.
3. Không còn nút chuyển chế độ.

**Không** cần ở v1: realtime price tick, chart, login, AI, editor.

## Ánh xạ ngành → hành (cổ điển)

Quy ước cố định trong product; đổi mapping = đổi version data, không “đoán” runtime.

| Hành | Ngành gán | Lý do ngắn |
|------|-----------|------------|
| **Kim** | Ngân hàng, chứng khoán, bảo hiểm, thép, kim loại, trang sức | Kim loại · tiền · công cụ tài chính |
| **Mộc** | Cao su, nông nghiệp, dược, sữa/thực phẩm từ thực vật | Cây · sinh trưởng · dược thảo |
| **Thủy** | Đồ uống, hàng không/du lịch, logistics cảng/vận tải biển, thủy sản, nước | Lưu thông · nước · dịch vụ lưu động |
| **Hỏa** | Khí/dầu/điện, lọc hóa, công nghệ, bán lẻ điện tử | Năng lượng · nhiệt · tín hiệu/tech |
| **Thổ** | Bất động sản, khu công nghiệp, VLXD/gạch men, xây dựng | Đất · địa ốc · vật liệu từ đất |

**Hai chế độ mapping (v1):**

| Mode | Việc |
|------|------|
| Scroll page | **Trên:** basket `period9` 20 mã. **Dưới:** ngũ hành `classic` — chọn hành → top 10 |
| (cũ) toggle | Đã bỏ — không còn nút chuyển chế độ |

## Chế độ `period9` — Vận Ly Hỏa (20 mã)

Tham chiếu nội dung blog:

- [`cu-all-in-de-doi`](../src/content/blog/cu-all-in-de-doi/index.md) — Vận 9 = điện, năng lượng, AI, truyền thông, công nghệ mới; Vingroup/VinFast như canh bạc điện hóa của VN
- [`phan-mem-da-thay-doi`](../src/content/blog/phan-mem-da-thay-doi/index.md) — Vận 9 (2024–2043): sáng tạo, tốc độ, truyền thông

**Tiêu chí chọn mã (không phải khuyến nghị):** doanh nghiệp HOSE gắn điện / năng lượng / công nghệ–AI / hạ tầng số–viễn thông / bán lẻ thiết bị số — ưu tiên cap lớn trong nhóm; **VIC đứng đầu** vì là neo câu chuyện All-in (BĐS nuôi EV/công nghiệp).

Snapshot ~2026-07, cap nghìn tỷ VND (T):

| # | Mã | Tên | Cap (T) | Vì sao vào basket Ly Hỏa |
|---|-----|-----|---------|--------------------------|
| 1 | VIC | Vingroup | ~1516 | Neo bài All-in: VinFast / điện hóa / công nghiệp mới |
| 2 | GAS | PV Gas | ~164 | Năng lượng |
| 3 | BSR | Lọc hóa dầu BSR | ~115 | Chuỗi năng lượng |
| 4 | FPT | FPT | ~110 | Công nghệ · phần mềm · AI |
| 5 | MWG | Thế Giới Di Động | ~104 | Thiết bị số / bán lẻ điện tử |
| 6 | GEE | Gelex Electricity | ~43 | Điện |
| 7 | POW | PV Power | ~42 | Điện |
| 8 | PLX | Petrolimex | ~41 | Năng lượng (phân phối) |
| 9 | GEX | GELEX | ~29 | Điện / công nghiệp điện |
| 10 | REE | REE | ~27 | Điện · kỹ thuật điện |
| 11 | PGV | EVN Genco 3 | ~26 | Phát điện |
| 12 | FRT | FPT Retail | ~19 | Bán lẻ số |
| 13 | VSH | Thủy điện Vĩnh Sơn–Sông Hinh | ~10 | Điện tái tạo |
| 14 | CTR | Viettel Construction | ~9 | Hạ tầng viễn thông |
| 15 | PC1 | PC1 Group | ~8 | Hạ tầng điện |
| 16 | DGW | Digiworld | ~8 | Phân phối ICT |
| 17 | VTP | Viettel Post | ~7 | Viễn thông / logistics số |
| 18 | HDG | Hà Đô | ~7 | Năng lượng tái tạo / hạ tầng |
| 19 | NT2 | Điện lực Nhơn Trạch 2 | ~6 | Phát điện |
| 20 | CMG | CMC | ~6 | Công nghệ |

**Không nhầm với classic Hỏa:** classic Hỏa vẫn là top 10 trong bucket năng lượng+tech theo ngũ hành; `period9` là **một danh sách 20 mã riêng** (có VIC — ở classic thuộc Thổ) để kể câu chuyện Vận Ly Hỏa / dòng vốn thời đại.

## Snapshot data — chế độ `classic` (HOSE, khoảng 2026-07)

Nguồn tham chiếu: stockanalysis HOSE by market cap. Cap làm tròn **nghìn tỷ VND (T)**. Refresh thủ công khi ship site; canvas prototype nhúng snapshot.

### Kim — top 10

| # | Mã | Tên | Cap (T) | Ngành |
|---|-----|-----|---------|--------|
| 1 | VCB | Vietcombank | ~474 | Ngân hàng |
| 2 | BID | BIDV | ~268 | Ngân hàng |
| 3 | CTG | VietinBank | ~231 | Ngân hàng |
| 4 | TCB | Techcombank | ~211 | Ngân hàng |
| 5 | VPB | VPBank | ~198 | Ngân hàng |
| 6 | MBB | MB Bank | ~180 | Ngân hàng |
| 7 | HPG | Hòa Phát | ~175 | Thép |
| 8 | LPB | LPBank | ~163 | Ngân hàng |
| 9 | HDB | HDBank | ~135 | Ngân hàng |
| 10 | STB | Sacombank | ~134 | Ngân hàng |

### Mộc — top 10

| # | Mã | Tên | Cap (T) | Ngành |
|---|-----|-----|---------|--------|
| 1 | VNM | Vinamilk | ~124 | Sữa / F&B |
| 2 | GVR | Tập đoàn Cao su VN | ~109 | Cao su |
| 3 | SBT | TTC - Biên Hòa | ~19 | Đường / nông sản |
| 4 | HAG | Hoàng Anh Gia Lai | ~18 | Nông nghiệp |
| 5 | DPM | Đạm Phú Mỹ | ~15 | Phân bón |
| 6 | DCM | Đạm Cà Mau | ~15 | Phân bón |
| 7 | DHG | Dược Hậu Giang | ~12 | Dược |
| 8 | BAF | BAF Việt Nam | ~11 | Nông nghiệp |
| 9 | HPA | Hòa Phát Agriculture | ~9 | Nông nghiệp |
| 10 | PHR | Phước Hòa Rubber | ~8 | Cao su |

### Thủy — top 10

| # | Mã | Tên | Cap (T) | Ngành |
|---|-----|-----|---------|--------|
| 1 | MCH | Masan Consumer | ~178 | Đồ uống / FMCG |
| 2 | VPL | Vinpearl | ~132 | Du lịch |
| 3 | VJC | VietJet | ~101 | Hàng không |
| 4 | HVN | Vietnam Airlines | ~70 | Hàng không |
| 5 | SAB | Sabeco | ~60 | Đồ uống |
| 6 | GMD | Gemadept | ~31 | Cảng / logistics |
| 7 | VHC | Vĩnh Hoàn | ~12 | Thủy sản |
| 8 | BWE | Nước – MT Bình Dương | ~10 | Nước |
| 9 | PVT | PV Trans | ~9 | Vận tải biển |
| 10 | HAH | Hải An | ~8 | Vận tải biển |

### Hỏa — top 10

| # | Mã | Tên | Cap (T) | Ngành |
|---|-----|-----|---------|--------|
| 1 | GAS | PV Gas | ~164 | Khí |
| 2 | BSR | Lọc hóa dầu BSR | ~115 | Lọc dầu |
| 3 | FPT | FPT | ~110 | Công nghệ |
| 4 | MWG | Thế Giới Di Động | ~104 | Bán lẻ điện tử |
| 5 | GEE | Gelex Electricity | ~43 | Điện |
| 6 | POW | PV Power | ~42 | Điện |
| 7 | PLX | Petrolimex | ~41 | Xăng dầu |
| 8 | REE | REE | ~27 | Điện / kỹ thuật |
| 9 | PGV | EVN Genco 3 | ~26 | Điện |
| 10 | FRT | FPT Retail | ~19 | Bán lẻ điện tử |

### Thổ — top 10

| # | Mã | Tên | Cap (T) | Ngành |
|---|-----|-----|---------|--------|
| 1 | VIC | Vingroup | ~1516 | BĐS / conglomerate |
| 2 | VHM | Vinhomes | ~560 | BĐS |
| 3 | VRE | Vincom Retail | ~52 | BĐS bán lẻ |
| 4 | BCM | Becamex | ~39 | KCN / BĐS |
| 5 | NVL | Novaland | ~30 | BĐS |
| 6 | KBC | Kinh Bắc | ~25 | KCN / BĐS |
| 7 | KDH | Khang Điền | ~20 | BĐS |
| 8 | VPI | Văn Phú Invest | ~20 | BĐS |
| 9 | CRV | CRV Real Estate | ~18 | BĐS |
| 10 | VGC | Viglacera | ~17 | VLXD |

## Ranh giới

| | Tools (`/tools`) | Atlas (parent) | Module này |
|--|------------------|----------------|------------|
| Việc | Utility nhanh | System-design atlas + micro-modules | Khám phá ngành qua ngũ hành |
| Tone | Utility | Forge / Oracle | Oracle flavor trong Atlas |
| Không làm | — | Diagram editor | Khuyến nghị đầu tư / “hợp mệnh” |

Disclaimer bắt buộc trên UI: **không phải lời khuyên đầu tư**; mapping mang tính minh họa văn hóa + ngành.

## Surface

- **TEMP canonical:** [`/tools/ngu-hanh`](../src/pages/tools/ngu-hanh.astro) — đăng ký trong `src/lib/tools.ts` để hiện gallery `/tools` (chưa `featured` trên homepage)
- Alias: `/oracle/ngu-hanh` → redirect sang `/tools/ngu-hanh` (giữ query)
- EN: `/en/tools/ngu-hanh`
- Data / island: `src/lib/ngu-hanh-stocks.ts`, `src/components/atlas/NguHanhStocks.astro`
- Share URL: `?hanh=hoa` (chỉ phần Ngũ hành; Vận Ly Hỏa luôn hiện phía trên)
- **Sau này:** gỡ khỏi `TOOLS[]`, gắn atlas shell / Oracle — xem parent north-star

## Open (module)

- [x] Thêm basket `period9` 20 mã (Vận Ly Hỏa) — neo VIC + điện / tech / viễn thông
- [x] UI: Vận Ly Hỏa rồi Ngũ hành trên một trang (không toggle)
- [x] TEMP: hiện trong `/tools` via registry
- [ ] Nguồn market cap tự động vs snapshot thủ công
- [ ] Gỡ khỏi tools registry khi Atlas shell có
- [ ] (Tuỳ chọn) Lọc lại 20 mã nếu muốn nghiêng thêm truyền thông thuần (YEG, SGT, ELC) thay vài tên điện
- [ ] (Tuỳ chọn) `featured: true` trên homepage tools row
