# Template Test Case API — Hướng dẫn cấu trúc

> Dùng template này khi sinh test case cho REST API. Mỗi sheet Excel tương ứng với **một API endpoint**.

---

## 1. Thông tin API (Header block — dòng 4 → 7)

| Field | Giá trị mẫu | Mô tả |
|---|---|---|
| **Mã API** | `API_01` | ID định danh API, dùng làm prefix cho TC ID |
| **Tên API** | `API chi tiết gói bán` | Tên mô tả chức năng API |
| **Phương thức** | `GET` / `POST` / `PUT` / `DELETE` | HTTP method |
| **Base URL** | `https://api.example.com/v1` | URL gốc của API |

> **Lưu ý:**
>
> - Header block thực tế nằm từ dòng 4 → 7 trong file Excel.
> - Mã API (`$D$4`) được dùng tự động trong công thức sinh TC ID tại cột `Testcase ID`.

---

## 2. Cấu trúc bảng Test Case

### 2.1 Các cột chính

| STT | Tên cột | Ghi chú |
|---|---|---|
| 1 | **QC/AI** | Người thực hiện sinh TC: ghi `QC` hoặc `AI` |
| 2 | **Testcase ID** | Auto-gen bằng công thức → output: `API_01.1`, `API_01.2`, … |
| 3 | **Mức Độ Ưu Tiên (Priority)** | `High` / `Medium` / `Low` |
| 4 | **Nội Dung Test (Test Title)** | Mô tả ngắn gọn scenario kiểm thử |
| 5 | **Điều Kiện/ Dữ Liệu Test** | điều kiện để có thể chạy được api cần test |
| 6 | **Các Bước Thực Hiện** | mô tả các bước cần thực hiện trước khi send Request |
| 7 | **Kết Quả Mong Đợi (Expected Response)** | Response body/message mong đợi; field quyết định TC ID có xuất hiện không |

### 2.2 Các cột theo dõi kết quả (Round-based)

Mỗi **Round** kiểm thử (Round 1, Round 2, …) gồm 4 cột phụ:

| Cột | Tên | Giá trị |
|---|---|---|
| A | **Kết Quả Thực Hiện (Result)** | `Pass` / `Fail` / `N/A` |
| B | **Người Thực Hiện (Executed By)** | Tên QC |
| C | **Bug ID** | ID bug Jira nếu Fail |
| D | **Ghi Chú (Remark)** | Ghi chú thêm |

> Khi thêm Round mới, nhân 4 cột này sang phải và đổi tiêu đề thành `Round 2`, `Round 3`, …

---

## 3. Cấu trúc nhóm (Group)

Test case được tổ chức theo **nhóm kịch bản**:

```text
Tên Group 1          ← Dòng header nhóm (merge cells, không có TC ID)
  API_01.1  ...
  API_01.2  ...
Tên Group 2
  API_01.3  ...
```

**Quy tắc đặt tên nhóm phổ biến:**

| Nhóm | Nội dung |
|---|---|
| Authentication / Authorization | Kiểm tra xác thực, phân quyền |
| Validation — Required Fields | Thiếu field bắt buộc |
| Validation — Format/Type | Sai kiểu dữ liệu, format |
| Validation — Boundary | Giá trị biên (min/max/length) |
| Business Flow — Happy Path | Luồng chính thành công |
| Business Flow — Edge Cases | Các ngoại lệ nghiệp vụ |
| Error Handling | Lỗi server, timeout, conflict |

---

## 4. Quy tắc sinh TC ID

**Công thức Excel thực tế:**

```excel
=IF(F12="","",$D$4&"."&COUNTA($F$12:F12)&"")
```

**Ý nghĩa:**

- TC ID chỉ xuất hiện khi cột `Expected Response` (cột F) **không rỗng**
- Đánh số tự động, liên tục trong toàn sheet
- Format: `{Mã API}.{số thứ tự}`

**Ví dụ:**

```text
API_01.1
API_01.2
API_01.3
```

> Khi gen bằng AI/code:
>
> - Đánh số tuần tự từ 1
> - Bỏ qua dòng group header và dòng trống
> - Không overwrite công thức ở cột `Testcase ID`

---

## 5. Hướng dẫn điền Priority

| Priority | Khi nào dùng |
|---|---|
| **High** | Luồng chính, auth, dữ liệu quan trọng, security |
| **Medium** | Validation thông thường, edge case nghiệp vụ |
| **Low** | UI message phụ, remark, optional field |

---

## 6. Hướng dẫn viết Expected Response

Viết đủ thông tin để QC có thể verify mà không cần đoán:

```text
✅ Tốt:
- HTTP 200
- response.message = "Login successful"
- data.access_token: có giá trị (non-null)

✅ Tốt (trường hợp lỗi):
- HTTP 401
- response.message = "Invalid username or password"
- data.access_token: không có (null hoặc không tồn tại)

❌ Tránh:
- "Thành công"
- "Lỗi"
```

---

## 7. Ví dụ dữ liệu mẫu (đồng nhất với guideline)

| TC ID | Priority | Test Title | Request Body |Các Bước Thực Hiện| Expected Response |
|---|---|---|---|---|
| API_01.1 | High | Đăng nhập thành công với credentials hợp lệ | `{"username":"user1@example.com","password":"Pass@1234"}` | 1. Send requet theo data 2. Quan sát response trả về|HTTP 200 — `response.message = "Login successful"` — `data.access_token`: có giá trị |
---

## 8. Quy ước tổ chức file Excel

- **Mỗi sheet = 1 API endpoint**
- **Tên sheet** = tên chức năng API (ngắn gọn, tiếng Việt)
- **Mã API** phải unique trong toàn bộ file (VD: `API_01`, `API_02`, …)
- Template đã pre-fill công thức `Testcase ID` cho nhiều dòng bên dưới
- Không chỉnh sửa hoặc xóa cột `Testcase ID` vì chứa công thức auto-gen
- Có thể nhập dữ liệu tại:
  - Cột `QC/AI`
  - Các cột dữ liệu chính
  - Các cột Result / Executed By / Bug ID / Remark

---

## 9. Checklist trước khi submit

- [ ] Mã API đã điền đúng ở header block
- [ ] Tất cả TC có `Expected Response` không để trống
- [ ] Priority đã gán đủ
- [ ] Nhóm (Group) đã đặt tên rõ ràng
- [ ] TC ID tự động hiển thị đúng (không có lỗi công thức)
- [ ] Round 1 đã điền Result sau khi thực thi
