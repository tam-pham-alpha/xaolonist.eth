---
slug: "nhan-vien-ky-thuat-so"
title: "Nhân viên kỹ thuật số"
summary: "Khi nhân viên ngày càng làm việc cùng AI, những gì họ học được trong từng session có thể dần được chưng cất thành trí nhớ dài hạn của tổ chức"
author: "Tam Pham"
cowriter: "@aethery"
category: "forge"
status: "published"
date: "2026-09-12"
lang: "vn"
---

Hắn vẫn nghĩ một công ty mất đi một nhân viên giỏi không chỉ mất một người. Nó mất theo rất nhiều thứ khó nhìn thấy hơn. Cách người đó debug một hệ thống, những lỗi họ từng gặp, những con đường đã thử rồi bỏ, những người cần tìm khi có sự cố, và quan trọng nhất là cách họ đưa ra quyết định sau nhiều năm va chạm với công việc

Trước đây phần lớn những thứ đó nằm trong đầu con người. Một phần nhỏ được để lại trong source code, ticket, Slack hay vài trang documentation mà chẳng mấy ai nhớ cập nhật. Khi một người rời công ty, rất nhiều tri thức cũng rời đi cùng họ

## Mỗi nhân viên đều có thể có một phiên bản kỹ thuật số

AI có thể làm chuyện này thay đổi

Khi kỹ sư ngày càng làm việc cùng Cursor, Claude hay ChatGPT, một phần khá lớn quá trình giải quyết vấn đề đã được thể hiện thành dữ liệu. Họ hỏi một câu, kiểm tra một giả thuyết, đọc một đoạn code, sửa một lỗi, chạy một bài test rồi cuối cùng đưa ra quyết định. Nếu biết cách giữ lại phần có giá trị trong quá trình ấy, mỗi ngày làm việc cũng đồng thời là một ngày xây thêm phiên bản kỹ thuật số của chính nhân viên đó

Không phải một bản sao biết nói giống họ. Cũng không phải hàng chục nghìn đoạn chat được nhét vào một vector database. Thứ cần giữ lại nhỏ hơn nhiều: họ vừa giải quyết vấn đề gì, phát hiện điều gì mới về hệ thống, quyết định nào đã được đưa ra, tại sao lại chọn như vậy, điều gì đã thử nhưng không hiệu quả, và artifact nào chứng minh cho kết luận đó

Theo thời gian, phiên bản kỹ thuật số ấy không cần thuộc về một cá nhân nữa. Kiến thức của nhiều người có thể dần kết tinh thành năng lực của cả một đội ngũ, một hệ thống hay một công ty

## Quá trình hiện thực có thể đơn giản hơn chúng ta nghĩ

Thay vì xây một middleware khổng lồ để đứng giữa tất cả model và ghi lại mọi câu nhân viên nói với AI, ta có thể bắt đầu bằng một cơ chế nhỏ hơn nhiều

Nhân viên vẫn làm việc như bình thường với Cursor, Claude hay những công cụ họ quen dùng. Khi một session kết thúc, agent nhìn lại những gì vừa xảy ra và chưng cất nó thành một bản ghi nhỏ

Một cuộc trò chuyện kéo dài hàng chục nghìn token có thể cuối cùng chỉ để lại vài trăm chữ. Vấn đề đã gặp là gì. Điều mới vừa học được là gì. Quyết định cuối cùng là gì. File, pull request, ticket hay log nào liên quan. Điều gì vẫn còn chưa chắc chắn

Những bản ghi nhỏ ấy được gửi về một kho chung. Qua thời gian, hệ thống so sánh chúng với những gì tổ chức đã biết, gom những kiến thức giống nhau lại, loại bỏ phần trùng lặp, phát hiện những thông tin đã cũ rồi đề xuất cập nhật vào kho tri thức

Kết quả cuối cùng thậm chí chẳng cần quá hào nhoáng. Nó có thể chỉ là một thư mục `docs/` nằm trong Git

Trong đó có kiến trúc hệ thống, những quyết định quan trọng, runbook xử lý sự cố, những điều cần biết khi làm việc với từng service, những thất bại đã từng xảy ra và lý do tại sao một vài thứ được thiết kế như hiện tại. Mỗi thay đổi đều có version, có diff, có evidence và có người review

GitHub giúp công ty giữ lại code mà nhân viên tạo ra. Một hệ thống như vậy có thể giúp công ty giữ lại phần nào những gì nhân viên đã học để tạo ra code đó

## Một plugin nhỏ có thể là điểm bắt đầu

Phần thú vị là ta chưa cần xây cả hệ thống ngay từ đầu

Một plugin cho Cursor hay Claude Code có thể là phiên bản đầu tiên. Plugin lắng nghe lifecycle của agent. Khi một session chuẩn bị kết thúc, nó yêu cầu agent tổng kết những kiến thức có giá trị vừa xuất hiện

MCP lúc này chỉ đóng vai trò như một chiếc cổng nhỏ. Agent gọi một tool đại loại như `submit_session_summary`, gửi phần tri thức vừa được chưng cất về hệ thống của công ty

Agent không cần gửi toàn bộ conversation. Nó cũng không cần gửi quá trình suy luận nội bộ. Hệ thống chỉ cần kết luận, quyết định, evidence, artifact liên quan và những câu hỏi vẫn chưa được giải quyết

Nhờ vậy, việc xây dựng knowledge base gần như trở thành một sản phẩm phụ của công việc hằng ngày

Nhân viên vẫn code. Vẫn hỏi Claude. Vẫn dùng Cursor. Vẫn mở pull request như trước

Chỉ có một thứ khác đi. Sau mỗi ngày làm việc, công ty biết thêm một chút về chính hệ thống của mình

## Từ những session nhỏ đến trí nhớ của tổ chức

Một session đơn lẻ chẳng có nhiều giá trị. Một nghìn session bắt đầu trở nên thú vị

Một engineer có thể gặp cùng một loại sự cố năm lần trong sáu tháng. Người khác cũng gặp nó ba lần. Mỗi lần lại bổ sung thêm một mẩu thông tin mới. Hệ thống có thể nhận ra tất cả những mẩu kiến thức ấy đang nói về cùng một vấn đề và dần hợp nhất chúng thành một tài liệu hoàn chỉnh

Tới lúc đó, thứ công ty sở hữu không còn là conversation history của nhân viên nữa

Nó là trí nhớ của tổ chức

Một senior engineer có thể rời công ty sau vài năm. Nhưng những gì người đó học được trong quá trình làm việc không nhất thiết phải biến mất. Một phần năng lực ấy đã âm thầm được kết tinh thành tài sản của tổ chức, từng session một

## Điều cần chứng minh

Dẫu vậy, hắn nghĩ chưa cần nói quá xa về digital employee, organizational intelligence hay một đội quân AI có thể thay thế con người

Có một thứ đơn giản hơn rất nhiều cần được chứng minh trước

Hãy cài plugin cho một nhóm kỹ sư, để họ làm việc như bình thường trong ba hoặc sáu tháng. Đừng bắt họ viết thêm documentation. Đừng thay đổi workflow của họ quá nhiều

Rồi quay lại nhìn thư mục `docs/`

Nếu sau khoảng thời gian ấy, tài liệu thực sự đầy đặn hơn, chính xác hơn, cập nhật gần với hệ thống hơn và một kỹ sư mới có thể hiểu mọi thứ nhanh hơn trước, thì có lẽ ý tưởng này đã chứng minh được giá trị của mình

Còn nếu sau hàng nghìn session, thứ còn lại chỉ là một núi những bản tóm tắt chẳng ai muốn đọc, thì có lẽ vấn đề chưa bao giờ nằm ở chuyện chúng ta thiếu dữ liệu

Có thể thứ khó nhất không phải làm sao để lưu lại mọi điều con người biết

Mà là làm sao nhận ra điều gì trong số đó thực sự đáng để một tổ chức nhớ

*❤️ cowriter aethery*
