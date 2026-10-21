# PLANNING.md — Kế Hoạch Đào Tạo & Ngân Hàng Bài Tập LeetCode

> **Học viên:** Trí Thanh  
> **Nhịp học:** mỗi ngày 1 chủ đề lý thuyết + 1–2 bài thực hành.  
> **Nguồn sự thật:** danh sách bài học (ID `x.y`) nằm ở [`ROADMAP.md`](./ROADMAP.md); khung bài giảng nằm ở [`TEMPLATE_LESSON.md`](./TEMPLATE_LESSON.md). File này chỉ chứa ngân hàng bài tập và đề test.  
> **Kiểm tra tự động:** chạy `python scripts/check_planning.py docs/PLANNING.md` sau mỗi lần sửa (đếm bài, bài lặp, câu test có nằm trong ngân hàng hay không).

## Quy ước chung

| Mục | Quy ước |
| :--- | :--- |
| Ưu tiên 1 — Cốt lõi | Bài bắt buộc, mẫu chuẩn của kỹ thuật. Làm hết trước khi sang nhóm khác. |
| Ưu tiên 2 — Phản xạ | Biến thể thường gặp. Mục tiêu: nhận ra mẫu trong 2 phút đầu. |
| Ưu tiên 3 — Thử thách | Bài Hard hoặc bài kết hợp nhiều kỹ thuật. Cho phép xem gợi ý tầng 2–3. |
| Bài test | 4 câu, 90 phút: Easy 3đ, Medium 1 4đ, Medium 2 5đ, Hard 6đ (tối đa 18đ). Mỗi lần WA cộng 5 phút phạt. |
| `(ôn lại — Tháng X)` | Bài đã xuất hiện ở tháng trước. Lặp lại có chủ đích để ôn, không tính là bài mới. |
| Số lượng | Mỗi tháng 33–50 bài rèn luyện + 8 bài test. Tháng 6 và Tháng 12–13 có cấu trúc riêng. |

## Bảng Tra Cứu Ràng Buộc & Ngưỡng Big-O

| Giới hạn $N$ | Ngưỡng Big-O (1 giây ≈ $10^8$ phép tính) | Thuật toán thường dùng |
| :--- | :--- | :--- |
| $N \le 11$ | $O(N!)$, $O(N^2 \cdot 2^N)$ | Quay lui hoán vị, vét cạn có cắt nhánh |
| $N \le 20 \sim 22$ | $O(2^N)$, $O(N \cdot 2^N)$ | Bitmask DP, Meet in the Middle |
| $N \le 100 \sim 400$ | $O(N^3)$, $O(N^4)$ | Floyd-Warshall, Interval DP, nhân ma trận |
| $N \le 2\,000 \sim 5\,000$ | $O(N^2)$ | DP 2D cơ bản, hai vòng lặp lồng nhau |
| $N \le 10^5 \sim 2 \cdot 10^5$ | $O(N \log N)$, $O(N \log^2 N)$ | Sắp xếp, Binary Search, Segment Tree, Heap, DSU |
| $N \le 10^6 \sim 10^7$ | $O(N)$, $O(N \log \log N)$ | Two Pointers, Sliding Window, Prefix Sum, Hash Map, Sàng nguyên tố |
| $N \le 10^9 \sim 10^{18}$ | $O(\sqrt{N})$, $O(\log N)$, $O(1)$ | Chặt nhị phân, lũy thừa nhị phân/ma trận, kiểm tra nguyên tố bằng chia thử đến $\sqrt{N}$, sàng phân đoạn khi $R - L \le 10^6$ |

---

# GIAI ĐOẠN 1: NỀN TẢNG THUẬT TOÁN & KỸ NĂNG CỐT LÕI (THÁNG 1 – 6)

---

## Tháng 1: Cấu Trúc Dữ Liệu Cơ Bản & STL
*Chủ đề:* Vector, Sorting, Stack, Queue, Deque, Heap, BST (Set/Multiset/Map), Custom Hash chống collision, Bitset.  
*Tổng số lượng:* **42 bài rèn luyện + 8 bài test = 50 bài**.

### Nhóm 1: Cốt Lõi Bắt Buộc (Ưu tiên 1 — Nền tảng cấu trúc dữ liệu)
- [ ] [217. Contains Duplicate](https://leetcode.com/problems/contains-duplicate/) (Easy) — `[Vector & Hash]` Sorting vs Hash Set.
- [ ] [1. Two Sum](https://leetcode.com/problems/two-sum/) (Easy) — `[Hash Map]` Tra cứu bù số $O(1)$.
- [ ] [88. Merge Sorted Array](https://leetcode.com/problems/merge-sorted-array/) (Easy) — `[Vector]` Ghép mảng từ đuôi về đầu $O(N)$.
- [ ] [20. Valid Parentheses](https://leetcode.com/problems/valid-parentheses/) (Easy) — `[Stack]` Kiểm tra ngoặc hợp lệ.
- [ ] [155. Min Stack](https://leetcode.com/problems/min-stack/) (Medium) — `[Stack]` Thiết kế ngăn xếp truy vấn min trong $O(1)$.
- [ ] [232. Implement Queue using Stacks](https://leetcode.com/problems/implement-queue-using-stacks/) (Easy) — `[Queue]` Chi phí khấu hao Amortized $O(1)$.
- [ ] [225. Implement Stack using Queues](https://leetcode.com/problems/implement-stack-using-queues/) (Easy) — `[Stack]` Mô phỏng cơ chế LIFO qua FIFO.
- [ ] [703. Kth Largest Element in a Stream](https://leetcode.com/problems/kth-largest-element-in-a-stream/) (Easy) — `[Heap]` Min-Heap kích thước $K$.
- [ ] [215. Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array/) (Medium) — `[Heap / Sorting]` Min-Heap vs `std::nth_element`.
- [ ] [347. Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements/) (Medium) — `[Heap / Hash]` Min-Heap vs Bucket Sort $O(N)$.
- [ ] [705. Design HashSet](https://leetcode.com/problems/design-hashset/) (Easy) — `[Hash Set]` Cài đặt băm giải quyết collision.
- [ ] [706. Design HashMap](https://leetcode.com/problems/design-hashmap/) (Easy) — `[Hash Map]` Cài đặt bảng băm Chaining.
- [ ] [179. Largest Number](https://leetcode.com/problems/largest-number/) (Medium) — `[Sorting]` Custom Comparator chuỗi: $A + B > B + A$.

### Nhóm 2: Rèn Luyện Phản Xạ (Ưu tiên 2 — Biến thể thường gặp)
- [ ] [75. Sort Colors](https://leetcode.com/problems/sort-colors/) (Medium) — `[Sorting]` Thuật toán lá cờ Hà Lan (DNF) 3 con trỏ $O(N)$.
- [ ] [912. Sort an Array](https://leetcode.com/problems/sort-an-array/) (Medium) — `[Sorting]` Cài đặt Merge Sort / Randomized Quick Sort.
- [ ] [485. Max Consecutive Ones](https://leetcode.com/problems/max-consecutive-ones/) (Easy) — `[Vector]` Duyệt mảng tối ưu Cache Locality.
- [ ] [150. Evaluate Reverse Polish Notation](https://leetcode.com/problems/evaluate-reverse-polish-notation/) (Medium) — `[Stack]` Tính biểu thức hậu tố.
- [ ] [71. Simplify Path](https://leetcode.com/problems/simplify-path/) (Medium) — `[Stack]` Xử lý đường dẫn Unix (`..`, `.`).
- [ ] [394. Decode String](https://leetcode.com/problems/decode-string/) (Medium) — `[Stack]` Stack lồng nhau giải mã chuỗi `k[str]`.
- [ ] [739. Daily Temperatures](https://leetcode.com/problems/daily-temperatures/) (Medium) — `[Stack]` Monotonic Stack tìm ngày ấm hơn gần nhất.
- [ ] [496. Next Greater Element I](https://leetcode.com/problems/next-greater-element-i/) (Easy) — `[Stack]` Monotonic Stack + Hash Map.
- [ ] [503. Next Greater Element II](https://leetcode.com/problems/next-greater-element-ii/) (Medium) — `[Stack]` Monotonic Stack trên mảng xoay vòng $2N$.
- [ ] [622. Design Circular Queue](https://leetcode.com/problems/design-circular-queue/) (Medium) — `[Queue]` Cài đặt Ring Buffer bằng mảng cố định.
- [ ] [641. Design Circular Deque](https://leetcode.com/problems/design-circular-deque/) (Medium) — `[Deque]` Cài đặt Deque vòng hai đầu.
- [ ] [1046. Last Stone Weight](https://leetcode.com/problems/last-stone-weight/) (Easy) — `[Heap]` Mô phỏng Max-Heap cơ bản.
- [ ] [973. K Closest Points to Origin](https://leetcode.com/problems/k-closest-points-to-origin/) (Medium) — `[Heap]` Max-Heap duy trì K điểm gần nhất.
- [ ] [451. Sort Characters By Frequency](https://leetcode.com/problems/sort-characters-by-frequency/) (Medium) — `[Heap / Hash]` Priority Queue / Bucket Sort.
- [ ] [378. Kth Smallest Element in a Sorted Matrix](https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/) (Medium) — `[Heap / BS]` Min-Heap đa luồng.
- [ ] [981. Time Based Key-Value Store](https://leetcode.com/problems/time-based-key-value-store/) (Medium) — `[BST / Map]` Hash Map + Binary Search trên timestamp.
- [ ] [380. Insert Delete GetRandom O(1)](https://leetcode.com/problems/insert-delete-getrandom-o1/) (Medium) — `[Vector & Map]` Swap phần tử cuối để xóa $O(1)$.
- [ ] [49. Group Anagrams](https://leetcode.com/problems/group-anagrams/) (Medium) — `[Hash Map]` Phân nhóm qua chuỗi đã sort hoặc tần số ký tự.
- [ ] [136. Single Number](https://leetcode.com/problems/single-number/) (Easy) — `[Bitset / Bit]` Tính chất XOR $a \oplus a = 0$.

### Nhóm 3: Nâng Cao & Thử Thách CP (Ưu tiên 3 — Monotonic Deque & Cấu trúc phức hợp)
- [ ] [164. Maximum Gap](https://leetcode.com/problems/maximum-gap/) (Hard) — `[Sorting]` Bucket Sort tuyến tính $O(N)$ thời gian & không gian.
- [ ] [84. Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram/) (Hard) — `[Stack]` Monotonic Stack diện tích lớn nhất.
- [ ] [85. Maximal Rectangle](https://leetcode.com/problems/maximal-rectangle/) (Hard) — `[Stack]` Histogram trên ma trận 2D $O(M \times N)$.
- [ ] [239. Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum/) (Hard) — `[Deque]` Monotonic Deque cửa sổ trượt $O(N)$.
- [ ] [862. Shortest Subarray with Sum at Least K](https://leetcode.com/problems/shortest-subarray-with-sum-at-least-k/) (Hard) — `[Deque]` Monotonic Deque trên Prefix Sum có số âm.
- [ ] [295. Find Median from Data Stream](https://leetcode.com/problems/find-median-from-data-stream/) (Hard) — `[Heap]` Cặp Max-Heap & Min-Heap cân bằng.
- [ ] [23. Merge k Sorted Lists](https://leetcode.com/problems/merge-k-sorted-lists/) (Hard) — `[Heap]` Min-Heap gom $K$ danh sách liên kết.
- [ ] [220. Contains Duplicate III](https://leetcode.com/problems/contains-duplicate-iii/) (Hard) — `[BST / Set]` `std::set::lower_bound` trong cửa sổ trượt.
- [ ] [432. All O`one Data Structure](https://leetcode.com/problems/all-oone-data-structure/) (Hard) — `[Design]` Doubly Linked List + Hash Map $O(1)$.
- [ ] [895. Maximum Frequency Stack](https://leetcode.com/problems/maximum-frequency-stack/) (Hard) — `[Stack / Hash]` Ngăn xếp tần số cực đại đa tầng.

### Hệ Thống 2 Bài Test Định Kỳ (Tháng 1)
#### Bài Test 1 (Bấm giờ 90 phút — Vector, Sorting, Stack, Queue):
- [ ] **Q1 (Easy):** [485. Max Consecutive Ones](https://leetcode.com/problems/max-consecutive-ones/)
- [ ] **Q2 (Medium 1):** [150. Evaluate Reverse Polish Notation](https://leetcode.com/problems/evaluate-reverse-polish-notation/)
- [ ] **Q3 (Medium 2):** [622. Design Circular Queue](https://leetcode.com/problems/design-circular-queue/)
- [ ] **Q4 (Hard):** [84. Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram/)

#### Bài Test 2 (Bấm giờ 90 phút — Hash Set, Heap, BST / Map):
- [ ] **Q1 (Easy):** [705. Design HashSet](https://leetcode.com/problems/design-hashset/)
- [ ] **Q2 (Medium 1):** [215. Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array/)
- [ ] **Q3 (Medium 2):** [981. Time Based Key-Value Store](https://leetcode.com/problems/time-based-key-value-store/)
- [ ] **Q4 (Hard):** [295. Find Median from Data Stream](https://leetcode.com/problems/find-median-from-data-stream/)

### Ghi chú nội dung
- Bitset chưa có bài LeetCode chuyên biệt. Luyện bằng cách tự cài sàng nguyên tố dùng `std::bitset` sau khi học xong Tháng 2.

---

## Tháng 2: Một Số Kỹ Thuật Căn Bản
*Chủ đề:* Xử lý bit, Two Pointers, Sliding Window, Prefix Sum & Mảng hiệu, Sàng nguyên tố & SPF, Chặt nhị phân & BS on Answer, Chặt tam phân, Tham lam.  
*Tổng số lượng:* **50 bài rèn luyện + 8 bài test = 58 bài**.

### Nhóm 1: Cốt Lõi Bắt Buộc (Ưu tiên 1 — Kỹ thuật nền tảng)
- [ ] [167. Two Sum II - Input Array Is Sorted](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/) (Medium) — `[Two Pointers]` Hai con trỏ đối đầu co dần.
- [ ] [11. Container With Most Water](https://leetcode.com/problems/container-with-most-water/) (Medium) — `[Two Pointers]` Loại trừ biên thấp hơn.
- [ ] [15. 3Sum](https://leetcode.com/problems/3sum/) (Medium) — `[Two Pointers]` Sắp xếp mảng + Cố định 1 phần tử + Two Pointers.
- [ ] [125. Valid Palindrome](https://leetcode.com/problems/valid-palindrome/) (Easy) — `[Two Pointers]` Chuỗi đối xứng hai đầu.
- [ ] [3. Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/) (Medium) — `[Sliding Window]` Cửa sổ trượt co giãn linh hoạt.
- [ ] [704. Binary Search](https://leetcode.com/problems/binary-search/) (Easy) — `[Binary Search]` Mẫu chặt nhị phân chuẩn tránh lặp vô tận.
- [ ] [875. Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas/) (Medium) — `[BS on Answer]` Mẫu tìm kiếm trên tập nghiệm cơ bản.
- [ ] [303. Range Sum Query - Immutable](https://leetcode.com/problems/range-sum-query-immutable/) (Easy) — `[Prefix Sum]` Mảng cộng dồn 1D truy vấn $O(1)$.
- [ ] [204. Count Primes](https://leetcode.com/problems/count-primes/) (Medium) — `[Sàng nguyên tố]` Sàng Eratosthenes chuẩn $O(N \log \log N)$.
- [ ] [191. Number of 1 Bits](https://leetcode.com/problems/number-of-1-bits/) (Easy) — `[Bitwise]` Tắt bit 1 thấp nhất qua `n & (n - 1)`.
- [ ] [136. Single Number](https://leetcode.com/problems/single-number/) (Easy) — `[Bitwise]` Khử phần tử trùng lặp bằng XOR.  *(ôn lại — Tháng 1)*
- [ ] [55. Jump Game](https://leetcode.com/problems/jump-game/) (Medium) — `[Greedy]` Tham lam vị trí xa nhất có thể đạt tới.

### Nhóm 2: Rèn Luyện Phản Xạ (Ưu tiên 2 — Biến thể mở rộng)
- [ ] [26. Remove Duplicates from Sorted Array](https://leetcode.com/problems/remove-duplicates-from-sorted-array/) (Easy) — `[Two Pointers]` Fast & Slow Pointers.
- [ ] [283. Move Zeroes](https://leetcode.com/problems/move-zeroes/) (Easy) — `[Two Pointers]` Dồn số khác 0 về đầu mảng.
- [ ] [16. 3Sum Closest](https://leetcode.com/problems/3sum-closest/) (Medium) — `[Two Pointers]` Cập nhật độ chênh lệch nhỏ nhất.
- [ ] [18. 4Sum](https://leetcode.com/problems/4sum/) (Medium) — `[Two Pointers]` 2 vòng ngoài + Two Pointers trong (tránh overflow bằng `long long`).
- [ ] [643. Maximum Average Subarray I](https://leetcode.com/problems/maximum-average-subarray-i/) (Easy) — `[Sliding Window]` Cửa sổ cố định độ dài K.
- [ ] [209. Minimum Size Subarray Sum](https://leetcode.com/problems/minimum-size-subarray-sum/) (Medium) — `[Sliding Window]` Tìm mảng con ngắn nhất tổng $\ge target$.
- [ ] [424. Longest Repeating Character Replacement](https://leetcode.com/problems/longest-repeating-character-replacement/) (Medium) — `[Sliding Window]` Duy trì ký tự xuất hiện nhiều nhất.
- [ ] [1004. Max Consecutive Ones III](https://leetcode.com/problems/max-consecutive-ones-iii/) (Medium) — `[Sliding Window]` Cửa sổ trượt cho phép lật K số 0.
- [ ] [560. Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k/) (Medium) — `[Prefix Sum]` Prefix Sum kết hợp Hash Map đếm tần số.
- [ ] [525. Contiguous Array](https://leetcode.com/problems/contiguous-array/) (Medium) — `[Prefix Sum]` Đổi số 0 thành -1 + Prefix Sum + Hash Map.
- [ ] [1109. Corporate Flight Bookings](https://leetcode.com/problems/corporate-flight-bookings/) (Medium) — `[Difference Array]` Mảng hiệu cập nhật đoạn $[L, R]$ trong $O(1)$.
- [ ] [35. Search Insert Position](https://leetcode.com/problems/search-insert-position/) (Easy) — `[Binary Search]` Tự cài đặt `std::lower_bound`.
- [ ] [34. Find First and Last Position of Element](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/) (Medium) — `[Binary Search]` Cận trái và cận phải.
- [ ] [33. Search in Rotated Sorted Array](https://leetcode.com/problems/search-in-rotated-sorted-array/) (Medium) — `[Binary Search]` Chặt nhị phân trên mảng xoay vòng.
- [ ] [153. Find Minimum in Rotated Sorted Array](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/) (Medium) — `[Binary Search]` Tìm điểm gãy của mảng xoay.
- [ ] [1011. Capacity To Ship Packages Within D Days](https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/) (Medium) — `[BS on Answer]` Tìm tải trọng tàu nhỏ nhất.
- [ ] [1482. Minimum Number of Days to Make m Bouquets](https://leetcode.com/problems/minimum-number-of-days-to-make-m-bouquets/) (Medium) — `[BS on Answer]` Số ngày hoa nở tối thiểu.
- [ ] [162. Find Peak Element](https://leetcode.com/problems/find-peak-element/) (Medium) — `[Binary / Ternary Search]` Tìm đỉnh cực đại địa phương trong $O(\log N)$.
- [ ] [45. Jump Game II](https://leetcode.com/problems/jump-game-ii/) (Medium) — `[Greedy]` Tham lam số bước nhảy tối thiểu.
- [ ] [435. Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals/) (Medium) — `[Greedy]` Lựa chọn đoạn kết thúc sớm nhất.
- [ ] [452. Minimum Number of Arrows to Burst Balloons](https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/) (Medium) — `[Greedy]` Giao các đoạn bóng bay.
- [ ] [2523. Closest Prime Numbers in Range](https://leetcode.com/problems/closest-prime-numbers-in-range/) (Medium) — `[Sàng nguyên tố]` Tìm cặp số nguyên tố gần nhau nhất trong đoạn $[L, R]$.
- [ ] [977. Squares of a Sorted Array](https://leetcode.com/problems/squares-of-a-sorted-array/) (Easy) — `[Two Pointers]` So sánh bình phương hai đầu, điền kết quả từ cuối về đầu.
- [ ] [844. Backspace String Compare](https://leetcode.com/problems/backspace-string-compare/) (Easy) — `[Two Pointers]` Duyệt ngược hai chuỗi, đạt $O(1)$ Space.
- [ ] [338. Counting Bits](https://leetcode.com/problems/counting-bits/) (Easy) — `[Bitwise]` DP trên bit: `dp[i] = dp[i >> 1] + (i & 1)`.
- [ ] [231. Power of Two](https://leetcode.com/problems/power-of-two/) (Easy) — `[Bitwise]` Kiểm tra `n > 0 && (n & (n - 1)) == 0`.
- [ ] [852. Peak Index in a Mountain Array](https://leetcode.com/problems/peak-index-in-a-mountain-array/) (Medium) — `[Ternary Search]` Tìm đỉnh hàm đơn phong bằng chặt tam phân hoặc nhị phân trên độ dốc.
- [ ] [2521. Distinct Prime Factors of Product of Array](https://leetcode.com/problems/distinct-prime-factors-of-product-of-array/) (Medium) — `[Sàng SPF]` Phân tích thừa số bằng mảng ước nguyên tố nhỏ nhất.
- [ ] [169. Majority Element](https://leetcode.com/problems/majority-element/) (Easy) — `[Recursion & D&C]` Chia để trị theo nửa mảng, so sánh với Boyer-Moore $O(N)$.
- [ ] [241. Different Ways to Add Parentheses](https://leetcode.com/problems/different-ways-to-add-parentheses/) (Medium) — `[Recursion & D&C]` Tách biểu thức tại mỗi toán tử, ghép kết quả hai nửa.

### Nhóm 3: Nâng Cao & Thử Thách CP (Ưu tiên 3 — Chặt nhị phân khó & Kỹ thuật tối ưu)
- [ ] [42. Trapping Rain Water](https://leetcode.com/problems/trapping-rain-water/) (Hard) — `[Two Pointers]` Hai con trỏ đối đầu duy trì max hai bên $O(1)$ Space.
- [ ] [76. Minimum Window Substring](https://leetcode.com/problems/minimum-window-substring/) (Hard) — `[Sliding Window]` Cửa sổ trượt tần số ký tự bao phủ chuỗi T.
- [ ] [410. Split Array Largest Sum](https://leetcode.com/problems/split-array-largest-sum/) (Hard) — `[BS on Answer]` Chia mảng thành K đoạn sao cho tổng lớn nhất là nhỏ nhất.
- [ ] [4. Median of Two Sorted Arrays](https://leetcode.com/problems/median-of-two-sorted-arrays/) (Hard) — `[Binary Search]` Phân vùng nhị phân song song hai mảng $O(\log(\min(M, N)))$.
- [ ] [992. Subarrays with K Different Integers](https://leetcode.com/problems/subarrays-with-k-different-integers/) (Hard) — `[Sliding Window]` Biến đổi đẳng thức: $exact(K) = atMost(K) - atMost(K-1)$.
- [ ] [304. Range Sum Query 2D - Immutable](https://leetcode.com/problems/range-sum-query-2d-immutable/) (Medium) — `[Prefix Sum]` Mảng cộng dồn 2D nguyên lý bao hàm loại trừ.
- [ ] [260. Single Number III](https://leetcode.com/problems/single-number-iii/) (Medium) — `[Bitwise]` Tách 2 số xuất hiện lẻ qua Lowest Set Bit `x & -x`.
- [ ] [1095. Find in Mountain Array](https://leetcode.com/problems/find-in-mountain-array/) (Hard) — `[Ternary / Binary Search]` Tìm đỉnh, rồi chặt nhị phân hai sườn, giới hạn số lần gọi API.

### Hệ Thống 2 Bài Test Định Kỳ (Tháng 2)
#### Bài Test 1 (Bấm giờ 90 phút — Bit, Two Pointers, Prefix / Difference Array, Sliding Window):
- [ ] **Q1 (Easy):** [191. Number of 1 Bits](https://leetcode.com/problems/number-of-1-bits/)
- [ ] **Q2 (Medium 1):** [11. Container With Most Water](https://leetcode.com/problems/container-with-most-water/)
- [ ] **Q3 (Medium 2):** [1109. Corporate Flight Bookings](https://leetcode.com/problems/corporate-flight-bookings/)
- [ ] **Q4 (Hard):** [76. Minimum Window Substring](https://leetcode.com/problems/minimum-window-substring/)

#### Bài Test 2 (Bấm giờ 90 phút — Binary Search, Sàng nguyên tố, Tham lam, BS on Answer):
- [ ] **Q1 (Easy):** [35. Search Insert Position](https://leetcode.com/problems/search-insert-position/)
- [ ] **Q2 (Medium 1):** [204. Count Primes](https://leetcode.com/problems/count-primes/)
- [ ] **Q3 (Medium 2):** [435. Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals/)
- [ ] **Q4 (Hard):** [410. Split Array Largest Sum](https://leetcode.com/problems/split-array-largest-sum/)

### Ghi chú nội dung
- Ternary Search trên LeetCode chỉ có 852 và 1095, nên Bài Test 2 không có câu Ternary. Sàng phân đoạn (Segmented Sieve) gần như không có bài LeetCode, cần luyện thêm trên CSES hoặc Codeforces.

---

## Tháng 3: Quy Hoạch Động & Kỹ Thuật Đổi Biến Số
*Chủ đề:* Chia để trị, DP Cổ điển (Kadane, LIS, LCS, Knapsack), Grid DP, Interval DP, Kỹ thuật đổi biến số trạng thái.  
*Tổng số lượng:* **37 bài rèn luyện + 8 bài test = 45 bài**.

### Nhóm 1: Cốt Lõi Bắt Buộc (Ưu tiên 1 — Nền tảng quy hoạch động)
- [ ] [70. Climbing Stairs](https://leetcode.com/problems/climbing-stairs/) (Easy) — `[Linear DP]` Fibonacci DP mở đầu.
- [ ] [746. Min Cost Climbing Stairs](https://leetcode.com/problems/min-cost-climbing-stairs/) (Easy) — `[Linear DP]` Chi phí tối thiểu bước bậc thang.
- [ ] [198. House Robber](https://leetcode.com/problems/house-robber/) (Medium) — `[Linear DP]` Trạng thái chọn / không chọn liền kề.
- [ ] [213. House Robber II](https://leetcode.com/problems/house-robber-ii/) (Medium) — `[Linear DP]` Dãy nhà vòng tròn (tách trường hợp đầu/cuối).
- [ ] [53. Maximum Subarray](https://leetcode.com/problems/maximum-subarray/) (Medium) — `[Linear DP]` Thuật toán Kadane $O(N)$.
- [ ] [62. Unique Paths](https://leetcode.com/problems/unique-paths/) (Medium) — `[Grid DP]` Đếm số đường đi ma trận 2D.
- [ ] [64. Minimum Path Sum](https://leetcode.com/problems/minimum-path-sum/) (Medium) — `[Grid DP]` Chi phí đường đi nhỏ nhất góc trên xuống góc dưới.
- [ ] [322. Coin Change](https://leetcode.com/problems/coin-change/) (Medium) — `[Knapsack]` Unbounded Knapsack tìm số đồng xu tối thiểu.
- [ ] [518. Coin Change II](https://leetcode.com/problems/coin-change-ii/) (Medium) — `[Knapsack]` Unbounded Knapsack đếm số cách đổi tiền.
- [ ] [416. Partition Equal Subset Sum](https://leetcode.com/problems/partition-equal-subset-sum/) (Medium) — `[Knapsack]` 0/1 Knapsack mảng 1D duyệt ngược.
- [ ] [300. Longest Increasing Subsequence](https://leetcode.com/problems/longest-increasing-subsequence/) (Medium) — `[LIS]` LIS $O(N \log N)$ bằng `std::lower_bound`.
- [ ] [1143. Longest Common Subsequence](https://leetcode.com/problems/longest-common-subsequence/) (Medium) — `[LCS]` Xâu con chung dài nhất bảng 2D.

### Nhóm 2: Rèn Luyện Phản Xạ (Ưu tiên 2 — Mẫu bài tập trung cấp)
- [ ] [91. Decode Ways](https://leetcode.com/problems/decode-ways/) (Medium) — `[String DP]` Đếm số cách giải mã chuỗi số.
- [ ] [139. Word Break](https://leetcode.com/problems/word-break/) (Medium) — `[String DP]` Ghép chuỗi từ từ điển.
- [ ] [152. Maximum Product Subarray](https://leetcode.com/problems/maximum-product-subarray/) (Medium) — `[Kadane]` Duy trì đồng thời cả giá trị min và max âm.
- [ ] [63. Unique Paths II](https://leetcode.com/problems/unique-paths-ii/) (Medium) — `[Grid DP]` Đường đi trên lưới có chướng ngại vật.
- [ ] [120. Triangle](https://leetcode.com/problems/triangle/) (Medium) — `[Grid DP]` DP tam giác duyệt từ đáy lên đỉnh.
- [ ] [931. Minimum Falling Path Sum](https://leetcode.com/problems/minimum-falling-path-sum/) (Medium) — `[Grid DP]` Rơi tự do trên ma trận.
- [ ] [221. Maximal Square](https://leetcode.com/problems/maximal-square/) (Medium) — `[Grid DP]` Diện tích hình vuông lớn nhất gồm toàn số 1.
- [ ] [494. Target Sum](https://leetcode.com/problems/target-sum/) (Medium) — `[Knapsack]` Chuyển đổi bài toán về Subset Sum $0/1$.
- [ ] [474. Ones and Zeroes](https://leetcode.com/problems/ones-and-zeroes/) (Medium) — `[Knapsack]` Knapsack 2 chiều ràng buộc số lượng bit 0 và bit 1.
- [ ] [673. Number of Longest Increasing Subsequence](https://leetcode.com/problems/number-of-longest-increasing-subsequence/) (Medium) — `[LIS]` Lưu kèm mảng đếm tần suất số lượng LIS.
- [ ] [583. Delete Operation for Two Strings](https://leetcode.com/problems/delete-operation-for-two-strings/) (Medium) — `[LCS]` Quy về bài toán tìm LCS.
- [ ] [72. Edit Distance](https://leetcode.com/problems/edit-distance/) (Hard) — `[String DP]` Khoảng cách Levenshtein 3 thao tác chèn, xóa, sửa.
- [ ] [516. Longest Palindromic Subsequence](https://leetcode.com/problems/longest-palindromic-subsequence/) (Medium) — `[Palindrome DP]` Chuỗi con đối xứng dài nhất (LCS với chuỗi đảo).
- [ ] [647. Palindromic Substrings](https://leetcode.com/problems/palindromic-substrings/) (Medium) — `[Palindrome DP]` Đếm số chuỗi con đối xứng liên tiếp.
- [ ] [5. Longest Palindromic Substring](https://leetcode.com/problems/longest-palindromic-substring/) (Medium) — `[Palindrome DP]` DP mở rộng tâm.
- [ ] [1312. Minimum Insertion Steps to Make a String Palindrome](https://leetcode.com/problems/minimum-insertion-steps-to-make-a-string-palindrome/) (Medium) — `[Palindrome DP]` Số phép chèn tối thiểu = Độ dài chuỗi trừ LPS.
- [ ] [121. Best Time to Buy and Sell Stock](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/) (Easy) — `[State Machine]` Mua bán chứng khoán 1 lần.
- [ ] [122. Best Time to Buy and Sell Stock II](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/) (Medium) — `[State Machine]` Mua bán vô số lần.
- [ ] [309. Best Time to Buy and Sell Stock with Cooldown](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/) (Medium) — `[State Machine]` DP 3 trạng thái (Buy, Sell, Cooldown).

### Nhóm 3: Nâng Cao & Kỹ Thuật Đổi Biến Số (Ưu tiên 3 — Interval DP & Hard DP)
- [ ] [312. Burst Balloons](https://leetcode.com/problems/burst-balloons/) (Hard) — `[Interval DP]` Duyệt ngược phần tử bóng nổ cuối cùng trên đoạn $[i, j]$.
- [ ] [1000. Minimum Cost to Merge Stones](https://leetcode.com/problems/minimum-cost-to-merge-stones/) (Hard) — `[Interval DP]` Gom K đống sỏi liên tiếp.
- [ ] [887. Super Egg Drop](https://leetcode.com/problems/super-egg-drop/) (Hard) — `[Đổi biến số trạng thái]` Chuyển trạng thái: Tìm số tầng tối đa thử được với $k$ quả trứng trong $m$ lần thả.
- [ ] [123. Best Time to Buy and Sell Stock III](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/) (Hard) — `[State Machine]` Mua bán tối đa 2 lần.
- [ ] [188. Best Time to Buy and Sell Stock IV](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/) (Hard) — `[State Machine]` Mua bán tối đa K lần.
- [ ] [10. Regular Expression Matching](https://leetcode.com/problems/regular-expression-matching/) (Hard) — `[String DP]` Khớp biểu thức chính quy với ký tự `.` và `*`.

### Hệ Thống 2 Bài Test Định Kỳ (Tháng 3)
#### Bài Test 1 (Bấm giờ 90 phút — Linear DP, Knapsack, String DP):
- [ ] **Q1 (Easy):** [746. Min Cost Climbing Stairs](https://leetcode.com/problems/min-cost-climbing-stairs/)
- [ ] **Q2 (Medium 1):** [198. House Robber](https://leetcode.com/problems/house-robber/)
- [ ] **Q3 (Medium 2):** [518. Coin Change II](https://leetcode.com/problems/coin-change-ii/)
- [ ] **Q4 (Hard):** [72. Edit Distance](https://leetcode.com/problems/edit-distance/)

#### Bài Test 2 (Bấm giờ 90 phút — State Machine, Grid DP, String DP, Đổi biến số):
- [ ] **Q1 (Easy):** [121. Best Time to Buy and Sell Stock](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/)
- [ ] **Q2 (Medium 1):** [62. Unique Paths](https://leetcode.com/problems/unique-paths/)
- [ ] **Q3 (Medium 2):** [139. Word Break](https://leetcode.com/problems/word-break/)
- [ ] **Q4 (Hard):** [887. Super Egg Drop](https://leetcode.com/problems/super-egg-drop/)

### Ghi chú nội dung
- Interval DP chỉ có 312 và 1000, đều là Hard, nên Bài Test 2 không có câu Interval DP. Học xong 312 ở Nhóm 3 rồi làm lại ở Tháng 6.

---

## Tháng 4: Lý Thuyết Đồ Thị Căn Bản
*Chủ đề:* DFS/BFS, Multi-source, Topological Sort, DSU, Dijkstra, Khớp & Cầu, Thành phần liên thông mạnh.  
*Tổng số lượng:* **36 bài rèn luyện + 8 bài test = 44 bài**.

### Nhóm 1: Cốt Lõi Bắt Buộc (Ưu tiên 1 — Nền tảng đồ thị)
- [ ] [200. Number of Islands](https://leetcode.com/problems/number-of-islands/) (Medium) — `[DFS / BFS]` Đếm số thành phần liên thông trên lưới.
- [ ] [733. Flood Fill](https://leetcode.com/problems/flood-fill/) (Easy) — `[DFS / BFS]` Tô màu loang ma trận cơ bản.
- [ ] [994. Rotting Oranges](https://leetcode.com/problems/rotting-oranges/) (Medium) — `[Multi-source BFS]` Loang song song từ nhiều nguồn cam hỏng.
- [ ] [207. Course Schedule](https://leetcode.com/problems/course-schedule/) (Medium) — `[Topo Sort]` Thuật toán Kahn phát hiện chu trình trên DAG.
- [ ] [210. Course Schedule II](https://leetcode.com/problems/course-schedule-ii/) (Medium) — `[Topo Sort]` Khôi phục thứ tự môn học Topological Sort.
- [ ] [684. Redundant Connection](https://leetcode.com/problems/redundant-connection/) (Medium) — `[DSU]` Tìm cạnh thừa tạo chu trình trong cây.
- [ ] [547. Number of Provinces](https://leetcode.com/problems/number-of-provinces/) (Medium) — `[DSU]` Đếm số tập hợp rời rạc các tỉnh thành.
- [ ] [743. Network Delay Time](https://leetcode.com/problems/network-delay-time/) (Medium) — `[Dijkstra]` Dijkstra chuẩn với Priority Queue.
- [ ] [785. Is Graph Bipartite?](https://leetcode.com/problems/is-graph-bipartite/) (Medium) — `[Graph Bipartite]` Thuật toán tô 2 màu kiểm tra tính 2 phía.
- [ ] [133. Clone Graph](https://leetcode.com/problems/clone-graph/) (Medium) — `[DFS / BFS]` Sao chép đồ thị bằng Hash Map liên kết.
- [ ] [1971. Find if Path Exists in Graph](https://leetcode.com/problems/find-if-path-exists-in-graph/) (Easy) — `[DSU / BFS]` Kiểm tra sự tồn tại của đường đi.
- [ ] [1192. Critical Connections in a Network](https://leetcode.com/problems/critical-connections-in-a-network/) (Hard) — `[Tarjan Bridges]` Thuật toán Tarjan tìm cạnh Cầu của đồ thị vô hướng.

### Nhóm 2: Rèn Luyện Phản Xạ (Ưu tiên 2 — Ma trận & Biến thể DSU / BFS)
- [ ] [695. Max Area of Island](https://leetcode.com/problems/max-area-of-island/) (Medium) — `[DFS / BFS]` Diện tích lớn nhất của thành phần liên thông.
- [ ] [130. Surrounded Regions](https://leetcode.com/problems/surrounded-regions/) (Medium) — `[DFS]` DFS từ biên ma trận vào trong để bảo toàn vùng biên.
- [ ] [417. Pacific Atlantic Water Flow](https://leetcode.com/problems/pacific-atlantic-water-flow/) (Medium) — `[DFS / BFS]` DFS ngược dòng từ hai đại dương lên đỉnh dốc.
- [ ] [1091. Shortest Path in Binary Matrix](https://leetcode.com/problems/shortest-path-in-binary-matrix/) (Medium) — `[BFS]` BFS ma trận 8 hướng tìm đường ngắn nhất.
- [ ] [286. Walls and Gates](https://leetcode.com/problems/walls-and-gates/) (Medium) — `[Multi-source BFS]` BFS đồng thời từ tất cả các cổng.
- [ ] [542. 01 Matrix](https://leetcode.com/problems/01-matrix/) (Medium) — `[Multi-source BFS]` Khoảng cách ngắn nhất từ ô 0 tới các ô xung quanh.
- [ ] [802. Find Eventual Safe States](https://leetcode.com/problems/find-eventual-safe-states/) (Medium) — `[Topo Sort]` Thuật toán Kahn ngược dựa trên Out-degree.
- [ ] [310. Minimum Height Trees](https://leetcode.com/problems/minimum-height-trees/) (Medium) — `[Topo Sort]` Cắt tỉa các lá để tìm trọng tâm cây.
- [ ] [1020. Number of Enclaves](https://leetcode.com/problems/number-of-enclaves/) (Medium) — `[DFS]` Flood fill loại trừ các đảo chạm biên.
- [ ] [1162. As Far from Land as Possible](https://leetcode.com/problems/as-far-from-land-as-possible/) (Medium) — `[Multi-source BFS]` Tìm ô biển xa đất liền nhất.
- [ ] [787. Cheapest Flights Within K Stops](https://leetcode.com/problems/cheapest-flights-within-k-stops/) (Medium) — `[Shortest Path]` Bellman-Ford / Modified Dijkstra giới hạn số chặng K.
- [ ] [1514. Path with Maximum Probability](https://leetcode.com/problems/path-with-maximum-probability/) (Medium) — `[Dijkstra]` Dijkstra tìm đường đi có tích xác suất lớn nhất.
- [ ] [1631. Path With Minimum Effort](https://leetcode.com/problems/path-with-minimum-effort/) (Medium) — `[Dijkstra]` Dijkstra Minimax trên ma trận độ cao.
- [ ] [721. Accounts Merge](https://leetcode.com/problems/accounts-merge/) (Medium) — `[DSU]` DSU gộp tài khoản qua địa chỉ email chung.
- [ ] [128. Longest Consecutive Sequence](https://leetcode.com/problems/longest-consecutive-sequence/) (Medium) — `[DSU / Hash]` DSU hoặc Hash Set liên kết các số kế tiếp $O(N)$.
- [ ] [990. Satisfiability of Equality Equations](https://leetcode.com/problems/satisfiability-of-equality-equations/) (Medium) — `[DSU]` DSU kiểm tra tính nhất quán giữa phương trình $a == b$ và $a \ne b$.
- [ ] [1319. Number of Operations to Make Network Connected](https://leetcode.com/problems/number-of-operations-to-make-network-connected/) (Medium) — `[DSU]` Đếm số cáp mạng dư thừa và số thành phần rời.

### Nhóm 3: Nâng Cao & Thử Thách CP (Ưu tiên 3 — Bi-directional BFS & Bitmask Graph)
- [ ] [127. Word Ladder](https://leetcode.com/problems/word-ladder/) (Hard) — `[Bi-directional BFS]` BFS hai đầu tìm khoảng cách biến đổi từ ngắn nhất.
- [ ] [126. Word Ladder II](https://leetcode.com/problems/word-ladder-ii/) (Hard) — `[BFS + DFS]` Bi-directional BFS kết hợp DFS truy vết toàn bộ đường đi ngắn nhất.
- [ ] [827. Making A Large Island](https://leetcode.com/problems/making-a-large-island/) (Hard) — `[DSU]` Thử đổi một ô biển thành đất liền và gộp các đảo lân cận.
- [ ] [847. Shortest Path Visiting All Nodes](https://leetcode.com/problems/shortest-path-visiting-all-nodes/) (Hard) — `[BFS + Bitmask]` BFS kết hợp trạng thái Bitmask $2^N$ duyệt qua mọi đỉnh.
- [ ] [269. Alien Dictionary](https://leetcode.com/problems/alien-dictionary/) (Hard) — `[Topo Sort]` Xây dựng đồ thị có hướng xác định bảng chữ cái ngôn ngữ lạ.
- [ ] [924. Minimize Malware Spread](https://leetcode.com/problems/minimize-malware-spread/) (Hard) — `[DSU]` Phân tích kích thước thành phần liên thông nhiễm mã độc.
- [ ] [1579. Remove Max Number of Edges to Keep Graph Fully Traversable](https://leetcode.com/problems/remove-max-number-of-edges-to-keep-graph-fully-traversable/) (Hard) — `[DSU]` Hai bảng DSU độc lập cho Alice và Bob kết hợp cạnh chung.

### Hệ Thống 2 Bài Test Định Kỳ (Tháng 4)
#### Bài Test 1 (Bấm giờ 90 phút — DFS / BFS, Clone Graph, Topo Sort, Bi-directional BFS):
- [ ] **Q1 (Easy):** [733. Flood Fill](https://leetcode.com/problems/flood-fill/)
- [ ] **Q2 (Medium 1):** [133. Clone Graph](https://leetcode.com/problems/clone-graph/)
- [ ] **Q3 (Medium 2):** [210. Course Schedule II](https://leetcode.com/problems/course-schedule-ii/)
- [ ] **Q4 (Hard):** [127. Word Ladder](https://leetcode.com/problems/word-ladder/)

#### Bài Test 2 (Bấm giờ 90 phút — DSU, Bipartite, Shortest Path, Tarjan Bridges):
- [ ] **Q1 (Easy):** [1971. Find if Path Exists in Graph](https://leetcode.com/problems/find-if-path-exists-in-graph/)
- [ ] **Q2 (Medium 1):** [785. Is Graph Bipartite?](https://leetcode.com/problems/is-graph-bipartite/)
- [ ] **Q3 (Medium 2):** [787. Cheapest Flights Within K Stops](https://leetcode.com/problems/cheapest-flights-within-k-stops/)
- [ ] **Q4 (Hard):** [1192. Critical Connections in a Network](https://leetcode.com/problems/critical-connections-in-a-network/)

### Ghi chú nội dung
- Tarjan Cầu và Khớp chỉ có 1192 trên LeetCode (đã đưa vào Bài Test 2). Tarjan SCC chưa có bài LeetCode phổ biến, cần luyện thêm ngoài LeetCode.

---

## Tháng 5: Toán Học (Mathematics in CP)
*Chủ đề:* Fast Pow, Nghịch đảo Modulo, Tổ hợp $C_n^k$, Stars and Bars, Xác suất, Kỳ vọng, Game Theory Nim, Dirichlet.  
*Tổng số lượng:* **33 bài rèn luyện + 8 bài test = 41 bài**.

### Nhóm 1: Cốt Lõi Bắt Buộc (Ưu tiên 1 — Nền tảng toán học & Trò chơi)
- [ ] [50. Pow(x, n)](https://leetcode.com/problems/powx-n/) (Medium) — `[Fast Pow]` Binary Exponentiation chia đôi số mũ xử lý cả $n$ âm.
- [ ] [365. Water and Jug Problem](https://leetcode.com/problems/water-and-jug-problem/) (Medium) — `[GCD & Bézout]` Điều kiện nghiệm nguyên Bézout $ax + by = z$.
- [ ] [62. Unique Paths](https://leetcode.com/problems/unique-paths/) (Medium) — `[Tổ hợp]` Công thức tổ hợp chập $C_{m+n-2}^{m-1}$.  *(ôn lại — Tháng 3)*
- [ ] [292. Nim Game](https://leetcode.com/problems/nim-game/) (Easy) — `[Game Theory]` Bất biến số sỏi $N \pmod 4 \ne 0$.
- [ ] [877. Stone Game](https://leetcode.com/problems/stone-game/) (Medium) — `[Game Theory]` Minimax DP / Quy luật người đi trước luôn thắng.
- [ ] [258. Add Digits](https://leetcode.com/problems/add-digits/) (Easy) — `[Modulo]` Digital Root tính trong $O(1)$ qua đồng dư modulo 9.
- [ ] [172. Factorial Trailing Zeroes](https://leetcode.com/problems/factorial-trailing-zeroes/) (Medium) — `[Number Theory]` Đếm thừa số nguyên tố 5 trong $N!$.
- [ ] [204. Count Primes](https://leetcode.com/problems/count-primes/) (Medium) — `[Number Theory]` Sàng số nguyên tố.  *(ôn lại — Tháng 2)*
- [ ] [372. Super Pow](https://leetcode.com/problems/super-pow/) (Medium) — `[Fast Pow]` Lũy thừa mảng số lớn mod 1337 qua định lý Euler.
- [ ] [464. Can I Win](https://leetcode.com/problems/can-i-win/) (Medium) — `[Game Theory]` Minimax + Bitmask memoization trạng thái các số đã chọn.
- [ ] [688. Knight Probability in Chessboard](https://leetcode.com/problems/knight-probability-in-chessboard/) (Medium) — `[Probability]` Xác suất di chuyển quân mã trên bàn cờ.
- [ ] [1201. Ugly Number III](https://leetcode.com/problems/ugly-number-iii/) (Medium) — `[Inclusion-Exclusion]` Nguyên lý bao hàm loại trừ + Binary Search on Answer.

### Nhóm 2: Rèn Luyện Phản Xạ (Ưu tiên 2 — Xác suất, Kỳ vọng & Biến thể trò chơi)
- [ ] [837. New 21 Game](https://leetcode.com/problems/new-21-game/) (Medium) — `[Probability]` Xác suất DP kết hợp Sliding Window tối ưu $O(N)$.
- [ ] [1227. Airplane Seat Assignment Probability](https://leetcode.com/problems/airplane-seat-assignment-probability/) (Medium) — `[Probability]` Bất biến xác suất 0.5 bằng chứng minh quy nạp.
- [ ] [808. Soup Servings](https://leetcode.com/problems/soup-servings/) (Medium) — `[Probability]` Xác suất đệ quy memoization với ngưỡng cận xấp xỉ 1.
- [ ] [1025. Divisor Game](https://leetcode.com/problems/divisor-game/) (Easy) — `[Game Theory]` Trò chơi chẵn lẻ: N chẵn thì Alice thắng.
- [ ] [1140. Stone Game II](https://leetcode.com/problems/stone-game-ii/) (Medium) — `[Game Theory]` Minimax DP lấy $1 \to 2M$ đống sỏi.
- [ ] [1406. Stone Game III](https://leetcode.com/problems/stone-game-iii/) (Hard) — `[Game Theory]` Minimax DP lấy $1 \to 3$ đống sỏi.
- [ ] [1510. Stone Game IV](https://leetcode.com/problems/stone-game-iv/) (Hard) — `[Game Theory]` Bốc số viên sỏi là số chính phương.
- [ ] [96. Unique Binary Search Trees](https://leetcode.com/problems/unique-binary-search-trees/) (Medium) — `[Combinatorics]` Số Catalan $C_n = \frac{1}{n+1} \binom{2n}{n}$.
- [ ] [878. Nth Magical Number](https://leetcode.com/problems/nth-magical-number/) (Hard) — `[Math & BS]` Bội chung nhỏ nhất LCM + BS on Answer.
- [ ] [223. Rectangle Area](https://leetcode.com/problems/rectangle-area/) (Medium) — `[Geometry]` Diện tích giao nhau của 2 hình chữ nhật.
- [ ] [149. Max Points on a Line](https://leetcode.com/problems/max-points-on-a-line/) (Hard) — `[Geometry]` Chuẩn hóa hệ số góc đường thẳng qua $\gcd(\Delta y, \Delta x)$.
- [ ] [470. Implement Rand10() Using Rand7()](https://leetcode.com/problems/implement-rand10-using-rand7/) (Medium) — `[Probability]` Rejection Sampling biến đổi biến ngẫu nhiên đều.
- [ ] [294. Flip Game II](https://leetcode.com/problems/flip-game-ii/) (Medium) — `[Game Theory]` Trò chơi lật chuỗi `++` thành `--` với memoization.
- [ ] [891. Sum of Subsequence Widths](https://leetcode.com/problems/sum-of-subsequence-widths/) (Hard) — `[Combinatorics]` Đóng góp tổ hợp $2^i - 2^{n-1-i}$ của từng phần tử sau khi sort.

### Nhóm 3: Nâng Cao & Thử Thách CP (Ưu tiên 3 — Stars and Bars & Số học chuyên sâu)
- [ ] [679. 24 Game](https://leetcode.com/problems/24-game/) (Hard) — `[Backtracking]` Quay lui 4 lá bài số học với sai số số thực $\epsilon = 10^{-5}$.
- [ ] [1735. Count Ways to Make Array With Product](https://leetcode.com/problems/count-ways-to-make-array-with-product/) (Hard) — `[Stars and Bars]` Phân tích thừa số nguyên tố + Bài toán chia kẹo Euler.
- [ ] [1359. Count All Valid Pickup and Delivery Options](https://leetcode.com/problems/count-all-valid-pickup-and-delivery-options/) (Hard) — `[Combinatorics]` Đếm số cách chèn vị trí $P_i, D_i$ với công thức $\prod (2i-1) \cdot i$.
- [ ] [1862. Sum of Floored Pairs](https://leetcode.com/problems/sum-of-floored-pairs/) (Hard) — `[Number Theory]` Sàng đếm tần số các đoạn chia nguyên trong $O(N \log N)$.
- [ ] [1643. Kth Smallest Instructions](https://leetcode.com/problems/kth-smallest-instructions/) (Hard) — `[Combinatorics]` Dùng tổ hợp xác định lựa chọn bước đi thứ K (`H` hay `V`).
- [ ] [920. Number of Music Playlists](https://leetcode.com/problems/number-of-music-playlists/) (Hard) — `[Combinatorics & DP]` Tổ hợp chọn bài hát mới hoặc lặp lại cách quãng K bài.
- [ ] [1453. Maximum Number of Darts Inside a Circular Dartboard](https://leetcode.com/problems/maximum-number-of-darts-inside-a-circular-dartboard/) (Hard) — `[Geometry]` Xác định tâm đường tròn đi qua 2 điểm để bao phủ nhiều điểm nhất.

### Hệ Thống 2 Bài Test Định Kỳ (Tháng 5)
#### Bài Test 1 (Bấm giờ 90 phút — Modulo, Fast Pow, Tổ hợp, Tổ hợp + DP):
- [ ] **Q1 (Easy):** [258. Add Digits](https://leetcode.com/problems/add-digits/)
- [ ] **Q2 (Medium 1):** [372. Super Pow](https://leetcode.com/problems/super-pow/)
- [ ] **Q3 (Medium 2):** [62. Unique Paths](https://leetcode.com/problems/unique-paths/)
- [ ] **Q4 (Hard):** [920. Number of Music Playlists](https://leetcode.com/problems/number-of-music-playlists/)

#### Bài Test 2 (Bấm giờ 90 phút — Game Theory, Minimax, Xác suất):
- [ ] **Q1 (Easy):** [292. Nim Game](https://leetcode.com/problems/nim-game/)
- [ ] **Q2 (Medium 1):** [464. Can I Win](https://leetcode.com/problems/can-i-win/)
- [ ] **Q3 (Medium 2):** [688. Knight Probability in Chessboard](https://leetcode.com/problems/knight-probability-in-chessboard/)
- [ ] **Q4 (Hard):** [1406. Stone Game III](https://leetcode.com/problems/stone-game-iii/)

---

## Tháng 6: Luyện Tập Tổng Lực (Recap & Bộ 8 Bài Test Thực Chiến)
*Chủ đề:* Tổng ôn toàn bộ Phase 1, kỹ thuật viết Stress Test so sánh Brute Force, rèn luyện 8 Mock Contests chuẩn format LeetCode Weekly Contest / Codeforces Div 3.  
*Tổng số lượng:* **8 bài recap tổng hợp + 8 Mock Contests (32 bài) = 40 bài**.

### Nhóm Cốt Lõi: 8 Bài Recap Tổng Hợp Phase 1
- [ ] [146. LRU Cache](https://leetcode.com/problems/lru-cache/) (Medium) — `[STL & Design]` Hash Map + Doubly Linked List.
- [ ] [42. Trapping Rain Water](https://leetcode.com/problems/trapping-rain-water/) (Hard) — `[Two Pointers]` Tra cứu hai đầu.  *(ôn lại — Tháng 2)*
- [ ] [300. Longest Increasing Subsequence](https://leetcode.com/problems/longest-increasing-subsequence/) (Medium) — `[LIS]` Chặt nhị phân trong DP.  *(ôn lại — Tháng 3)*
- [ ] [72. Edit Distance](https://leetcode.com/problems/edit-distance/) (Hard) — `[String DP]` Khoảng cách Levenshtein.  *(ôn lại — Tháng 3)*
- [ ] [200. Number of Islands](https://leetcode.com/problems/number-of-islands/) (Medium) — `[DFS / BFS]` Loang ma trận.  *(ôn lại — Tháng 4)*
- [ ] [207. Course Schedule](https://leetcode.com/problems/course-schedule/) (Medium) — `[Topo Sort]` Phát hiện chu trình.  *(ôn lại — Tháng 4)*
- [ ] [743. Network Delay Time](https://leetcode.com/problems/network-delay-time/) (Medium) — `[Dijkstra]` Đường đi ngắn nhất.  *(ôn lại — Tháng 4)*
- [ ] [50. Pow(x, n)](https://leetcode.com/problems/powx-n/) (Medium) — `[Math]` Lũy thừa nhị phân.  *(ôn lại — Tháng 5)*

### Bộ 8 Mock Contests Thực Chiến (Bấm giờ 90 phút / đề — 32 Bài LeetCode):
#### Mock Contest 1 (STL, Stack, Queue, Heap)
- [ ] **Q1 (Easy):** [20. Valid Parentheses](https://leetcode.com/problems/valid-parentheses/)
- [ ] **Q2 (Medium 1):** [150. Evaluate Reverse Polish Notation](https://leetcode.com/problems/evaluate-reverse-polish-notation/)
- [ ] **Q3 (Medium 2):** [347. Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements/)
- [ ] **Q4 (Hard):** [239. Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum/)

#### Mock Contest 2 (Two Pointers, Sliding Window, Prefix Sum)
- [ ] **Q1 (Easy):** [167. Two Sum II](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/)
- [ ] **Q2 (Medium 1):** [11. Container With Most Water](https://leetcode.com/problems/container-with-most-water/)
- [ ] **Q3 (Medium 2):** [560. Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k/)
- [ ] **Q4 (Hard):** [42. Trapping Rain Water](https://leetcode.com/problems/trapping-rain-water/)

#### Mock Contest 3 (Binary Search & BS on Answer)
- [ ] **Q1 (Easy):** [704. Binary Search](https://leetcode.com/problems/binary-search/)
- [ ] **Q2 (Medium 1):** [33. Search in Rotated Sorted Array](https://leetcode.com/problems/search-in-rotated-sorted-array/)
- [ ] **Q3 (Medium 2):** [875. Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas/)
- [ ] **Q4 (Hard):** [4. Median of Two Sorted Arrays](https://leetcode.com/problems/median-of-two-sorted-arrays/)

#### Mock Contest 4 (Classical DP & Knapsack)
- [ ] **Q1 (Easy):** [70. Climbing Stairs](https://leetcode.com/problems/climbing-stairs/)
- [ ] **Q2 (Medium 1):** [198. House Robber](https://leetcode.com/problems/house-robber/)
- [ ] **Q3 (Medium 2):** [322. Coin Change](https://leetcode.com/problems/coin-change/)
- [ ] **Q4 (Hard):** [300. Longest Increasing Subsequence](https://leetcode.com/problems/longest-increasing-subsequence/)

#### Mock Contest 5 (Grid DP, Interval DP & String DP)
- [ ] **Q1 (Easy):** [64. Minimum Path Sum](https://leetcode.com/problems/minimum-path-sum/)
- [ ] **Q2 (Medium 1):** [1143. Longest Common Subsequence](https://leetcode.com/problems/longest-common-subsequence/)
- [ ] **Q3 (Medium 2):** [516. Longest Palindromic Subsequence](https://leetcode.com/problems/longest-palindromic-subsequence/)
- [ ] **Q4 (Hard):** [312. Burst Balloons](https://leetcode.com/problems/burst-balloons/)

#### Mock Contest 6 (Graph BFS/DFS & DSU)
- [ ] **Q1 (Easy):** [200. Number of Islands](https://leetcode.com/problems/number-of-islands/)
- [ ] **Q2 (Medium 1):** [207. Course Schedule](https://leetcode.com/problems/course-schedule/)
- [ ] **Q3 (Medium 2):** [684. Redundant Connection](https://leetcode.com/problems/redundant-connection/)
- [ ] **Q4 (Hard):** [127. Word Ladder](https://leetcode.com/problems/word-ladder/)

#### Mock Contest 7 (Dijkstra, Bridges, Math & Bits)
- [ ] **Q1 (Easy):** [136. Single Number](https://leetcode.com/problems/single-number/)
- [ ] **Q2 (Medium 1):** [743. Network Delay Time](https://leetcode.com/problems/network-delay-time/)
- [ ] **Q3 (Medium 2):** [260. Single Number III](https://leetcode.com/problems/single-number-iii/)
- [ ] **Q4 (Hard):** [1192. Critical Connections in a Network](https://leetcode.com/problems/critical-connections-in-a-network/)

#### Mock Contest 8 (Tổng Hợp Nâng Cao Phase 1)
- [ ] **Q1 (Easy):** [204. Count Primes](https://leetcode.com/problems/count-primes/)
- [ ] **Q2 (Medium 1):** [464. Can I Win](https://leetcode.com/problems/can-i-win/)
- [ ] **Q3 (Medium 2):** [787. Cheapest Flights Within K Stops](https://leetcode.com/problems/cheapest-flights-within-k-stops/)
- [ ] **Q4 (Hard):** [887. Super Egg Drop](https://leetcode.com/problems/super-egg-drop/)

---

# GIAI ĐOẠN 2: THUẬT TOÁN NÂNG CAO & ĐỈNH CAO THI ĐẤU (THÁNG 7 – 13)

---

## Tháng 7: Cấu Trúc Dữ Liệu Nâng Cao
*Chủ đề:* Segment Tree, Lazy Propagation, Fenwick Tree (BIT), Sparse Table, Trie, Suffix Array, Persistent Segment Tree.  
*Tổng số lượng:* **34 bài rèn luyện + 8 bài test = 42 bài**.

### Nhóm 1: Cốt Lõi Bắt Buộc (Ưu tiên 1 — Nền tảng SegTree, BIT & Trie)
- [ ] [208. Implement Trie (Prefix Tree)](https://leetcode.com/problems/implement-trie-prefix-tree/) (Medium) — `[Trie]` Cài đặt Trie chuẩn với 26 nhánh con.
- [ ] [211. Design Add and Search Words Data Structure](https://leetcode.com/problems/design-add-and-search-words-data-structure/) (Medium) — `[Trie]` Trie hỗ trợ tìm kiếm ký tự đại diện `.`.
- [ ] [421. Maximum XOR of Two Numbers in an Array](https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/) (Medium) — `[Binary Trie]` Cây tiền tố nhị phân 32-bit tìm cặp XOR lớn nhất.
- [ ] [307. Range Sum Query - Mutable](https://leetcode.com/problems/range-sum-query-mutable/) (Medium) — `[Segment Tree / BIT]` Cập nhật điểm (Point Update) & Truy vấn đoạn (Range Query) $O(\log N)$.
- [ ] [315. Count of Smaller Numbers After Self](https://leetcode.com/problems/count-of-smaller-numbers-after-self/) (Hard) — `[Fenwick Tree]` Đếm nghịch thế bên phải kết hợp nén tọa độ.
- [ ] [715. Range Module](https://leetcode.com/problems/range-module/) (Hard) — `[Segment Tree]` Cập nhật khoảng với kỹ thuật Lazy Propagation.
- [ ] [850. Rectangle Area II](https://leetcode.com/problems/rectangle-area-ii/) (Hard) — `[Segment Tree & Sweep]` Đoạn quét kết hợp Segment Tree tính diện tích hợp các hình chữ nhật.
- [ ] [212. Word Search II](https://leetcode.com/problems/word-search-ii/) (Hard) — `[Trie & Backtracking]` Trie kết hợp DFS Backtracking trên ma trận ký tự.
- [ ] [303. Range Sum Query - Immutable](https://leetcode.com/problems/range-sum-query-immutable/) (Easy) — `[Range Query]` Nền tảng so sánh giữa Prefix Sum và Segment Tree.  *(ôn lại — Tháng 2)*
- [ ] [677. Map Sum Pairs](https://leetcode.com/problems/map-sum-pairs/) (Medium) — `[Trie]` Trie lưu tổng tiền tố giá trị.

### Nhóm 2: Rèn Luyện Phản Xạ (Ưu tiên 2 — Biến thể truy vấn đoạn & BIT)
- [ ] [648. Replace Words](https://leetcode.com/problems/replace-words/) (Medium) — `[Trie]` Tìm tiền tố gốc ngắn nhất trong Trie.
- [ ] [1268. Search Suggestions System](https://leetcode.com/problems/search-suggestions-system/) (Medium) — `[Trie]` Gợi ý top 3 từ điển có cùng tiền tố sau mỗi ký tự gõ.
- [ ] [1707. Maximum XOR With an Element From Array](https://leetcode.com/problems/maximum-xor-with-an-element-from-array/) (Hard) — `[Binary Trie]` Offline Queries sắp xếp theo ngưỡng chặn $m_i$ + Binary Trie.
- [ ] [493. Reverse Pairs](https://leetcode.com/problems/reverse-pairs/) (Hard) — `[Fenwick Tree]` Đếm cặp nghịch thế thỏa mãn $nums[i] > 2 \cdot nums[j]$.
- [ ] [327. Count of Range Sum](https://leetcode.com/problems/count-of-range-sum/) (Hard) — `[Fenwick Tree]` BIT trên mảng Prefix Sum đã nén tọa độ.
- [ ] [1524. Number of Sub-arrays With Odd Sum](https://leetcode.com/problems/number-of-sub-arrays-with-odd-sum/) (Medium) — `[Prefix Sum / BIT]` Đếm số mảng con có tổng lẻ.
- [ ] [218. The Skyline Problem](https://leetcode.com/problems/the-skyline-problem/) (Hard) — `[Segment Tree / Multiset]` Duy trì độ cao cực đại trong đường quét.
- [ ] [732. My Calendar III](https://leetcode.com/problems/my-calendar-iii/) (Hard) — `[Segment Tree]` Segment Tree động đếm số lần giao nhau cực đại của các lịch hẹn.
- [ ] [699. Falling Squares](https://leetcode.com/problems/falling-squares/) (Hard) — `[Segment Tree]` Segment Tree với Max Range Query và Range Update.
- [ ] [1649. Create Sorted Array through Instructions](https://leetcode.com/problems/create-sorted-array-through-instructions/) (Hard) — `[Fenwick Tree]` Tính chi phí chèn tối thiểu giữa số nhỏ hơn và số lớn hơn.
- [ ] [2179. Count Good Triplets in an Array](https://leetcode.com/problems/count-good-triplets-in-an-array/) (Hard) — `[Fenwick Tree]` Đếm bộ ba chỉ số tăng $(i, j, k)$ ở cả 2 hoán vị.
- [ ] [2426. Number of Pairs Satisfying Inequality](https://leetcode.com/problems/number-of-pairs-satisfying-inequality/) (Hard) — `[Fenwick Tree]` Chuyển đổi $nums1[i] - nums2[i] \le nums1[j] - nums2[j] + diff$.
- [ ] [1803. Count Pairs With XOR in a Range](https://leetcode.com/problems/count-pairs-with-xor-in-a-range/) (Hard) — `[Binary Trie]` Đếm số cặp phần tử có kết quả XOR nằm trong $[low, high]$.
- [ ] [1938. Maximum Genetic Difference Query](https://leetcode.com/problems/maximum-genetic-difference-query/) (Hard) — `[Offline DFS + Trie]` Offline queries trên cây kết hợp push/pop Binary Trie.

### Nhóm 3: Nâng Cao & Thử Thách CP (Ưu tiên 3 — Segment Tree động & Suffix Structure)
- [ ] [2213. Longest Substring of One Repeating Character](https://leetcode.com/problems/longest-substring-of-one-repeating-character/) (Hard) — `[Segment Tree]` Gộp đoạn phức tạp lưu tiền tố, hậu tố và đoạn dài nhất.
- [ ] [2286. Booking Concert Tickets in Groups](https://leetcode.com/problems/booking-concert-tickets-in-groups/) (Hard) — `[Segment Tree]` Kết hợp truy vấn Sum và truy vấn Min tìm hàng ghế trống.
- [ ] [1163. Last Substring in Lexicographical Order](https://leetcode.com/problems/last-substring-in-lexicographical-order/) (Hard) — `[Suffix Structure]` Suffix Array concept hai con trỏ tối ưu $O(N)$.
- [ ] [1044. Longest Duplicate Substring](https://leetcode.com/problems/longest-duplicate-substring/) (Hard) — `[Suffix / Double Hash]` Double Rolling Hash + Binary Search on Answer.
- [ ] [1825. Finding MK Average](https://leetcode.com/problems/finding-mk-average/) (Hard) — `[Data Structure Design]` 3 Multiset duy trì k phần tử nhỏ nhất, lớn nhất và phần giữa.
- [ ] [2003. Smallest Missing Genetic Value in Each Subtree](https://leetcode.com/problems/smallest-missing-genetic-value-in-each-subtree/) (Hard) — `[DSU on Tree]` Kỹ thuật Small to Large gộp Set trên cây.
- [ ] [1928. Minimum Cost to Reach Destination in Time](https://leetcode.com/problems/minimum-cost-to-reach-destination-in-time/) (Hard) — `[Dijkstra đa trạng thái]` Dijkstra 2 chiều lưu thời gian và chi phí.
- [ ] [1505. Minimum Possible Integer After at Most K Adjacent Swaps](https://leetcode.com/problems/minimum-possible-integer-after-at-most-k-adjacent-swaps/) (Hard) — `[Fenwick Tree]` Tham lam đưa chữ số nhỏ nhất về đầu kết hợp BIT tính số bước dời.
- [ ] [308. Range Sum Query 2D - Mutable](https://leetcode.com/problems/range-sum-query-2d-mutable/) (Hard) — `[2D BIT]` Cập nhật điểm và tính tổng hình chữ nhật 2D trong $O(\log M \log N)$.
- [ ] [239. Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum/) (Hard) — `[RMQ / Sparse Table]` So sánh hiệu năng Sparse Table và Monotonic Deque.  *(ôn lại — Tháng 1)*

### Hệ Thống 2 Bài Test Định Kỳ (Tháng 7)
#### Bài Test 1 (Bấm giờ 90 phút — Range Query, Segment Tree, Lazy Propagation):
- [ ] **Q1 (Easy):** [303. Range Sum Query - Immutable](https://leetcode.com/problems/range-sum-query-immutable/)
- [ ] **Q2 (Medium 1):** [307. Range Sum Query - Mutable](https://leetcode.com/problems/range-sum-query-mutable/)
- [ ] **Q3 (Medium 2):** [1524. Number of Sub-arrays With Odd Sum](https://leetcode.com/problems/number-of-sub-arrays-with-odd-sum/)
- [ ] **Q4 (Hard):** [715. Range Module](https://leetcode.com/problems/range-module/)

#### Bài Test 2 (Bấm giờ 90 phút — Trie, Binary Trie, Fenwick Tree):
- [ ] **Q1 (Easy):** [208. Implement Trie](https://leetcode.com/problems/implement-trie-prefix-tree/)
- [ ] **Q2 (Medium 1):** [211. Design Add and Search Words](https://leetcode.com/problems/design-add-and-search-words-data-structure/)
- [ ] **Q3 (Medium 2):** [421. Maximum XOR of Two Numbers](https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/)
- [ ] **Q4 (Hard):** [315. Count of Smaller Numbers After Self](https://leetcode.com/problems/count-of-smaller-numbers-after-self/)

### Ghi chú nội dung
- Bài Test 2 câu Q1 là 208 (Medium cơ bản) vì LeetCode không có bài Trie mức Easy. Chưa có bài LeetCode chuẩn cho Suffix Array và Persistent Segment Tree. Sparse Table luyện bằng cách tự cài lại bài 239 và các bài Range Minimum Query. Cần bổ sung nguồn ngoài LeetCode.

---

## Tháng 8: Một Số Kỹ Thuật Nâng Cao
*Chủ đề:* Meet in the middle, Chia căn & Thuật toán Mo, Merge Small to Large, KMP, Z-Algorithm, Hashing, Sweep line, Convex Hull Trick (CHT) & Li Chao Tree.  
*Tổng số lượng:* **34 bài rèn luyện + 8 bài test = 42 bài**.

### Nhóm 1: Cốt Lõi Bắt Buộc (Ưu tiên 1 — Nền tảng MITM, KMP & Sweep Line)
- [ ] [28. Find the Index of the First Occurrence in a String](https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/) (Medium) — `[KMP]` Cài đặt thuật toán so khớp chuỗi KMP chuẩn với mảng $\pi$.
- [ ] [459. Repeated Substring Pattern](https://leetcode.com/problems/repeated-substring-pattern/) (Easy) — `[KMP]` Phân tích chu kỳ lặp qua mảng tiền tố $\pi[n-1]$.
- [ ] [187. Repeated DNA Sequences](https://leetcode.com/problems/repeated-dna-sequences/) (Medium) — `[Rolling Hash]` Băm chuỗi cửa sổ cố định độ dài 10.
- [ ] [253. Meeting Rooms II](https://leetcode.com/problems/meeting-rooms-ii/) (Medium) — `[Sweep line]` Đường quét sắp xếp sự kiện mở/đóng phòng họp.
- [ ] [56. Merge Intervals](https://leetcode.com/problems/merge-intervals/) (Medium) — `[Sweep line]` Hợp nhất các khoảng thời gian giao nhau.
- [ ] [1755. Closest Subsequence Sum](https://leetcode.com/problems/closest-subsequence-sum/) (Hard) — `[Meet in the Middle]` Tách mảng thành hai nửa kích thước $N/2 \le 20$, sinh tập tổng rồi Two Pointers.
- [ ] [218. The Skyline Problem](https://leetcode.com/problems/the-skyline-problem/) (Hard) — `[Sweep line]` Multiset quản lý các tòa nhà đang hoạt động.  *(ôn lại — Tháng 7)*
- [ ] [214. Shortest Palindrome](https://leetcode.com/problems/shortest-palindrome/) (Hard) — `[KMP]` KMP trên chuỗi mở rộng $S + \# + rev(S)$.
- [ ] [252. Meeting Rooms](https://leetcode.com/problems/meeting-rooms/) (Easy) — `[Sweep line]` Kiểm tra xem có 2 khoảng thời gian nào trùng nhau không.
- [ ] [57. Insert Interval](https://leetcode.com/problems/insert-interval/) (Medium) — `[Sweep line]` Chèn khoảng mới và gộp đoạn liên tiếp.

### Nhóm 2: Rèn Luyện Phản Xạ (Ưu tiên 2 — MITM, Double Hash & Monotonic Queue)
- [ ] [1288. Remove Covered Intervals](https://leetcode.com/problems/remove-covered-intervals/) (Medium) — `[Sweep line]` Loại bỏ các đoạn bị bao phủ hoàn toàn.
- [ ] [1851. Minimum Interval to Include Each Query](https://leetcode.com/problems/minimum-interval-to-include-each-query/) (Hard) — `[Sweep line / Min-Heap]` Sắp xếp cả đoạn và query, duy trì Min-Heap độ dài đoạn.
- [ ] [1392. Longest Happy Prefix](https://leetcode.com/problems/longest-happy-prefix/) (Hard) — `[KMP]` Tìm tiền tố dài nhất đồng thời là hậu tố ($\pi[n-1]$).
- [ ] [1044. Longest Duplicate Substring](https://leetcode.com/problems/longest-duplicate-substring/) (Hard) — `[Double Rolling Hash]` Double Hash tránh collision + Binary Search.  *(ôn lại — Tháng 7)*
- [ ] [2035. Partition Array Into Two Arrays to Minimize Sum Difference](https://leetcode.com/problems/partition-array-into-two-arrays-to-minimize-sum-difference/) (Hard) — `[Meet in the Middle]` MITM phân loại theo số lượng phần tử đã chọn $k$.
- [ ] [805. Split Array With Same Average](https://leetcode.com/problems/split-array-with-same-average/) (Hard) — `[Meet in the Middle / DP]` Đưa về bài toán tổng 0 với kích thước tập con $k$.
- [ ] [956. Tallest Billboard](https://leetcode.com/problems/tallest-billboard/) (Hard) — `[Meet in the Middle / DP]` Duy trì hiệu độ cao giữa 2 cột.
- [ ] [1499. Max Value of Equation](https://leetcode.com/problems/max-value-of-equation/) (Hard) — `[Monotonic Deque]` Tối ưu biểu thức $(y_i - x_i) + (y_j + x_j)$ với $x_j - x_i \le k$.
- [ ] [1425. Constrained Subsequence Sum](https://leetcode.com/problems/constrained-subsequence-sum/) (Hard) — `[DP + Monotonic Deque]` DP tìm tổng dãy con lớn nhất với khoảng cách $\le k$.
- [ ] [1438. Longest Continuous Subarray With Absolute Diff <= Limit](https://leetcode.com/problems/longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit/) (Medium) — `[Monotonic Deque]` Hai Deque duy trì đồng thời min và max trong cửa sổ.
- [ ] [1944. Number of Visible People in a Queue](https://leetcode.com/problems/number-of-visible-people-in-a-queue/) (Hard) — `[Monotonic Stack]` Đếm số người nhìn thấy bên phải theo chiều cao.
- [ ] [2444. Count Subarrays With Fixed Bounds](https://leetcode.com/problems/count-subarrays-with-fixed-bounds/) (Hard) — `[Sweep con trỏ]` Đếm mảng con có min bằng minK và max bằng maxK trong $O(N)$.
- [ ] [2223. Sum of Scores of Built Strings](https://leetcode.com/problems/sum-of-scores-of-built-strings/) (Hard) — `[Z-Algorithm]` Tính tổng độ dài tiền tố chung lớn nhất bằng mảng Z.
- [ ] [3031. Minimum Time to Revert Word to Initial State II](https://leetcode.com/problems/minimum-time-to-revert-word-to-initial-state-ii/) (Hard) — `[KMP / Z-Algorithm]` Kiểm tra tính tiền tố hậu tố cách quãng $k$.

### Nhóm 3: Nâng Cao & CHT / Li Chao Tree (Ưu tiên 3 — Tối ưu DP)
- [ ] [656. Coin Path](https://leetcode.com/problems/coin-path/) (Hard) — `[DP Tối ưu]` DP chi phí nhỏ nhất với thứ tự từ điển nhỏ nhất.
- [ ] [1793. Maximum Score of a Good Subarray](https://leetcode.com/problems/maximum-score-of-a-good-subarray/) (Hard) — `[Two Pointers / Greedy]` Mở rộng tham lam hai bên qua vị trí $k$.
- [ ] [1340. Jump Game V](https://leetcode.com/problems/jump-game-v/) (Hard) — `[DP trên đồ thị DAG]` Sắp xếp độ cao giảm dần để tính DP.
- [ ] [1411. Number of Ways to Paint N x 3 Grid](https://leetcode.com/problems/number-of-ways-to-paint-n-x-3-grid/) (Hard) — `[Matrix DP]` DP 2 trạng thái màu (ABA vs ABC).
- [ ] [1955. Count Number of Special Subsequences](https://leetcode.com/problems/count-number-of-special-subsequences/) (Hard) — `[DP State]` Đếm dãy con đặc biệt 3 trạng thái $0 \to 1 \to 2$.
- [ ] [2321. Maximum Score Of Spliced Array](https://leetcode.com/problems/maximum-score-of-spliced-array/) (Hard) — `[Kadane mở rộng]` Biến đổi hiệu mảng thành bài toán Kadane tìm đoạn chênh lệch lớn nhất.
- [ ] [850. Rectangle Area II](https://leetcode.com/problems/rectangle-area-ii/) (Hard) — `[Sweep line + SegTree]` Đường quét nâng cao kết hợp rời rạc hóa tọa độ.  *(ôn lại — Tháng 7)*
- [ ] [2262. Total Appeal of A String](https://leetcode.com/problems/total-appeal-of-a-string/) (Hard) — `[Contribution Technique]` Tính đóng góp của từng vị trí xuất hiện ký tự.
- [ ] [828. Count Unique Characters of All Substrings](https://leetcode.com/problems/count-unique-characters-of-all-substrings-of-a-given-string/) (Hard) — `[Contribution Technique]` Nhân khoảng cách trái và phải của mỗi ký tự.
- [ ] [907. Sum of Subarray Minimums](https://leetcode.com/problems/sum-of-subarray-minimums/) (Medium) — `[Monotonic Stack]` Tính đóng góp của phần tử cực tiểu trong mọi mảng con.

### Hệ Thống 2 Bài Test Định Kỳ (Tháng 8)
#### Bài Test 1 (Bấm giờ 90 phút — KMP, Rolling Hash, Meet in the Middle):
- [ ] **Q1 (Easy):** [459. Repeated Substring Pattern](https://leetcode.com/problems/repeated-substring-pattern/)
- [ ] **Q2 (Medium 1):** [28. Find the Index of the First Occurrence](https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/)
- [ ] **Q3 (Medium 2):** [187. Repeated DNA Sequences](https://leetcode.com/problems/repeated-dna-sequences/)
- [ ] **Q4 (Hard):** [1755. Closest Subsequence Sum](https://leetcode.com/problems/closest-subsequence-sum/)

#### Bài Test 2 (Bấm giờ 90 phút — Sweep line: Intervals, Meeting Rooms, Skyline):
- [ ] **Q1 (Easy):** [252. Meeting Rooms](https://leetcode.com/problems/meeting-rooms/)
- [ ] **Q2 (Medium 1):** [56. Merge Intervals](https://leetcode.com/problems/merge-intervals/)
- [ ] **Q3 (Medium 2):** [253. Meeting Rooms II](https://leetcode.com/problems/meeting-rooms-ii/)
- [ ] **Q4 (Hard):** [218. The Skyline Problem](https://leetcode.com/problems/the-skyline-problem/)

### Ghi chú nội dung
- Mo's Algorithm, Convex Hull Trick, Li Chao Tree và Square Root Decomposition gần như không có bài LeetCode. Z-Algorithm chỉ có 2223 và 3031. Cần bổ sung nguồn ngoài LeetCode (CSES, Codeforces).

---

## Tháng 9: Quy Hoạch Động Nâng Cao
*Chủ đề:* Bitmask DP, SOS DP, Digit DP, Quy hoạch động nhân ma trận, Tree DP & Re-rooting, Bitset DP.  
*Tổng số lượng:* **34 bài rèn luyện + 8 bài test = 42 bài**.

### Nhóm 1: Cốt Lõi Bắt Buộc (Ưu tiên 1 — Nền tảng Bitmask & Tree DP)
- [ ] [78. Subsets](https://leetcode.com/problems/subsets/) (Medium) — `[Bitmask]` Sinh toàn bộ $2^N$ tập con bằng phép duyệt bit.
- [ ] [698. Partition to K Equal Sum Subsets](https://leetcode.com/problems/partition-to-k-equal-sum-subsets/) (Medium) — `[Bitmask DP]` Phân chia mảng thành K tập có tổng bằng nhau.
- [ ] [847. Shortest Path Visiting All Nodes](https://leetcode.com/problems/shortest-path-visiting-all-nodes/) (Hard) — `[BFS + Bitmask]` Trạng thái $(mask, u)$ tìm chu trình thăm hết các đỉnh ngắn nhất.  *(ôn lại — Tháng 4)*
- [ ] [337. House Robber III](https://leetcode.com/problems/house-robber-iii/) (Medium) — `[Tree DP]` Độc lập cực đại trên cây: Trả về cặp $(rob, not\_rob)$.
- [ ] [124. Binary Tree Maximum Path Sum](https://leetcode.com/problems/binary-tree-maximum-path-sum/) (Hard) — `[Tree DP]` Tổng đường đi lớn nhất giữa 2 nút bất kỳ trên cây.
- [ ] [834. Sum of Distances in Tree](https://leetcode.com/problems/sum-of-distances-in-tree/) (Hard) — `[Tree Re-rooting]` Kỹ thuật đổi gốc cây 2 lượt DFS đạt độ phức tạp $O(N)$.
- [ ] [233. Number of Digit One](https://leetcode.com/problems/number-of-digit-one/) (Hard) — `[Digit DP]` Đếm số lượng chữ số 1 xuất hiện từ 1 đến $N$.
- [ ] [902. Numbers At Most N Given Digit Set](https://leetcode.com/problems/numbers-at-most-n-given-digit-set/) (Hard) — `[Digit DP]` Đếm số lượng số nhỏ hơn $N$ tạo từ tập chữ số cho trước.
- [ ] [543. Diameter of Binary Tree](https://leetcode.com/problems/diameter-of-binary-tree/) (Easy) — `[Tree DP]` Tính đường kính cây nhị phân qua chiều cao hai nhánh con.
- [ ] [464. Can I Win](https://leetcode.com/problems/can-i-win/) (Medium) — `[Bitmask DP]` Minimax kết hợp Bitmask lưu trạng thái các số đã chọn.  *(ôn lại — Tháng 5)*

### Nhóm 2: Rèn Luyện Phản Xạ (Ưu tiên 2 — Digit DP & Bitmask nâng cao)
- [ ] [968. Binary Tree Cameras](https://leetcode.com/problems/binary-tree-cameras/) (Hard) — `[Tree DP]` 3 trạng thái lắp camera: Đã lắp, được bao phủ, chưa được bao phủ.
- [ ] [1372. Longest ZigZag Path in a Binary Tree](https://leetcode.com/problems/longest-zigzag-path-in-a-binary-tree/) (Medium) — `[Tree DP]` Đường đi ziczac đổi hướng trái/phải.
- [ ] [1443. Minimum Time to Collect All Apples in a Tree](https://leetcode.com/problems/minimum-time-to-collect-all-apples-in-a-tree/) (Medium) — `[Tree DFS]` Gom táo trên cây trả về thời gian tối thiểu.
- [ ] [1125. Smallest Sufficient Team](https://leetcode.com/problems/smallest-sufficient-team/) (Hard) — `[Bitmask DP]` Bài toán tập phủ nhỏ nhất với mask kỹ năng.
- [ ] [1655. Distribute Repeating Integers](https://leetcode.com/problems/distribute-repeating-integers/) (Hard) — `[Bitmask DP]` Phân phối số lượng cho các khách hàng thỏa mãn đơn hàng.
- [ ] [1434. Number of Ways to Wear Different Hats](https://leetcode.com/problems/number-of-ways-to-wear-different-hats/) (Hard) — `[Bitmask DP]` Đảo chiều trạng thái: Duyệt từng chiếc mũ và bitmask đại diện cho số người.
- [ ] [1012. Numbers With Repeated Digits](https://leetcode.com/problems/numbers-with-repeated-digits/) (Hard) — `[Digit DP]` Đếm số có ít nhất 1 chữ số lặp lại qua bù trừ.
- [ ] [600. Non-negative Integers without Consecutive Ones](https://leetcode.com/problems/non-negative-integers-without-consecutive-ones/) (Hard) — `[Digit DP]` Số nhị phân không có 2 bit 1 liên tiếp (dãy Fibonacci).
- [ ] [1986. Minimum Number of Work Sessions to Finish the Tasks](https://leetcode.com/problems/minimum-number-of-work-sessions-to-finish-the-tasks/) (Medium) — `[Bitmask DP]` Số phiên làm việc tối thiểu để hoàn thành $N$ công việc.
- [ ] [2172. Maximum AND Sum of Array](https://leetcode.com/problems/maximum-and-sum-of-array/) (Hard) — `[Bitmask DP]` Phân phối các phần tử vào các khe cắm.
- [ ] [552. Student Attendance Record II](https://leetcode.com/problems/student-attendance-record-ii/) (Hard) — `[Matrix Exponentiation DP]` Quy hoạch động nhân ma trận lũy thừa trạng thái điểm danh.
- [ ] [1397. Find All Good Strings](https://leetcode.com/problems/find-all-good-strings/) (Hard) — `[Digit DP + KMP]` Digit DP kết hợp hàm chuyển trạng thái KMP loại trừ chuỗi cấm.
- [ ] [2719. Count of Integers](https://leetcode.com/problems/count-of-integers/) (Hard) — `[Digit DP]` Đếm số lượng số trong đoạn $[num1, num2]$ có tổng chữ số thỏa mãn $[min, max]$.
- [ ] [2827. Number of Beautiful Integers in the Range](https://leetcode.com/problems/number-of-beautiful-integers-in-the-range/) (Hard) — `[Digit DP]` Digit DP lưu số chữ số chẵn/lẻ và số dư chia cho $K$.

### Nhóm 3: Nâng Cao & Thử Thách CP (Ưu tiên 3 — Re-rooting & Bitmask cực hạn)
- [ ] [174. Dungeon Game](https://leetcode.com/problems/dungeon-game/) (Hard) — `[Grid DP]` DP đi ngược từ công chúa về hiệp sĩ.
- [ ] [879. Profitable Schemes](https://leetcode.com/problems/profitable-schemes/) (Hard) — `[Knapsack 2D]` Quy hoạch động 2 chiều ràng buộc số người và lợi nhuận tối thiểu.
- [ ] [1473. Paint House III](https://leetcode.com/problems/paint-house-iii/) (Hard) — `[DP 3D]` DP 3 trạng thái $dp(i, k, c)$ với số khu phố và màu sơn.
- [ ] [1531. String Compression II](https://leetcode.com/problems/string-compression-ii/) (Hard) — `[DP Nén chuỗi]` Xóa tối đa K ký tự để chiều dài nén ngắn nhất.
- [ ] [1879. Minimum XOR Sum of Two Arrays](https://leetcode.com/problems/minimum-xor-sum-of-two-arrays/) (Hard) — `[Bitmask DP]` Phân công việc sao cho tổng XOR là nhỏ nhất.
- [ ] [2581. Count Number of Possible Root Nodes](https://leetcode.com/problems/count-number-of-possible-root-nodes/) (Hard) — `[Tree Re-rooting]` Kỹ thuật đổi gốc đếm số đỉnh gốc thỏa mãn $\ge k$ phỏng đoán.
- [ ] [2246. Longest Path With Different Adjacent Characters](https://leetcode.com/problems/longest-path-with-different-adjacent-characters/) (Hard) — `[Tree DP]` Đường đi dài nhất trên cây có các ký tự kề nhau khác nhau.
- [ ] [312. Burst Balloons](https://leetcode.com/problems/burst-balloons/) (Hard) — `[Interval DP]` Củng cố kỹ thuật gộp đoạn.  *(ôn lại — Tháng 3)*
- [ ] [887. Super Egg Drop](https://leetcode.com/problems/super-egg-drop/) (Hard) — `[DP Đổi biến]` Rèn luyện phản xạ đổi biến số trạng thái.  *(ôn lại — Tháng 3)*
- [ ] [70. Climbing Stairs](https://leetcode.com/problems/climbing-stairs/) (Easy) — `[Matrix DP]` Viết mã nhân ma trận $2 \times 2$ cho bài toán Fibonacci.  *(ôn lại — Tháng 3)*

### Hệ Thống 2 Bài Test Định Kỳ (Tháng 9)
#### Bài Test 1 (Bấm giờ 90 phút — Bitmask, Bitmask DP, BFS + Bitmask):
- [ ] **Q1 (Easy):** [78. Subsets](https://leetcode.com/problems/subsets/)
- [ ] **Q2 (Medium 1):** [698. Partition to K Equal Sum Subsets](https://leetcode.com/problems/partition-to-k-equal-sum-subsets/)
- [ ] **Q3 (Medium 2):** [1986. Minimum Number of Work Sessions to Finish the Tasks](https://leetcode.com/problems/minimum-number-of-work-sessions-to-finish-the-tasks/)
- [ ] **Q4 (Hard):** [847. Shortest Path Visiting All Nodes](https://leetcode.com/problems/shortest-path-visiting-all-nodes/)

#### Bài Test 2 (Bấm giờ 90 phút — Tree DP, Tree Re-rooting):
- [ ] **Q1 (Easy):** [543. Diameter of Binary Tree](https://leetcode.com/problems/diameter-of-binary-tree/)
- [ ] **Q2 (Medium 1):** [337. House Robber III](https://leetcode.com/problems/house-robber-iii/)
- [ ] **Q3 (Medium 2):** [1372. Longest ZigZag Path in a Binary Tree](https://leetcode.com/problems/longest-zigzag-path-in-a-binary-tree/)
- [ ] **Q4 (Hard):** [834. Sum of Distances in Tree](https://leetcode.com/problems/sum-of-distances-in-tree/)

### Ghi chú nội dung
- SOS DP, Bitset DP và DP chia để trị tối ưu chưa có bài LeetCode tương ứng. Matrix Exponentiation chỉ có 552 và 70. Cần bổ sung nguồn ngoài LeetCode.

---

## Tháng 10: Lý Thuyết Đồ Thị Nâng Cao
*Chủ đề:* Luồng cực đại Dinic, Lát cắt cực tiểu, Cặp ghép cực đại 2 phía, LCA Binary Lifting, HLD, Centroid Decomposition, 2-SAT.  
*Tổng số lượng:* **34 bài rèn luyện + 8 bài test = 42 bài**.

### Nhóm 1: Cốt Lõi Bắt Buộc (Ưu tiên 1 — Nền tảng LCA & Đồ thị nâng cao)
- [ ] [236. Lowest Common Ancestor of a Binary Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/) (Medium) — `[LCA]` Tổ tiên chung gần nhất thuật toán đệ quy.
- [ ] [235. Lowest Common Ancestor of a BST](https://leetcode.com/problems/lowest-common-ancestor-of-a-bst/) (Easy) — `[LCA]` LCA trên cây nhị phân tìm kiếm trong $O(H)$.
- [ ] [1483. Kth Ancestor of a Tree Node](https://leetcode.com/problems/kth-ancestor-of-a-tree-node/) (Hard) — `[Binary Lifting]` Cài đặt mảng `up[u][i]` nhảy $2^i$ bước trong $O(\log N)$.
- [ ] [1584. Min Cost to Connect All Points](https://leetcode.com/problems/min-cost-to-connect-all-points/) (Medium) — `[MST]` Thuật toán Kruskal / Prim tìm cây khung nhỏ nhất.
- [ ] [1334. Find the City With the Smallest Number of Neighbors](https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance/) (Medium) — `[Floyd-Warshall]` Khoảng cách giữa mọi cặp đỉnh $O(V^3)$.
- [ ] [1349. Maximum Students Taking Exam](https://leetcode.com/problems/maximum-students-taking-exam/) (Hard) — `[Max Independent Set / Min Cut]` Tập độc lập cực đại trên đồ thị 2 phía / Bitmask.
- [ ] [332. Reconstruct Itinerary](https://leetcode.com/problems/reconstruct-itinerary/) (Hard) — `[Eulerian Path]` Chu trình Euler thuật toán Hierholzer.
- [ ] [1820. Maximum Number of Accepted Invitations](https://leetcode.com/problems/maximum-number-of-accepted-invitations/) (Medium) — `[Bipartite Matching]` Cặp ghép cực đại đồ thị 2 phía (Thuật toán Hungarian / DFS tăng luồng).
- [ ] [785. Is Graph Bipartite?](https://leetcode.com/problems/is-graph-bipartite/) (Medium) — `[Bipartite Graph]` Củng cố đồ thị hai phía.  *(ôn lại — Tháng 4)*
- [ ] [1135. Connecting Cities With Minimum Cost](https://leetcode.com/problems/connecting-cities-with-minimum-cost/) (Medium) — `[MST]` Kruskal với DSU.

### Nhóm 2: Rèn Luyện Phản Xạ (Ưu tiên 2 — Biến thể MST, DSU & Đường đi)
- [ ] [1168. Optimize Water Distribution in a Village](https://leetcode.com/problems/optimize-water-distribution-in-a-village/) (Hard) — `[MST Đỉnh ảo]` Tạo đỉnh ảo 0 đại diện cho trạm cấp nước ngầm để áp dụng Kruskal.
- [ ] [1627. Graph Connectivity With Threshold](https://leetcode.com/problems/graph-connectivity-with-threshold/) (Hard) — `[Sàng ước số + DSU]` Sàng liên kết các bội số lớn hơn ngưỡng threshold.
- [ ] [1579. Remove Max Number of Edges to Keep Graph Fully Traversable](https://leetcode.com/problems/remove-max-number-of-edges-to-keep-graph-fully-traversable/) (Hard) — `[2 DSU độc lập]` Duyệt ưu tiên cạnh loại 3 (chung cho cả Alice & Bob).  *(ôn lại — Tháng 4)*
- [ ] [839. Similar String Groups](https://leetcode.com/problems/similar-string-groups/) (Hard) — `[DSU]` So khớp 2 chuỗi có thể hoán vị 2 ký tự và gộp DSU.
- [ ] [952. Largest Component Size by Common Factor](https://leetcode.com/problems/largest-component-size-by-common-factor/) (Hard) — `[DSU]` DSU liên kết các số qua thừa số nguyên tố chung.
- [ ] [765. Couples Holding Hands](https://leetcode.com/problems/couples-holding-hands/) (Hard) — `[DSU]` Đếm số chu trình hoán vị để tính số lần đổi chỗ tối thiểu.
- [ ] [886. Possible Bipartition](https://leetcode.com/problems/possible-bipartition/) (Medium) — `[Bipartite Graph]` Phân chia nhóm không tương thích bằng tô 2 màu.
- [ ] [1947. Maximum Compatibility Score Sum](https://leetcode.com/problems/maximum-compatibility-score-sum/) (Medium) — `[Hungarian / Bitmask]` Cặp ghép trọng số cực đại giữa học sinh và người hướng dẫn.
- [ ] [753. Cracking the Safe](https://leetcode.com/problems/cracking-the-safe/) (Hard) — `[Eulerian Path]` Dãy De Bruijn thông qua chu trình Euler.
- [ ] [1568. Minimum Number of Days to Disconnect Island](https://leetcode.com/problems/minimum-number-of-days-to-disconnect-island/) (Hard) — `[Tarjan Khớp / Cầu]` Đáp số chỉ có thể là 0, 1 hoặc 2.
- [ ] [2045. Second Minimum Time to Reach Destination](https://leetcode.com/problems/second-minimum-time-to-reach-destination/) (Hard) — `[Modified BFS / Dijkstra]` Tìm đường đi ngắn thứ nhì với đèn tín hiệu giao thông.
- [ ] [2065. Maximum Path Quality of a Graph](https://leetcode.com/problems/maximum-path-quality-of-a-graph/) (Hard) — `[DFS Backtracking]` Tìm đường đi quay về đỉnh 0 có tổng điểm lớn nhất trong thời gian $T \le 100$.
- [ ] [2092. Find All People With Secret](https://leetcode.com/problems/find-all-people-with-secret/) (Hard) — `[DSU Rollback / BFS]` DSU theo từng mốc thời gian và rollback những ai không biết bí mật.
- [ ] [2421. Number of Good Paths](https://leetcode.com/problems/number-of-good-paths/) (Hard) — `[DSU Sort Vertices]` Sắp xếp các đỉnh theo giá trị tăng dần rồi gộp cụm DSU.

### Nhóm 3: Nâng Cao & Thử Thách CP (Ưu tiên 3 — Cấu trúc cây & Flow)
- [ ] [2003. Smallest Missing Genetic Value in Each Subtree](https://leetcode.com/problems/smallest-missing-genetic-value-in-each-subtree/) (Hard) — `[Small to Large / Tree]` Tìm giá trị MEX trên cây.  *(ôn lại — Tháng 7)*
- [ ] [1928. Minimum Cost to Reach Destination in Time](https://leetcode.com/problems/minimum-cost-to-reach-destination-in-time/) (Hard) — `[Dijkstra đa trạng thái]` Dijkstra theo thời gian và chi phí.  *(ôn lại — Tháng 7)*
- [ ] [2699. Modify Graph Edge Weights](https://leetcode.com/problems/modify-graph-edge-weights/) (Hard) — `[Dijkstra 2 lượt]` Gán trọng số các cạnh biến đổi để khoảng cách đạt đúng $target$.
- [ ] [1192. Critical Connections in a Network](https://leetcode.com/problems/critical-connections-in-a-network/) (Hard) — `[Tarjan]` Tìm cầu trong đồ thị viễn thông.  *(ôn lại — Tháng 4)*
- [ ] [127. Word Ladder](https://leetcode.com/problems/word-ladder/) (Hard) — `[Bi-directional BFS]` Tìm kiếm đường đi ngắn nhất.  *(ôn lại — Tháng 4)*
- [ ] [126. Word Ladder II](https://leetcode.com/problems/word-ladder-ii/) (Hard) — `[BFS + DFS]` Truy vết toàn bộ nghiệm.  *(ôn lại — Tháng 4)*
- [ ] [827. Making A Large Island](https://leetcode.com/problems/making-a-large-island/) (Hard) — `[DSU]` Thử nghiệm nối các vùng đảo.  *(ôn lại — Tháng 4)*
- [ ] [269. Alien Dictionary](https://leetcode.com/problems/alien-dictionary/) (Hard) — `[Topo Sort]` Khôi phục bảng chữ cái lạ.  *(ôn lại — Tháng 4)*
- [ ] [847. Shortest Path Visiting All Nodes](https://leetcode.com/problems/shortest-path-visiting-all-nodes/) (Hard) — `[BFS + Bitmask]` Duyệt đồ thị trạng thái bitmask.  *(ôn lại — Tháng 4)*
- [ ] [1971. Find if Path Exists in Graph](https://leetcode.com/problems/find-if-path-exists-in-graph/) (Easy) — `[DSU]` Kiểm tra liên thông cơ bản.  *(ôn lại — Tháng 4)*

### Hệ Thống 2 Bài Test Định Kỳ (Tháng 10)
#### Bài Test 1 (Bấm giờ 90 phút — LCA, Floyd-Warshall, Binary Lifting):
- [ ] **Q1 (Easy):** [235. Lowest Common Ancestor of a BST](https://leetcode.com/problems/lowest-common-ancestor-of-a-bst/)
- [ ] **Q2 (Medium 1):** [236. Lowest Common Ancestor of a Binary Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/)
- [ ] **Q3 (Medium 2):** [1334. Find the City With the Smallest Number of Neighbors at a Threshold Distance](https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance/)
- [ ] **Q4 (Hard):** [1483. Kth Ancestor of a Tree Node](https://leetcode.com/problems/kth-ancestor-of-a-tree-node/)

#### Bài Test 2 (Bấm giờ 90 phút — DSU, Bipartite, MST, Small to Large):
- [ ] **Q1 (Easy):** [1971. Find if Path Exists](https://leetcode.com/problems/find-if-path-exists-in-graph/)
- [ ] **Q2 (Medium 1):** [785. Is Graph Bipartite?](https://leetcode.com/problems/is-graph-bipartite/)
- [ ] **Q3 (Medium 2):** [1584. Min Cost to Connect All Points](https://leetcode.com/problems/min-cost-to-connect-all-points/)
- [ ] **Q4 (Hard):** [2003. Smallest Missing Genetic Value in Each Subtree](https://leetcode.com/problems/smallest-missing-genetic-value-in-each-subtree/)

### Ghi chú nội dung
- Max Flow (Dinic), Heavy-Light Decomposition, Centroid Decomposition và 2-SAT chưa có bài LeetCode tương ứng. Nhiều bài tháng này lặp lại Tháng 4 để ôn. Gợi ý nguồn ngoài (cần kiểm tra lại link trước khi dùng): CSES — Download Speed (Max Flow), School Dance (Matching), Path Queries II (HLD), Fixed-Length Paths I (Centroid), Giant Pizza (2-SAT).

---

## Tháng 11: Toán Học Nâng Cao
*Chủ đề:* Hình học phẳng (CCW, Bao lồi Monotone Chain), Mobius Inversion, Phi hàm Euler, Euclid mở rộng, Chinese Remainder Theorem (CRT), Linear Basis XOR.  
*Tổng số lượng:* **34 bài rèn luyện + 8 bài test = 42 bài**.

### Nhóm 1: Cốt Lõi Bắt Buộc (Ưu tiên 1 — Nền tảng hình học & Số học)
- [ ] [1232. Check If It Is a Straight Line](https://leetcode.com/problems/check-if-it-is-a-straight-line/) (Easy) — `[Hình học]` Tích có hướng (Cross Product) kiểm tra 3 điểm thẳng hàng.
- [ ] [149. Max Points on a Line](https://leetcode.com/problems/max-points-on-a-line/) (Hard) — `[Hình học]` Chuẩn hóa phân số tối giản hệ số góc qua $\gcd(\Delta y, \Delta x)$.  *(ôn lại — Tháng 5)*
- [ ] [587. Erect the Fence](https://leetcode.com/problems/erect-the-fence/) (Hard) — `[Bao lồi Convex Hull]` Thuật toán Andrew Monotone Chain tìm bao lồi trong $O(N \log N)$.
- [ ] [892. Surface Area of 3D Shapes](https://leetcode.com/problems/surface-area-of-3d-shapes/) (Easy) — `[Hình học 3D]` Tính diện tích bề mặt khối lập phương 3D trừ đi các mặt tiếp xúc.
- [ ] [976. Largest Perimeter Triangle](https://leetcode.com/problems/largest-perimeter-triangle/) (Easy) — `[Hình học]` Bất đẳng thức tam giác kết hợp sắp xếp tham lam.
- [ ] [812. Largest Triangle Area](https://leetcode.com/problems/largest-triangle-area/) (Easy) — `[Hình học]` Diện tích tam giác từ 3 điểm bằng công thức Shoelace.
- [ ] [1201. Ugly Number III](https://leetcode.com/problems/ugly-number-iii/) (Medium) — `[Bao hàm loại trừ]` Inclusion-Exclusion 3 tập hợp + BS on Answer.  *(ôn lại — Tháng 5)*
- [ ] [878. Nth Magical Number](https://leetcode.com/problems/nth-magical-number/) (Hard) — `[Số học & BS]` Số thần kỳ thứ N qua $\text{lcm}(A, B)$ và Binary Search.  *(ôn lại — Tháng 5)*
- [ ] [268. Missing Number](https://leetcode.com/problems/missing-number/) (Easy) — `[Toán / Bit]` Công thức tổng Gauss $\frac{n(n+1)}{2}$ so sánh với phép XOR.
- [ ] [29. Divide Two Integers](https://leetcode.com/problems/divide-two-integers/) (Medium) — `[Bitwise]` Phép chia nhị phân bằng phép dịch bit `<<` và trừ lũy thừa 2.

### Nhóm 2: Rèn Luyện Phản Xạ (Ưu tiên 2 — Lấy mẫu ngẫu nhiên & Bitwise Math)
- [ ] [869. Reordered Power of 2](https://leetcode.com/problems/reordered-power-of-2/) (Medium) — `[Số học]` Đếm tần số các chữ số của tất cả các lũy thừa $2^k$.
- [ ] [470. Implement Rand10() Using Rand7()](https://leetcode.com/problems/implement-rand10-using-rand7/) (Medium) — `[Xác suất ngẫu nhiên]` Rejection Sampling ma trận $7 \times 7$.  *(ôn lại — Tháng 5)*
- [ ] [519. Random Flip Matrix](https://leetcode.com/problems/random-flip-matrix/) (Medium) — `[Randomized Algorithm]` Virtual Fisher-Yates shuffle bằng Hash Map $O(1)$.
- [ ] [384. Shuffle an Array](https://leetcode.com/problems/shuffle-an-array/) (Medium) — `[Randomized Algorithm]` Thuật toán xáo trộn Fisher-Yates đạt phân phối đều chuẩn $O(N)$.
- [ ] [382. Linked List Random Node](https://leetcode.com/problems/linked-list-random-node/) (Medium) — `[Reservoir Sampling]` Chọn ngẫu nhiên 1 nút trên luồng dữ liệu danh sách liên kết $O(1)$ memory.
- [ ] [398. Random Pick Index](https://leetcode.com/problems/random-pick-index/) (Medium) — `[Reservoir Sampling]` Lấy ngẫu nhiên chỉ số xuất hiện của target với xác suất $1/k$.
- [ ] [528. Random Pick with Weight](https://leetcode.com/problems/random-pick-with-weight/) (Medium) — `[Prefix Sum + BS]` Chọn ngẫu nhiên theo trọng số bằng Prefix Sum và `std::upper_bound`.
- [ ] [497. Random Point in Non-overlapping Rectangles](https://leetcode.com/problems/random-point-in-non-overlapping-rectangles/) (Medium) — `[Reservoir / Prefix Sum]` Chọn ngẫu nhiên điểm nguyên trên tập các hình chữ nhật.
- [ ] [137. Single Number II](https://leetcode.com/problems/single-number-ii/) (Medium) — `[Bitwise]` Máy trạng thái hữu hạn mod 3 lưu 2 biến `ones` và `twos`.
- [ ] [1318. Minimum Flips to Make a OR b Equal to c](https://leetcode.com/problems/minimum-flips-to-make-a-or-b-equal-to-c/) (Medium) — `[Bitwise]` Đếm số bit cần lật từng vị trí.
- [ ] [1442. Count Triplets That Can Form Two Arrays of Equal XOR](https://leetcode.com/problems/count-triplets-that-can-form-two-arrays-of-equal-xor/) (Medium) — `[Bitwise Prefix Sum]` Đưa về tìm đoạn có tổng XOR bằng 0: $pref[i] == pref[k+1]$.
- [ ] [1015. Smallest Integer Divisible by K](https://leetcode.com/problems/smallest-integer-divisible-by-k/) (Medium) — `[Modulo & Pigeonhole]` Số gồm toàn chữ số 1 chia hết cho K.
- [ ] [223. Rectangle Area](https://leetcode.com/problems/rectangle-area/) (Medium) — `[Hình học]` Giao diện tích hai hình chữ nhật.  *(ôn lại — Tháng 5)*
- [ ] [391. Perfect Rectangle](https://leetcode.com/problems/perfect-rectangle/) (Hard) — `[Hình học]` Kiểm tra tập các hình chữ nhật con ghép thành hình chữ nhật hoàn hảo.

### Nhóm 3: Nâng Cao & Thử Thách CP (Ưu tiên 3 — Bao lồi Welzl & Stars and Bars)
- [ ] [1862. Sum of Floored Pairs](https://leetcode.com/problems/sum-of-floored-pairs/) (Hard) — `[Số học nâng cao]` Sàng đoạn chia nguyên bằng mảng đếm tần số $O(N \log N)$.  *(ôn lại — Tháng 5)*
- [ ] [1735. Count Ways to Make Array With Product](https://leetcode.com/problems/count-ways-to-make-array-with-product/) (Hard) — `[Stars and Bars]` Phân tích thừa số nguyên tố kết hợp bài toán chia kẹo Euler.  *(ôn lại — Tháng 5)*
- [ ] [1924. Erect the Fence II](https://leetcode.com/problems/erect-the-fence-ii/) (Hard) — `[Hình học nâng cao]` Thuật toán Welzl tìm vòng tròn bao nhỏ nhất (Minimum Enclosing Circle) trong $O(N)$.
- [ ] [1453. Maximum Number of Darts Inside a Circular Dartboard](https://leetcode.com/problems/maximum-number-of-darts-inside-a-circular-dartboard/) (Hard) — `[Hình học]` Xác định tâm đường tròn đi qua 2 điểm để bao phủ số phi tiêu lớn nhất.  *(ôn lại — Tháng 5)*
- [ ] [365. Water and Jug Problem](https://leetcode.com/problems/water-and-jug-problem/) (Medium) — `[GCD & Bézout]` Giải bài toán đong nước qua định lý Bézout.  *(ôn lại — Tháng 5)*
- [ ] [679. 24 Game](https://leetcode.com/problems/24-game/) (Hard) — `[Toán / Backtracking]` Quay lui phân số số thực giải bài toán 24.  *(ôn lại — Tháng 5)*
- [ ] [1359. Count All Valid Pickup and Delivery Options](https://leetcode.com/problems/count-all-valid-pickup-and-delivery-options/) (Hard) — `[Tổ hợp]` Đếm số cách sắp xếp giao hàng hợp lệ.  *(ôn lại — Tháng 5)*
- [ ] [891. Sum of Subsequence Widths](https://leetcode.com/problems/sum-of-subsequence-widths/) (Hard) — `[Tổ hợp]` Đóng góp của phần tử vào độ rộng tập con.  *(ôn lại — Tháng 5)*
- [ ] [1643. Kth Smallest Instructions](https://leetcode.com/problems/kth-smallest-instructions/) (Hard) — `[Tổ hợp]` Xác định bước đi thứ K.  *(ôn lại — Tháng 5)*
- [ ] [920. Number of Music Playlists](https://leetcode.com/problems/number-of-music-playlists/) (Hard) — `[Tổ hợp + DP]` Danh sách phát nhạc K bài cách quãng.  *(ôn lại — Tháng 5)*

### Hệ Thống 2 Bài Test Định Kỳ (Tháng 11)
#### Bài Test 1 (Bấm giờ 90 phút — Hình học (Cross Product, Rectangle Area, Convex Hull), GCD & Bézout):
- [ ] **Q1 (Easy):** [1232. Check If It Is a Straight Line](https://leetcode.com/problems/check-if-it-is-a-straight-line/)
- [ ] **Q2 (Medium 1):** [223. Rectangle Area](https://leetcode.com/problems/rectangle-area/)
- [ ] **Q3 (Medium 2):** [365. Water and Jug Problem](https://leetcode.com/problems/water-and-jug-problem/)
- [ ] **Q4 (Hard):** [587. Erect the Fence](https://leetcode.com/problems/erect-the-fence/)

#### Bài Test 2 (Bấm giờ 90 phút — XOR / số học, Bao hàm loại trừ + BS on Answer):
- [ ] **Q1 (Easy):** [268. Missing Number](https://leetcode.com/problems/missing-number/)
- [ ] **Q2 (Medium 1):** [869. Reordered Power of 2](https://leetcode.com/problems/reordered-power-of-2/)
- [ ] **Q3 (Medium 2):** [1201. Ugly Number III](https://leetcode.com/problems/ugly-number-iii/)
- [ ] **Q4 (Hard):** [878. Nth Magical Number](https://leetcode.com/problems/nth-magical-number/)

### Ghi chú nội dung
- Mobius, Phi Euler, Euclid mở rộng, CRT, Linear Basis XOR và tích phân Simpson chưa có bài LeetCode tương ứng; phần lớn bài của tháng này lặp lại Tháng 5 hoặc thuộc hình học. Cần bổ sung nguồn ngoài LeetCode (CSES mục Mathematics, Codeforces tag number theory).

---

## Tháng 12 – 13: Luyện Tập Đỉnh Cao & Phỏng Vấn (Contest Sprints & Big Tech Interview)
*Chủ đề:* Speed Solving thi đấu LeetCode Weekly/Biweekly & Codeforces Div 2, chinh phục mốc **Guardian 2100+**, hoàn thiện kỹ năng phỏng vấn Big Tech.  
*Tổng số lượng:* **25 bài Contest Sprints + 10 bài Mock Interview = 35 bài**.

### 1. Chiến Lược Speed Solving & Đạt Mốc LeetCode Guardian (2100+)
- [ ] Tham gia đều đặn các kỳ thi **LeetCode Weekly & Biweekly Contests** (Mục tiêu hoàn thành Q1, Q2, Q3 trong 20–25 phút).
- [ ] 100% Upsolving câu Q4 (Hard) sau mỗi contest trong vòng 24 giờ.
- [ ] Thi đấu các kỳ **Codeforces Div 2** để bứt phá mốc Specialist lên Expert (1600+).

### 2. Bộ 25 Đề Contest Sprints Đặc Sắc (Các bài Q3/Q4 kinh điển quyết định rank Guardian):
1. - [ ] [239. Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum/) (Hard) — Monotonic Deque đỉnh cao.  *(ôn lại — Tháng 1)*
2. - [ ] [84. Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram/) (Hard) — Monotonic Stack kinh điển.  *(ôn lại — Tháng 1)*
3. - [ ] [312. Burst Balloons](https://leetcode.com/problems/burst-balloons/) (Hard) — Interval DP duyệt ngược.  *(ôn lại — Tháng 3)*
4. - [ ] [887. Super Egg Drop](https://leetcode.com/problems/super-egg-drop/) (Hard) — Đổi biến số trạng thái DP.  *(ôn lại — Tháng 3)*
5. - [ ] [1192. Critical Connections in a Network](https://leetcode.com/problems/critical-connections-in-a-network/) (Hard) — Tarjan Cầu.  *(ôn lại — Tháng 4)*
6. - [ ] [847. Shortest Path Visiting All Nodes](https://leetcode.com/problems/shortest-path-visiting-all-nodes/) (Hard) — BFS + Bitmask state.  *(ôn lại — Tháng 4)*
7. - [ ] [715. Range Module](https://leetcode.com/problems/range-module/) (Hard) — Segment Tree Lazy Propagation.  *(ôn lại — Tháng 7)*
8. - [ ] [1755. Closest Subsequence Sum](https://leetcode.com/problems/closest-subsequence-sum/) (Hard) — Meet in the Middle $2^{N/2}$.  *(ôn lại — Tháng 8)*
9. - [ ] [834. Sum of Distances in Tree](https://leetcode.com/problems/sum-of-distances-in-tree/) (Hard) — Tree Re-rooting 2 lượt DFS.  *(ôn lại — Tháng 9)*
10. - [ ] [1483. Kth Ancestor of a Tree Node](https://leetcode.com/problems/kth-ancestor-of-a-tree-node/) (Hard) — Binary Lifting $O(\log N)$.  *(ôn lại — Tháng 10)*
11. - [ ] [587. Erect the Fence](https://leetcode.com/problems/erect-the-fence/) (Hard) — Andrew Monotone Chain Bao lồi.  *(ôn lại — Tháng 11)*
12. - [ ] [2179. Count Good Triplets in an Array](https://leetcode.com/problems/count-good-triplets-in-an-array/) (Hard) — Fenwick Tree hoán vị.  *(ôn lại — Tháng 7)*
13. - [ ] [2035. Partition Array Into Two Arrays to Minimize Sum Difference](https://leetcode.com/problems/partition-array-into-two-arrays-to-minimize-sum-difference/) (Hard) — MITM phân loại kích thước.  *(ôn lại — Tháng 8)*
14. - [ ] [2444. Count Subarrays With Fixed Bounds](https://leetcode.com/problems/count-subarrays-with-fixed-bounds/) (Hard) — Con trỏ quét mảng con cố định min/max.  *(ôn lại — Tháng 8)*
15. - [ ] [2421. Number of Good Paths](https://leetcode.com/problems/number-of-good-paths/) (Hard) — DSU duyệt theo thứ tự đỉnh tăng dần.  *(ôn lại — Tháng 10)*
16. - [ ] [2581. Count Number of Possible Root Nodes](https://leetcode.com/problems/count-number-of-possible-root-nodes/) (Hard) — Tree Re-rooting đếm dự đoán.  *(ôn lại — Tháng 9)*
17. - [ ] [2699. Modify Graph Edge Weights](https://leetcode.com/problems/modify-graph-edge-weights/) (Hard) — Modified Dijkstra 2 lượt.  *(ôn lại — Tháng 10)*
18. - [ ] [2719. Count of Integers](https://leetcode.com/problems/count-of-integers/) (Hard) — Digit DP tổng chữ số.  *(ôn lại — Tháng 9)*
19. - [ ] [188. Best Time to Buy and Sell Stock IV](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/) (Hard) — State Machine DP mua bán K lần.  *(ôn lại — Tháng 3)*
20. - [ ] [85. Maximal Rectangle](https://leetcode.com/problems/maximal-rectangle/) (Hard) — Histogram ma trận 2D.  *(ôn lại — Tháng 1)*
21. - [ ] [410. Split Array Largest Sum](https://leetcode.com/problems/split-array-largest-sum/) (Hard) — BS on Answer Minimax.  *(ôn lại — Tháng 2)*
22. - [ ] [4. Median of Two Sorted Arrays](https://leetcode.com/problems/median-of-two-sorted-arrays/) (Hard) — Chặt nhị phân song song hai mảng.  *(ôn lại — Tháng 2)*
23. - [ ] [76. Minimum Window Substring](https://leetcode.com/problems/minimum-window-substring/) (Hard) — Cửa sổ trượt tần số ký tự.  *(ôn lại — Tháng 2)*
24. - [ ] [315. Count of Smaller Numbers After Self](https://leetcode.com/problems/count-of-smaller-numbers-after-self/) (Hard) — BIT đếm nghịch thế.  *(ôn lại — Tháng 7)*
25. - [ ] [124. Binary Tree Maximum Path Sum](https://leetcode.com/problems/binary-tree-maximum-path-sum/) (Hard) — Tree DP tính tổng đường đi.  *(ôn lại — Tháng 9)*

### 3. Bộ 10 Đề Mock Technical Interview Chuẩn Big Tech (Google / Meta / Amazon)
- [ ] **Mock 1 (Data Structures):** [146. LRU Cache](https://leetcode.com/problems/lru-cache/) (Cài đặt Doubly Linked List + Hash Map trong 30 phút).
- [ ] **Mock 2 (Concurrency/Design):** [460. LFU Cache](https://leetcode.com/problems/lfu-cache/) (Cấu trúc 2 Hash Map + Double Linked List).
- [ ] **Mock 3 (Strings & Parsing):** [224. Basic Calculator](https://leetcode.com/problems/basic-calculator/) (Xử lý dấu ngoặc và số âm bằng Stack).
- [ ] **Mock 4 (Search & Backtracking):** [212. Word Search II](https://leetcode.com/problems/word-search-ii/) (Trie kết hợp DFS Backtracking trên ma trận).
- [ ] **Mock 5 (Trees & Graph):** [297. Serialize and Deserialize Binary Tree](https://leetcode.com/problems/serialize-and-deserialize-binary-tree/) (Mã hóa và giải mã cây).
- [ ] **Mock 6 (Advanced DP):** [10. Regular Expression Matching](https://leetcode.com/problems/regular-expression-matching/) (Khớp chuỗi regex `.` và `*`).
- [ ] **Mock 7 (Intervals & Sweep):** [218. The Skyline Problem](https://leetcode.com/problems/the-skyline-problem/) (Đường quét quản lý đường chân trời).
- [ ] **Mock 8 (Stream & Minimax):** [295. Find Median from Data Stream](https://leetcode.com/problems/find-median-from-data-stream/) (Cặp Max-Heap và Min-Heap duy trì trung vị).
- [ ] **Mock 9 (Complex Matrix):** [42. Trapping Rain Water](https://leetcode.com/problems/trapping-rain-water/) & [407. Trapping Rain Water II](https://leetcode.com/problems/trapping-rain-water-ii/) (Hứng nước mưa 1D và 2D với Min-Heap).
- [ ] **Mock 10 (Graph & Flow):** [127. Word Ladder](https://leetcode.com/problems/word-ladder/) & [126. Word Ladder II](https://leetcode.com/problems/word-ladder-ii/) (Bi-directional BFS và truy vết toàn bộ đường đi).

---