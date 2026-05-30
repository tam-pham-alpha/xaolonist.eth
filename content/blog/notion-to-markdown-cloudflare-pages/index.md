---
slug: "notion-to-markdown-cloudflare-pages"
title: "Di cư từ Notion API sang Markdown & Cloudflare Pages"
summary: "Hey, lại là hắn đây, và dạo này hắn đã quyết định làm một cuộc đại di cư cho blog của mình: dọn nhà từ Notion API sang Markdown files đặt tại local và deploy lên Cloudflare Pages"
author: "Tam Pham"
category: "blog"
status: "published"
date: "2026-05-30"
cover: "./cover.png"
lang: "vn"
---

Hey, lại là hắn đây, và dạo này hắn đã quyết định làm một cuộc đại di cư cho blog của mình: dọn nhà từ Notion API sang Markdown files đặt tại local và deploy lên Cloudflare Pages.

Trước đây hắn từng rất thích dùng Notion làm CMS vì nó tiện, viết lách trực quan và giao diện kéo thả mượt mà. Tuy nhiên, sau một thời gian, Notion API bắt đầu bộc lộ những giới hạn khó chịu: tốc độ query chậm, thi thoảng dính rate limit, và mỗi lần rebuild blog là lại phải đợi kéo data qua mạng rất mất thời gian.

Vì thế, hắn đã quyết định chuyển sang giải pháp thuần túy SSG (Static Site Generation) truyền thống: viết Markdown và lưu tại repo GitHub. Một phần là để tiết kiệm chi phí subscription hàng tháng của Notion, nhưng lý do lớn hơn chính là sự linh hoạt và khả năng tận dụng sức mạnh của AI trong việc xuất bản các bài viết mới — tiện lợi và linh hoạt hơn rất nhiều so với quy trình dùng Notion truyền thống. Dưới đây là tóm tắt các bước hắn đã làm để hoàn tất cuộc di cư này.

### Bước 1: Export dữ liệu từ Notion
Đầu tiên, hắn export toàn bộ database bài viết từ Notion dưới dạng Markdown & CSV. Notion sẽ nén toàn bộ bài viết thành một file `.zip` chứa các file `.md` cùng thư mục ảnh đi kèm.

### Bước 2: Viết script convert và chuẩn hóa cấu trúc
File Markdown xuất ra từ Notion có format frontmatter khá lộn xộn và không tương thích ngay với Gatsby. Hắn đã viết một script Node.js ngắn để:
1. Đọc tất cả các file `.md` được xuất ra.
2. Parse lại Metadata (slug, title, date, category, status...) và ghi đè thành frontmatter chuẩn của blog.
3. Di chuyển các hình ảnh đính kèm vào đúng thư mục `content/blog/<slug>/images/` hoặc lưu làm `cover.jpg` tại thư mục bài viết.
4. Đổi lại đường dẫn ảnh trong nội dung bài viết thành relative path tương ứng.

### Bước 3: Cấu hình build với Gatsby
Sau khi toàn bộ bài viết đã nằm gọn gàng tại local dưới dạng cấu trúc:
```
content/blog/<slug>/
├── index.md
└── cover.jpg
```
Hắn dùng `gatsby-source-filesystem` kết hợp với `gatsby-transformer-remark` để Gatsby tự động scan và tạo node cho các file Markdown này. Việc truy vấn qua GraphQL giờ đây diễn ra hoàn toàn ở local, tốc độ build giảm từ gần 1 phút xuống còn chưa đầy 7 giây.

### Bước 4: Deploy lên Cloudflare Pages
Cuối cùng, hắn đưa toàn bộ code lên GitHub và kết nối với Cloudflare Pages:
1. Tạo một dự án Pages mới trên Cloudflare Dashboard.
2. Kết nối repo GitHub của blog.
3. Chọn framework preset là **Gatsby**.
4. Cấu hình build command là `yarn build` và output directory là `public`.

Mỗi lần hắn hoàn thành một bài viết mới tại local, hắn chỉ cần commit và push lên GitHub. Cloudflare Pages sẽ tự động trigger build và deploy chỉ trong vòng chưa đầy 1 phút. Hoàn toàn tự động, nhanh chóng, bảo mật và quan trọng nhất là hoàn toàn miễn phí.

Cuộc di cư này giúp hắn nhận ra đôi khi sự phức tạp của API hay database đám mây không mang lại nhiều giá trị bằng sự đơn giản, tin cậy của các file tĩnh (plain text). Cảm giác sở hữu hoàn toàn nội dung của mình dưới dạng file vật lý nằm trên máy tính cá nhân thật sự rất yên tâm.
