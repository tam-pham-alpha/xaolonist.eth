---
slug: "afterglow-ai"
title: "AfterglowAI, khi công ty bắt đầu có trí nhớ"
summary: "GitHub cho biết điều gì vừa thay đổi, MCP tìm lại context, còn AfterglowAI nối con người, dịch vụ, tài liệu và quyết định thành một lớp trí nhớ sống của tổ chức"
author: "Tam Pham"
cowriter: "@aethery"
category: "forge"
status: "published"
date: "2026-09-12"
lang: "vn"
---

Có những buổi chiều hắn đóng laptop lại rồi chợt nhận ra, phần đáng giá nhất của một ngày làm việc đôi khi không nằm trong đoạn code vừa merge. Nó nằm trong những thứ nhỏ hơn và khó nhìn thấy hơn. Một giả thuyết bị loại bỏ sau hai tiếng debug, một câu hỏi đúng được hỏi trong Slack, một quyết định đổi hướng vì ai đó nhớ ra một incident từ sáu tháng trước, hay một chi tiết mà chỉ người đã sống đủ lâu với hệ thống mới biết phải để ý

Code còn lại trong GitHub. Ticket còn lại trong Jira. Tài liệu còn nằm trên Notion. Nhưng lý do vì sao mọi thứ đi đến hình dạng hiện tại thường nằm rải rác giữa rất nhiều nơi, đôi khi nằm trong đầu của một vài người. Khi họ chuyển team hoặc rời khỏi công ty, phần code vẫn còn, nhưng một phần trí nhớ của tổ chức cũng lặng lẽ đi theo

Hắn đang nghĩ về một sản phẩm tạm gọi là **AfterglowAI**. Afterglow là phần ánh sáng còn sót lại sau khi nguồn sáng đã đi qua. Một người có thể rời khỏi một căn phòng, nhưng trong mắt ta vẫn còn một chút ánh sáng của họ. Một nhân viên cũng vậy. Họ để lại code, những cuộc trao đổi, các quyết định, những incident đã từng xử lý và vô số dấu vết nhỏ khác. AfterglowAI không cố giữ lại con người. Nó chỉ cố làm cho những dấu vết ấy đủ rõ để người đến sau còn hiểu được

## Công ty không thiếu dữ liệu, công ty thiếu trí nhớ

Hầu hết doanh nghiệp công nghệ ngày nay đã lưu gần như mọi thứ. GitHub giữ code và lịch sử thay đổi. Notion, Google Drive hay Confluence giữ tài liệu. Slack giữ phần lớn những cuộc trao đổi hàng ngày. Jira và Linear giữ ticket. Datadog, Grafana hay các hệ thống monitoring giữ dấu vết khi production gặp vấn đề

Vấn đề nằm ở chỗ những thứ ấy tồn tại cạnh nhau nhưng không thật sự biết nhau. Một pull request có thể là kết quả của một incident. Incident ấy lại bắt đầu từ một cuộc trao đổi trong Slack. Trong Slack có người nhắc đến một thiết kế cũ trên Notion. Thiết kế ấy được viết bởi một người đã chuyển team từ lâu. Sáu tháng sau, một engineer mới chỉ nhìn thấy đoạn code cuối cùng và rất khó biết vì sao người trước lại chọn cách làm có vẻ kỳ lạ như vậy

Documentation truyền thống cố giải quyết chuyện này bằng cách yêu cầu con người viết thêm tài liệu. Nhưng càng bận thì người ta càng ít viết. Những hệ thống cần tài liệu nhất thường cũng là những hệ thống thay đổi nhanh nhất. Tài liệu được viết hôm nay có thể đã chậm hơn production vài tháng vào cuối năm

AfterglowAI đi theo hướng ngược lại. Thay vì bắt con người tạo thêm knowledge, nó quan sát những dấu vết vốn đã được tạo ra trong quá trình làm việc, rồi cố hiểu mối quan hệ giữa chúng. Knowledge không còn là một công việc bổ sung. Nó trở thành một sản phẩm phụ tự nhiên của công việc hàng ngày

## GitHub là nơi bắt đầu, không phải nơi kết thúc

Nếu phải chọn một nơi để AfterglowAI nhìn vào đầu tiên, hắn sẽ chọn GitHub. Không phải vì GitHub chứa nhiều dữ liệu nhất, mà vì một thay đổi được merge vào code thường có ý nghĩa rõ hơn rất nhiều so với một cuộc thảo luận

Slack chứa hàng nghìn ý tưởng chưa bao giờ được thực hiện. Jira chứa những ticket có thể nằm yên hàng tháng. Notion chứa những thiết kế đã từng đúng nhưng có thể không còn đúng nữa. Một pull request đã merge lại khác. Nó cho thấy tổ chức thực sự đã thay đổi một phần hệ thống

Vì vậy AfterglowAI không cần ngồi quét toàn bộ dữ liệu công ty mỗi ngày. Nó chỉ cần quan sát các sự kiện có ý nghĩa như một pull request vừa merge, một issue vừa được đóng, một release vừa được tạo hoặc một deployment vừa hoàn thành. Mỗi sự kiện giống như tiếng chuông nhỏ báo rằng hôm nay tổ chức có thể vừa học thêm một điều

Từ tiếng chuông ấy, agent mới bắt đầu đi tìm câu chuyện phía sau

```text
GitHub event
     ↓
Afterglow observer
     ↓
Context resolver
     ↓
MCP của các hệ thống liên quan
     ↓
Decision và knowledge
     ↓
Company memory
```

GitHub khi ấy chỉ đóng vai trò làm chiếc neo. Nó nói cho AfterglowAI biết chuyện gì vừa thực sự xảy ra. Phần còn lại là đi tìm lý do

## MCP biến các hệ thống rời rạc thành một không gian có thể hỏi

Một sai lầm dễ mắc phải khi xây sản phẩm kiểu này là tự viết connector cho mọi thứ. Connector cho Slack, connector cho Notion, connector cho Jira, connector cho Google Drive, rồi vài năm sau đội ngũ chỉ còn bận sửa API của người khác

MCP làm cho câu chuyện đơn giản hơn. Nếu doanh nghiệp đã có các MCP chính thức hoặc đủ tin cậy cho GitHub, Notion, Slack, Jira và những hệ thống nội bộ, AfterglowAI không cần sở hữu việc kết nối dữ liệu. Nó chỉ cần biết khi nào phải hỏi và nên hỏi điều gì

Một PR vừa merge có description nhắc đến một ticket. Agent đọc ticket ấy qua MCP. Trong ticket có một link đến tài liệu thiết kế. Agent đọc tiếp tài liệu. Tài liệu lại nhắc một incident cũ. Agent đi tìm incident đó rồi so sánh với thay đổi hiện tại. Quá trình này giống một người senior lần theo vài manh mối quen thuộc để hiểu chuyện gì thật sự đã xảy ra, chỉ khác là agent có thể làm việc ấy đều đặn cho hàng nghìn thay đổi nhỏ

Điểm quan trọng là AfterglowAI không cần ingest toàn bộ Slack hay toàn bộ Notion vào database của mình trước. Nó có thể đọc context theo nhu cầu. Điều này làm kiến trúc nhẹ hơn, giảm dữ liệu rác và cũng khiến ranh giới quyền truy cập dễ kiểm soát hơn

MCP ở phía đầu vào giúp AfterglowAI hiểu doanh nghiệp. Sau này chính AfterglowAI lại có thể cung cấp một MCP ở phía đầu ra để Claude, Cursor, ChatGPT hay các agent nội bộ hỏi lại trí nhớ mà hệ thống đã tích lũy. Một chuẩn giao tiếp được dùng ở cả hai phía, một bên để học và một bên để nhớ

## Bản đồ đầu tiên chỉ cần ba thứ

Để bắt đầu, admin không cần ngồi mô hình hóa toàn bộ công ty. AfterglowAI chỉ cần một bản đồ rất đơn giản giữa **service, employee và document**

Một service biết repository nào thuộc về nó. Một employee biết họ đang phụ trách hoặc thường xuyên làm việc với service nào. Một document biết nó mô tả service hay chủ đề nào. Từ vài mối nối ban đầu ấy, hệ thống có đủ điểm tựa để lần theo những mối quan hệ khác

Theo thời gian, bản đồ ấy tự dày lên. Nếu một engineer liên tục author và review PR của một service, xử lý nhiều incident liên quan và thường xuất hiện trong các design document, hệ thống có thể dần tăng độ tin cậy rằng người đó có domain knowledge sâu về service ấy. Nếu một tài liệu không còn được code hiện tại tham chiếu và nhiều decision mới đã thay thế thiết kế cũ, hệ thống có thể hiểu rằng tài liệu đó vẫn có giá trị lịch sử nhưng không còn là source of truth

Như vậy employee không còn chỉ là một dòng trong org chart. Service cũng không chỉ là một repository. Document cũng không còn là một file đứng riêng lẻ. Giá trị nằm ở những đường nối giữa chúng

```text
Employee ──works_on──────▶ Service
Employee ──authored──────▶ Pull Request
Employee ──made──────────▶ Decision

Pull Request ──changes───▶ Service
Pull Request ──implements▶ Decision

Incident ──affects───────▶ Service
Incident ──resolved_by───▶ Pull Request

Decision ──supported_by──▶ Document
Decision ──supersedes────▶ Decision
```

Sau một thời gian, những đường nối ấy bắt đầu kể được một câu chuyện mà từng hệ thống riêng lẻ không thể kể

## Decision mới là đơn vị tri thức quan trọng nhất

Nếu chỉ lưu document, AfterglowAI sẽ trở thành một search engine khác. Nếu chỉ lưu conversation, nó sẽ trở thành một kho transcript khổng lồ. Hắn nghĩ đơn vị tri thức đáng giữ nhất lại là **decision**

Một decision không chỉ nói rằng code đã thay đổi. Nó cố trả lời vì sao thay đổi ấy xảy ra. Vấn đề ban đầu là gì. Những giả thuyết nào đã được thử. Phương án nào bị loại. Ai tham gia. Bằng chứng nào khiến team đổi hướng. Cuối cùng quyết định ấy được hiện thực hóa bằng PR nào và sau khi deploy thì hệ thống có thực sự tốt hơn không

Đây là phần mà rất ít công cụ trong doanh nghiệp giữ được đầy đủ. Git biết ai thay đổi một dòng code. Jira biết ticket được đóng lúc nào. Slack biết người ta đã nói gì. Nhưng không hệ thống nào mặc định hiểu được toàn bộ chuỗi nhân quả ở giữa

AfterglowAI cố nối chuỗi ấy lại

Một knowledge entry tốt không nhất thiết phải dài. Nó chỉ cần đủ để một người chưa từng tham gia sự việc có thể hiểu được vấn đề, quyết định và bằng chứng phía sau. Quan trọng hơn, mỗi kết luận phải có đường quay về nguồn gốc của nó. Nếu agent nói một quyết định được đưa ra vì incident X, người đọc phải có thể lần ngược về incident ấy, PR liên quan và tài liệu đã được sử dụng

Knowledge lúc đó không còn là lời kể của AI. Nó trở thành một lớp diễn giải đặt trên những bằng chứng thật

## Knowledge phải sống cùng hệ thống

Một trong những vấn đề lớn nhất của tài liệu là chúng già đi. Code tiếp tục thay đổi, còn câu chữ thường đứng yên

AfterglowAI phải xem knowledge như một thứ sống. Một decision được tạo hôm nay có thể bị thay thế sau sáu tháng. Một kiến trúc từng hợp lý trong giai đoạn đầu có thể không còn phù hợp khi traffic tăng lên. Một incident cũ có thể rất giống incident mới, nhưng nguyên nhân cuối cùng lại khác

Vì vậy decision không nên bị ghi đè. Nó nên có lịch sử. Decision mới có thể supersede decision cũ. Knowledge hiện tại cho người dùng biết hệ thống đang vận hành thế nào hôm nay, còn graph phía sau vẫn giữ được con đường đã đưa tổ chức đến đây

Điều này tạo ra một khả năng khá đẹp. Khi engineer hỏi “tại sao chúng ta đang làm như vậy”, AfterglowAI trả lời decision hiện tại. Khi họ hỏi “trước đây chúng ta đã từng làm khác chưa”, hệ thống có thể đi ngược dòng thời gian và kể lại từng lần thay đổi

Công ty bắt đầu có trí nhớ không chỉ về trạng thái hiện tại, mà cả quá trình trưởng thành của chính mình

## Incident và design knowledge có thể tự hình thành

Khi decision graph đã đủ dày, một vài knowledge base khác gần như tự xuất hiện

Incident knowledge không cần được viết lại từ đầu. AfterglowAI có thể gom những incident ảnh hưởng cùng một service, so sánh symptom, nguyên nhân, PR sửa lỗi và outcome sau deployment. Khi một sự cố mới xuất hiện, agent có thể tìm những sự cố cũ có cấu trúc gần giống thay vì chỉ search vài từ khóa giống nhau

Design knowledge cũng có thể hình thành theo cách tương tự. README cho biết service đang được mô tả thế nào. Notion giữ design intent ban đầu. GitHub cho thấy implementation thật. Decision history nói vì sao implementation đã lệch khỏi bản thiết kế ở vài nơi. Khi ghép bốn mảnh này lại, hệ thống có thể tạo ra một bức tranh kiến trúc gần với thực tế hơn rất nhiều so với một diagram được vẽ hai năm trước

Đến đây AfterglowAI không còn chỉ thu thập knowledge. Nó bắt đầu **tổng hợp những lớp tri thức mới từ những bằng chứng vốn đã tồn tại**

## Dữ liệu ra quyết định của một employee dần trở thành digital counterpart

Nếu AfterglowAI hoạt động đủ lâu, một thứ khác bắt đầu xuất hiện tự nhiên. Mỗi employee sẽ để lại một decision history riêng

Người này thường tham gia những service nào. Họ từng xử lý loại incident gì. Trong những tình huống không chắc chắn, họ có xu hướng kiểm tra điều gì trước. Những giả thuyết nào họ thường loại bỏ. Những quyết định nào của họ tồn tại lâu trong production. Khi nào họ chọn một giải pháp đơn giản, khi nào họ chấp nhận thêm complexity để đổi lấy reliability

Đây không phải hồ sơ nhân sự và cũng không nên trở thành công cụ chấm điểm con người. Nó là một bản đồ năng lực được dựng lên từ công việc thật

Qua vài năm, bản đồ ấy có thể đủ dày để hình thành một **digital counterpart**, một phiên bản kỹ thuật số có thể trả lời dựa trên những điều người đó đã thực sự làm và những bằng chứng họ từng để lại. Khi hỏi counterpart về một service, nó không giả vờ “suy nghĩ giống Tâm”. Nó chỉ nói rằng trong các decision trước đây, Tâm từng chọn A thay vì B vì những lý do nào, incident nào đã dẫn đến lựa chọn đó và implementation cuối cùng nằm ở đâu

Ranh giới này quan trọng. AfterglowAI không cố sao chép một con người. Nó cố bảo tồn phần năng lực đã được thể hiện ra trong công việc

Một người có thể rời công ty. Digital counterpart không thay thế họ, nhưng những người đến sau không còn phải bắt đầu từ một căn phòng tối

## Không nên biến trí nhớ thành giám sát

Một sản phẩm giữ lại decision history rất dễ trượt sang hướng employee monitoring nếu thiết kế sai từ đầu

Nếu mục tiêu trở thành đọc mọi prompt, lưu mọi cuộc trò chuyện và đo xem một người đã làm bao nhiêu việc mỗi ngày, AfterglowAI sẽ nhanh chóng trở thành thứ mà nhân viên muốn tránh. Nó cũng thu về rất nhiều noise nhưng chưa chắc hiểu được gì thêm

Hướng hợp lý hơn là quan sát **work artifacts**, những thứ vốn đã thuộc về quá trình vận hành của tổ chức. PR, issue, deployment, design document và incident đều có lý do chính đáng để được lưu. Agent chỉ tìm thêm context khi cần giải thích một thay đổi thật sự đã xảy ra. Knowledge được tạo ra phải luôn có bằng chứng, quyền truy cập phải kế thừa từ các hệ thống nguồn và những phần riêng tư không liên quan đến công việc không cần xuất hiện trong graph

Nếu làm được như vậy, AfterglowAI không phải camera đặt sau lưng nhân viên. Nó giống một người thủ thư ngồi rất yên trong góc, chỉ khi một chương mới của công ty được viết xong thì mới đánh dấu xem chương ấy liên quan đến những trang nào trước đó

## Lõi kỹ thuật có thể nhỏ hơn tưởng tượng

Phiên bản đầu của AfterglowAI không cần một hạ tầng quá cầu kỳ. Một GitHub App nhận webhook có thể làm observer. Một job queue xử lý các event. Một context resolver agent sử dụng MCP để đọc các nguồn liên quan. PostgreSQL lưu entity, relationship, decision và event. pgvector hỗ trợ semantic retrieval cho những đoạn tài liệu cần tìm gần nghĩa. Object storage giữ raw evidence nếu cần audit

Graph database có thể hữu ích trong tương lai, nhưng chưa phải điều cần chứng minh đầu tiên. Thách thức khó nhất không nằm ở việc lưu một triệu cạnh. Nó nằm ở việc agent có đủ chính xác để nhìn một pull request rồi tìm ra đúng context, phân biệt đâu là quyết định thật sự và đâu chỉ là một cuộc trao đổi thoáng qua hay không

Nếu phần đó chưa làm được, Neo4j hay một hệ vector lớn hơn cũng không cứu được sản phẩm. Nếu phần đó làm tốt, hạ tầng còn lại có thể lớn lên dần theo nhu cầu

## Afterglow MCP là lớp trí nhớ quay trở lại công việc

Khi company memory đã đủ dày, AfterglowAI có thể tự trở thành một MCP server

Lúc ấy Cursor, Claude, ChatGPT hay agent nội bộ không cần search từng nguồn riêng lẻ cho những câu hỏi mang tính lịch sử. Chúng có thể hỏi Afterglow rằng ai từng làm nhiều nhất với ZeroHash, tại sao một service dùng Aeron, incident nào trước đây giống lỗi hiện tại, một design đã thay đổi qua những quyết định nào, hay trong sáu tháng qua SDP đã đổi kiến trúc ở đâu

Afterglow MCP không nên chỉ expose document search. Nó nên expose những capability gần với cách người trong công ty thật sự đặt câu hỏi

```text
who_knows(topic)

why_decision(decision_or_service)

similar_incidents(symptoms)

service_history(service)

employee_context(employee, topic)

what_changed(service, since)
```

MCP ở đầu vào giúp Afterglow tìm context. MCP ở đầu ra giúp các AI khác dùng lại context đã được chắt lọc. Một vòng tròn khép kín bắt đầu hình thành

## Điều đầu tiên cần chứng minh

Hắn chưa nghĩ AfterglowAI cần chứng minh rằng nó có thể xây một digital employee hoàn chỉnh. Đó là câu chuyện rất xa và cũng dễ khiến mọi thứ trở nên mơ hồ

Bài toán đầu tiên nhỏ hơn nhiều

Hãy đưa cho AfterglowAI một pull request vừa được merge. Hệ thống phải tự nhận ra service liên quan, tìm đúng ticket và document, lần ra incident nếu có, hiểu những phương án đã được cân nhắc, rồi viết lại thành một decision record mà senior engineer tham gia sự việc đọc xong phải thấy rằng: đúng, đây chính là lý do chúng ta đã làm như vậy

Nếu làm được việc ấy ổn định, mỗi PR tiếp theo sẽ để lại thêm một chút ánh sáng. Sau một năm, công ty có một decision history. Sau vài năm, các service có lịch sử sống của riêng chúng. Những incident cũ bắt đầu giúp giải quyết incident mới. Những design document không còn đứng một mình. Năng lực của từng người cũng dần để lại hình dạng rõ ràng hơn

Rồi đến một ngày, một nhân viên rời đi. Chiếc ghế trống, tài khoản đã tắt, những buổi họp quen thuộc không còn tên họ nữa. Nhưng khi một người mới hỏi vì sao hệ thống được xây theo cách này, công ty vẫn còn một nơi có thể lần theo những dấu chân cũ và tìm thấy câu trả lời

Có lẽ trí nhớ của một tổ chức cũng chỉ bắt đầu từ những thứ nhỏ như vậy. Một pull request, một quyết định, một chút ánh sáng còn sót lại sau khi người ta đã bước qua

*❤️ cowriter aethery*
