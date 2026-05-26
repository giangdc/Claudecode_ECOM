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
**Nhiệm vụ**: Thiết kế bộ TC kiểm thử REST API đầy đủ, có thể thực thi ngay — bao gồm happy path, validation, edge case, authentication, authorization, security và error handling.

- **Ngôn ngữ output**: Tiếng Việt
- **Không suy đoán business rule domain-specific**
- **Được phép áp dụng API security testing best practices industry-standard**
  để sinh negative/security test cases ngay cả khi spec không ghi rõ
- Các assumption/security inference phải đánh dấu:
  `[SECURITY-INFERRED]`
- **Không tự bịa response body/status code đặc thù nghiệp vụ**
- **Self-check bắt buộc** trước khi xuất file — sai thì tự sửa

---

# INPUT — 3 DẠNG HỖ TRỢ

## Dạng A — cURL command

```bash
curl -X POST https://api.example.com/v1/login \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer xxx" \
  -H "Client-Id: web-app" \
  -d '{"username":"user@example.com","password":"Pass@1234"}'
```

→ Tự parse:
- method
- URL
- headers
- auth scheme
- request body

---

## Dạng B — Swagger / OpenAPI / Word / Excel

Bao gồm:
- endpoint path
- method
- request schema
- response schema
- auth scheme
- error codes
- business rules

→ Mapping đầy đủ vào template.

---

## Dạng C — Mô tả nghiệp vụ thuần

Ví dụ:

> "API đăng nhập hệ thống, nhận username/password, trả về access_token nếu đúng"

→ Có thể suy luận cấu trúc request/response hợp lý  
→ Các field tự suy luận phải đánh dấu:
`[INFERRED]`

Nếu thiếu quá nhiều thông tin → hỏi gộp 1 lần trước khi generate TC.

---

# EXECUTION WORKFLOW

# STEP 1 — Parse & Understand API

Với mỗi endpoint, extract:

| Trường | Nội dung |
|---|---|
| Mã API | API_01, API_02 |
| Tên API | Mô tả ngắn |
| HTTP Method | GET/POST/PUT/PATCH/DELETE |
| Base URL | URL đầy đủ |
| Auth Scheme | Bearer/API Key/Basic/OAuth/None |
| Auth Headers | Authorization, X-API-Key, Client-Id... |
| Request Params | query/path params |
| Request Body | schema JSON |
| Response Success | status + sample |
| Response Error | error codes |
| Business Rules | nếu có |

---

## Multi-Factor Authentication Detection

Nếu request chứa nhiều auth-related headers như:

- Authorization
- X-API-Key
- Client-Id
- X-Checkout-Token
- X-Device-Id
- Session-Id
- Access-Token
- Refresh-Token

→ coi MỖI header là một authentication/authorization factor riêng.

BẮT BUỘC sinh TC validate độc lập cho từng header:

- Missing header
- Empty value
- Invalid value
- Invalid format
- Expired token
- Tampered token
- Malformed token
- Wrong client mapping
- Duplicate headers
- Header case sensitivity
- Replay/reuse token

---

Thông báo sau khi parse:

```text
📋 Đã phân tích input:
- Số endpoints: [N]
- Danh sách:
  - API_01: POST /login
  - API_02: GET /users/{id}
- Auth headers detect:
  - Authorization
  - Client-Id
  - X-Checkout-Token
- Field INFERRED:
  - [danh sách]
- Cần xác nhận:
  - [câu hỏi]

→ Bắt đầu thiết kế TC...
```

---

# STEP 2 — Risk Analysis

| Risk | Ví dụ |
|---|---|
| High | login, payment, delete, write DB |
| Medium | update partial, filter query |
| Low | health check |

Rule:

- Endpoint High Risk → generate security/auth test case sâu hơn
- Payment/Auth APIs → ưu tiên:
  - replay attack
  - token mismatch
  - privilege escalation
  - sensitive data exposure

---

# STEP 3 — Test Scenario Design

## Authentication / Authorization

BẮT BUỘC cover:

### Per-header validation

Cho TỪNG auth-related header:

- Missing header
- Empty value
- Invalid format
- Invalid token
- Expired token
- Malformed token
- Tampered token
- Duplicate header
- Wrong encoding
- Wrong signature
- Unauthorized role
- Insufficient permission

---

## Cross Authentication Validation

Nếu API dùng nhiều auth headers/tokens:

BẮT BUỘC có TC:

- Authorization hợp lệ + Client-Id sai
- Authorization hợp lệ + X-Checkout-Token sai
- Token của user A + Client-Id của client B
- Checkout token không thuộc Authorization token
- Token scope không đúng endpoint
- Replay token
- Header bị swap/mismatch
- Multi-session token conflict

---

## Validation — Required Fields

- Thiếu từng field bắt buộc
- Mỗi field = 1 TC riêng
- Null
- Empty string

---

## Validation — Format / Type

- Sai kiểu dữ liệu
- Sai regex
- Sai format:
  - email
  - UUID
  - datetime
  - phone
  - enum

---

## Validation — Boundary

- min
- max
- min-1
- max+1
- empty array
- large payload

---

## Business Flow — Happy Path

- Thành công với data hợp lệ
- Verify response schema
- Verify persistence

---

## Business Flow — Edge Cases

- duplicate resource
- deleted resource
- invalid status transition
- race condition
- concurrent request

---

## Error Handling

- timeout
- DB error
- 409 conflict
- 429 rate limit
- downstream service unavailable

---

## Data Integrity & Security

- Không leak:
  - password
  - secret
  - private key
  - internal stacktrace
- Verify masking
- Verify audit fields

---

# STEP 4 — Test Case Design

# Atomic Rule

- 1 TC = 1 mục tiêu kiểm thử
- Request phải executable ngay
- Expected result verify được ngay

---

## Request Format

```json
{
  "username": "user@example.com",
  "password": ""
}
```

KHÔNG dùng mô tả chung chung kiểu:
- "truyền password rỗng"

---

## Expected Response Format

```text
- HTTP 400
- response.message = "password is required"
- data.access_token = null/absent
```

---

# MANDATORY TEST CASE CHECKLIST

BẮT BUỘC có:

| Nhóm | Mandatory Coverage |
|---|---|
| Auth | Generate TC cho TỪNG auth-related header |
| Auth | Missing / empty / invalid / expired |
| Auth | Cross-header validation |
| Auth | Unauthorized role |
| Auth | Token-client mismatch |
| Required | Missing từng field |
| Required | Null / empty |
| Happy Path | Ít nhất 1 TC |
| Boundary | min/max nếu có |
| Resource Not Found | 404 |
| Security | Không leak secret |
| Security | Replay token |
| Security | Duplicate headers |

---

# MINIMUM AUTH COVERAGE RULE

Nếu API có:

- >=2 auth headers
  → tối thiểu 8 auth TC

- >=3 auth headers
  → tối thiểu 12 auth TC

Nếu output auth coverage thấp hơn:
→ tự review và generate thêm.

---

# CONSTRAINTS

## Duplicate Prevention

Không duplicate wording 100%.

Tuy nhiên:

Authentication/Authorization test cases
VẪN PHẢI generate đầy đủ cho EVERY endpoint
vì token scope/permission có thể khác nhau.

---

# BLOCKED TEST CASE

Nếu thiếu spec:

```text
[BLOCKED – cần confirm: <question>]
```

KHÔNG bỏ qua TC quan trọng.

---

# COVERAGE REVIEW (SELF-CHECK)

Trước khi export:

## Coverage

- [ ] Có Happy Path
- [ ] Có auth TC cho từng auth header
- [ ] Có cross-header validation
- [ ] Có missing required field
- [ ] Có null/empty
- [ ] Có boundary
- [ ] Có 404
- [ ] Có security test
- [ ] Có data sensitivity test

---

## Quality

- [ ] Atomic
- [ ] Executable
- [ ] Request JSON cụ thể
- [ ] Expected response cụ thể
- [ ] Không duplicate
- [ ] Coverage >= 8/10

---

# OUTPUT

## Template

Đọc template:

```text
./template/template-testcase-api.md
```

trước khi generate file.

---

## Excel Output

Tên file:

```text
AI_ISC_<project>_<version>_TC_API_v<tc_version>.xlsx
```

Ví dụ:

```text
AI_ISC_FoxProject_v1.0_TC_API_v1.0.xlsx
```

---

## Sheet Rule

- 1 sheet = 1 endpoint
- Sheet name = tên API ngắn gọn
- API code unique:
  - API_01
  - API_02

---

## Group Order

1. Authentication / Authorization
2. Validation — Required Fields
3. Validation — Format / Type
4. Validation — Boundary
5. Business Flow — Happy Path
6. Business Flow — Edge Cases
7. Error Handling
8. Data Integrity & Security

---

# HANDOFF

```text
✅ TC API v[x] đã tạo xong.

- File:
  AI_ISC_[project]_[version]_TC_API_v[x].xlsx

- Tổng endpoints: [N]
- Tổng TC: [N]

- High: [n]
- Medium: [n]
- Low: [n]

- BLOCKED:
  [N] TC cần confirm

- SECURITY-INFERRED:
  [danh sách]

→ Khi API spec thay đổi:
  chỉ cập nhật endpoint bị ảnh hưởng
```

---

# FINAL SELF-CHECK

- [ ] TC ID đúng format
- [ ] Request Body là JSON thực
- [ ] Expected Response có status + field cụ thể
- [ ] Có Auth group
- [ ] Có Required Fields group
- [ ] Có Happy Path
- [ ] Có Cross-auth validation
- [ ] Có Security TC
- [ ] Không duplicate logic
- [ ] SECURITY-INFERRED đã đánh dấu
- [ ] BLOCKED có câu hỏi cụ thể