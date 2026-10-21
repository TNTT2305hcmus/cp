# TEMPLATE_LESSON.md — Khung Chuẩn Bài Giảng & Bài Test

> **Căn cứ:** [`ROADMAP.md`](./ROADMAP.md) (danh sách bài học, ID `x.y`) và [`PLANNING.md`](./PLANNING.md) (ngân hàng bài tập, đề test).
> **Phong cách:** cảm hứng từ AlgoMaster DSA. Light mode mặc định, một cột đọc 740px, một màu nhấn (teal), ít icon.
> **Phạm vi:** file này là chuẩn duy nhất cho mọi file `LessonXX_*.tsx`, `MonthXX_Overview.tsx` và bài test. Khi file khác mâu thuẫn, file này thắng.

---

## PHẦN 1: NGUYÊN TẮC SƯ PHẠM

Mọi quyết định thiết kế bên dưới đều xuất phát từ 6 nguyên tắc này. Nếu một phần của bài giảng không phục vụ nguyên tắc nào, hãy bỏ nó.

1. **Bài toán trước, kỹ thuật sau.** Người học phải thấy vì sao vét cạn thất bại (bằng con số cụ thể) trước khi được dạy cách sửa.
2. **Một bài giảng chỉ dạy một ý chính.** Nếu cần hai mô hình khác nhau (ví dụ Two Pointers đối đầu và cùng chiều), mỗi mô hình có đủ ví dụ, mô phỏng và bài tập riêng, nhưng cùng chia sẻ một câu "ý tưởng cốt lõi".
3. **Xem rồi tự làm.** Người học quan sát mô phỏng, dự đoán bước kế tiếp, rồi mới đọc code. Không đưa lời giải trước khi người học có cơ hội nghĩ.
4. **Chứng minh ngắn, đúng, đọc được.** Mỗi kỹ thuật có một bất biến (invariant) phát biểu bằng một câu và chứng minh trong 3–5 dòng. Không chứng minh dài dòng.
5. **Nhận diện mẫu quan trọng hơn thuộc code.** Mỗi bài có bảng "dấu hiệu trong đề bài → kỹ thuật" để người học biết khi nào dùng, và khi nào không dùng.
6. **Gợi ý theo tầng, có kỷ luật.** Tự nghĩ tối thiểu 15 phút trước khi mở gợi ý tầng 1. Không có nút "xem code" trong danh sách bài tập.

---

## PHẦN 2: CẤU TRÚC CHUẨN CỦA MỘT BÀI HỌC

Thứ tự các phần là cố định. Thời gian đọc mục tiêu: 15–25 phút, chưa tính bài tập.

```
┌──────────────────────────────────────────────────────────────────────┐
│ 1. ĐẦU BÀI                                                           │
│    Breadcrumb, tiêu đề, mô tả 1–2 câu, metadata, mục tiêu, kiến thức │
│    cần có                                                            │
├──────────────────────────────────────────────────────────────────────┤
│ 2. BÀI TOÁN MỞ ĐẦU & VÌ SAO VÉT CẠN THẤT BẠI                         │
├──────────────────────────────────────────────────────────────────────┤
│ 3. Ý TƯỞNG CỐT LÕI                                                   │
├──────────────────────────────────────────────────────────────────────┤
│ 4. MÔ PHỎNG TƯƠNG TÁC                                                │
├──────────────────────────────────────────────────────────────────────┤
│ 5. KHI NÀO DÙNG KỸ THUẬT NÀY                                         │
├──────────────────────────────────────────────────────────────────────┤
│ 6. TÍNH ĐÚNG ĐẮN (BẤT BIẾN)                                          │
├──────────────────────────────────────────────────────────────────────┤
│ 7. CÀI ĐẶT (C++20 / Python / TypeScript)                             │
├──────────────────────────────────────────────────────────────────────┤
│ 8. BẪY VÀ LỖI THƯỜNG GẶP                                             │
├──────────────────────────────────────────────────────────────────────┤
│ 9. KIỂM TRA NHANH (3 CÂU)                                            │
├──────────────────────────────────────────────────────────────────────┤
│ 10. BÀI TẬP (3 NHÓM ƯU TIÊN, GỢI Ý 3 TẦNG)                           │
├──────────────────────────────────────────────────────────────────────┤
│ 11. TÓM TẮT & BÀI KẾ TIẾP                                            │
└──────────────────────────────────────────────────────────────────────┘
```

### 2.1. Đầu bài

| Thành phần | Quy định |
| :--- | :--- |
| Breadcrumb | `Lộ trình CP > Tháng N: Tên tháng > N.k Tên bài`. Hai mục đầu bấm được. |
| Tiêu đề | Tên kỹ thuật, tiếng Việt kèm tên tiếng Anh trong ngoặc. Ví dụ: `Kỹ thuật Hai con trỏ (Two Pointers)`. |
| Mô tả | 1–2 câu, nói rõ kỹ thuật giúp giảm từ độ phức tạp nào xuống độ phức tạp nào. |
| Metadata | Độ khó (Easy / Medium / Hard), thời gian đọc ước tính, Time và Space của kỹ thuật chính. Hiển thị bằng chữ, không dùng nhiều màu. |
| Bạn sẽ làm được | Đúng 3 gạch đầu dòng, mỗi dòng bắt đầu bằng động từ đo được: "Nhận ra...", "Cài đặt...", "Giải thích vì sao...". |
| Cần biết trước | Liên kết đến bài hoặc tháng trước. Nếu không có tiền đề thì ghi "Không cần kiến thức trước". |
| Nút hoàn thành | Một nút duy nhất ở đầu và một ở cuối bài. Không lặp banner chúc mừng. |

### 2.2. Bài toán mở đầu & vì sao vét cạn thất bại

- Chọn **một** bài toán cụ thể, đủ đơn giản để phát biểu trong 2 câu.
- Viết cách vét cạn, đếm số phép tính với `N` thực tế của đề (ví dụ `N = 10⁵ → 5 × 10⁹` phép tính) và so với ngưỡng `10⁸` phép tính mỗi giây.
- Kết thúc bằng một câu hỏi mở: "Có thông tin nào của đề bài mà vét cạn chưa tận dụng?" Câu trả lời dẫn sang phần 3.

### 2.3. Ý tưởng cốt lõi

- Một đoạn văn không quá 5 câu, kèm **một câu quy tắc in đậm** người học có thể nhớ nguyên văn. Ví dụ: "Mỗi bước loại bỏ chắc chắn ít nhất một ứng viên không thể là đáp án."
- Một ví dụ chạy tay trên mảng nhỏ (5–8 phần tử), viết thành bảng từng bước. Ví dụ này dùng cùng dữ liệu với mô phỏng ở phần 4 để người học đối chiếu.

### 2.4. Mô phỏng tương tác

Mô phỏng là phần quan trọng nhất của bài. Quy chuẩn:

**Dữ liệu và logic**
- Một hàm thuần `buildSteps(input): Step[]` sinh toàn bộ các bước. Component chỉ hiển thị bước thứ `i`. Không tính toán trong lúc render.
- Mỗi `Step` có tối thiểu: vị trí các con trỏ, giá trị cần hiển thị, `observation` (quan sát), `decision` (quyết định) và `reason` (lý do). Ba trường này thay cho một đoạn thông báo dài.
- Người học đổi được đầu vào: ít nhất là `target` hoặc mảng (nhập chuỗi số cách nhau dấu phẩy, có kiểm tra hợp lệ và thông báo lỗi bằng chữ).
- Có sẵn 3 bộ dữ liệu mẫu: một trường hợp thành công, một trường hợp không có đáp án, một trường hợp biên (trùng lặp hoặc phần tử âm).

**Điều khiển**
- Bốn nút: `Đặt lại`, `Lùi`, `Chạy tự động / Tạm dừng`, `Tiếp`. Phím tắt: `←`, `→`, `Space`.
- Tốc độ chọn bằng 3 mức `0.5x / 1x / 2x`. Tự động dừng ở bước cuối.
- Khi người dùng bật `prefers-reduced-motion`, tắt hiệu ứng scale và chuyển cảnh, chỉ giữ đổi màu viền.

**Hiển thị**
- Ô mảng: kích thước cố định, chỉ đổi màu viền và nền, không phóng to, không đổ bóng đậm.
- Nhãn con trỏ nằm phía trên ô, bằng chữ (`L`, `R`, `SLOW`, `FAST`). Không đổi nhãn sang màu thứ ba khi hai con trỏ trùng nhau, chỉ ghép chữ (`L,R`).
- Vùng đã loại bỏ hiển thị bằng nền xám nhạt.
- Một thanh trạng thái hiển thị các đại lượng đang theo dõi (ví dụ `Tổng`, `Target`).
- Hộp giải thích bước hiện tại có `aria-live="polite"` và theo mẫu ba dòng: **Quan sát** → **Quyết định** → **Lý do**.
- Bước cuối nêu kết luận và độ phức tạp của lần chạy này.

**Tự kiểm tra trong lúc xem**
- Nút "Dự đoán bước tiếp theo": người học chọn `L++`, `R--` hoặc `Dừng` trước khi bấm `Tiếp`. Sai thì hộp giải thích hiện lý do, không trừ điểm. Đây là cách biến việc xem thụ động thành việc nghĩ chủ động.

### 2.5. Khi nào dùng kỹ thuật này

Một bảng hai cột và một danh sách ngắn:

| Dấu hiệu trong đề bài | Kỹ thuật |
| :--- | :--- |
| (3–5 dòng, mỗi dòng là cụm từ thật trong đề LeetCode) | |

- **Không dùng khi:** 1–2 gạch đầu dòng nêu điều kiện làm kỹ thuật sai hoặc không áp dụng được (ví dụ "mảng chưa sắp xếp và không được phép sắp xếp").
- **Dễ nhầm với:** kỹ thuật gần giống (ví dụ Two Pointers và Sliding Window) và cách phân biệt trong một câu.

### 2.6. Tính đúng đắn (bất biến)

Bắt buộc theo 3 dòng:

1. **Bất biến:** một câu phát biểu điều luôn đúng trước mỗi vòng lặp.
2. **Duy trì:** chứng minh mỗi bước làm bất biến vẫn đúng (3–5 dòng).
3. **Kết thúc:** vì sao khi dừng thì bất biến cho ra đáp án, và vì sao không bỏ sót nghiệm.

### 2.7. Cài đặt

- Ba tab: **C++20** (chuẩn thi đấu, mặc định), **Python 3**, **TypeScript**.
- Mã nguồn chạy được trên LeetCode, chú thích bằng tiếng Anh, tên biến đầy đủ nghĩa.
- Đầu mã có đúng hai dòng chú thích: tên bài LeetCode và `Time: O(...) | Space: O(...)`.
- Với bài có nhiều biến thể, thêm một **khung chung** (template) ngắn ngay dưới bài mẫu để người học thấy phần nào đổi, phần nào giữ nguyên.
- Nút sao chép mã. Không đặt số dòng trong DOM bằng `<br/>`; dùng thư viện tô màu hoặc `counter` CSS.

### 2.8. Bẫy và lỗi thường gặp

Mỗi bẫy dùng cùng một mẫu để người học tra cứu nhanh khi dính WA:

> **Tên bẫy.** *Triệu chứng:* ... *Nguyên nhân:* ... *Cách sửa:* ... *Test nhỏ để bắt lỗi:* ...

Tối thiểu 3 bẫy. Luôn xét: tràn số `int` / `long long`, mảng rỗng hoặc 1 phần tử, trùng lặp, chỉ số bắt đầu từ 0 hay 1, vòng lặp vô hạn.

### 2.9. Kiểm tra nhanh

3 câu trắc nghiệm hoặc dự đoán kết quả. Phản hồi ngay, có giải thích, không lưu điểm. Câu 1 kiểm tra khái niệm, câu 2 kiểm tra nhận diện mẫu, câu 3 kiểm tra một bẫy.

### 2.10. Bài tập

**Bảng bài tập** (lấy từ `PLANNING.md`, mọi ID phải tồn tại trong ngân hàng của tháng):

| Cột | Nội dung |
| :--- | :--- |
| Hộp chọn | Lưu tiến độ. |
| Tên bài | Liên kết LeetCode, mở tab mới. |
| Mẫu | Một cụm từ ngắn, ví dụ `Đối đầu co dần`. Ẩn mặc định ở nhóm Ưu tiên 2–3 để người học tự nhận diện. |
| Độ khó | Chữ `Easy / Medium / Hard`. |
| Gợi ý | Ba tầng, mở dần. |

**Ba tầng gợi ý:**

| Tầng | Nội dung | Ví dụ |
| :--- | :--- | :--- |
| 1. Quan sát | Tính chất của dữ liệu, chưa nói thuật toán. | "Mảng đã sắp xếp. Điều đó cho biết gì về tổng khi dịch một đầu?" |
| 2. Chiến lược | Quy tắc dịch chuyển trạng thái, chưa viết code. | "Tổng nhỏ hơn target thì tăng `L`, lớn hơn thì giảm `R`." |
| 3. Khung hàm | Điều kiện dừng và giá trị trả về, không có thân vòng lặp. | "`while (L < R)`; trả về chỉ số bắt đầu từ 1." |

**Nhóm và định mức:**
- Ưu tiên 1 (Cốt lõi): làm hết, mỗi bài tối đa 25 phút.
- Ưu tiên 2 (Phản xạ): làm ít nhất 70%.
- Ưu tiên 3 (Thử thách): làm ít nhất 1 bài, cho phép dùng gợi ý tầng 2–3.
- **Điều kiện hoàn thành bài học:** xong 100% Ưu tiên 1 và ít nhất 70% tổng số bài.
- **Ôn tập giãn cách:** các bài đã làm được nhắc lại sau 3 ngày và 7 ngày (hiển thị bằng chữ "Nên ôn lại", không dùng thông báo đẩy).

### 2.11. Tóm tắt & bài kế tiếp

- Thẻ tóm tắt 5 dòng: ý chính, dấu hiệu nhận biết, độ phức tạp, bẫy số 1, bài mẫu.
- Một câu nối sang bài kế tiếp và liên kết trực tiếp.
- Nút đánh dấu hoàn thành lý thuyết. Trạng thái lưu vào `localStorage` và đồng bộ lên thanh Lộ trình.

---

## PHẦN 3: CẤU TRÚC CHUẨN CỦA TRANG TỔNG QUAN THÁNG

Mỗi tháng có một trang tổng quan `MonthXX_Overview.tsx`. Số liệu trên trang phải **tính từ dữ liệu**, không viết tay.

| Phần | Nội dung |
| :--- | :--- |
| Đầu trang | Breadcrumb, tiêu đề, mô tả 2 câu, nút "Học tiếp" trỏ tới bài chưa xong đầu tiên (không phải luôn là bài đầu). |
| Số liệu | Số bài học, số bài tập (đã làm / tổng), số bài test, mục tiêu Big-O. Tổng lấy từ `PLANNING.md` đã kiểm tra. |
| Vì sao tháng này quan trọng | Bảng "Vét cạn → Kỹ thuật của tháng" 4–6 dòng. |
| Danh mục bài học | Danh sách theo thứ tự học, mỗi dòng: trạng thái, tên, độ khó, số bài tập. Có dấu "Demo" nếu bài có mô phỏng. |
| Bài test | Hai thẻ Bài Test 1 và Bài Test 2, ghi rõ bài học cần xong trước khi làm. |
| Lưu ý | Đúng 3 lưu ý, trong đó có "Stuck Checklist" (15 phút). |

**Số bài học trên trang phải khớp `ROADMAP.md`.** Không dùng hai con số khác nhau cho cùng một thứ (ví dụ "8 kỹ thuật" ở tiêu đề và "9 kỹ thuật" ở thống kê).

---

## PHẦN 4: CẤU TRÚC CHUẨN CỦA BÀI TEST ĐỊNH KỲ

Mỗi tháng có 2 bài test. Tháng 6 có 8 bài test (Mock Contest). Tháng 12–13 dùng thi thật (LeetCode Weekly, Biweekly, Codeforces).

| Thành phần | Quy định |
| :--- | :--- |
| Đầu đề | `Bài Test N — Tháng X: chủ đề`. Đồng hồ 90 phút có `Bắt đầu`, `Tạm dừng`, `Nộp bài`. Chỉ cho tạm dừng tối đa 1 lần. |
| Điều kiện mở | Đã hoàn thành lý thuyết các bài học thuộc phạm vi test (ghi rõ trên thẻ). |
| Bốn câu | Q1 Easy 3đ (≤ 5 phút), Q2 Medium 4đ (≤ 15 phút), Q3 Medium 5đ (≤ 20 phút), Q4 Hard 6đ (≤ 45 phút). Tối đa 18 điểm. |
| Chấm điểm | Người học tự đánh dấu `AC`, `WA` hoặc `TLE` sau khi nộp trên LeetCode. Mỗi lần `WA` hoặc `TLE` cộng 5 phút phạt. Điểm chỉ tính cho câu `AC`. |
| Bảng kết quả | Điểm, tổng thời gian có phạt, thứ tự giải. Lưu lịch sử các lần làm để thấy tiến bộ. |
| Mở khóa sau thi | Sau khi hết giờ hoặc bấm `Nộp bài`: lời giải C++20 và Python, phân tích lỗi thường gặp, và danh sách bài tương tự để upsolving. |
| Upsolving | Câu chưa `AC` phải được giải lại trong vòng 24 giờ. Hệ thống nhắc bằng chữ, không bắt buộc. |

**Quy tắc chọn đề:** mỗi câu phải có trong ngân hàng bài tập của tháng đó (kiểm tra bằng `scripts/check_planning.py`) và đúng mức độ khó của vị trí câu. Tiêu đề của bài test chỉ được ghi những chủ đề mà bốn câu thực sự kiểm tra.

---

## PHẦN 5: THIẾT KẾ GIAO DIỆN

Giữ nguyên bố cục hiện tại (cột đọc 740px, thẻ, breadcrumb). Chỉ giảm nhiễu.

### 5.1. Màu sắc: một màu nhấn và bốn màu trạng thái

| Vai trò | Light | Dark | Dùng cho |
| :--- | :--- | :--- | :--- |
| Nền trang | `#f8fafc` | `#090d16` | Nền chính. |
| Nền thẻ | `#ffffff` | `#111827` | Thẻ, khối mã. |
| Viền | `#e2e8f0` | `#1e293b` | Mọi đường viền. |
| Chữ chính / phụ | `#0f172a` / `#475569` | `#f1f5f9` / `#94a3b8` | Văn bản. |
| **Nhấn (accent)** | `#0d9488` | `#2dd4bf` | Liên kết, nút chính, mục đang chọn, tiến độ. Màu duy nhất dùng cho "thương hiệu". |
| Con trỏ trái / A | `#0284c7` | `#38bdf8` | Chỉ dùng trong mô phỏng. |
| Con trỏ phải / B | `#d97706` | `#fbbf24` | Chỉ dùng trong mô phỏng. |
| Đúng / hoàn thành | `#059669` | `#34d399` | Chỉ dùng cho trạng thái đúng. |
| Lỗi / TLE | `#e11d48` | `#fb7185` | Chỉ dùng cho lỗi và bẫy. |

Quy tắc: không dùng màu tím, không dùng gradient, không dùng `animate-pulse`. Mỗi màn hình tối đa một màu nhấn nổi bật cùng với màu trạng thái đang có nghĩa trong mô phỏng. Thông tin không được truyền đạt chỉ bằng màu: luôn có chữ hoặc nhãn đi kèm.

### 5.2. Icon: chỉ dùng khi có chức năng

| Được dùng | Không dùng |
| :--- | :--- |
| `ChevronRight` cho breadcrumb và dòng bấm được | Icon trang trí cạnh tiêu đề phần (`TrendingUp`, `Layers`, `Compass`, `ShieldAlert`) |
| `Check` cho trạng thái hoàn thành | `Star` cho độ ưu tiên (dùng chữ `Ưu tiên 1`) |
| `ExternalLink` cho liên kết LeetCode | `Gauge` cho tốc độ (dùng chữ `Tốc độ`) |
| `Play`, `Pause`, `RotateCcw`, `ChevronLeft`, `ChevronRight` trong điều khiển mô phỏng | Chấm nhấp nháy, badge nhiều màu |

Mục tiêu: một bài học dùng không quá 6 loại icon.

### 5.3. Chữ và khoảng cách

- Văn bản: `Inter`, `system-ui`. Mã, biến, Big-O, chỉ số: `JetBrains Mono`, `Fira Code`.
- Thân bài 17px, giãn dòng 1.8, chiều rộng cột 740px (khoảng 70 ký tự mỗi dòng).
- Tiêu đề phần: `text-xl` đến `text-2xl`, đậm; không dùng chữ viết hoa toàn bộ.
- Khoảng cách giữa các phần lớn (`space-y-10`), trong phần nhỏ (`space-y-3`). Một kiểu bo góc cho thẻ (`rounded-xl`), một kiểu cho ô nhỏ (`rounded-lg`).
- Thẻ chỉ dùng cho nội dung độc lập (mô phỏng, bẫy, tóm tắt). Văn bản thường không đặt trong thẻ.

### 5.4. Khả năng truy cập

- Mọi điều khiển dùng được bằng bàn phím; vòng focus nhìn thấy rõ.
- Hộp giải thích mô phỏng có `aria-live="polite"`.
- Độ tương phản chữ tối thiểu 4.5:1 ở cả hai chế độ.
- Hiển thị tốt từ 375px; bảng và mảng rộng cuộn ngang trong khung riêng, không làm trang cuộn ngang.
- Tôn trọng `prefers-reduced-motion`.

---

## PHẦN 6: DỮ LIỆU, TÊN FILE VÀ LƯU TIẾN ĐỘ

| Mục | Quy ước |
| :--- | :--- |
| File bài học | `src/lessons/Lesson<tháng><số>_<TenChuDe>.tsx` ví dụ `Lesson02_TwoPointers.tsx` (bài 2.1). Khi tháng có nhiều bài, dùng `Lesson02_01_TwoPointers.tsx`. |
| File tổng quan | `src/lessons/Month<tháng>_Overview.tsx` |
| ID bài học | `x.y` đúng theo `ROADMAP.md` (ví dụ `2.1`). `x.0` là trang tổng quan. |
| ID bài tập | Số thứ tự LeetCode dạng chuỗi (`'167'`). Phải tồn tại trong `PLANNING.md` của tháng. |
| Tiến độ lý thuyết | `localStorage['cp_theory_<id>']` = `'true'` hoặc xóa khóa. |
| Tiến độ bài tập | `localStorage['cp_problems']` = JSON `{ "<id bài tập>": true }`. Dùng một khóa chung cho toàn site (một bài LeetCode xuất hiện ở nhiều tháng chỉ cần đánh dấu một lần). |
| Props bài học | `isTheoryCompleted`, `onToggleTheory`, `completedProblems`, `onToggleProblem`, `onSelectSubtopic`. Không đổi tên. |
| Bọc `localStorage` | Luôn trong `try/catch`; nếu lỗi thì chạy bằng state trong bộ nhớ. |

---

## PHẦN 7: QUY TRÌNH BIÊN SOẠN BÀI MỚI

1. Đọc mục tiêu của bài trong `ROADMAP.md` và chọn bài tập trong `PLANNING.md`.
2. Viết `buildSteps` và kiểm tra bằng tay trên 3 bộ dữ liệu (thành công, không có đáp án, biên) **trước khi** viết giao diện.
3. Viết nội dung theo đúng thứ tự 11 phần ở Phần 2.
4. Chạy `python scripts/check_planning.py docs/PLANNING.md` và sửa mọi lỗi.
5. Đối chiếu danh sách kiểm tra ở Phần 8.

---

## PHẦN 8: DANH SÁCH KIỂM TRA TRƯỚC KHI HOÀN THÀNH

**Nội dung**
- [ ] Có đủ 11 phần theo đúng thứ tự.
- [ ] Phần 2 nêu con số thật (`N`, số phép tính) và so với `10⁸`.
- [ ] Phần 5 có bảng dấu hiệu, mục "Không dùng khi" và "Dễ nhầm với".
- [ ] Phần 6 có bất biến, duy trì, kết thúc.
- [ ] Mã C++ biên dịch được và đúng trên các test mẫu của LeetCode.
- [ ] Mỗi bẫy có triệu chứng, nguyên nhân, cách sửa, test nhỏ.
- [ ] Mỗi bài tập có gợi ý đủ 3 tầng và mọi ID có trong `PLANNING.md`.

**Mô phỏng**
- [ ] Đổi được đầu vào; có 3 bộ dữ liệu mẫu.
- [ ] Có `Đặt lại / Lùi / Chạy / Tiếp`, phím tắt, bước cuối rõ ràng.
- [ ] Mỗi bước có Quan sát, Quyết định, Lý do.
- [ ] Hoạt động đúng khi `target` không có đáp án và khi mảng có phần tử trùng.

**Giao diện**
- [ ] Không quá 6 loại icon, không gradient, không `animate-pulse`, không màu tím.
- [ ] Đẹp ở 375px và ở chế độ tối.
- [ ] Dùng được bằng bàn phím; `aria-live` hoạt động.
- [ ] Số liệu trên trang tổng quan khớp `ROADMAP.md` và `PLANNING.md`.

---

## PHỤ LỤC A: KHUNG KỸ THUẬT RÚT GỌN CỦA MỘT BÀI HỌC

```tsx
export interface PracticeProblem {
  id: string;               // LeetCode number, must exist in PLANNING.md
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  url: string;
  pattern: string;
  priority: 1 | 2 | 3;
  hints: [string, string, string]; // tier 1 observation, tier 2 strategy, tier 3 skeleton
}

export interface SimStep {
  pointers: Record<string, number>;   // e.g. { L: 0, R: 7 }
  stats: Record<string, number | string>;
  observation: string;
  decision: string;
  reason: string;
  done?: boolean;
}

// A pure function: all steps are computed up front, the component only renders steps[i].
export function buildSteps(input: { array: number[]; target: number }): SimStep[] { /* ... */ }
```

## PHỤ LỤC B: MẪU VIẾT GỢI Ý TỐT VÀ XẤU

| | Ví dụ |
| :--- | :--- |
| Tốt (tầng 1) | "Mảng đã sắp xếp tăng dần. Nếu tổng hiện tại quá nhỏ, phần tử nào chắc chắn không thể là một nửa của đáp án?" |
| Xấu (tầng 1) | "Dùng hai con trỏ." (đã lộ thuật toán) |
| Tốt (tầng 3) | "Vòng lặp chạy khi `L < R`. Ba nhánh: bằng, nhỏ hơn, lớn hơn. Trả về `[L + 1, R + 1]`." |
| Xấu (tầng 3) | Dán nguyên lời giải. |