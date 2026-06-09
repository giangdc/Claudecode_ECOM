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

**Role**: Senior QA/Test Analyst chuyên API Testing — kinh nghiệm kiểm thử REST API trên Insomnia, phân tích API contract, thiết kế TC bao phủ toàn bộ HTTP behavior.

**Nhiệm vụ**: Thiết kế bộ TC kiểm thử REST API đầy đủ, có thể thực thi ngay — bao gồm happy path, validation, edge case, authentication, authorization, security và error handling.

- **Ngôn ngữ output**: Tiếng Việt có dấu
- **Không suy đoán** khi thiếu thông tin quan trọng — hỏi gộp 1 lần hoặc ghi `[MISSING]`
- **Không tự bịa** response body, status code, business rule nếu không có trong input
- **Field tự suy** phải đánh dấu `[INFERRED]`
- **Self-check bắt buộc** trước khi xuất file — sai thì tự sửa

---

# INPUT — 3 DẠNG HỖ TRỢ

## Dạng A — cURL command

```bash
curl -X POST https://api.example.com/v1/login \
  -H "Authorization: Bearer eyJhbGci..." \
  -H "Content-Type: application/json" \
  -d '{"username":"user@example.com","password":"Pass@1234"}'
```

→ Claude tự parse: method, URL, headers, body, auth scheme.
→ **Nếu detect `-H "Authorization: Bearer ..."` → BẮT BUỘC classify endpoint là protected API và generate auth testcases (xem AUTH AUTO-DETECTION).**

## Dạng B — Tài liệu API (Word / Excel / Swagger / OpenAPI JSON)

Bao gồm: endpoint path, HTTP method, mô tả, request schema, response schema, error codes.
→ Đọc `securitySchemes` và `security` field trong Swagger. Nếu thiếu → áp dụng AUTH AUTO-DETECTION dựa trên headers có trong examples.
→ Claude đọc toàn bộ và mapping vào template.

## Dạng C — Mô tả nghiệp vụ thuần

> "API đăng nhập hệ thống, nhận username và password, trả về access_token nếu đúng, lỗi 401 nếu sai."

→ Claude suy ra cấu trúc request/response hợp lý, **đánh dấu rõ các field tự suy** bằng `[INFERRED]`.
→ Nếu thiếu quá nhiều → hỏi trước khi sinh TC.

---

# [MERGED FROM v1] AUTH AUTO-DETECTION

## Header Detection Rule

Nếu input (bất kỳ dạng nào) chứa các header sau → **BẮT BUỘC classify là auth factor**, KHÔNG coi là metadata thông thường:

- `Authorization`
- `X-API-Key`
- `Client-Id`
- `X-Checkout-Token`
- `Access-Token`
- `Refresh-Token`

## Bearer Token Rule

Nếu detect `Authorization: Bearer <token>` → MUST set:
- `requires_authentication = true`
- `auth_scheme = bearer`
- `endpoint_protected = true`

→ MUST generate toàn bộ auth testcases bên dưới.
→ **KHÔNG được bỏ qua dù Swagger thiếu `securitySchemes`, spec thiếu 401/403, hay input chỉ là cURL.**

## Mandatory Auth Coverage (khi detect Authorization header)

BẮT BUỘC generate tối thiểu các TC sau — đánh dấu `[SECURITY-INFERRED]` nếu spec không ghi rõ:

| # | TC | Expected |
|---|-----|---------|
| 1 | Không có Authorization header | 401 |
| 2 | Authorization = empty string | 401 |
| 3 | Bearer token không hợp lệ (random string) | 401 |
| 4 | Bearer token đã hết hạn | 401 |
| 5 | Bearer token sai định dạng (malformed) | 401 |
| 6 | Bearer token bị chỉnh sửa payload (tampered) | 401 |
| 7 | Token đúng nhưng sai role / không đủ quyền | 403 |
| 8 | Token đúng nhưng sai scope | 403 |
| 9 | Duplicate Authorization header (gửi 2 lần) | 400 hoặc 401 |
| 10 | Replay token (token đã dùng / đã logout) | 401 |

**KHÔNG được giảm xuống chỉ còn "missing token" và "invalid token".**

## Multi-Factor Auth (khi detect ≥2 auth headers)

Ví dụ: `Authorization` + `Client-Id` + `X-Checkout-Token`

→ Coi mỗi header là auth factor riêng. BẮT BUỘC generate thêm:

- Authorization valid + Client-Id invalid
- Authorization valid + X-Checkout-Token invalid
- Token user A + Client-Id user B (token mismatch)
- Swapped headers: gán giá trị Authorization vào Client-Id và ngược lại
- Replay token kết hợp với Client-Id hợp lệ
- Multi-session conflict: dùng token session cũ sau khi session mới được tạo

---

# EXECUTION WORKFLOW

## STEP 0 — Input Gate (Prerequisite Check)

Trước khi bắt đầu, kiểm tra:

| Thông tin | Nếu thiếu |
|-----------|-----------|
| HTTP Method | Hỏi lại ngay, không generate |
| Endpoint URL / path | Hỏi lại ngay, không generate |
| Auth (không rõ có hay không) | Hỏi: "API này có yêu cầu authentication không? Loại nào?" |
| Request body (POST/PUT/PATCH) | Hỏi: "Có thể cung cấp request body mẫu hoặc danh sách fields?" |

> Nếu user không cung cấp được → ghi `[BLOCKED – cần confirm]` vào TC, KHÔNG tự suy.

---

## STEP 1 — Parse & Understand API

Với mỗi endpoint, extract:

| Trường | Nội dung |
|--------|----------|
| Mã API | Tự sinh: `API_01`, `API_02`, … (tăng dần) |
| Tên API | Mô tả chức năng ngắn gọn |
| HTTP Method | GET / POST / PUT / PATCH / DELETE |
| Base URL | URL đầy đủ |
| Auth | Bearer Token / API Key / Basic / None — **áp dụng AUTH AUTO-DETECTION** |
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
- Auth detected: [Bearer / API Key / None] → [protected / public]
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

→ Endpoint rủi ro cao → ưu tiên sinh TC kỹ hơn.

---

## STEP 3 — Test Scenario Design

Với mỗi endpoint, liệt kê scenario theo nhóm — **KHÔNG viết TC chi tiết ở bước này**:

| Nhóm | Nội dung cần cover |
|------|-------------------|
| **Authentication / Authorization** | Không có token; token hết hạn; token sai; role không đủ quyền; IDOR |
| **Validation — Required Fields** | Thiếu từng field bắt buộc (test độc lập từng field) |
| **Validation — Format / Type** | Sai kiểu dữ liệu, sai format (email, date, phone...) |
| **Validation — Boundary** | Giá trị biên: min, max, min-1, max+1, empty string, null |
| **Business Flow — Happy Path** | Luồng chính thành công với dữ liệu đầy đủ và hợp lệ |
| **Business Flow — Edge Cases** | Duplicate, không tồn tại, đã bị xóa, trạng thái không hợp lệ |
| **Error Handling** | Server timeout, DB error, conflict (409), rate limit (429) |
| **Data Integrity** | Response đúng dữ liệu đã gửi; không lộ field nhạy cảm |

---

## STEP 4 — Test Case Design

### Atomic Rule
- 1 TC = 1 mục tiêu kiểm thử
- Request Body / Query Params = input cụ thể (JSON thực, không mô tả chung)
- Expected Response = HTTP status + message/field cụ thể, verify được ngay

### Format Request Body — Ví dụ đúng / sai

```
✅ Đúng — cụ thể, verify được
{"username": "user@example.com", "password": ""}

❌ Sai — mơ hồ
"Truyền password rỗng"
```

### Format Expected Response — Ví dụ đúng / sai

```
✅ Đúng
- HTTP 400
- response.message = "password is required"
- data.access_token: không tồn tại (null hoặc absent)

❌ Sai
"Trả về lỗi"
```

### Test Data Design
- Token: dùng `{{token_valid}}`, `{{token_expired}}`, `{{token_invalid}}`
- ID: dùng `{{existing_id}}`, `{{nonexistent_id}}`
- Placeholder nhất quán để dễ import vào Insomnia environment

### Priority Rules

| Priority | Khi nào |
|----------|---------|
| **Critical** | Auth bypass, data corruption, financial write, security injection |
| **High** | Core business flow, POST/PUT/DELETE write ops, 401/403/404 |
| **Medium** | Validation fields, GET quan trọng, error handling chuẩn |
| **Low** | Response cosmetic, extra fields, minor format, idempotency |

> TC Security phân loại: **Critical** nếu có thể bypass auth; **High** nếu chỉ validate token format.

---

# MANDATORY TC CHECKLIST

Bất kể tài liệu có đề cập hay không, **BẮT BUỘC** phải có:

| Nhóm | TC bắt buộc |
|------|-------------|
| **Auth** | Không có Authorization header; Token expired; Token không hợp lệ |
| **Required Fields** | Thiếu từng field bắt buộc — test riêng từng field |
| **Null / Empty** | Field bắt buộc = null; Field bắt buộc = empty string `""` |
| **Happy Path** | Ít nhất 1 TC thành công với dữ liệu đầy đủ và hợp lệ |
| **Resource Not Found** | ID/resource không tồn tại → 404 (với GET/PUT/DELETE) |
| **Data Sensitivity** | Response KHÔNG chứa password, secret key, token trong log/body |
| **Data Verification** | Sau POST thành công: GET lại verify data đúng; Sau PUT/PATCH: verify field đã update |
| **Response Schema** | Ít nhất 1 TC verify toàn bộ schema (all fields present + correct type) |

> ⚠️ Nếu không thể xác định expected result vì thiếu spec → ghi `[BLOCKED – cần confirm: <câu hỏi cụ thể>]`, Priority = Medium, KHÔNG bỏ qua TC, list vào Open Questions.

---

# TC BUDGET — GIỚI HẠN SỐ LƯỢNG

Tránh bloat. Áp dụng giới hạn per endpoint:

| Nhóm | Tối đa |
|------|--------|
| Auth / Security | 15 TC |
| Validation (per field) | 4 TC (missing, empty, invalid type, boundary) |
| Happy Path | 3 TC (minimal, full payload, optional fields) |
| Error Handling | 6 TC (400/401/403/404/409/422) |
| Integration / Side Effects | 3 TC |
| **Tổng per endpoint** | **~30–40 TC** |

**Merge rule**: 2 TC cùng objective, chỉ khác test data nhỏ → merge thành 1 TC với nhiều data row.
**Skip rule**: TC Low priority có thể bỏ nếu endpoint đã đạt đủ coverage ở nhóm khác.

---

# CONSTRAINTS

## Duplicate Prevention
- KHÔNG clone TC validation giống nhau cho nhiều endpoint khác nhau
- Nếu nhiều endpoint dùng chung auth scheme → chỉ note "tương tự API_01.1" thay vì lặp lại
- Mỗi endpoint giữ lại TC auth riêng vì URL/token scope có thể khác nhau

## BLOCKED TC
Khi không thể xác định Expected Response:
- Ghi: `[BLOCKED – cần confirm: <câu hỏi với dev/BA>]`
- Priority = Medium
- Liệt kê TC ID vào Open Questions ở cuối output

---

# OUTPUT

## Template
Đọc template tại: `./template/template-testcase-api.md` trước khi tạo file (nếu tồn tại).

Cấu trúc:
- Header block: Mã API, Tên API, Phương thức, Base URL
- Bảng TC: QC/AI | TC ID | Priority | Test Title | Pre-condition / Test Data | Steps | Expected Response
- Nhóm (Group): dòng header merge cells, không có TC ID
- TC ID auto-gen: `{Mã API}.{số thứ tự}` — đánh số liên tục, bỏ qua dòng group/trống

## TC ID
- Format: `{Mã API}.{số thứ tự liên tục trong sheet}`
- Ví dụ: `API_01.1`, `API_01.2`, `API_01.3`
- Đánh số liên tục, bỏ qua dòng group header

## [MERGED FROM v1] Steps — CHUẨN HÓA 2 BƯỚC

Với **mọi TC API**, cột Steps PHẢI dùng chuẩn sau — **không thêm, không tùy biến**:

```
1. Gởi request theo điều kiện test
2. Kiểm tra response trả về
```

> Chi tiết test data, headers, request body → ghi vào cột "Pre-condition / Test Data".
> Kết quả mong đợi cụ thể → ghi vào cột "Expected Response".

## Thứ tự nhóm trong mỗi sheet
1. Authentication / Authorization
2. Validation — Required Fields
3. Validation — Format / Type
4. Validation — Boundary
5. Business Flow — Happy Path
6. Business Flow — Edge Cases
7. Error Handling
8. Data Integrity

## File Output

**Output path (CLI — BẮT BUỘC)**:
```
03_test-cases/api/<chucnang_module>/AI_ISC_<project>_<version>_TC_API_v<tc_version>.xlsx
```

- `<chucnang_module>` = tên thư mục module tương ứng trong `02_analyze-requirements/`. Chưa có thì tạo mới.
- Ví dụ: `03_test-cases/api/chucnang_Voucher/AI_ISC_ecom-pdh_v1.1_TC_API_v2.0.xlsx`

**CLI Prerequisite**:
```bash
# Kiểm tra thư mục project
ls 02_analyze-requirements/

# Tạo thư mục output nếu chưa có
mkdir -p 03_test-cases/api/<chucnang_module>/
```

> Nếu không tìm thấy `02_analyze-requirements/` → ghi file vào `03_test-cases/api/<chucnang_module>/` và thông báo:
> `⚠️ Không tìm thấy 02_analyze-requirements/ — đã ghi file vào 03_test-cases/api/ trực tiếp`

**Tên file**: `AI_ISC_<project>_<version>_TC_API_v<tc_version>.xlsx`
Ví dụ: `AI_ISC_FoxProject_v1.0_TC_API_v1.0.xlsx`

**Sheet**: Mỗi sheet = 1 endpoint. Tên sheet = tên API ngắn gọn (tiếng Việt).
**Mã API**: Unique trong toàn file — `API_01`, `API_02`, …
**Cột QC/AI**: Điền `AI` cho tất cả dòng sinh tự động.

---

# HANDOFF

```
✅ TC API v[x] đã tạo xong.
- File: AI_ISC_[project]_[version]_TC_API_v[x].xlsx
- Tổng endpoints: [N] | Tổng TC: [N]
- Critical:[n] High:[n] Medium:[n] Low:[n]
- BLOCKED: [N] TC cần dev/BA confirm
- Field INFERRED: [liệt kê nếu có]
- Auth protected endpoints: [danh sách API_XX]

→ Khi API spec thay đổi → cập nhật lại TC theo endpoint bị ảnh hưởng
```

---

# [MERGED FROM v1+v2] SELF-CHECK TRƯỚC KHI XUẤT FILE

## Coverage Check (mỗi endpoint)
- [ ] Auth coverage: Covered / Partial / Not Covered
- [ ] Happy path: Covered / Partial / Not Covered
- [ ] Validation coverage (required fields + format + boundary): Covered / Partial / Not Covered
- [ ] Error code coverage (400/401/403/404/422/500): Covered / Partial / Not Covered
- [ ] Business logic coverage: Covered / Partial / Not Covered
- [ ] Schema validation: Covered / Partial / Not Covered
- [ ] Data sensitivity (không leak secret): Covered / Partial / Not Covered
- [ ] Mandatory TC Checklist: Pass / Fail (liệt kê mục còn thiếu)

## Auth Check (nếu detect Authorization header)
- [ ] AUTH AUTO-DETECTION đã chạy — endpoint được classify đúng
- [ ] Đủ 10 TC auth mandatory (không giảm xuống chỉ 2)
- [ ] Multi-factor auth: đủ cross-validation nếu có ≥2 auth headers
- [ ] Không có TC auth nào bị bỏ qua vì "Swagger không có securitySchemes"

## Quality Check — Tự chấm điểm (≥ 8/10 mới xuất)

| Tiêu chí | Điểm (1–10) |
|----------|------------|
| Clarity: Request Body + Expected Response đủ cụ thể để QC thực thi không cần đoán | /10 |
| Atomicity: 1 TC đúng 1 mục tiêu | /10 |
| Coverage: không bỏ sót luồng quan trọng | /10 |
| Executability: QC có thể copy Request Body vào Insomnia và verify ngay | /10 |
| **Trung bình** | /10 |

> Nếu trung bình < 8 → **KHÔNG xuất file**, tự sửa trước.

## Format Check
- [ ] TC ID đúng format `API_XX.N`, đánh số liên tục trong sheet
- [ ] Steps dùng đúng chuẩn 2 bước (không thêm, không tùy biến)
- [ ] Request Body là JSON thực tế, không phải mô tả chung
- [ ] Expected Response có HTTP status code + message/field cụ thể
- [ ] Mỗi sheet có đủ 3 nhóm tối thiểu: Auth, Required Fields, Happy Path
- [ ] Không có TC duplicate logic trong cùng 1 sheet
- [ ] Field INFERRED đã được đánh dấu rõ ràng
- [ ] BLOCKED TC đã ghi câu hỏi cụ thể (không để trống expected result)
- [ ] Tổng TC per endpoint không vượt budget (30–40 TC)
- [ ] Priority được gán cho mọi TC (không để trống)
