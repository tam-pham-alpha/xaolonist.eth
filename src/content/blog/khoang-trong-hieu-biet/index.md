---
slug: "khoang-trong-hieu-biet"
title: "Khoảng trống hiểu biết, cái giá phải trả khi code với AI"
summary: "AI có thể tạo ra code nhanh hơn rất nhiều so với tốc độ con người có thể hiểu và kiểm chứng nó, và khoảng cách ấy đang trở thành một món nợ mới của ngành phần mềm"
author: "Tam Pham"
category: "forge"
status: "published"
date: "2026-09-09"
lang: "vn"
---

*Bản dịch từ bài viết [Comprehension Debt - the hidden cost of AI generated code](https://addyosmani.com/blog/comprehension-debt/) của Addy Osmani, đăng ngày 14 tháng 3 năm 2026*

**Comprehension debt**, tạm gọi là **khoảng trống hiểu biết**, là cái giá âm thầm mà trí nhớ và khả năng tư duy của con người phải trả khi chúng ta phụ thuộc quá nhiều vào AI và tự động hóa. Với kỹ sư phần mềm, vấn đề này đặc biệt rõ khi ngày càng nhiều công việc được giao cho những AI agent

Có một loại chi phí không bao giờ xuất hiện trong những biểu đồ đo tốc độ của đội ngũ khi chúng ta bắt đầu dùng AI để viết code ngày càng nhiều. Nhất là khi lượng code AI tạo ra lớn đến mức việc đọc lại tất cả trở thành một công việc mệt mỏi. Khoản chi phí ấy cứ âm thầm tích tụ, cho tới một ngày chúng ta buộc phải trả lại, cùng với lãi

Khoảng trống hiểu biết là **khoảng cách ngày càng lớn giữa lượng code đang tồn tại trong hệ thống và lượng code mà một con người thực sự hiểu**

Khác với nợ kỹ thuật, thứ thường tự bộc lộ qua những lần build ngày càng chậm, những dependency rối rắm, hay cảm giác bất an mỗi khi phải chạm vào một module cũ, khoảng trống hiểu biết lại tạo ra một cảm giác tự tin giả tạo. Codebase trông vẫn sạch. Test vẫn xanh. Mọi thứ có vẻ ổn. Cho tới khi hóa đơn được gửi đến, thường vào đúng thời điểm tệ nhất

[Margaret-Anne Storey](https://margaretstorey.com/blog/2026/02/09/cognitive-debt/) từng kể về một nhóm sinh viên chạm phải bức tường này vào tuần thứ bảy của dự án. Họ không còn có thể thực hiện một thay đổi đơn giản **mà không vô tình làm hỏng một thứ khác**. Vấn đề thật sự không nằm ở code xấu. Không một ai trong nhóm còn có thể giải thích vì sao những quyết định thiết kế trước đó được đưa ra, hay các phần khác nhau của hệ thống đáng lẽ phải phối hợp với nhau như thế nào. Cái mô hình trong đầu về toàn bộ hệ thống đã biến mất

Đó chính là lúc món nợ hiểu biết bắt đầu sinh lãi ngay trước mắt chúng ta

Tôi đã đọc nhiều cuộc thảo luận trên Hacker News, nơi các kỹ sư thật sự vật lộn với phiên bản mang tính cấu trúc của vấn đề này. Không còn đơn giản là cuộc tranh luận quen thuộc giữa những người lạc quan và hoài nghi về AI. Cả ngành đang cố tìm hiểu xem sự nghiêm ngặt trong kỹ nghệ phần mềm phải trông như thế nào, khi nút thắt cổ chai đã chuyển sang một nơi khác

Một nghiên cứu gần đây của Anthropic mang tên [How AI Impacts Skill Formation](https://www.anthropic.com/research/AI-assistance-coding-skills) đã chỉ ra những mặt trái tiềm ẩn khi kỹ sư phụ thuộc quá nhiều vào trợ lý lập trình AI. Trong một thử nghiệm có đối chứng ngẫu nhiên với 52 kỹ sư phần mềm đang học một thư viện mới, những người sử dụng AI hoàn thành công việc trong khoảng thời gian gần tương đương nhóm đối chứng, nhưng đạt điểm thấp hơn 17% trong bài kiểm tra mức độ hiểu sau đó, 50% so với 67%. Sự suy giảm lớn nhất xuất hiện ở khả năng debug, sau đó là hiểu khái niệm và đọc code. **Các nhà nghiên cứu nhấn mạnh rằng việc giao phó thụ động kiểu “cứ làm cho nó chạy đi” gây hại cho quá trình hình thành kỹ năng nhiều hơn rất nhiều so với việc chủ động dùng AI để đặt câu hỏi và tìm hiểu**. Bài nghiên cứu đầy đủ có tại [arXiv](https://arxiv.org/abs/2601.20245/)

## Có một sự bất cân xứng về tốc độ

**AI tạo ra code nhanh hơn rất nhiều so với tốc độ con người có thể đánh giá nó.** Điều này nghe có vẻ hiển nhiên, nhưng hệ quả của nó lại dễ bị đánh giá thấp

Khi một developer trong team tự viết code, quá trình review của con người vốn luôn là một nút thắt cổ chai, nhưng đó từng là một nút thắt có ích. Việc đọc PR buộc người review phải hiểu thay đổi. Nó làm lộ ra những giả định ẩn, phát hiện những quyết định thiết kế đang mâu thuẫn với kiến trúc được xây dựng sáu tháng trước, đồng thời giúp kiến thức về codebase được phân phối giữa những con người chịu trách nhiệm duy trì nó

Code do AI tạo ra phá vỡ vòng phản hồi này. Khối lượng quá lớn. Code lại sạch sẽ về cú pháp, thường được trình bày đẹp và nhìn qua có vẻ chính xác, chính những tín hiệu mà trước đây thường khiến chúng ta cảm thấy yên tâm để merge. Nhưng đúng ở bề mặt không đồng nghĩa với đúng ở cấp độ hệ thống. Codebase trông khỏe mạnh, trong khi sự hiểu biết của con người bên dưới đang dần bị khoét rỗng

Tôi từng đọc một kỹ sư nói rằng nút thắt cổ chai của việc xây phần mềm từ trước tới nay vẫn luôn là một developer đủ năng lực phải thực sự hiểu dự án. AI không làm biến mất giới hạn đó. Nó chỉ tạo ra ảo giác rằng chúng ta đã thoát khỏi nó

Sự đảo chiều này còn mạnh hơn vẻ ngoài của nó. Khi code còn đắt để tạo ra, một kỹ sư senior thường có thể review nhanh hơn tốc độ một kỹ sư junior viết code. **AI đảo ngược điều đó: một junior bây giờ có thể tạo ra code nhanh hơn tốc độ một senior có thể kiểm tra nó một cách nghiêm túc.** Yếu tố giới hạn từng giúp việc review còn mang ý nghĩa đã biến mất. **Thứ từng là một cánh cổng kiểm soát chất lượng giờ trở thành một bài toán thông lượng**

## Tôi rất thích test, nhưng test không phải câu trả lời hoàn chỉnh

Phản xạ tự nhiên của chúng ta là dựa nhiều hơn vào những phương pháp kiểm chứng mang tính xác định như unit test, integration test, static analysis, linter hay formatter. Tôi cũng làm vậy rất nhiều trong những dự án phụ thuộc mạnh vào [AI coding agent](https://addyosmani.com/agentic-engineering/ai-coding-agent/). Nếu review của con người đã trở thành nút thắt, hãy tự động hóa chính quá trình kiểm tra. Để máy kiểm tra máy

Điều đó có ích. Nhưng nó có một giới hạn rất rõ

Một bộ test có khả năng bao phủ toàn bộ hành vi quan sát được của hệ thống, trong nhiều trường hợp, sẽ phức tạp hơn cả đoạn code mà nó đang kiểm tra. Một lớp phức tạp mà chúng ta không thể suy luận được cũng chẳng mang lại nhiều an toàn. Sâu hơn nữa là một vấn đề căn bản hơn: bạn không thể viết test cho một hành vi mà bạn chưa từng nghĩ tới

Không ai viết một test để xác nhận rằng một phần tử khi được kéo đi thì không được biến thành hoàn toàn trong suốt. Tất nhiên họ không viết. Khả năng đó chưa bao giờ xuất hiện trong đầu họ. Đây chính xác là kiểu lỗi sẽ lọt qua, không phải vì bộ test được viết kém, mà vì không ai nghĩ rằng mình cần phải nhìn vào đó

Còn một dạng lỗi khác đáng được gọi tên. **Khi AI thay đổi hành vi của implementation rồi đồng thời cập nhật hàng trăm test case để phù hợp với hành vi mới, câu hỏi không còn là “đoạn code này có đúng không?” mà trở thành “tất cả những thay đổi test kia có thật sự cần thiết không, và coverage hiện tại có đủ để bắt được những thứ mà mình còn chưa nghĩ tới hay không?”** Test không thể trả lời câu hỏi đó. Chỉ sự hiểu biết mới làm được

Dữ liệu bắt đầu cho thấy điều tương tự. Một số nghiên cứu cho thấy developer dùng AI theo kiểu giao phó việc sinh code chỉ đạt dưới 40% trong các bài kiểm tra mức độ hiểu, trong khi những người dùng AI để hỏi về khái niệm, tìm hiểu và khám phá các trade-off đạt trên 65%. Công cụ không tự nó phá hủy khả năng hiểu. Cách chúng ta sử dụng nó mới là điều quyết định

Test là cần thiết. Nhưng chưa đủ

## Hãy dựa vào spec, nhưng spec cũng không kể hết câu chuyện

Một giải pháp thường được đề xuất là viết một bản đặc tả bằng ngôn ngữ tự nhiên thật chi tiết trước. Đính kèm nó vào PR. Review spec thay vì review code. Sau đó tin rằng AI sẽ trung thành chuyển ý định ấy thành implementation

Ý tưởng này hấp dẫn giống như Waterfall từng hấp dẫn. Định nghĩa thật kỹ vấn đề trước, rồi mới thực thi. Mọi thứ được chia tách sạch sẽ

Vấn đề nằm ở chỗ quá trình chuyển một bản spec thành phần mềm hoạt động được chứa vô số quyết định ngầm: edge case, cấu trúc dữ liệu, xử lý lỗi, đánh đổi về hiệu năng, cách các thành phần tương tác với nhau. Không một bản spec nào có thể mô tả hết tất cả. **Hai kỹ sư cùng hiện thực một spec vẫn có thể tạo ra hai hệ thống với rất nhiều khác biệt có thể quan sát được.** Không nhất thiết hệ thống nào sai. Chúng chỉ khác nhau. Và rất nhiều khác biệt trong số đó rồi sẽ trở nên quan trọng với người dùng theo những cách mà chẳng ai dự đoán trước

Còn một khả năng khác đáng suy nghĩ. Một bản spec chi tiết tới mức có thể mô tả hoàn toàn một chương trình về cơ bản cũng chính là chương trình đó, chỉ khác là nó được viết bằng một ngôn ngữ không thể thực thi. Chi phí tổ chức để viết những bản spec đủ chi tiết nhằm thay thế việc review code hoàn toàn có thể lớn hơn lợi ích năng suất mà AI mang lại. Và cuối cùng, chúng ta vẫn chưa review thứ thực sự được tạo ra

Vấn đề sâu hơn là trong rất nhiều trường hợp, chẳng tồn tại một bản spec **đúng** ngay từ đầu. Requirement dần xuất hiện trong quá trình xây dựng. Edge case chỉ lộ ra khi hệ thống được sử dụng. Giả định rằng một hệ thống không đơn giản có thể được đặc tả hoàn toàn trước khi bắt đầu xây đã được thử đi thử lại nhiều lần và không mấy thành công. AI không thay đổi điều đó. Nó chỉ thêm vào một tầng mới của những quyết định ngầm được đưa ra mà không có sự cân nhắc của con người

## Học từ lịch sử

Hàng chục năm quản lý chất lượng phần mềm giữa những đội ngũ phân tán, với mức độ hiểu biết và khả năng giao tiếp khác nhau, đã tạo ra rất nhiều phương pháp thực tế được kiểm chứng qua thời gian. Những điều đó không tự nhiên mất đi chỉ vì một thành viên trong team giờ đây là một mô hình AI

**Điều thay đổi với AI là chi phí, giảm rất mạnh, tốc độ, tăng rất mạnh, và chi phí quản lý giữa người với người, gần như bằng không. Điều không thay đổi là nhu cầu phải có một người sở hữu đủ nhiều bối cảnh của hệ thống để giữ được sự hiểu biết nhất quán về codebase đang thật sự làm gì và tại sao nó lại làm như vậy**

Đây là sự tái phân phối giá trị khá khó chịu mà khoảng trống hiểu biết tạo ra

Khi lượng code do AI tạo ra tăng lên, người kỹ sư thật sự hiểu hệ thống trở nên có giá trị hơn chứ không phải kém đi. Đó là khả năng nhìn vào một diff và gần như lập tức nhận ra hành vi nào đang gánh cả hệ thống. Khả năng nhớ vì sao một quyết định kiến trúc được đưa ra trong một đêm căng thẳng tám tháng trước

Đó còn là khả năng phân biệt một refactor an toàn với một refactor đang âm thầm thay đổi thứ mà người dùng đã phụ thuộc vào. Kỹ năng ấy trở thành nguồn tài nguyên khan hiếm mà toàn bộ hệ thống phải dựa vào

## Chúng ta còn có một khoảng trống trong cách đo lường

**Khoảng trống hiểu biết nguy hiểm chính vì gần như không có thứ gì trong hệ thống đo lường hiện tại của chúng ta nhìn thấy nó**

Velocity trông vẫn rất đẹp. DORA metrics vẫn ổn định. Số lượng PR tăng lên. Code coverage vẫn xanh

Các buổi đánh giá hiệu suất nhìn thấy năng suất tăng. Chúng không nhìn thấy sự suy giảm trong mức độ hiểu, vì gần như không một artifact nào mà tổ chức dùng để đo output có chứa chiều kích ấy. Hệ thống khuyến khích đang tối ưu rất đúng cho thứ nó đo. Vấn đề là thứ được đo không còn đại diện đầy đủ cho thứ thật sự quan trọng

Điều này khiến khoảng trống hiểu biết còn âm thầm hơn cả nợ kỹ thuật. Nợ kỹ thuật thường là một sự đánh đổi có ý thức. Bạn chọn đi đường tắt, bạn biết đại khái khoản nợ nằm ở đâu, và có thể lên lịch để trả nó sau. Khoảng trống hiểu biết thì tích tụ gần như vô hình, nhiều khi không hề có ai chủ động quyết định chấp nhận nó. Nó là tổng hợp của hàng trăm lần review mà code nhìn có vẻ ổn, test vẫn pass và phía sau còn một PR khác đang chờ

Giả định của tổ chức rằng **code đã được review đồng nghĩa với code đã được hiểu** không còn đúng nữa. Kỹ sư approve những đoạn code mà họ không thực sự hiểu hết, nhưng hành động approve đó vẫn mang theo một sự bảo chứng ngầm. Trách nhiệm đã được phân tán ra khắp nơi mà chẳng ai để ý

## Quy định pháp lý có thể đến gần hơn chúng ta nghĩ

Bất kỳ ngành nào phát triển quá nhanh cuối cùng cũng thu hút sự quản lý. Ngành công nghệ từ lâu khá được miễn nhiễm với quy luật ấy, một phần vì lỗi phần mềm thường còn có thể sửa được, một phần vì ngành này luôn chạy nhanh hơn tốc độ các nhà quản lý có thể theo kịp

Khoảng thời gian ấy đang dần khép lại. Khi code do AI tạo ra bắt đầu vận hành trong hệ thống y tế, hạ tầng tài chính hay dịch vụ chính phủ, câu nói “AI viết nó và chúng tôi không review hết” sẽ không còn là một lời giải thích có thể đứng vững trong báo cáo sau sự cố, nhất là khi sinh mạng hoặc những tài sản lớn bị đặt vào rủi ro

Những đội ngũ đang xây dựng kỷ luật về sự hiểu biết từ bây giờ, coi việc thật sự hiểu hệ thống chứ không chỉ làm cho test pass là một yêu cầu không thể thương lượng, sẽ có vị thế tốt hơn khi thời điểm ấy đến so với những đội chỉ tối ưu cho tốc độ merge

## Khoảng trống hiểu biết thật sự đòi hỏi điều gì

Câu hỏi đúng lúc này không còn là “làm sao để chúng ta tạo ra nhiều code hơn?”. Câu hỏi nên là “làm sao để chúng ta thật sự hiểu nhiều hơn về những thứ mình đang đưa vào production?”, để người dùng luôn nhận được một trải nghiệm có chất lượng ổn định

Sự thay đổi góc nhìn này kéo theo những hệ quả rất thực tế. Nó có nghĩa là chúng ta phải cực kỳ rõ ràng về việc một thay đổi đáng lẽ phải làm gì trước khi bắt đầu viết nó. Phải xem verification không phải là thứ thêm vào cuối cùng, mà là một ràng buộc cấu trúc ngay từ đầu. Phải duy trì được mô hình tinh thần ở cấp độ toàn hệ thống, thứ giúp chúng ta phát hiện lỗi của AI ở tầng kiến trúc thay vì soi từng dòng code. Và phải thành thật với sự khác biệt giữa hai câu: “test đã pass” và “tôi hiểu đoạn này đang làm gì, cũng như tại sao nó lại làm như vậy”

**Làm cho code trở nên rẻ để tạo ra không có nghĩa là chúng ta cũng có thể bỏ qua việc hiểu nó với giá rẻ. Công việc hiểu hệ thống mới chính là công việc thật sự**

AI có thể đảm nhận phần chuyển đổi ý tưởng thành code. Nhưng vẫn phải có một ai đó hiểu thứ vừa được tạo ra, hiểu vì sao nó được tạo ra theo cách ấy, và liệu những quyết định ngầm nằm bên trong có phải là những quyết định đúng hay không. Nếu không, chúng ta chỉ đang trì hoãn một hóa đơn mà cuối cùng vẫn phải thanh toán đầy đủ

Sớm hay muộn, chúng ta cũng phải trả giá cho sự hiểu biết. Và khoản nợ ấy tích lũy lãi rất nhanh
