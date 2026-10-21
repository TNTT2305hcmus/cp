# ROADMAP.md — Lộ Trình Huấn Luyện Competitive Programming (13 Tháng)

> **Căn cứ:** [TopAlgo Roadmap](https://topalgo.com.vn/roadmap) kết hợp kho bài tập [LeetCode](https://leetcode.com/).
> **File liên quan:** ngân hàng bài tập và đề test ở [`PLANNING.md`](./PLANNING.md); khung bài giảng ở [`TEMPLATE_LESSON.md`](./TEMPLATE_LESSON.md).
> **Vai trò của file này:** nguồn sự thật cho **danh sách bài học và ID `x.y`**. Tên, thứ tự và số lượng bài học trong các file `.tsx` và `roadmapData` phải khớp với file này.

---

## Quy ước chung

| Mục | Quy ước |
| :--- | :--- |
| ID bài học | `x.y`, trong đó `x` là số tháng và `y` là thứ tự học. `x.0` là trang tổng quan tháng. |
| Nhịp học | Mỗi ngày 1 chủ đề lý thuyết và 1–2 bài tập. Một tháng khoảng 30 buổi học. |
| Bài test | Mỗi tháng 2 bài test. Mỗi bài 4 câu (Easy, Medium 1, Medium 2, Hard), 90 phút, tối đa 18 điểm. Định dạng như LeetCode Weekly Contest. |
| Mốc tháng | Tháng 1–6 dùng định dạng Codeforces Div 3 cho các bài thi thử. Tháng 7–13 dùng Div 2. |
| Chuẩn đầu ra | Mỗi tháng có danh sách việc người học làm được. Chỉ chuyển tháng khi đạt ít nhất 2 trong 3 chuẩn. |
| Stuck Checklist | Bí ý tưởng quá **15 phút** thì: vẽ test nhỏ (3–5 phần tử), thử nghĩ ngược từ kết quả, nén biên, rồi mới mở gợi ý tầng 1. |

## Tổng quan 13 tháng

| Giai đoạn | Tháng | Chủ đề | Số bài học |
| :--- | :--- | :--- | :---: |
| 1. Nền tảng | 1 | Cấu trúc dữ liệu cơ bản (Vector, Stack, Queue, Heap, BST, Hash, Bitset) | 7 |
| | 2 | Một số kỹ thuật căn bản (Two Pointers, Sliding Window, Prefix Sum, Bit, Sàng, Binary Search, Ternary, Tham lam, Chia để trị) | 9 |
| | 3 | Quy hoạch động và kỹ thuật đổi biến số | 6 |
| | 4 | Lý thuyết đồ thị căn bản (DFS, BFS, Topo, DSU, Dijkstra, Tarjan) | 7 |
| | 5 | Toán học (Tổ hợp, Xác suất, Kỳ vọng, Game Theory, Modulo) | 7 |
| | 6 | Tổng ôn và 8 bài thi thử | 10 |
| 2. Nâng cao | 7 | Cấu trúc dữ liệu nâng cao (Segment Tree, Fenwick, Sparse Table, Trie, Suffix Array, Persistent) | 7 |
| | 8 | Kỹ thuật nâng cao (Meet in the Middle, Mo, Small to Large, KMP/Z/Hash, Sweep line, CHT) | 7 |
| | 9 | Quy hoạch động nâng cao (Bitmask, SOS, Digit, Matrix, Tree, Bitset, D&C Opt) | 7 |
| | 10 | Đồ thị nâng cao (Max Flow, Min Cut, LCA, HLD, Centroid, 2-SAT) | 6 |
| | 11 | Toán học nâng cao (Hình học, Mobius, Phi Euler, CRT, Linear Basis, Giải tích) | 7 |
| | 12–13 | Luyện thi đỉnh cao và phỏng vấn Big Tech | 2 |

---

# GIAI ĐOẠN 1: NỀN TẢNG THUẬT TOÁN & KỸ NĂNG CỐT LÕI

## Tháng 1: Cấu Trúc Dữ Liệu Cơ Bản

**Mục tiêu:** nắm cơ chế bộ nhớ và độ phức tạp của từng cấu trúc dữ liệu; loại bỏ lỗi TLE do sao chép dữ liệu (truyền theo giá trị) và do bảng băm bị tấn công.

| ID | Bài học | Nội dung chính | Độ khó |
| :--- | :--- | :--- | :--- |
| 1.1 | Độ phức tạp, Vector, Sorting | Big-O, Big-$\Theta$, quy tắc $10^8$ phép tính mỗi giây. Chi phí khấu hao của `std::vector`, `reserve()`, truyền `const vector<int>&`. IntroSort, comparator tùy biến, `stable_sort`, `nth_element` $O(N)$. | Easy |
| 1.2 | Stack | LIFO, cài bằng mảng cố định. Dãy ngoặc hợp lệ, biểu thức hậu tố (RPN). | Easy |
| 1.3 | Queue và Deque | FIFO, Ring Buffer. `std::deque` chèn/xóa hai đầu $O(1)$. | Medium |
| 1.4 | Heap (Priority Queue) | Min-Heap, Max-Heap. `push`, `pop` $O(\log N)$, `top` $O(1)$. Top-K trên luồng dữ liệu. | Medium |
| 1.5 | Set, Multiset (BST) | Cây đỏ-đen, `lower_bound`, `upper_bound` $O(\log N)$. | Medium |
| 1.6 | Map, Hash | `std::map` ($O(\log N)$) và `std::unordered_map` ($O(1)$ trung bình). Anti-hash test trên Codeforces và Custom Hash `splitmix64`. | Medium |
| 1.7 | Bitset | `std::bitset` nén 64 giá trị boolean vào một từ máy, tăng tốc khoảng 64 lần. | Medium |

**Chuẩn đầu ra:** (1) giải thích vì sao `unordered_map` có thể thoái hóa về $O(N)$ và cách khắc phục; (2) chọn đúng cấu trúc dữ liệu cho một đề cho trước trong 2 phút; (3) không còn lỗi truyền vector theo giá trị.

**Bài test:** Test 1 gồm bài học 1.1–1.3. Test 2 gồm bài học 1.4–1.7.

---

## Tháng 2: Một Số Kỹ Thuật Căn Bản

**Mục tiêu:** xây phản xạ nhận diện mẫu thuật toán tối ưu; đưa bài toán từ $O(N^2)$ xuống $O(N)$ hoặc $O(N \log N)$.

| ID | Bài học | Nội dung chính | Độ khó |
| :--- | :--- | :--- | :--- |
| 2.1 | Hai con trỏ (Two Pointers) | Đối đầu co dần và cùng chiều (Fast & Slow). Two Sum II, Container With Most Water, 3Sum, Remove Duplicates. | Medium |
| 2.2 | Cửa sổ trượt (Sliding Window) | Cửa sổ cố định độ dài $K$ và cửa sổ co giãn với bảng đếm tần số. | Medium |
| 2.3 | Prefix Sum và Mảng hiệu | Cộng dồn 1D/2D truy vấn $O(1)$. Mảng hiệu cập nhật đoạn $[L, R]$ trong $O(1)$. | Easy |
| 2.4 | Xử lý bit (Bit Manipulation) | `&`, `\|`, `^`, `~`, `<<`, `>>`. `x & -x`, `x & (x - 1)`. `__builtin_popcount`, `__builtin_clz`, `__builtin_ctz`. | Easy |
| 2.5 | Sàng nguyên tố và SPF | Sàng Eratosthenes $O(N \log \log N)$. Sàng phân đoạn cho $R \le 10^{12}$ và $R - L \le 10^6$. Sàng ước nguyên tố nhỏ nhất để phân tích thừa số trong $O(\log N)$. | Medium |
| 2.6 | Chặt nhị phân và BS on Answer | Mẫu tránh lặp vô tận, `lower_bound`, `upper_bound`. Chặt trên số thực ($\epsilon = 10^{-7}$). Nhận diện tính đơn điệu của $P(x)$. | Medium |
| 2.7 | Chặt tam phân (Ternary Search) | Cực trị của hàm đơn phong (Unimodal) trên số nguyên và số thực. | Medium |
| 2.8 | Tham lam (Greedy) | Lựa chọn cục bộ tối ưu, chứng minh Exchange Argument. | Medium |
| 2.9 | Đệ quy và Chia để trị | Cây đệ quy, Master Theorem, Merge Sort, Quick Select. | Medium |

**Chuẩn đầu ra:** (1) nhìn ràng buộc $N$ và đoán được độ phức tạp cần đạt; (2) viết chặt nhị phân đúng, không lặp vô tận, ở cả hai biến thể cận trái và cận phải; (3) giải ít nhất 70% bài Ưu tiên 2 trong 25 phút mỗi bài.

**Bài test:** Test 1 gồm bài học 2.1–2.4. Test 2 gồm bài học 2.5–2.9 (Ternary Search chỉ có rất ít bài trên LeetCode nên không có câu riêng trong test).

---

## Tháng 3: Quy Hoạch Động Và Kỹ Thuật Đổi Biến Số

**Mục tiêu:** chia bài toán thành các bài toán con gối nhau; đổi biến trạng thái khi một giới hạn quá lớn.

| ID | Bài học | Nội dung chính | Độ khó |
| :--- | :--- | :--- | :--- |
| 3.1 | Chia để trị và đếm nghịch thế | Phân rã bài toán độc lập; đếm cặp nghịch thế bằng Merge Sort. | Medium |
| 3.2 | DP nhập môn và bài cổ điển | Top-Down và Bottom-Up. Ba bước: trạng thái, công thức chuyển, cơ sở. Kadane, LIS $O(N \log N)$, LCS, Edit Distance. | Medium |
| 3.3 | Grid DP và Knapsack | Grid DP, Rolling Array. Knapsack 0/1 duyệt ngược 1D, Unbounded Knapsack (Coin Change). | Medium |
| 3.4 | Interval DP và Palindromic DP | DP trên đoạn $[i, j]$ theo độ dài tăng dần (Burst Balloons, Matrix Chain). DP chuỗi đối xứng. | Hard |
| 3.5 | DP kết hợp Binary Search và cấu trúc dữ liệu | Tối ưu chuyển trạng thái bằng chặt nhị phân hoặc cấu trúc dữ liệu cơ bản. | Hard |
| 3.6 | Kỹ thuật đổi biến số | Khi $W \le 10^9$ nhưng $V \le 1000$: đổi $dp[i][w] \to dp[i][v]$ (chi phí nhỏ nhất để đạt giá trị $v$). Biến thể Knapsack và phân hoạch tập hợp. | Hard |

**Chuẩn đầu ra:** (1) viết được ba bước DP cho một bài mới trước khi code; (2) tối ưu bộ nhớ bằng Rolling Array; (3) nhận ra khi nào cần đổi biến số trạng thái.

**Bài test:** Test 1 gồm 3.1–3.3. Test 2 gồm 3.4–3.6.

---

## Tháng 4: Lý Thuyết Đồ Thị Căn Bản

**Mục tiêu:** làm chủ duyệt đồ thị, đường đi ngắn nhất, sắp xếp phụ thuộc, thành phần liên thông và DSU Rollback.

| ID | Bài học | Nội dung chính | Độ khó |
| :--- | :--- | :--- | :--- |
| 4.1 | DFS và ứng dụng | Danh sách kề `vector<vector<pair<int,int>>>`. Đếm thành phần liên thông, Flood Fill, tô 3 màu phát hiện chu trình có hướng. | Medium |
| 4.2 | BFS | Đường đi ngắn nhất trên đồ thị không trọng số. Multi-Source BFS, Bi-directional BFS. | Medium |
| 4.3 | Sắp xếp tô-pô | DAG, thuật toán Kahn với `in_degree[]`, ràng buộc phụ thuộc. | Medium |
| 4.4 | DSU và DSU Rollback | Path Compression và Union by Rank $O(\alpha(N))$. DSU Rollback: chỉ Union by Rank kèm ngăn xếp lịch sử, nền tảng cho Offline Dynamic Connectivity. | Medium |
| 4.5 | Dijkstra với Heap | Trọng số dương, $O((V + E) \log V)$, truy vết đường đi. | Medium |
| 4.6 | Khớp và Cầu | Cây khung DFS, `tin[]`, `low[]`. Cầu khi `low[v] > tin[u]`. | Hard |
| 4.7 | Thành phần liên thông mạnh (SCC) | Tarjan với Stack và Kosaraju 2 lượt. Co cụm đồ thị (Condensation DAG). | Hard |

**Chuẩn đầu ra:** (1) chọn đúng DFS, BFS, Dijkstra hoặc DSU cho một đề đồ thị; (2) cài Dijkstra và Kahn không cần tra cứu; (3) giải thích `low[]` và `tin[]`.

**Bài test:** Test 1 gồm 4.1–4.4. Test 2 gồm 4.5–4.7.

---

## Tháng 5: Toán Học

**Mục tiêu:** nắm công cụ số học, đồng dư, tổ hợp, xác suất, kỳ vọng và lý thuyết trò chơi cho $N \le 10^9 \sim 10^{18}$.

| ID | Bài học | Nội dung chính | Độ khó |
| :--- | :--- | :--- | :--- |
| 5.1 | Tổ hợp và số học đồng dư | Quy tắc cộng, nhân; hoán vị, chỉnh hợp, tổ hợp $C_n^k$. Lũy thừa nhị phân $A^B \bmod M$ trong $O(\log B)$. Nghịch đảo modulo (Fermat nhỏ), mảng giai thừa. | Medium |
| 5.2 | Tổ hợp nâng cao | Stars and Bars, số Catalan, bài toán phân hoạch. | Hard |
| 5.3 | DP và Tổ hợp | Tam giác Pascal trong DP, đếm cấu hình kết hợp DP trạng thái. | Hard |
| 5.4 | Xác suất | Không gian mẫu, xác suất có điều kiện, công thức Bayes cơ bản. | Medium |
| 5.5 | Kỳ vọng | Tuyến tính của kỳ vọng $E[X + Y] = E[X] + E[Y]$ (kể cả khi phụ thuộc). DP kỳ vọng. | Medium |
| 5.6 | Lý thuyết trò chơi | Trạng thái thắng/thua, Nim và tổng XOR, hàm Mex, Sprague-Grundy. | Hard |
| 5.7 | Phương pháp chứng minh | Quy nạp, nguyên lý Dirichlet, bất biến. | Medium |

**Chuẩn đầu ra:** (1) tính $C_n^k \bmod (10^9 + 7)$ trong $O(1)$ sau tiền xử lý; (2) tách được bài toán đếm thành tổ hợp và DP; (3) xác định thắng/thua của trò chơi Nim.

**Bài test:** Test 1 gồm 5.1–5.3. Test 2 gồm 5.4–5.7.

---

## Tháng 6: Luyện Tập Tổng Lực (Recap và 8 Bài Thi Thử)

**Mục tiêu:** tổng ôn 5 tháng đầu, tạo áp lực phòng thi, rèn kỹ năng tìm test sai khi dính WA.

| ID | Bài học | Nội dung chính | Độ khó |
| :--- | :--- | :--- | :--- |
| 6.1 | Recap và bảng nhận diện | Bảng "ràng buộc dữ liệu → thuật toán". Lỗi kinh điển: tràn số, lệch một (off-by-one), tràn stack đệ quy. | Medium |
| 6.2 | Stress Test | Generator sinh test ngẫu nhiên, lời giải vét cạn $O(N^2)$ làm chuẩn, script so khớp tự động. | Medium |
| 6.3 | Mock 1 | STL, Vector, Stack, Queue, Heap. | Medium |
| 6.4 | Mock 2 | Two Pointers, Sliding Window, Prefix Sum, Binary Search on Answer. | Medium |
| 6.5 | Mock 3 | Binary Search và BS on Answer. | Medium |
| 6.6 | Mock 4 | DP cổ điển, Kadane, Knapsack, LIS. | Medium |
| 6.7 | Mock 5 | Grid DP, Interval DP, String DP. | Hard |
| 6.8 | Mock 6 | Duyệt đồ thị (DFS/BFS), DSU. | Medium |
| 6.9 | Mock 7 | Dijkstra, Tarjan, Toán và Bit. | Hard |
| 6.10 | Mock 8 | Tổng hợp toàn bộ Giai đoạn 1. | Hard |

**Chuẩn đầu ra:** (1) đạt trung bình ít nhất 12/18 điểm trên 8 mock; (2) tự viết được một stress test hoàn chỉnh; (3) liệt kê được 5 loại lỗi hay gặp của chính mình.

---

# GIAI ĐOẠN 2: CẤU TRÚC DỮ LIỆU & THUẬT TOÁN NÂNG CAO

## Tháng 7: Cấu Trúc Dữ Liệu Nâng Cao

**Mục tiêu:** cập nhật và truy vấn liên tục trên mảng lớn trong $O(\log N)$; làm quen cấu trúc dữ liệu lưu lịch sử.

| ID | Bài học | Nội dung chính | Độ khó |
| :--- | :--- | :--- | :--- |
| 7.1 | Segment Tree | Dựng cây trên mảng kích thước $4N$; `build`, `update`, `query` (Sum, Min, Max, GCD). | Hard |
| 7.2 | Lazy Propagation và kỹ thuật mở rộng | Cập nhật đoạn $[L, R]$ trong $O(\log N)$. Segment Tree động, nén tọa độ, giới thiệu Segment Tree Beats. | Hard |
| 7.3 | Fenwick Tree (BIT) | $\text{LSB}(i) = i \,\&\, (-i)$. Point Update, Range Query. Mở rộng 2D và 3D. Đếm nghịch thế. | Medium |
| 7.4 | Sparse Table | Tiền xử lý $O(N \log N)$, truy vấn RMQ trong $O(1)$. | Medium |
| 7.5 | Trie | Chèn, tìm tiền tố. Binary Trie tìm cặp có XOR lớn nhất. | Medium |
| 7.6 | Suffix Array | Sắp xếp hậu tố $O(N \log^2 N)$ hoặc $O(N \log N)$, mảng LCP. | Hard |
| 7.7 | Cấu trúc dữ liệu bền (Persistent) | Node Copying. Persistent Segment Tree tìm phần tử nhỏ thứ $K$ trên đoạn $[L, R]$. | Hard |

**Chuẩn đầu ra:** (1) cài Segment Tree và Fenwick Tree trong 10 phút không cần tra cứu; (2) quyết định giữa Segment Tree, Fenwick và Sparse Table cho một đề; (3) kết hợp nén tọa độ với Fenwick.

**Bài test:** Test 1 gồm 7.1–7.4. Test 2 gồm 7.5–7.7.

---

## Tháng 8: Một Số Kỹ Thuật Nâng Cao

**Mục tiêu:** làm quen các kỹ thuật tối ưu kinh điển của ICPC và Codeforces Div 1/Div 2.

| ID | Bài học | Nội dung chính | Độ khó |
| :--- | :--- | :--- | :--- |
| 8.1 | Meet in the Middle | Giảm $O(2^N)$ xuống $O(2^{N/2} \cdot N/2)$: chia đôi, sắp xếp, chặt nhị phân. | Hard |
| 8.2 | Chia căn và thuật toán Mo | $\sqrt{N}$ khối. Mo: sắp xếp truy vấn offline theo $(L / \text{BLOCK}, R)$, $O((N + Q)\sqrt{N})$. | Hard |
| 8.3 | Merge Small to Large (DSU on Tree) | Gộp tập nhỏ vào tập lớn, $O(N \log^2 N)$ hoặc $O(N \log N)$. | Hard |
| 8.4 | KMP, Z-Algorithm và Hashing | Polynomial Rolling Hash với Double Hash. KMP (mảng $\pi$), Z-Algorithm. | Medium |
| 8.5 | Sweep line | Sắp sự kiện theo trục $X$, quản lý trục $Y$ bằng cấu trúc cân bằng (phòng họp, hợp diện tích hình chữ nhật). | Hard |
| 8.6 | Convex Hull Trick và Li Chao Tree | Tối ưu DP dạng $dp[i] = \min(dp[j] + m_j x_i + c_j)$. Bao lồi bằng ngăn xếp, Li Chao Tree. | Hard |
| 8.7 | Kỹ thuật ngẫu nhiên | Miller-Rabin, thuật toán xác suất sinh hash, Randomized Quickselect. | Hard |

**Chuẩn đầu ra:** (1) nhận ra bài $N \le 40$ là Meet in the Middle; (2) cài KMP và Z không cần tra cứu; (3) dùng Double Hash đúng cách.

**Bài test:** Test 1 gồm 8.1–8.4. Test 2 gồm 8.5–8.7.

---

## Tháng 9: Quy Hoạch Động Nâng Cao

**Mục tiêu:** vượt DP phổ thông, giải bài mức Hard trên LeetCode và Div 2 D/E trên Codeforces.

| ID | Bài học | Nội dung chính | Độ khó |
| :--- | :--- | :--- | :--- |
| 9.1 | Bitmask DP | Biểu diễn tập hợp bằng bit. Người du lịch (TSP) $O(N^2 \cdot 2^N)$, phân công công việc. | Hard |
| 9.2 | SOS DP | Tổng trên mọi tập con trong $O(N \cdot 2^N)$ thay vì $O(3^N)$. | Hard |
| 9.3 | Digit DP | Đếm số trong $[L, R]$ thỏa tính chất chữ số, trạng thái $dp(idx, cnt, tight, leading\_zero)$. | Hard |
| 9.4 | DP nhân ma trận | Truy hồi tuyến tính thành nhân ma trận, số hạng thứ $10^{18}$ trong $O(K^3 \log N)$. | Hard |
| 9.5 | Tree DP và Re-rooting | Tập độc lập cực đại trên cây. Re-rooting bằng 2 lượt DFS, từ $O(N^2)$ xuống $O(N)$. | Hard |
| 9.6 | Bitset DP | Knapsack và Reachability nhanh gấp khoảng 64 lần với `std::bitset`. | Hard |
| 9.7 | DP tối ưu chia để trị | Khi $opt[i][j-1] \le opt[i][j] \le opt[i+1][j]$, giảm $O(K N^2)$ xuống $O(K N \log N)$. | Hard |

**Chuẩn đầu ra:** (1) viết bitmask DP đúng chiều duyệt mask; (2) viết Digit DP với đủ bốn trạng thái; (3) tính được Re-rooting cho mọi đỉnh trong $O(N)$.

**Bài test:** Test 1 gồm 9.1–9.4. Test 2 gồm 9.5–9.7.

---

## Tháng 10: Lý Thuyết Đồ Thị Nâng Cao

**Mục tiêu:** làm chủ thuật toán đồ thị chuyên sâu trong ICPC: luồng cực đại, phân hoạch cây, 2-SAT.

| ID | Bài học | Nội dung chính | Độ khó |
| :--- | :--- | :--- | :--- |
| 10.1 | Max Flow và cặp ghép cực đại | Mạng luồng, đồ thị thặng dư, đường tăng luồng. **Dinic** $O(V^2 E)$ với Level Graph và Blocking Flow. Định lý Hall, Hopcroft-Karp. | Hard |
| 10.2 | Min Cut | Định lý Max-Flow Min-Cut, bài toán đóng dự án và chia nhóm tối ưu. | Hard |
| 10.3 | LCA và Euler Tour | Binary Lifting với `up[u][i]` trong $O(\log N)$. Euler Tour trải phẳng cây thành mảng 1D. | Hard |
| 10.4 | Heavy-Light Decomposition | Chuỗi nặng. Truy vấn và cập nhật đường đi giữa hai đỉnh trong $O(\log^2 N)$ kèm Segment Tree. | Hard |
| 10.5 | Centroid Decomposition | Chia để trị theo trọng tâm; đường đi độ dài $K$ trong $O(N \log N)$. | Hard |
| 10.6 | 2-SAT | Mệnh đề $(A \lor B)$ thành $(\neg A \Rightarrow B)$. Giải bằng SCC trong $O(V + E)$. | Hard |

**Chuẩn đầu ra:** (1) mô hình hóa một bài ghép cặp thành Max Flow; (2) cài Binary Lifting; (3) nhận ra bài toán nào cần HLD thay vì LCA.

**Bài test:** Test 1 gồm 10.1–10.3. Test 2 gồm 10.4–10.6.

---

## Tháng 11: Toán Học Nâng Cao

**Mục tiêu:** giải bài số học, giải tích và hình học phẳng phức tạp mà không dính sai số.

| ID | Bài học | Nội dung chính | Độ khó |
| :--- | :--- | :--- | :--- |
| 11.1 | Hình học phẳng | Tích có hướng (CCW), đoạn thẳng cắt nhau, công thức Shoelace, Convex Hull Andrew's Monotone Chain $O(N \log N)$. | Hard |
| 11.2 | Bao hàm loại trừ và Mobius | Hàm $\mu(n)$, sàng Mobius, đếm cặp nguyên tố cùng nhau $\gcd(i, j) = 1$. | Hard |
| 11.3 | Phi hàm Euler | $\phi(n) = n \prod (1 - 1/p)$, sàng $O(N)$, định lý Euler $A^{\phi(M)} \equiv 1 \pmod M$. | Medium |
| 11.4 | Euclid mở rộng và Diophantine | Tìm $x, y$ để $A x + B y = \gcd(A, B)$. | Medium |
| 11.5 | Định lý số dư Trung Hoa (CRT) | Hệ đồng dư bậc nhất với các modulo nguyên tố cùng nhau. | Hard |
| 11.6 | Linear Basis XOR | Cơ sở tuyến tính, Gaussian Elimination trên GF(2), tập con có XOR lớn nhất. | Hard |
| 11.7 | Giải tích trong CP | Tích phân Simpson, Newton-Raphson. | Hard |

**Chuẩn đầu ra:** (1) dùng số nguyên (không dùng số thực) trong các phép kiểm tra hình học; (2) cài Euclid mở rộng và CRT; (3) chọn công thức Mobius hay bao hàm loại trừ cho bài đếm.

**Bài test:** Test 1 gồm 11.1, 11.3, 11.4. Test 2 gồm 11.2, 11.5–11.7. Lưu ý: LeetCode có rất ít bài cho nhóm này, xem phần "Ghi chú nội dung" của Tháng 11 trong `PLANNING.md`.

---

## Tháng 12–13: Luyện Thi Đỉnh Cao và Phỏng Vấn Big Tech

**Mục tiêu:** đạt **LeetCode Guardian (rating 2100+)**, **Codeforces Specialist → Expert (1600+)** và tự tin qua vòng coding của Big Tech.

| ID | Bài học | Nội dung chính | Độ khó |
| :--- | :--- | :--- | :--- |
| 12.1 | Contest Sprints | Giải Q1–Q3 trong 20–25 phút đầu, dành 40 phút còn lại cho Q4. Tham gia ít nhất 8 kỳ LeetCode Weekly/Biweekly và các kỳ Codeforces Div 2. Upsolving 100% câu chưa giải trong 24 giờ. | Hard |
| 12.2 | Big Tech Interview | Hỏi rõ ràng buộc và trường hợp biên trước khi code. Nói to luồng tư duy và Big-O. Code sạch, đặt tên rõ. Dry Run trên test nhỏ. 10 buổi mock 45 phút, không dùng autocomplete. | Hard |

**Chuẩn đầu ra:** (1) hoàn thành ít nhất 3/4 câu trong 90 phút ở 50% số kỳ contest; (2) hoàn thành mock interview trong 45 phút với đầy đủ bốn bước ở trên.