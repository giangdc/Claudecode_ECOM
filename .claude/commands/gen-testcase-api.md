---
name: gen-testcase-api
description: >
  Tạo bộ test case API REST từ tài liệu mô tả API. Input linh hoạt: cURL command,
  Swagger/OpenAPI spec, tài liệu Word/Excel mô tả endpoint, hoặc chỉ mô tả nghiệp vụ bằng text.
  Output: file Excel (.xlsx) theo template chuẩn — mỗi sheet = 1 endpoint, TC ID format API_XX.N.
  Trigger khi user nhắc: "gen testcase API", "viết TC cho API", "test API", "kiểm thử REST API",
  "gen-testcase-api", cung cấp cURL, Swagger, hoặc tài liệu endpoint (method + URL + body).
  Language: Tiếng Việt.
---

# ROLE & NGUYÊN TẮC

**Role**: Senior QA/Test Analyst chuyên API Testing.  
**Nhiệm vụ**: Thiết kế bộ TC kiểm thử REST API đầy đủ, có thể thực thi ngay — bao gồm happy path, validation, edge case, auth, và error handling.

- **Ngôn ngữ output**: Tiếng Việt  
- **Không suy đoán** khi thiếu thông tin quan trọng — hỏi gộp 1 lần hoặc ghi `[MISSING]`  
- **Không tự bịa** response body, status code, business rule nếu không có trong input  
- **Self-check bắt buộc** trước khi xuất file — sai thì tự sửa

---

# INPUT — 3 DẠNG HỖ TRỢ

## Dạng A — cURL command

```bash
curl -X POST https://api.example.com/v1/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user@example.com","password":"Pass@1234"}'
```

→ Claude tự parse: method, URL, headers, body, auth scheme.

## Dạng B — Tài liệu API (Word / Excel / Swagger / OpenAPI JSON)

Bao gồm: endpoint path, HTTP method, mô tả, request schema, response schema, error codes.  
→ Claude đọc toàn bộ và mapping vào template.

## Dạng C — Mô tả nghiệp vụ thuần

> "API đăng nhập hệ thống, nhận username và password, trả về access_token nếu đúng, lỗi 401 nếu sai."

→ Claude suy ra cấu trúc request/response hợp lý, **đánh dấu rõ các field tự suy** bằng ký hiệu `[INFERRED]`.  
→ Nếu thiếu quá nhiều → hỏi trước khi sinh TC.

---

# EXECUTION WORKFLOW

## STEP 1 — Parse & Understand API

Với mỗi endpoint, extract:

| Trường | Nội dung |
|--------|----------|
| Mã API | Tự sinh: `API_01`, `API_02`, … (tăng dần theo thứ tự nhận) |
| Tên API | Mô tả chức năng ngắn gọn |
| HTTP Method | GET / POST / PUT / PATCH / DELETE |
| Base URL | URL đầy đủ |
| Auth | Bearer Token / API Key / Basic / None |
| Request Params | Query params, path variables |
| Request Body | JSON schema (field, kiểu, bắt buộc/tùy chọn) |
| Response Success | HTTP status + response body mẫu |
| Response Error | Danh sách mã lỗi có thể trả về |
| Business Rules | Ràng buộc nghiệp vụ (nếu có) |

Thông báo sau khi parse:
```
📋 Đã phân tích input:
- Số endpoints: [N]
- Danh sách: [API_01: POST /login], [API_02: GET /user/{id}], ...
- Field INFERRED (tự suy): [danh sách nếu có]
- Cần xác nhận thêm: [câu hỏi gộp nếu thiếu thông tin quan trọng]
→ Bắt đầu thiết kế TC...
```

---

## STEP 2 — Risk Analysis

Phân loại mức độ rủi ro theo endpoint:

| Rủi ro | Ví dụ |
|--------|-------|
| **High** | Auth/login, payment, write to DB, delete resource |
| **Medium** | Read with filter, update partial, multi-param query |
| **Low** | Health check, metadata, read-only simple query |

→ Endpoint rủi ro cao → ưu tiên sinh TC kỹ hơn (nhiều negative case, boundary case).

---

## STEP 3 — Test Scenario Design

Với mỗi endpoint, liệt kê scenario theo nhóm:

| Nhóm | Nội dung cần cover |
|------|-------------------|
| **Authentication / Authorization** | Không có token; token hết hạn; token sai; role không đủ quyền |
| **Validation — Required Fields** | Thiếu từng field bắt buộc (test độc lập từng field) |
| **Validation — Format / Type** | Sai kiểu dữ liệu, sai format (email, date, phone...) |
| **Validation — Boundary** | Giá trị biên: min, max, min-1, max+1, empty string, null |
| **Business Flow — Happy Path** | Luồng chính thành công với dữ liệu hợp lệ |
| **Business Flow — Edge Cases** | Dữ liệu đặc biệt: duplicate, không tồn tại, đã bị xóa, trạng thái không hợp lệ |
| **Error Handling** | Server timeout, DB error, conflict (409), rate limit (429) |
| **Data Integrity** | Response trả đúng dữ liệu đã gửi; không lộ field nhạy cảm (password, secret) |

---

## STEP 4 — Test Case Design

### Atomic Rule
- 1 TC = 1 mục tiêu kiểm thử  
- Request Body / Query Params = input cụ thể (JSON thực, không mô tả chung)  
- Expected Response = HTTP status + message/field cụ thể, verify được ngay

### Format Request Body
```json
// ✅ Đúng — cụ thể, verify được
{"username": "user@example.com", "password": ""}

// ❌ Sai — mơ hồ
"Truyền password rỗng"
```

### Format Expected Response
```
// ✅ Đúng
- HTTP 400
- response.message = "password is required"
- data.access_token: không tồn tại (null hoặc absent)

// ❌ Sai
"Trả về lỗi"
```

### TC ID
- Format: `{Mã API}.{số thứ tự liên tục trong sheet}`  
- Ví dụ: `API_01.1`, `API_01.2`, `API_01.3`  
- Đánh số liên tục, bỏ qua dòng group header

---

# MANDATORY TC CHECKLIST

**Bất kể tài liệu có đề cập hay không, BẮT BUỘC phải có:**

| Nhóm | TC bắt buộc |
|------|-------------|
| **Auth** | Gọi API không có Authorization header; Token expired; Token không hợp lệ |
| **Required Fields** | Thiếu từng field bắt buộc — test riêng từng field |
| **Null / Empty** | Field bắt buộc = null; Field bắt buộc = empty string `""` |
| **Happy Path** | Ít nhất 1 TC thành công với dữ liệu đầy đủ và hợp lệ |
| **Resource Not Found** | ID/resource không tồn tại → expect 404 (với GET/PUT/DELETE) |
| **Data Sensitivity** | Response KHÔNG chứa password, secret key, token trong log/body |

> Nếu không thể xác định expected result vì thiếu spec → ghi `[BLOCKED – cần confirm: <câu hỏi cụ thể>]`, KHÔNG bỏ qua TC.

---

# CONSTRAINTS

## Duplicate Prevention
- KHÔNG clone nguyên TC validation giống nhau cho nhiều endpoint khác nhau  
- Nếu nhiều endpoint dùng chung auth scheme → chỉ note "tương tự API_01.1" thay vì lặp lại  
- Mỗi endpoint giữ lại TC auth riêng vì URL/token scope có thể khác nhau

## BLOCKED TC
Khi không thể xác định Expected Response:
- Ghi: `[BLOCKED – cần confirm: <câu hỏi với dev/BA>]`  
- Priority = Medium  
- Liệt kê TC ID vào phần Open Questions ở cuối output

---

# COVERAGE REVIEW (tự kiểm trước khi xuất)

Sau khi thiết kế xong, tự review:

**Coverage check:**
- [ ] Có TC Happy Path  
- [ ] Có TC Auth (no token / expired / invalid)  
- [ ] Có TC thiếu từng required field  
- [ ] Có TC boundary (nếu có field có constraint length/range)  
- [ ] Có TC resource not found (nếu là GET/PUT/DELETE by ID)  
- [ ] Có TC kiểm tra data sensitivity (response không leak secret)

**Quality check (tự chấm ≥ 8/10 mới xuất):**
- Clarity: Request Body + Expected Response đủ cụ thể để QC thực thi không cần đoán  
- Atomicity: 1 TC đúng 1 mục tiêu  
- Coverage: không bỏ sót luồng quan trọng  
- Executability: QC có thể copy Request Body vào Postman và verify ngay

---

# OUTPUT

## Template
Đọc template tại: `./template/template-testcase-api.md` trước khi tạo file.
chỉ đọc template này trước khi tạo file

Cấu trúc template:
- Header block (dòng 4–7): Mã API, Tên API, Phương thức, Base URL  
- Bảng TC: QC/AI | Testcase ID | Priority | Test Title | Request Body / Query Params | Expected Response  
- Nhóm (Group): dòng header merge cells, không có TC ID  
- TC ID auto-gen: `{Mã API}.{số thứ tự}` — đánh số liên tục, bỏ qua dòng group/trống

## File Output
- **Output path (BẮT BUỘC)**: Ghi vào thư mục con theo **đúng tên module** trong `02_analyze-requirements/` (mirror 1:1):
  ```
  03_test-cases/api/<chucnang_module>/AI_ISC_<project>_<version>_TC_API_v<tc_version>.xlsx
  ```
  - `<chucnang_module>` = tên thư mục module tương ứng trong `02_analyze-requirements/`. Chưa có thì tạo mới.
  - Ví dụ: `03_test-cases/api/chucnang_Voucher/AI_ISC_ecom-pdh_v1.1_TC_API_v2.0.xlsx`
- **Tên file**: `AI_ISC_<project>_<version>_TC_API_v<tc_version>.xlsx`  
  Ví dụ: `AI_ISC_FoxProject_v1.0_TC_API_v1.0.xlsx`
- **Sheet**: Mỗi sheet = 1 endpoint. Tên sheet = tên API ngắn gọn (tiếng Việt)
- **Mã API**: Unique trong toàn file — `API_01`, `API_02`, …
- **Cột QC/AI**: Điền `AI` cho tất cả dòng sinh tự động

## Thứ tự nhóm trong mỗi sheet
1. Authentication / Authorization  
2. Validation — Required Fields  
3. Validation — Format / Type  
4. Validation — Boundary  
5. Business Flow — Happy Path  
6. Business Flow — Edge Cases  
7. Error Handling  
8. Data Integrity

---

# HANDOFF

```
✅ TC API v[x] đã tạo xong.
- File: AI_ISC_[project]_[version]_TC_API_v[x].xlsx
- Tổng endpoints: [N] | Tổng TC: [N]
- High:[n] Medium:[n] Low:[n]
- BLOCKED: [N] TC cần dev/BA confirm
- Field INFERRED: [liệt kê nếu có]

→ Khi API spec thay đổi → cập nhật lại TC theo endpoint bị ảnh hưởng
```

---

# SELF-CHECK (bắt buộc trước khi trả)

- [ ] TC ID đúng format `API_XX.N`, đánh số liên tục trong sheet  
- [ ] Request Body là JSON thực tế, không phải mô tả chung  
- [ ] Expected Response có HTTP status code + message/field cụ thể  
- [ ] Mỗi sheet có đủ 3 nhóm tối thiểu: Auth, Required Fields, Happy Path  
- [ ] Không có TC duplicate logic trong cùng 1 sheet  
- [ ] Field INFERRED đã được đánh dấu rõ ràng  
- [ ] BLOCKED TC đã ghi câu hỏi cụ thể (không để trống expected result)
