export interface SubTopic {
  id: string;
  title: string;
  description: string;
  keyTopics: string[];
  problemCount: number;
  hasInteractiveLesson: boolean;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface MonthModule {
  id: number;
  monthNumber: number;
  monthLabel: string;
  title: string;
  phase: string;
  summary: string;
  subtopics: SubTopic[];
}

export const ROADMAP_MODULES: MonthModule[] = [
  {
    id: 1,
    monthNumber: 1,
    monthLabel: 'Tháng 1',
    phase: 'Phase 1: Nền Tảng Chuyên Sâu',
    title: 'Cấu Trúc Dữ Liệu Cơ Bản',
    summary: 'Làm chủ độ phức tạp thuật toán, cơ chế bộ nhớ và các cấu trúc dữ liệu chuẩn STL.',
    subtopics: [
      { id: '1.0', title: 'Tổng quan', description: 'Toàn cảnh kiến thức Tháng 1: Vector, Sorting, Stack, Queue, Heap, BST, Bitset (50 bài LeetCode).', keyTopics: ['Overview', '50 Problems', 'STL', 'Big-O'], problemCount: 50, hasInteractiveLesson: true, difficulty: 'Medium' },
      { id: '1.1', title: '1.1 Big-O, Vector & Sorting', description: 'Độ phức tạp thuật toán, mảng động vector::reserve và kỹ thuật IntroSort.', keyTopics: ['Big-O', 'Vector Reallocation', 'Custom Comparator'], problemCount: 7, hasInteractiveLesson: true, difficulty: 'Easy' },
      { id: '1.2', title: '1.2 Ngăn Xếp (Stack)', description: 'Nguyên lý LIFO, kiểm tra dãy ngoặc và tính toán biểu thức hậu tố.', keyTopics: ['Stack LIFO', 'Parentheses', 'Monotonic Stack'], problemCount: 7, hasInteractiveLesson: true, difficulty: 'Easy' },
      { id: '1.3', title: '1.3 Queue & Deque', description: 'Hàng đợi FIFO, Ring Buffer và hàng đợi hai đầu std::deque.', keyTopics: ['Queue FIFO', 'Ring Buffer', 'Monotonic Deque'], problemCount: 5, hasInteractiveLesson: true, difficulty: 'Easy' },
      { id: '1.4', title: '1.4 Heap (Priority Queue)', description: 'Cấu trúc Min-Heap, Max-Heap và duy trì Top-K phần tử trong luồng dữ liệu.', keyTopics: ['Priority Queue', 'Min/Max Heap', 'Top-K Elements'], problemCount: 9, hasInteractiveLesson: true, difficulty: 'Medium' },
      { id: '1.5', title: '1.5 BST (Set & Multiset)', description: 'Cây đỏ-đen std::set, std::multiset và thao tác lower_bound / upper_bound.', keyTopics: ['Red-Black Tree', 'lower_bound', 'Multiset'], problemCount: 4, hasInteractiveLesson: true, difficulty: 'Medium' },
      { id: '1.6', title: '1.6 BST (Map & Custom Hash)', description: 'std::map và kỹ thuật Custom Hash (splitmix64) chống Anti-hash test.', keyTopics: ['std::map', 'unordered_map', 'splitmix64'], problemCount: 5, hasInteractiveLesson: true, difficulty: 'Medium' },
      { id: '1.7', title: '1.7 Bitset (std::bitset)', description: 'Nén 64 boolean vào số nguyên 64-bit và tăng tốc độ tính toán gấp 64 lần.', keyTopics: ['Bitset', 'Bitwise Parallelism', 'Memory Optimization'], problemCount: 2, hasInteractiveLesson: true, difficulty: 'Medium' },
      { id: '1.8', title: '1.8 Test 1 ', description: '4 bài kiểm tra định kỳ (Easy, Medium 1, Medium 2, Hard) về Vector, Sorting, Stack, Queue.', keyTopics: ['Test 1', '4 Problems', '90 Minutes'], problemCount: 4, hasInteractiveLesson: true, difficulty: 'Medium' },
      { id: '1.9', title: '1.9 Test 2 ', description: '4 bài kiểm tra định kỳ về Heap, BST, Set, Map, Bitset.', keyTopics: ['Test 2', '4 Problems', '90 Minutes'], problemCount: 4, hasInteractiveLesson: true, difficulty: 'Hard' },
    ]
  },
  {
    id: 2,
    monthNumber: 2,
    monthLabel: 'Tháng 2',
    phase: 'Phase 1: Nền Tảng Chuyên Sâu',
    title: 'Một Số Kỹ Thuật Căn Bản',
    summary: 'Xử lý bit, Two Pointers, Sliding Window, Prefix Sum, Sàng nguyên tố, Chặt nhị phân/tam phân, Tham lam.',
    subtopics: [
      { id: '2.0', title: 'Tổng quan', description: 'Toàn cảnh kiến thức Tháng 2: Bit, Two Pointers, Window, Prefix Sum, Sàng, Binary Search, Tham lam (58 bài LeetCode).', keyTopics: ['Overview', '58 Problems', 'Big-O Mapping', 'Strategy'], problemCount: 58, hasInteractiveLesson: true, difficulty: 'Medium' },
      { id: '2.1', title: '2.1 Two Pointers', description: 'Kỹ thuật hai con trỏ đối đầu và cùng chiều triệt tiêu không gian tìm kiếm.', keyTopics: ['Two Pointers', 'Search Space Elimination', 'Sorted Array'], problemCount: 4, hasInteractiveLesson: true, difficulty: 'Medium' },
      { id: '2.2', title: '2.2 Cửa Sổ Trượt (Sliding Window)', description: 'Cửa sổ cố định và co giãn linh hoạt kèm bảng đếm tần số.', keyTopics: ['Fixed Window', 'Dynamic Window', 'Frequency Map'], problemCount: 4, hasInteractiveLesson: false, difficulty: 'Medium' },
      { id: '2.3', title: '2.3 Prefix Sum & Mảng Hiệu', description: 'Mảng cộng dồn 1D/2D truy vấn tổng O(1) và mảng hiệu cập nhật đoạn O(1).', keyTopics: ['Prefix Sum', 'Difference Array', 'Inclusion-Exclusion'], problemCount: 3, hasInteractiveLesson: false, difficulty: 'Easy' },
      { id: '2.4', title: '2.4 Xử Lý Bit (Bitwise)', description: 'Bit trick: x & -x, x & (x-1), hàm __builtin_popcount và biểu diễn tập con.', keyTopics: ['Bit Manipulation', 'Lowest Set Bit', 'Bitmask Subsets'], problemCount: 3, hasInteractiveLesson: false, difficulty: 'Medium' },
      { id: '2.5', title: '2.5 Sàng Số Nguyên Tố & SPF', description: 'Sàng Eratosthenes, sàng phân đoạn và sàng ước nguyên tố nhỏ nhất SPF.', keyTopics: ['Eratosthenes', 'Segmented Sieve', 'SPF'], problemCount: 3, hasInteractiveLesson: false, difficulty: 'Medium' },
      { id: '2.6', title: '2.6 Chặt Nhị Phân & BS On Answer', description: 'Chặt nhị phân chuẩn, chặt trên số thực và chặt trên miền kết quả (Minimax).', keyTopics: ['Binary Search', 'BS on Answer', 'Monotonic Predicate'], problemCount: 4, hasInteractiveLesson: false, difficulty: 'Hard' },
      { id: '2.7', title: '2.7 Chặt Tam Phân (Ternary Search)', description: 'Tìm cực trị của hàm số đơn phong bằng cách chia 3 đoạn.', keyTopics: ['Ternary Search', 'Unimodal Function', 'Extremum'], problemCount: 2, hasInteractiveLesson: false, difficulty: 'Medium' },
      { id: '2.8', title: '2.8 Thuật Toán Tham Lam (Greedy)', description: 'Lựa chọn cục bộ tối ưu và kỹ thuật chứng minh Exchange Argument.', keyTopics: ['Greedy Choice', 'Optimal Substructure', 'Exchange Argument'], problemCount: 3, hasInteractiveLesson: false, difficulty: 'Medium' },
      { id: '2.9', title: '2.9 Đệ Quy & Chia Để Trị', description: 'Cây đệ quy, định lý Master, bài toán Merge Sort và Quick Select.', keyTopics: ['Recursion Tree', 'Master Theorem', 'Divide & Conquer'], problemCount: 2, hasInteractiveLesson: false, difficulty: 'Medium' },
      { id: '2.10', title: '2.10 Test 1 ', description: '4 bài kiểm tra: Bit, Two Pointers, Sliding Window, Prefix Sum.', keyTopics: ['Test 1', '4 Problems', '90 Minutes'], problemCount: 4, hasInteractiveLesson: false, difficulty: 'Medium' },
      { id: '2.11', title: '2.11 Test 2 ', description: '4 bài kiểm tra: Sàng nguyên tố, BS on Answer, Ternary Search, Tham lam.', keyTopics: ['Test 2', '4 Problems', '90 Minutes'], problemCount: 4, hasInteractiveLesson: false, difficulty: 'Hard' },
    ]
  },
  {
    id: 3,
    monthNumber: 3,
    monthLabel: 'Tháng 3',
    phase: 'Phase 1: Nền Tảng Chuyên Sâu',
    title: 'Quy Hoạch Động & Đổi Biến Số',
    summary: 'Chia để trị, DP Cổ điển (Kadane, LIS, LCS, Knapsack), Grid DP, Interval DP và kỹ thuật đổi biến số.',
    subtopics: [
      { id: '3.1', title: '3.1 Bản Chất DP & Bài Toán Cổ Điển', description: 'Tư duy Memoization vs Tabulation; Kadane, LIS O(N log N), LCS, Edit Distance.', keyTopics: ['State Definition', 'Kadane', 'LIS O(N log N)'], problemCount: 4, hasInteractiveLesson: false, difficulty: 'Medium' },
      { id: '3.2', title: '3.2 Grid DP & Mảng Cuốn', description: 'Quy hoạch động trên lưới 2D và kỹ thuật mảng cuốn 1D tối ưu không gian.', keyTopics: ['Grid 2D', 'Rolling Array', 'Path Sum'], problemCount: 3, hasInteractiveLesson: false, difficulty: 'Medium' },
      { id: '3.3', title: '3.3 Biến Thể Cái Túi (Knapsack)', description: '0/1 Knapsack mảng 1D đảo chiều và Unbounded Knapsack (Coin Change).', keyTopics: ['0/1 Knapsack', 'Unbounded Knapsack', 'Coin Change'], problemCount: 3, hasInteractiveLesson: false, difficulty: 'Medium' },
      { id: '3.4', title: '3.4 Interval DP (DP Khoảng)', description: 'Duyệt theo chiều dài khoảng len = 2 đến N; Burst Balloons, Matrix Chain.', keyTopics: ['Interval DP', 'Burst Balloons', 'Subsegment Transition'], problemCount: 3, hasInteractiveLesson: false, difficulty: 'Hard' },
      { id: '3.5', title: '3.5 Kỹ Thuật Đổi Biến Số Trạng Thái', description: 'Đổi biến trạng thái khi giới hạn W lớn nhưng giá trị V nhỏ (Super Egg Drop, Knapsack đảo).', keyTopics: ['State Transformation', 'Dimension Swap', 'Super Egg Drop'], problemCount: 3, hasInteractiveLesson: false, difficulty: 'Hard' },
      { id: '3.6', title: '3.6 Củng Cố Đổi Biến Số', description: 'Thực hành các bài toán phân hoạch tập hợp và tối ưu không gian trạng thái.', keyTopics: ['State Compression', 'Advanced Partition', 'Optimization'], problemCount: 3, hasInteractiveLesson: false, difficulty: 'Hard' },
      { id: '3.7', title: '3.7 Test 1', description: '4 bài kiểm tra: DP cổ điển, Kadane, LIS, Knapsack.', keyTopics: ['Test 1', '4 Problems', '90 Minutes'], problemCount: 4, hasInteractiveLesson: false, difficulty: 'Medium' },
      { id: '3.8', title: '3.8 Test 2', description: '4 bài kiểm tra: Interval DP, String DP, Đổi biến số trạng thái.', keyTopics: ['Test 2', '4 Problems', '90 Minutes'], problemCount: 4, hasInteractiveLesson: false, difficulty: 'Hard' },
    ]
  },
  {
    id: 4,
    monthNumber: 4,
    monthLabel: 'Tháng 4',
    phase: 'Phase 1: Nền Tảng Chuyên Sâu',
    title: 'Lý Thuyết Đồ Thị Căn Bản',
    summary: 'DFS/BFS, Topological Sort, DSU & DSU Rollback, Dijkstra, Khớp & Cầu, Thành phần liên thông mạnh.',
    subtopics: [
      { id: '4.1', title: '4.1 Biểu Diễn Đồ Thị & DFS', description: 'Danh sách kề tối ưu cache, duyệt DFS, đếm liên thông, chu trình 3 màu.', keyTopics: ['DFS', 'Adjacency List', 'Cycle Detection'], problemCount: 3, hasInteractiveLesson: false, difficulty: 'Medium' },
      { id: '4.2', title: '4.2 Thuật Toán BFS & Multi-Source', description: 'Đường đi ngắn nhất không trọng số, BFS nhiều nguồn và BFS 2 đầu.', keyTopics: ['BFS', 'Multi-Source BFS', 'Bi-directional BFS'], problemCount: 3, hasInteractiveLesson: false, difficulty: 'Medium' },
      { id: '4.3', title: '4.3 Sắp Xếp Tô-pô (Topological Sort)', description: 'Đồ thị DAG, thuật toán Kahn bậc vào in_degree[] và ứng dụng lập lịch.', keyTopics: ['DAG', 'Kahn Algorithm', 'In-degree'], problemCount: 3, hasInteractiveLesson: false, difficulty: 'Medium' },
      { id: '4.4', title: '4.4 DSU & DSU Rollback', description: 'DSU nén đường đi O(α(N)) và DSU Rollback lưu lịch sử bằng ngăn xếp.', keyTopics: ['DSU', 'Union by Rank', 'DSU Rollback'], problemCount: 3, hasInteractiveLesson: false, difficulty: 'Medium' },
      { id: '4.5', title: '4.5 Dijkstra + Heap', description: 'Đường đi ngắn nhất trọng số dương bằng Priority Queue O((V+E)log V).', keyTopics: ['Dijkstra', 'Priority Queue', 'Shortest Path'], problemCount: 3, hasInteractiveLesson: false, difficulty: 'Medium' },
      { id: '4.6', title: '4.6 Khớp và Cầu (Tarjan)', description: 'Cây khung DFS, mảng tin[] và low[], điều kiện xác định Cầu và Khớp.', keyTopics: ['Bridges', 'Articulation Points', 'Tarjan low/tin'], problemCount: 2, hasInteractiveLesson: false, difficulty: 'Hard' },
      { id: '4.7', title: '4.7 Thành Phần Liên Thông Mạnh (SCC)', description: 'Thuật toán Tarjan và Kosaraju, co cụm đồ thị thành DAG.', keyTopics: ['SCC', 'Tarjan SCC', 'Condensation DAG'], problemCount: 2, hasInteractiveLesson: false, difficulty: 'Hard' },
      { id: '4.8', title: '4.8 Test 1', description: '4 bài kiểm tra: DFS/BFS, Multi-source, Topological Sort, DSU.', keyTopics: ['Test 1', '4 Problems', '90 Minutes'], problemCount: 4, hasInteractiveLesson: false, difficulty: 'Medium' },
      { id: '4.9', title: '4.9 Test 2', description: '4 bài kiểm tra: Dijkstra, Khớp & Cầu, SCC, DSU Rollback.', keyTopics: ['Test 2', '4 Problems', '90 Minutes'], problemCount: 4, hasInteractiveLesson: false, difficulty: 'Hard' },
    ]
  },
  {
    id: 5,
    monthNumber: 5,
    monthLabel: 'Tháng 5',
    phase: 'Phase 1: Nền Tảng Chuyên Sâu',
    title: 'Toán Học (Mathematics in CP)',
    summary: 'Tổ hợp, Số học đồng dư, Fast Pow, Nghịch đảo Modulo, Xác suất, Kỳ vọng, Game Theory Nim.',
    subtopics: [
      { id: '5.1', title: '5.1 Đồng Dư, Fast Pow & Mod Inverse', description: 'Lũy thừa nhị phân nhanh O(log B), định lý Fermat nhỏ và nghịch đảo modulo.', keyTopics: ['Fast Pow', 'Fermat Little Theorem', 'Modular Inverse'], problemCount: 3, hasInteractiveLesson: false, difficulty: 'Medium' },
      { id: '5.2', title: '5.2 Tổ Hợp & Stars and Bars', description: 'Quy tắc tổ hợp, tiền xử lý giai thừa O(1), bài toán chia kẹo Euler Stars and Bars.', keyTopics: ['Combinatorics O(1)', 'Factorials Array', 'Stars and Bars'], problemCount: 3, hasInteractiveLesson: false, difficulty: 'Medium' },
      { id: '5.3', title: '5.3 Quy Hoạch Động + Tổ Hợp', description: 'Tam giác Pascal trong DP, kết hợp đếm cấu hình với DP trạng thái.', keyTopics: ['DP + Combinatorics', 'Pascal Triangle', 'Arrangements'], problemCount: 3, hasInteractiveLesson: false, difficulty: 'Hard' },
      { id: '5.4', title: '5.4 Xác Suất & Kỳ Vọng (Expected Value)', description: 'Xác suất có điều kiện, tính tuyến tính của kỳ vọng E[X+Y] và Expected Value DP.', keyTopics: ['Probability DP', 'Expected Value', 'Linearity of Expectation'], problemCount: 3, hasInteractiveLesson: false, difficulty: 'Hard' },
      { id: '5.5', title: '5.5 Lý Thuyết Trò Chơi (Game Theory)', description: 'P/N-position, trò chơi Nim, tổng XOR (Nim-sum), hàm Mex và Sprague-Grundy.', keyTopics: ['Nim Game', 'Sprague-Grundy', 'Mex Function'], problemCount: 3, hasInteractiveLesson: false, difficulty: 'Medium' },
      { id: '5.6', title: '5.6 Phương Pháp Chứng Minh Toán Học', description: 'Quy nạp toán học, nguyên lý Dirichlet (Pigeonhole) và bất biến toán học.', keyTopics: ['Induction', 'Pigeonhole', 'Invariance'], problemCount: 2, hasInteractiveLesson: false, difficulty: 'Medium' },
      { id: '5.7', title: '5.7 Test 1', description: '4 bài kiểm tra: Fast Pow, Modulo, Tổ hợp C(n, k), Stars and Bars.', keyTopics: ['Test 1', '4 Problems', '90 Minutes'], problemCount: 4, hasInteractiveLesson: false, difficulty: 'Medium' },
      { id: '5.8', title: '5.8 Test 2', description: '4 bài kiểm tra: Xác suất, Kỳ vọng, Trò chơi Nim, DP + Tổ hợp.', keyTopics: ['Test 2', '4 Problems', '90 Minutes'], problemCount: 4, hasInteractiveLesson: false, difficulty: 'Hard' },
    ]
  },
  {
    id: 6,
    monthNumber: 6,
    monthLabel: 'Tháng 6',
    phase: 'Phase 1: Nền Tảng Chuyên Sâu',
    title: 'Recaps',
    summary: 'Tổng ôn Phase 1, kỹ thuật viết Stress Test sinh test bắt bug và bộ 8 bài test thực chiến (32 bài).',
    subtopics: [
      { id: '6.1', title: '6.1 Recap', description: 'Bảng tổng hợp ràng buộc dữ liệu sang thuật toán; phòng tránh các bẫy tràn số, TLE, MLE.', keyTopics: ['Recap Phase 1', 'Constraints Mapping', 'Edge Cases'], problemCount: 4, hasInteractiveLesson: false, difficulty: 'Medium' },
      { id: '6.2', title: '6.2 Kỹ Thuật Viết Stress Test', description: 'Viết generator sinh test ngẫu nhiên, viết code trâu O(N²) và script so khớp bắt lỗi WA.', keyTopics: ['Stress Testing', 'Test Generator', 'Brute-force Script'], problemCount: 2, hasInteractiveLesson: false, difficulty: 'Hard' },
      { id: '6.3', title: '6.3 Contest 1', description: '4 bài test: Valid Parentheses, RPN, Top K Frequent, Sliding Window Max.', keyTopics: ['Contest 1', '4 Problems', 'STL Focus'], problemCount: 4, hasInteractiveLesson: false, difficulty: 'Medium' },
      { id: '6.4', title: '6.4 Contest 2', description: '4 bài test: Two Sum II, Container Water, Subarray Sum K, Trapping Rain.', keyTopics: ['Contest 2', '4 Problems', 'Pointers Focus'], problemCount: 4, hasInteractiveLesson: false, difficulty: 'Medium' },
      { id: '6.5', title: '6.5 Contest 3', description: '4 bài test: Binary Search, Rotated Array, Koko Bananas, Median of 2 Arrays.', keyTopics: ['Contest 3', '4 Problems', 'BS Focus'], problemCount: 4, hasInteractiveLesson: false, difficulty: 'Hard' },
      { id: '6.6', title: '6.6 Contest 4', description: '4 bài test: Climbing Stairs, House Robber, Coin Change, LIS.', keyTopics: ['Contest 4', '4 Problems', 'DP Focus'], problemCount: 4, hasInteractiveLesson: false, difficulty: 'Medium' },
      { id: '6.7', title: '6.7 Contest 5', description: '4 bài test: Min Path Sum, LCS, Palindromic Subseq, Burst Balloons.', keyTopics: ['Contest 5', '4 Problems', 'String DP Focus'], problemCount: 4, hasInteractiveLesson: false, difficulty: 'Hard' },
      { id: '6.8', title: '6.8 Contest 6', description: '4 bài test: Number of Islands, Course Schedule, Redundant Connection, Word Ladder.', keyTopics: ['Contest 6', '4 Problems', 'Graph Focus'], problemCount: 4, hasInteractiveLesson: false, difficulty: 'Hard' },
      { id: '6.9', title: '6.9 Contest 7', description: '4 bài test: Single Number, Network Delay, Single Number III, Critical Connections.', keyTopics: ['Contest 7', '4 Problems', 'Shortest Path Focus'], problemCount: 4, hasInteractiveLesson: false, difficulty: 'Hard' },
      { id: '6.10', title: '6.10 Contest 8', description: '4 bài test: Count Primes, Can I Win, Cheapest Flights K Stops, Super Egg Drop.', keyTopics: ['Mock Contest 8', '4 Problems', 'Grand Review'], problemCount: 4, hasInteractiveLesson: false, difficulty: 'Hard' },
    ]
  },
  {
    id: 7,
    monthNumber: 7,
    monthLabel: 'Tháng 7',
    phase: 'Phase 2: Thuật Toán Nâng Cao',
    title: 'Cấu Trúc Dữ Liệu Nâng Cao',
    summary: 'Segment Tree & Lazy Propagation, Fenwick Tree 3D, Sparse Table, Trie, Suffix Array, Persistent DS.',
    subtopics: [
      { id: '7.1', title: '7.1 Segment Tree Cơ Bản', description: 'Cấu trúc mảng 4N, hàm build(), update điểm và truy vấn đoạn (Sum, Min, Max, GCD) O(log N).', keyTopics: ['Segment Tree', 'Point Update', 'Range Query'], problemCount: 3, hasInteractiveLesson: false, difficulty: 'Hard' },
      { id: '7.2', title: '7.2 Segment Tree Lazy Propagation', description: 'Cập nhật trên cả đoạn [L, R] trong O(log N) bằng cơ chế lưu và đẩy cờ lười.', keyTopics: ['Lazy Propagation', 'Range Update', 'Push Down'], problemCount: 3, hasInteractiveLesson: false, difficulty: 'Hard' },
      { id: '7.3', title: '7.3 Fenwick Tree & Fenwick 3D', description: 'Bit LSB(i), cập nhật điểm truy vấn đoạn, mở rộng 2D/3D và đếm nghịch thế.', keyTopics: ['Fenwick Tree', 'Inversion Counting', 'Fenwick 3D'], problemCount: 3, hasInteractiveLesson: false, difficulty: 'Hard' },
      { id: '7.4', title: '7.4 Bảng Thưa (Sparse Table)', description: 'Tiền xử lý O(N log N) bằng 2 lũy thừa, truy vấn Range Minimum Query (RMQ) trong O(1).', keyTopics: ['Sparse Table', 'RMQ O(1)', 'Binary Lifting'], problemCount: 2, hasInteractiveLesson: false, difficulty: 'Medium' },
      { id: '7.5', title: '7.5 Cây Tiền Tố (Trie) & Binary Trie', description: 'Chèn từ, tìm kiếm tiền tố và Binary Trie tìm cặp số có XOR lớn nhất.', keyTopics: ['Trie', 'Prefix Search', 'Binary Trie XOR'], problemCount: 3, hasInteractiveLesson: false, difficulty: 'Medium' },
      { id: '7.6', title: '7.6 Mảng Hậu Tố (Suffix Array)', description: 'Sắp xếp hậu tố O(N log N) và mảng LCP giải các bài toán chuỗi phức tạp.', keyTopics: ['Suffix Array', 'LCP Array', 'String Matching'], problemCount: 2, hasInteractiveLesson: false, difficulty: 'Hard' },
      { id: '7.7', title: '7.7 Persistent Data Structure', description: 'Persistent Segment Tree lưu lịch sử các phiên bản, tìm phần tử thứ K trên đoạn [L, R].', keyTopics: ['Persistent SegTree', 'Node Copying', 'K-th Element'], problemCount: 2, hasInteractiveLesson: false, difficulty: 'Hard' },
      { id: '7.8', title: '7.8 Test 1', description: '4 bài kiểm tra: Segment Tree, Lazy Propagation, Sparse Table, Range Query.', keyTopics: ['Test 1', '4 Problems', '90 Minutes'], problemCount: 4, hasInteractiveLesson: false, difficulty: 'Hard' },
      { id: '7.9', title: '7.9 Test 2', description: '4 bài kiểm tra: Fenwick 3D, Trie, Suffix Array, Persistent Segment Tree.', keyTopics: ['Test 2', '4 Problems', '90 Minutes'], problemCount: 4, hasInteractiveLesson: false, difficulty: 'Hard' },
    ]
  },
  {
    id: 8,
    monthNumber: 8,
    monthLabel: 'Tháng 8',
    phase: 'Phase 2: Thuật Toán Nâng Cao',
    title: 'Một Số Kỹ Thuật Nâng Cao',
    summary: 'Meet in the middle, Chia căn & Thuật toán Mo, Merge Small to Large, KMP, Hashing, Sweep line, CHT.',
    subtopics: [
      { id: '8.1', title: '8.1 Meet In The Middle', description: 'Giảm độ phức tạp từ O(2^N) xuống O(2^{N/2}) bằng chia đôi tập dữ liệu và chặt nhị phân.', keyTopics: ['Meet in the Middle', 'Subset Partition', 'Binary Search'], problemCount: 3, hasInteractiveLesson: false, difficulty: 'Hard' },
      { id: '8.2', title: '8.2 Chia Căn & Thuật Toán Mo', description: 'Chia mảng thành căn N khối và sắp xếp truy vấn Offline giải quyết bài toán đoạn trong O((N+Q)√N).', keyTopics: ['Square Root Decomposition', 'Mo Algorithm', 'Offline Queries'], problemCount: 3, hasInteractiveLesson: false, difficulty: 'Hard' },
      { id: '8.3', title: '8.3 Merge Small To Large (Sack)', description: 'Gộp cấu trúc dữ liệu từ tập nhỏ vào tập lớn trên cây trong O(N log² N).', keyTopics: ['Small to Large', 'DSU on Tree', 'Sack Technique'], problemCount: 2, hasInteractiveLesson: false, difficulty: 'Hard' },
      { id: '8.4', title: '8.4 KMP, Z-Algorithm & Hashing', description: 'Double Hash chống va chạm, mảng tiền tố KMP và Z-Algorithm so khớp không quay lui.', keyTopics: ['Rolling Hash', 'KMP Prefix Array', 'Z-Algorithm'], problemCount: 3, hasInteractiveLesson: false, difficulty: 'Medium' },
      { id: '8.5', title: '8.5 Thuật Toán Đường Quét (Sweep Line)', description: 'Sắp xếp sự kiện theo trục X kết hợp cấu trúc cân bằng quản lý trục Y (Skyline, Hợp diện tích).', keyTopics: ['Sweep Line', 'Event Queue', 'Skyline'], problemCount: 3, hasInteractiveLesson: false, difficulty: 'Hard' },
      { id: '8.6', title: '8.6 Convex Hull Trick & Li Chao Tree', description: 'Tối ưu hóa quy hoạch động dạng min(dp[j] + m_j*x_i + c_j) bằng bao lồi đường thẳng và Li Chao Tree.', keyTopics: ['Convex Hull Trick', 'Li Chao Tree', 'Line Container'], problemCount: 2, hasInteractiveLesson: false, difficulty: 'Hard' },
      { id: '8.7', title: '8.7 Kỹ Thuật Ngẫu Nhiên (Randomization)', description: 'Thuật toán Miller-Rabin kiểm tra số nguyên tố và randomized quickselect.', keyTopics: ['Randomization', 'Miller-Rabin', 'Monte Carlo'], problemCount: 2, hasInteractiveLesson: false, difficulty: 'Medium' },
      { id: '8.8', title: '8.8 Test 1', description: '4 bài kiểm tra: Meet in the middle, KMP, Z-Algorithm, Rolling Hash.', keyTopics: ['Test 1', '4 Problems', '90 Minutes'], problemCount: 4, hasInteractiveLesson: false, difficulty: 'Hard' },
      { id: '8.9', title: '8.9 Test 2', description: '4 bài kiểm tra: Sweep line, Chia căn (Mo), Convex Hull Trick, Small to Large.', keyTopics: ['Test 2', '4 Problems', '90 Minutes'], problemCount: 4, hasInteractiveLesson: false, difficulty: 'Hard' },
    ]
  },
  {
    id: 9,
    monthNumber: 9,
    monthLabel: 'Tháng 9',
    phase: 'Phase 2: Thuật Toán Nâng Cao',
    title: 'Quy Hoạch Động Nâng Cao',
    summary: 'Bitmask DP, SOS DP, Digit DP, Quy hoạch động nhân ma trận, Tree DP & Re-rooting, Bitset DP, Chia để trị.',
    subtopics: [
      { id: '9.1', title: '9.1 Quy Hoạch Động Bitmask', description: 'Bài toán Người du lịch TSP O(N²·2^N), bài toán phân công công việc và duyệt submask.', keyTopics: ['Bitmask DP', 'TSP', 'Submask Enumeration'], problemCount: 3, hasInteractiveLesson: false, difficulty: 'Hard' },
      { id: '9.2', title: '9.2 Kỹ Thuật SOS (Sum Over Subsets)', description: 'Tính toán tổng trên mọi tập con của một mặt nạ trong O(N·2^N) thay vì O(3^N).', keyTopics: ['SOS DP', 'Subsets Sum', 'Mask Transformation'], problemCount: 2, hasInteractiveLesson: false, difficulty: 'Hard' },
      { id: '9.3', title: '9.3 Quy Hoạch Động Chữ Số (Digit DP)', description: 'Đếm số lượng số trong khoảng [L, R] thỏa mãn ràng buộc chữ số bằng dp(idx, cnt, tight, leading_zero).', keyTopics: ['Digit DP', 'Tight Constraint', 'Leading Zero'], problemCount: 3, hasInteractiveLesson: false, difficulty: 'Hard' },
      { id: '9.4', title: '9.4 Quy Hoạch Động Nhân Ma Trận', description: 'Biểu diễn hệ phương trình truy hồi tuyến tính thành phép nhân ma trận, tính số hạng thứ 10¹⁸ trong O(K³ log N).', keyTopics: ['Matrix Exponentiation', 'Linear Recurrence', 'Fast Matrix'], problemCount: 2, hasInteractiveLesson: false, difficulty: 'Hard' },
      { id: '9.5', title: '9.5 Tree DP & Kỹ Thuật Re-rooting', description: 'Độc lập cực đại trên cây và kỹ thuật đổi gốc cây 2 lượt DFS giảm từ O(N²) xuống O(N).', keyTopics: ['Tree DP', 'Re-rooting 2-Pass', 'Subtree Aggregation'], problemCount: 3, hasInteractiveLesson: false, difficulty: 'Hard' },
      { id: '9.6', title: '9.6 Bitset DP & Tối Ưu Chia Để Trị', description: 'Tận dụng std::bitset tăng tốc Knapsack gấp 64 lần và tối ưu DP Chia để trị O(K·N log N).', keyTopics: ['Bitset DP', 'D&C Optimization', 'Knuth Optimization'], problemCount: 2, hasInteractiveLesson: false, difficulty: 'Hard' },
      { id: '9.7', title: '9.7 Test 1', description: '4 bài kiểm tra: Bitmask DP, SOS DP, Digit DP, Bitset DP.', keyTopics: ['Test 1', '4 Problems', '90 Minutes'], problemCount: 4, hasInteractiveLesson: false, difficulty: 'Hard' },
      { id: '9.8', title: '9.8 Test 2', description: '4 bài kiểm tra: Tree DP, Tree Re-rooting, Matrix DP, DP Chia để trị.', keyTopics: ['Test 2', '4 Problems', '90 Minutes'], problemCount: 4, hasInteractiveLesson: false, difficulty: 'Hard' },
    ]
  },
  {
    id: 10,
    monthNumber: 10,
    monthLabel: 'Tháng 10',
    phase: 'Phase 2: Thuật Toán Nâng Cao',
    title: 'Lý Thuyết Đồ Thị Nâng Cao',
    summary: 'Luồng cực đại Dinic, Lát cắt cực tiểu, Cặp ghép cực đại 2 phía, LCA Binary Lifting, HLD, Centroid, 2-SAT.',
    subtopics: [
      { id: '10.1', title: '10.1 Luồng Cực Đại & Lát Cắt Cực Tiểu', description: 'Mạng luồng, thuật toán Dinic O(V²E) với Level Graph và định lý Max-Flow Min-Cut.', keyTopics: ['Dinic Algorithm', 'Max Flow', 'Min Cut'], problemCount: 3, hasInteractiveLesson: false, difficulty: 'Hard' },
      { id: '10.2', title: '10.2 Cặp Ghép Cực Đại 2 Phía', description: 'Đồ thị hai phía, thuật toán Hopcroft-Karp và định lý Hall.', keyTopics: ['Bipartite Matching', 'Hopcroft-Karp', 'Hall Marriage'], problemCount: 2, hasInteractiveLesson: false, difficulty: 'Hard' },
      { id: '10.3', title: '10.3 LCA (Binary Lifting) & Euler Tour', description: 'Kỹ thuật Binary Lifting tìm LCA trong O(log N) và trải phẳng cây Euler Tour Technique.', keyTopics: ['LCA Binary Lifting', 'Euler Tour', 'Tree Flattening'], problemCount: 3, hasInteractiveLesson: false, difficulty: 'Medium' },
      { id: '10.4', title: '10.4 Heavy-Light Decomposition (HLD)', description: 'Phân hoạch nặng nhẹ chuỗi nặng, truy vấn và cập nhật đường đi bất kỳ trên cây trong O(log² N).', keyTopics: ['HLD', 'Heavy Chains', 'Path Query SegTree'], problemCount: 2, hasInteractiveLesson: false, difficulty: 'Hard' },
      { id: '10.5', title: '10.5 Centroid Decomposition', description: 'Chia để trị trên cây bằng cách tìm trọng tâm, giải bài toán đường đi độ dài K trong O(N log N).', keyTopics: ['Centroid Decomposition', 'Divide & Conquer Tree', 'Path Counting'], problemCount: 2, hasInteractiveLesson: false, difficulty: 'Hard' },
      { id: '10.6', title: '10.6 2-SAT (2-Satisfiability)', description: 'Biểu diễn mệnh đề logic dạng đồ thị có hướng và giải trong thời gian tuyến tính O(V+E) bằng SCC.', keyTopics: ['2-SAT', 'Implication Graph', 'SCC Kosaraju'], problemCount: 2, hasInteractiveLesson: false, difficulty: 'Hard' },
      { id: '10.7', title: '10.7 Test 1', description: '4 bài kiểm tra: LCA Binary Lifting, Euler Tour, Dinic Max Flow, Min Cut.', keyTopics: ['Test 1', '4 Problems', '90 Minutes'], problemCount: 4, hasInteractiveLesson: false, difficulty: 'Hard' },
      { id: '10.8', title: '10.8 Test 2', description: '4 bài kiểm tra: Heavy-Light Decomposition (HLD), Centroid Decomposition, 2-SAT.', keyTopics: ['Test 2', '4 Problems', '90 Minutes'], problemCount: 4, hasInteractiveLesson: false, difficulty: 'Hard' },
    ]
  },
  {
    id: 11,
    monthNumber: 11,
    monthLabel: 'Tháng 11',
    phase: 'Phase 2: Thuật Toán Nâng Cao',
    title: 'Toán Học Nâng Cao',
    summary: 'Hình học phẳng (CCW, Bao lồi Monotone Chain), Mobius Inversion, Phi hàm Euler, Euclid mở rộng, CRT.',
    subtopics: [
      { id: '11.1', title: '11.1 Hình Học Phẳng & Vector CCW', description: 'Tọa độ nguyên, tích có hướng CCW xác định chiều quay, kiểm tra đoạn thẳng cắt nhau tránh sai số.', keyTopics: ['2D Geometry', 'Cross Product CCW', 'Precision Free'], problemCount: 3, hasInteractiveLesson: false, difficulty: 'Medium' },
      { id: '11.2', title: '11.2 Bao Lồi (Andrew Monotone Chain)', description: 'Thuật toán Monotone Chain tìm bao lồi trong O(N log N) bằng sắp xếp và 2 ngăn xếp.', keyTopics: ['Convex Hull', 'Monotone Chain', 'Graham Scan'], problemCount: 2, hasInteractiveLesson: false, difficulty: 'Hard' },
      { id: '11.3', title: '11.3 Bao Hàm Loại Trừ & Hàm Mobius', description: 'Hàm μ(n), sàng Mobius và nghịch đảo Mobius giải bài toán đếm cặp số gcd(i, j) = 1.', keyTopics: ['Inclusion-Exclusion', 'Mobius Function', 'Mobius Inversion'], problemCount: 3, hasInteractiveLesson: false, difficulty: 'Hard' },
      { id: '11.4', title: '11.4 Phi Hàm Euler & Euclid Mở Rộng', description: 'Công thức tính φ(n), định lý Euler A^{φ(M)} ≡ 1 và thuật toán Euclid mở rộng giải phương trình Diophantine.', keyTopics: ['Euler Totient', 'Extended Euclid', 'Diophantine'], problemCount: 3, hasInteractiveLesson: false, difficulty: 'Medium' },
      { id: '11.5', title: '11.5 Định Lý Số Dư Trung Hoa (CRT)', description: 'Giải hệ phương trình đồng dư bậc nhất với các modulo nguyên tố cùng nhau.', keyTopics: ['Chinese Remainder Theorem', 'System of Congruences', 'CRT'], problemCount: 2, hasInteractiveLesson: false, difficulty: 'Hard' },
      { id: '11.6', title: '11.6 Linear Basis XOR & Giải Tích', description: 'Cơ sở tuyến tính không gian vector XOR và tích phân số học Simpson công thức.', keyTopics: ['Linear Basis XOR', 'Gaussian Elimination GF(2)', 'Simpson Rule'], problemCount: 2, hasInteractiveLesson: false, difficulty: 'Hard' },
      { id: '11.7', title: '11.7 Test 1', description: '4 bài kiểm tra: Hình học phẳng, CCW, Convex Hull, Phi hàm Euler, Euclid mở rộng.', keyTopics: ['Test 1', '4 Problems', '90 Minutes'], problemCount: 4, hasInteractiveLesson: false, difficulty: 'Hard' },
      { id: '11.8', title: '11.8 Test 2', description: '4 bài kiểm tra: Bao hàm loại trừ, Mobius, CRT, Linear Basis XOR.', keyTopics: ['Test 2', '4 Problems', '90 Minutes'], problemCount: 4, hasInteractiveLesson: false, difficulty: 'Hard' },
    ]
  },
  {
    id: 12,
    monthNumber: 12,
    monthLabel: 'Tháng 12',
    phase: 'Phase 2: Thuật Toán Nâng Cao',
    title: 'Interview',
    summary: 'Chiến thuật Speed Solving LeetCode Guardian 2100+, Codeforces Expert và bộ 10 bài Mock Technical Interview Big Tech.',
    subtopics: [
      { id: '12.1', title: '12.1 Chiến Thuật Thi Đấu Tốc Độ', description: 'Hoàn thành Q1-Q3 trong 20 phút, phương pháp xử lý bí ý tưởng (Stuck Checklist) cho Q4.', keyTopics: ['Speed Solving', 'Stuck Checklist', 'Contest Psychology'], problemCount: 4, hasInteractiveLesson: false, difficulty: 'Hard' },
      { id: '12.2', title: '12.2 LeetCode Guardian Sprint', description: 'Thi đấu liên tục 8 kỳ Weekly/Biweekly Contests, mục tiêu lọt Top 1-2% toàn cầu.', keyTopics: ['LeetCode Contest', 'Guardian 2100+', 'Upsolving'], problemCount: 8, hasInteractiveLesson: false, difficulty: 'Hard' },
      { id: '12.3', title: '12.3 Codeforces Div 2 Sprint', description: 'Luyện tập các bài Div 2 C/D/E bứt phá mốc Specialist lên Expert (1600 - 1650+).', keyTopics: ['Codeforces Div 2', 'Rating 1600+', 'CF Upsolving'], problemCount: 6, hasInteractiveLesson: false, difficulty: 'Hard' },
      { id: '12.4', title: '12.4 Quy Chuẩn Phỏng Vấn Big Tech', description: 'Phương pháp Clarifying questions, thinking out loud, phân tích Big-O và code sạch không IDE.', keyTopics: ['Big Tech Interview', 'Thinking Out Loud', 'Clean Code'], problemCount: 3, hasInteractiveLesson: false, difficulty: 'Medium' },
      { id: '12.5', title: '12.5 Bộ 10 Bài Mock Technical Interview', description: 'Luyện tập trực tiếp 10 bài phỏng vấn kinh điển (LRU Cache, LFU Cache, Basic Calculator, Word Search II...).', keyTopics: ['10 Mock Interviews', 'Google/Meta/Amazon', 'System Design DSA'], problemCount: 10, hasInteractiveLesson: false, difficulty: 'Hard' },
    ]
  }
];
