# Interactive Architecture Atlas — Architecture North-Star

> **Status: IDEA / north-star.** Evergreen direction (`00-00-00` = not a dated build log). Captures positioning so future Forge / Oracle / atlas work can reference it. Related: tools platform (`00-00-00-tools-platform-architecture.md`) is for small utilities; this note is a **different product shape** — interactive system-design learning and exploratory atlases, closer to ⚒️ Forge / 🔮 Oracle than to QR/resizer-style tools.
>
> Formerly: `_logs/26-07-19-interactive-architecture-atlas.md` (promoted to `00-00-00`).
>
> Date opened: 2026-07-19 · updated: 2026-07-23

## Why this fits better than generic utilities

Ý tưởng này **hợp với nền tảng của mình hơn các utility thông thường**. Nhưng điểm quan trọng: **đừng bắt đầu bằng một công cụ “vẽ architecture diagram”** — Mermaid, Excalidraw, Draw.io đã làm khá tốt.

Sản phẩm nên giúp người dùng **hiểu, so sánh và lựa chọn kiến trúc** — không cạnh tranh ở chỗ vẽ box/arrow.

## Positioning

> **An interactive atlas of how software systems work.**

Hoặc gần tinh thần blog hơn:

> **See the architecture. Follow the data. Understand the trade-offs.**

Nhánh tự nhiên của **⚒️ Forge**: không chỉ dạy cách dùng công nghệ, mà trực quan hóa những nền móng tạo nên hệ thống hiện đại.

Một số module có thể nghiêng **Oracle** (văn hóa / thị trường / ngũ hành) — vẫn cùng “atlas” interaction model, không phải tool registry.

## Concept tiềm năng nhất

Một thư viện kiến trúc hệ thống có thể tương tác:

> Chọn bài toán → xem kiến trúc tham khảo → thay đổi quy mô → quan sát luồng dữ liệu, bottleneck và trade-off

Ví dụ chọn **Real-time Chat System**, người dùng thấy sơ đồ kiểu:

```text
Client
  ↓ WebSocket
Gateway
  ↓
Message Service ──→ Kafka ──→ Notification Workers
  ↓                    ↓
Redis               Cassandra
```

Nhưng thay vì hình tĩnh, họ có thể:

- Bấm **Send message** để thấy request chạy qua hệ thống
- Tăng từ `1K` lên `1M` concurrent users
- Bật/tắt Kafka, Redis, CDN hoặc load balancer
- Làm một node bị lỗi để xem hệ thống phản ứng
- Xem latency được cộng dồn qua từng bước
- Xem điểm nào là bottleneck
- So sánh kiến trúc đơn giản và kiến trúc scale lớn

## Điểm khác biệt thực sự

Sơ đồ tĩnh chỉ trả lời: *“Hệ thống có những thành phần gì?”*

Sản phẩm này nên trả lời thêm:

| Câu hỏi | Ý nghĩa |
|---------|---------|
| Tại sao thành phần đó tồn tại? | Responsibility + justification |
| Điều gì xảy ra khi bỏ nó đi? | Toggle / ablation |
| Khi scale tăng, kiến trúc phải đổi thế nào? | Evolution by load |
| Một request thực sự đi qua hệ thống ra sao? | Animated path |

Mỗi node hiển thị bốn lớp:

1. **Responsibility** — node này chịu trách nhiệm gì?
2. **Why it exists** — tại sao không xử lý trực tiếp ở node trước?
3. **Failure mode** — node hỏng thì chuyện gì xảy ra?
4. **Scaling strategy** — scale ngang, partition, replicate hay cache?

## Kiến trúc tiến hóa theo quy mô

Thay vì chỉ hiện kiến trúc hoàn chỉnh, kể câu chuyện:

```text
Stage 1: Monolith
        ↓
Stage 2: Add database
        ↓
Stage 3: Add cache
        ↓
Stage 4: Add queue
        ↓
Stage 5: Partition workload
        ↓
Stage 6: Multi-region
```

Người dùng kéo thanh quy mô:

```text
100 users ───────────── 100M users
```

Kiến trúc tự biến đổi theo giai đoạn — dễ hiểu hơn đọc một bài system-design dài.

## Catalog nên làm (thứ tự)

Không catalog rộng ngay. Bắt đầu bằng **5 bài toán** người học system design hay tìm:

1. **URL Shortener** — DB, cache, ID generation, read-heavy
2. **Real-time Chat** — WebSocket, presence, ordering, ack, offline message
3. **Notification System** — queue, retry, rate limit, fan-out, DLQ
4. **File Upload & Processing** — presigned URL, object storage, worker, scan, CDN
5. **Payment System** — idempotency, ledger, events, reconciliation, audit

Sau đó mới mở rộng:

- News feed
- Ride-hailing
- Video streaming
- Search engine
- E-commerce checkout
- Trading exchange
- Market-data pipeline
- Observability pipeline
- Feature flag system
- Distributed scheduler

### Micro-modules (nhỏ, trong cùng atlas)

Cùng interaction spirit (chọn → xem → so sánh), nhưng **không** phải system-design diagram đầy đủ. Đây là satellite entries — detail sống ở file riêng khi cần:

| Module | Việc | Doc chi tiết |
|--------|------|--------------|
| **Ngũ hành × CK VN** | Vận Ly Hỏa (20 mã) rồi Ngũ hành (chọn hành → top 10) | [`26-07-23-ngu-hanh-vn-stocks.md`](./26-07-23-ngu-hanh-vn-stocks.md) · **TEMP** `/tools/ngu-hanh` |

Ngũ hành là **một phần nhỏ** của Atlas — prototype UX / Oracle flavor — không thay thế catalog kiến trúc phần mềm ở trên.

## MVP nên nhỏ đến mức nào?

MVP đầu chỉ cần **một kiến trúc duy nhất**, làm thật tốt.

Ứng viên mạnh (chọn một khi lên plan build):

- **Notification system**, hoặc
- **Real-time market-data pipeline** (lợi thế kinh nghiệm riêng)

Mỗi architecture chỉ cần:

- Diagram tương tác
- Animation của một request/event
- Click node → xem vai trò (4 lớp thông tin)
- Thanh điều chỉnh traffic
- Latency / throughput / bottleneck mô phỏng
- Hai chế độ: `Simple` và `Scaled`
- Một vài failure scenarios

**Không** cần ở v1: AI, editor, cho user tự vẽ.

**Song song / sớm hơn MVP kiến trúc:** micro-module Ngũ hành × CK VN có thể ship như artifact riêng để thử interaction “chọn biểu tượng → xem 10 kết quả”, rồi gắn vào atlas shell sau.

## Ba lớp sản phẩm (sau khi có library)

| Layer | Việc |
|-------|------|
| **Learn** | Thư viện kiến trúc phổ biến — học + phỏng vấn system design |
| **Design** | User nhập yêu cầu (“100K WebSocket, lưu message 30 ngày”) → đề xuất architecture + giải thích quyết định |
| **Inspect** | Upload repo / Terraform / K8s YAML / Compose → dựng lại kiến trúc thực tế, đối chiếu pattern phổ biến |

## Lợi thế riêng

Không chỉ box và arrow đẹp. Kinh nghiệm thực tế có thể trực quan hóa những thứ trang system-design thường mô tả hời hợt:

- Hot path / cold path
- Backpressure
- Ordering
- Staleness
- Fan-out
- Retry và deduplication
- Queue buildup
- Tail latency
- Snapshot + live stream
- Failover và recovery

Nền tảng kỹ thuật gần gũi: real-time pricing, event-driven systems, DAG computation, Aeron / ZMQ, latency propagation, FIX gateway, funding event streams, market-data pipelines.

## Ranh giới với Tools Platform

| | Tools (`/tools`) | Architecture Atlas (Forge / Oracle) |
|--|------------------|-------------------------------------|
| Việc | Giải một annoyance nhỏ, nhanh | Hiểu / so sánh / chọn kiến trúc (và micro-atlas liên quan) |
| Runtime | client / edge / nuc utilities | Interactive educational / exploratory product |
| Ví dụ | Image resizer, timezone planner | Notification atlas; Ngũ hành × CK VN (module nhỏ) |
| Không làm | — | Diagram editor (Mermaid/Excalidraw đã đủ) |

Hai hướng có thể cùng tồn tại trên anh4gs.xyz; **đừng** nhét atlas vào registry utility như một “tool vẽ sơ đồ”.

## Open when ready to build

- [ ] Chọn MVP architecture: Notification vs Market-data pipeline
- [ ] Quyết định surface: `/forge/atlas`, `/atlas`, hay subdomain
- [ ] Tech sketch: client-only graph + sim vs edge for shareable states
- [ ] Gắn micro-module Ngũ hành vào atlas shell (nav / catalog entry) — **hiện TEMP trong `TOOLS[]` / `/tools/ngu-hanh`; gỡ khỏi registry khi atlas shell có**
- [ ] Viết dated implementation plan (`yy-mm-dd-…`) riêng — note này chỉ là north-star
