---
slug: "astro-migration-gatsby-to-astro"
title: "Dọn Nhà Sang Astro"
summary: "Chuyện hắn tháo dỡ toàn bộ ngôi nhà Gatsby để xây lại từ đầu trên nền Astro 5, và kết quả bất ngờ khi build time giảm từ 47 giây xuống còn 1.6 giây"
author: "Tam Pham"
cowriter: "@aethery"
category: "forge"
status: "published"
date: "2026-05-30"
cover: "./cover.png"
lang: "vn"
---

Hey, lại là hắn đây...

Chỉ mới tuần trước, hắn vừa hoàn thành cuộc di cư từ styled-components sang Tailwind CSS. Tưởng đâu ngôi nhà kỹ thuật số đã ổn định, nhưng khi ngồi nhìn lại bản kê khai package.json, hắn nhận ra một sự thật khó chịu: Gatsby đã chính thức bước vào giai đoạn "bảo trì" (maintenance mode) sau khi Netlify mua lại rồi bỏ rơi nó. Hơn 1.500 dependencies nằm im trong node_modules, nhiều package không còn được cập nhật, và mỗi lần chạy `yarn install` là một phút rưỡi chờ đợi vô nghĩa

Hắn quyết định: thay vì vá víu trên một nền tảng đang chìm, chi bằng xây lại từ đầu

## Vì sao chọn Astro

Hắn cân nhắc giữa Next.js, Remix và Astro. Với một trang blog tĩnh thuần Markdown, câu trả lời khá rõ ràng:

- **Zero JavaScript mặc định**: Astro không gửi một byte JS nào xuống trình duyệt trừ khi hắn yêu cầu. Gatsby luôn đính kèm React runtime (~40KB gzipped) dù trang chỉ hiển thị nội dung tĩnh
- **Content Collections**: Thay vì viết GraphQL queries phức tạp trong gatsby-node.ts rồi truyền data qua pageContext, Astro cung cấp `getCollection()` với schema validation bằng Zod, type-safe từ đầu đến cuối
- **Hệ sinh thái nhẹ**: Gatsby cần hơn 10 plugins chỉ để xử lý ảnh, sitemap và markdown. Astro xử lý tất cả chỉ với sharp và một vài dòng config
- **Build time**: Đây là lý do quyết định nhất

## Quá trình tháo dỡ

Cuộc di cư diễn ra trong một buổi chiều cuối tuần. Quy trình khá rõ ràng:

**Bước 1: Dọn nền móng**

Xóa toàn bộ file cấu hình Gatsby (`gatsby-config.ts`, `gatsby-node.ts`, `gatsby-browser.tsx`, `postcss.config.js`, `tailwind.config.js`) và thay bằng một file duy nhất: `astro.config.mjs`

**Bước 2: Di chuyển nội dung**

Chuyển `content/blog/` vào `src/content/blog/` để Astro có thể tối ưu hóa ảnh tại build time. Tạo `content.config.ts` với Zod schema thay thế cho GraphQL

**Bước 3: Chuyển đổi components**

Mỗi file React TSX được viết lại thành Astro component. Không cần useState, useEffect, hay bất kỳ hook nào. Layout.tsx + SEO.tsx gộp thành một file Layout.astro duy nhất. NavBar, Footer, Card, tất cả đều trở thành template tĩnh không cần runtime

**Bước 4: Nâng cấp Tailwind**

Tailwind v3 lên v4: `@tailwind` directives biến thành `@import "tailwindcss"`, `tailwind.config.js` biến thành CSS `@theme` block. Cấu hình nằm ngay trong CSS, không cần file JavaScript riêng

## Hai vấn đề bất ngờ

Không có cuộc di cư nào trơn tru hoàn toàn

**Duplicate Content IDs**: Nhiều bài viết có cả `index.md` (tiếng Việt) và `index.en.md` (tiếng Anh) trong cùng thư mục. Astro glob loader tạo ra ID trùng nhau. Giải pháp: viết hàm `generateId` tùy chỉnh trong content config để đưa tên file vào ID

**Ảnh mất tích từ Notion**: Hai bài viết cũ được migrate từ Notion có tham chiếu đến thư mục `./images/` nhưng thư mục đó chưa bao giờ tồn tại. Gatsby âm thầm render thành thẻ `<img>` hỏng, nhưng Astro nghiêm khắc hơn: nó từ chối build. Giải pháp: viết một remark plugin nhỏ (`remark-strip-missing-images.mjs`) để tự động loại bỏ các tham chiếu ảnh không tồn tại

## Kết quả

| | Gatsby 5 | Astro 5 |
|---|---|---|
| Dependencies | ~1.500 packages | ~330 packages |
| Build time (local, cached) | 7-47 giây | **1.6 giây** |
| Build time (Cloudflare CI) | ~3 phút | **22 giây** |
| JS gửi xuống trình duyệt | React runtime (~40KB) | **0 KB** |
| Output size | ~65MB | **44MB** |
| Số trang tạo ra | 122 | 122 |

122 trang, 58 bài viết tiếng Việt, 58 bài tiếng Anh, 6 trang tĩnh, sitemap, tất cả đều được giữ nguyên. Không mất một URL nào

Điều đáng chú ý nhất: trên Cloudflare Pages, tổng thời gian từ lúc push code đến lúc deploy xong chỉ còn khoảng 59 giây (bao gồm clone, install, build và deploy). Trước đây với Gatsby, riêng bước build đã ngốn hơn 2 phút

## Bài học kỹ thuật

- Khi framework core đã vào maintenance mode, đừng chờ đợi. Chi phí di cư chỉ tăng theo thời gian, không bao giờ giảm
- Đối với trang web nội dung tĩnh (blog, documentation), việc ship JavaScript runtime xuống trình duyệt là một sự lãng phí không cần thiết. Astro loại bỏ hoàn toàn vấn đề này
- Content Collections của Astro với Zod schema validation là một bước tiến lớn so với GraphQL layer của Gatsby. Type-safe, đơn giản, không cần học thêm query language
- Luôn kiểm tra các edge case khi di cư: file trùng tên, ảnh mất tích, đường dẫn thay đổi. Viết script hoặc plugin nhỏ để xử lý tự động thay vì sửa tay từng file

Ngôi nhà kỹ thuật số giờ đây nhẹ nhàng hơn, nhanh hơn, và đơn giản hơn rất nhiều. Đôi khi, cách tốt nhất để tối ưu hóa một hệ thống không phải là thêm vào, mà là bỏ bớt đi

_❤️ cowriter aethery_
