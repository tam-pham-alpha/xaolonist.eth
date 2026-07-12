---
slug: "tailwind-migration-gatsby-clean"
title: "Di Cư Sang Tailwind CSS"
summary: "Chuyện hắn dọn dẹp đống đổ nát CSS-in-JS để bước sang thế giới build-time tối giản của Tailwind CSS, và bài học dọn dẹp cache thực tế"
author: "Tam Pham"
cowriter: "@aethery"
category: "forge"
status: "published"
date: "2026-05-30"
cover: "./cover.png"
lang: "vn"
---

Hey, lại là hắn đây...

Hôm nay hắn quyết định làm một cuộc đại phẫu cho ngôi nhà kỹ thuật số của mình: gỡ bỏ toàn bộ styled-components để thay thế bằng Tailwind CSS. Hắn nhận ra, sau nhiều năm vận hành, đống CSS-in-JS (styled-components) đã trở thành một thứ hành trang quá nặng nề cho một trang blog tĩnh.

Mọi thứ vốn bắt đầu bằng sự tiện lợi ban đầu: hắn thích viết CSS ngay trong JavaScript, thích sự cô lập của các styled components. Nhưng cái giá phải trả là sự chậm trễ âm thầm mà trình duyệt phải gánh chịu. CSS-in-JS hoạt động ở runtime, nghĩa là mỗi khi người dùng tải trang, trình duyệt phải tải bộ thư viện styled-components về, phân tích cú pháp JavaScript, rồi mới bắt đầu tính toán và inject CSS vào DOM. Đối với các thiết bị di động cấu hình yếu, đó là một gánh nặng không hề nhỏ. Chưa kể, dung lượng file JS bundle phình to thêm hàng chục Kilobytes chỉ để gánh vác phần runtime này.

Tailwind CSS thì ngược lại, nó hoạt động ở build-time. Tất cả các class tiện ích được quét, phân tích và biên dịch thành một file CSS tĩnh, cực kỳ tối giản trước khi xuất bản. Khi người dùng truy cập trang web, trình duyệt nhận ngay file CSS thuần túy, render giao diện ngay lập tức mà không tốn một chu kỳ CPU nào cho việc chạy JavaScript tính toán giao diện. Hiệu suất tăng lên, dung lượng bundle giảm đi rõ rệt. Đó là sự tối giản tối đa, đưa ngôi nhà kỹ thuật số trở về trạng thái tự nhiên nhất: HTML và CSS thuần túy.

Thế nhưng, khi hắn hí hửng dọn dẹp xong package.json, gỡ bỏ plugin và gõ lệnh chạy dev server để chiêm ngưỡng giao diện mới, terminal lập tức dội cho hắn một gáo nước lạnh. Webpack báo lỗi không tìm thấy `gatsby-plugin-styled-components/gatsby-browser.js`. Hắn kiểm tra lại mã nguồn, chắc chắn không còn một dòng import styled-components nào tồn tại. Vậy mà Gatsby vẫn báo lỗi đòi tìm lại bóng hình cũ.

Hắn tìm hiểu và nhận ra cơ chế hoạt động của gatsby-cache.

Để tối ưu hóa tốc độ build, Gatsby lưu trữ tất cả kết quả biên dịch trung gian vào thư mục `.cache`. Nhưng khi ta thay đổi cấu trúc nền tảng của hệ thống, gỡ bỏ các thư viện lõi, đống cache cũ bỗng trở thành những cấu hình lỗi thời. Hệ thống cố gắng tận dụng dữ liệu cũ nhưng lại xung đột với thực tế rằng tài nguyên cũ không còn nữa, dẫn đến những lỗi biên dịch bên trong Webpack.

Hắn hiểu rằng, để xây dựng một cái mới nhanh hơn, sạch hơn, đôi khi ta không thể chắp vá trên nền tảng của những tệp tin cũ. Hắn gõ lệnh giải thoát:

```bash
yarn clean
```

Lệnh chạy, toàn bộ thư mục `.cache` và `public` bị xóa sổ. Hệ thống được đưa về trạng thái nguyên sơ, hoàn toàn trống rỗng. Và khi hắn chạy lại lệnh dev, mọi thứ biên dịch trơn tru, mượt mà chỉ trong vài giây.

Bài học kỹ thuật này mang lại những kinh nghiệm thực tế về việc tối ưu hóa hệ thống:

- Muốn tối ưu hóa hiệu suất, hãy loại bỏ những gánh nặng runtime không cần thiết, đưa mọi thứ về dạng tối giản và nguyên bản nhất
- Khi thay đổi cấu trúc cốt lõi của mã nguồn, cần xóa bỏ hoàn toàn bộ nhớ đệm cũ để tránh các xung đột biên dịch không đáng có
- Định kỳ dọn dẹp cache và các tệp tin tạm thời là cách tốt nhất để giữ cho môi trường phát triển luôn sạch sẽ và hoạt động ở hiệu suất cao nhất

Chỉ khi các tệp tin cũ thực sự được dọn sạch, hệ thống mới có thể vận hành ở tốc độ tối đa, trơn tru và chính xác.

_❤️ cowriter aethery_
