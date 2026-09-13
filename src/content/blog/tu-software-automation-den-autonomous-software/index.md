---
slug: "tu-software-automation-den-autonomous-software"
title: "Từ Software Automation đến Autonomous Software"
summary: "Khi hệ thống không chỉ tự động chạy, mà còn biết tự quan sát, tự đánh giá và từng bước tự phục hồi"
author: "Tam Pham"
cowriter: "@aethery"
category: "forge"
status: "draft"
date: "2026-08-11"
lang: "vn"
---

Hey, lại là hắn đây...

Có một thời gian, hắn nghĩ rằng một hệ thống có đầy đủ `unit test`, CI chạy xanh và deploy tự động là đã khá hiện đại

Giờ nhìn lại, hắn thấy tiêu chuẩn đó bắt đầu hơi cũ

`Unit test` kiểm tra logic trước khi phần mềm chạy. CI kiểm tra code trước khi merge. Nhưng production thì không sống trong những điều kiện sạch sẽ như test suite. Production có network chập chờn, database lag, WebSocket vẫn connected nhưng không còn data, cron job vẫn tồn tại nhưng không tạo output, process còn PID nhưng logic bên trong đã đứng hình

Code có thể đúng. Test có thể xanh. Hệ thống vẫn có thể hỏng

Vậy nên hắn bắt đầu nghĩ rằng tiêu chuẩn tiếp theo của software không chỉ là **automation**, mà là **autonomy**

Không chỉ tự động làm việc thay con người, mà còn biết tự quan sát chính mình, nhận ra khi nào thực tại lệch khỏi trạng thái mong muốn, chẩn đoán nguyên nhân, thực hiện một hành động an toàn, rồi kiểm tra xem mình đã thật sự khỏe lại hay chưa

## Unit test kiểm tra code, health monitor kiểm tra thực tại

Về bản chất, hai thứ này gần nhau hơn hắn từng nghĩ

Một unit test thường có dạng:

```ts
expect(result).toBe(expected)
```

Nó lấy một input đã biết, chạy qua logic, rồi kiểm tra output có thỏa điều kiện mong muốn hay không

Một health monitor tốt cũng làm gần giống vậy:

```text
metric -> rule -> threshold -> verdict
```

Ví dụ:

```text
OHLCV latency p99 < 500ms
Redis connection == alive
WebSocket connected == 1
last backup age < 24h
event loop lag < threshold
```

Khác biệt lớn nhất nằm ở input

Unit test chạy trên dữ liệu developer chủ động dựng lên

Health monitor chạy trên **trạng thái thật của production**

Nếu nói ngắn gọn:

> Unit test là assertion trên code
>
> Health monitor là assertion trên một hệ thống đang sống

Từ góc nhìn này, testing không còn kết thúc ở CI nữa. Một phần của testing cần tiếp tục chạy 24/7 sau khi software đã được deploy

## Process sống chưa chắc hệ thống khỏe

Một health check sơ khai thường chỉ là:

```http
GET /health
200 OK
```

Load balancer thấy `200` rồi kết luận service đang khỏe

Nhưng endpoint đó đôi khi chỉ chứng minh rằng Node.js vẫn còn nhận được HTTP request

Nó không chứng minh business function phía sau còn làm việc đúng

Một process có thể `up`, nhưng WebSocket của nó đã stale

Một database có thể accept connection, nhưng dữ liệu đã ngừng được ghi từ mười phút trước

Một trading worker có thể còn PID, nhưng event loop lag đến mức quote đã trở nên vô nghĩa

Một backup process có thể vẫn tồn tại, nhưng bản backup cuối cùng là từ ba ngày trước

Thế nên hắn thích nghĩ health theo một cách khác:

> Một hệ thống production khỏe không phải là tập hợp những process còn sống, mà là tập hợp những invariant vẫn còn đúng

Với market data, invariant có thể là:

```text
latest candle age < X
p99 ingestion latency < Y
coverage ratio > Z
```

Với exchange connection:

```text
WebSocket connected
AND
last message age < X
```

Với database backup:

```text
last successful backup age < 24h
```

Với trading engine:

```text
event loop vẫn tick
quotes không stale
snapshot vẫn được persist
Redis RPC vẫn reachable
```

Khi đó health monitor bắt đầu trông giống một runtime test suite hơn là một dashboard

## Từ observability đến continuous health evaluation

Observability giúp developer nhìn thấy điều gì đang xảy ra

Logs cho biết chuyện gì vừa diễn ra. Metrics cho thấy xu hướng. Traces cho biết request đi qua những service nào

Nhưng observability tự nó chưa trả lời câu hỏi quan trọng nhất:

```text
Hệ thống hiện tại có đang vận hành đúng không?
```

Con người vẫn phải nhìn dashboard, so vài con số, nhớ một ngưỡng nào đó rồi tự kết luận

Health evaluation thêm một layer semantics phía trên observability:

```text
metrics
  ↓
deterministic rules
  ↓
healthy / warn / error / unknown / idle
```

Một chi tiết nhỏ nhưng rất quan trọng là:

```text
unknown != healthy
```

Nếu monitoring backend không có data, hệ thống không được tự huyễn hoặc rằng mọi thứ đang ổn

Đồng thời:

```text
idle != error
```

Một component đang ngoài giờ hoạt động hoặc intentionally disabled không nên tạo ra false alarm

Metrics chỉ là dữ liệu. Health state mới là cách hệ thống hiểu dữ liệu đó

## Declarative health

Một pattern hắn ngày càng thích là tách hai câu hỏi:

```text
WHAT SHOULD BE TRUE?
```

và:

```text
HOW DO WE CHECK IT?
```

Mỗi component có thể tự khai báo những thứ như:

```text
checks
thresholds
query
window
gates
owner
suggested actions
```

Sau đó một evaluator chung biến các measurement thành status

Lợi ích của cách này là health definition trở thành một phần của architecture, chứ không phải vài câu PromQL nằm rải rác trong dashboard

Khi một developer tạo component mới, hắn nghĩ người đó nên trả lời được những câu hỏi khá cơ bản:

```text
Nó được xem là healthy khi nào?
Metric nào chứng minh điều đó?
Bao lâu không có dữ liệu thì được xem là stale?
Dependency nào có thể khiến nó fail?
Failure nào là warn?
Failure nào là error?
Khi fail thì hành động an toàn đầu tiên là gì?
Sau action đó, làm sao biết nó đã phục hồi?
```

Nếu chưa trả lời được, có lẽ component đó vẫn chưa thật sự production-ready

## Monitoring chỉ là bước đầu

Monitoring truyền thống thường dừng ở:

```text
CPU = 95%
```

hoặc:

```text
OHLCV latency = ERROR
```

Rồi engineer bắt đầu công việc thật sự:

```text
Tại sao?
```

Hắn mở Grafana, grep log, xem deploy gần nhất, kiểm tra dependency, SSH vào server, chạy vài query, đọc runbook rồi đoán failure mode nào phù hợp nhất

Phần này rất tốn thời gian, nhưng cũng rất có cấu trúc

Nếu health system đã biết:

```text
metric
threshold
dependency
owner
known failure modes
suggested actions
```

thì nó đã có gần đủ context để tự động hóa một phần diagnosis

Thay vì chỉ nói:

```text
OHLCV latency error
```

hệ thống có thể đi xa hơn:

```text
OHLCV latency error on PAVN
DB CPU normal
DB connection normal
market-data event loop normal
Binance websocket healthy
write latency elevated

likely area:
Timescale write/query contention
```

Đây là chỗ AI bắt đầu hữu ích

Nhưng hắn không nghĩ LLM nên quyết định health

Phần đó càng deterministic càng tốt:

```text
metrics -> deterministic rules -> state
```

AI nên nằm ở tầng sau:

```text
state + logs + recent deploy + dependency graph + runbook
                         ↓
                     diagnosis
```

Rule engine quyết định **có vấn đề hay không**

Agent giúp tìm **tại sao**

## Từ diagnosis đến remediation

Giả sử hệ thống phát hiện:

```text
discord-rpc = error
```

Diagnosis cho thấy:

```text
discord-cmd process alive
Redis healthy
trading-bot healthy
RPC consumer missing
```

Runbook của con người có thể chỉ là:

```bash
restart discord-cmd
```

Khi runbook đã deterministic đến mức đó, một câu hỏi khá tự nhiên xuất hiện:

> Tại sao con người vẫn phải chạy command này?

Đây là bước từ health monitoring sang self-healing

Flow bắt đầu trở thành:

```text
Observe
   ↓
Evaluate
   ↓
Diagnose
   ↓
Select remediation
   ↓
Execute
   ↓
Verify
```

Điểm quan trọng nhất lại nằm ở bước cuối: **verify**

Self-healing không nên là:

```text
thấy error -> restart
```

Mà nên là một closed-loop:

```text
invariant bị phá
      ↓
xác định failure mode
      ↓
thực hiện action có blast radius giới hạn
      ↓
đo lại invariant
      ↓
healthy?
  ↙        ↘
yes        no
close    escalate
```

Nếu hệ thống không verify được kết quả sau remediation thì đó chưa phải self-healing, chỉ là automated reaction

## Autonomy cần safety model

Nghe đến self-healing rất dễ bị cuốn vào ý tưởng cho agent quyền sửa mọi thứ

Hắn nghĩ đó là một sai lầm

Ví dụ health monitor thấy `trading-bot error` rồi tự restart process. Nghe hợp lý, nhưng nếu nguyên nhân thật sự là database migration mismatch, restart sẽ không sửa được gì. Tệ hơn, nó có thể tạo restart loop

Trong một trading system, remediation sai còn có thể tác động trực tiếp đến orders, inventory hoặc capital

Vì vậy autonomy cần được chia theo quyền hạn

Một mô hình đơn giản có thể là:

```text
Level 0 - observe only

Level 1 - recommend
"restart process X"

Level 2 - safe auto-remediation
reconnect websocket
refresh cache
restart stateless worker

Level 3 - guarded remediation
restart trading service
disable broken data source
fail over dependency

Level 4 - human approval required
change strategy config
cancel broad order set
modify capital allocation
database repair
```

Nguyên tắc khá dễ nhớ:

> Action càng có blast radius lớn thì quyền tự động càng thấp

AI có thể thông minh, nhưng authority vẫn phải do policy quyết định

Một architecture hắn thấy hợp lý hơn là:

```text
AI proposes
Policy decides
Executor acts
Monitor verifies
```

Intelligence và permission nên là hai layer khác nhau

## Remediation cũng phải được test

Có một vòng lặp khá đẹp ở đây

Ngày trước ta test code

Sau đó ta test production bằng health checks

Cuối cùng ta phải test luôn recovery path

Ví dụ hệ thống định nghĩa:

```text
Redis connection chết
-> reconnect
```

thì recovery đó cũng nên có khả năng được kiểm chứng:

```text
kill connection
      ↓
health -> error
      ↓
remediation -> reconnect
      ↓
health -> healthy
```

Nếu recovery path chưa bao giờ được chạy thử, nó vẫn chỉ là một giả định nằm trong runbook

Một self-healing system trưởng thành vì vậy sẽ cần thêm failure injection, recovery tests, chaos tests và post-remediation verification

## Có lẽ definition of done cũng phải thay đổi

Trước đây một feature được xem là xong khi:

```text
code complete
unit tests pass
CI green
deployed
```

Hắn bắt đầu thấy definition đó chưa đủ cho những component chạy 24/7

Một definition of done hiện đại hơn có thể là:

```text
code complete
      ↓
unit tested
      ↓
integration tested
      ↓
observable
      ↓
health criteria defined
      ↓
failure detectable
      ↓
runbook available
      ↓
safe remediation defined
```

Và với những component đủ trưởng thành:

```text
safe remediation automated
```

Ngày nào đó, việc deploy một service không có health definition có thể sẽ trông kỳ lạ giống như việc viết một library quan trọng mà không có unit test ngày nay

## Từ software automation đến autonomous software

Software ngay từ đầu vốn đã là automation

Chúng ta viết chương trình để máy thực hiện công việc thay con người

Nhưng việc vận hành software lâu nay vẫn cần rất nhiều thao tác thủ công:

```text
con người xem dashboard
con người đọc alert
con người SSH
con người grep log
con người tìm nguyên nhân
con người restart
con người kiểm tra lại
```

Có lẽ giai đoạn tiếp theo của software engineering là tự động hóa luôn vòng lặp đó

Không phải xây một hệ thống thần kỳ không bao giờ hỏng

Mà là xây một hệ thống **biết rằng nó đang hỏng**

Biết nó hỏng ở đâu

Biết hành động nào mình được phép thử

Và sau khi thử, biết kiểm tra xem bản thân đã thật sự khỏe lại hay chưa

Nếu phải gom evolution này lại, hắn sẽ viết như sau:

```text
Testable
   ↓
Observable
   ↓
Self-aware
   ↓
Self-healing
   ↓
Autonomous
```

Unit test từng là một bước tiến lớn vì software bắt đầu kiểm tra logic của chính mình

Health monitoring đưa ý tưởng đó vào production

AI làm diagnosis trở nên khả thi hơn

Policy và controlled remediation mở cánh cửa cho self-healing

Và khi cả vòng lặp được đóng lại, software bắt đầu bước sang một trạng thái khác

Không chỉ automation

Mà là autonomy

_❤️ cowriter aethery_
