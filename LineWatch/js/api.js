// ===== api.js: tài khoản + dữ liệu mẫu + lưu vào localStorage =====

// Mỗi tài khoản CHỈ vào được trang của đúng vai trò của mình
const USERS = [
  { username: "congnhan1", password: "congnhan123", role: "operator",    name: "Công nhân Nam" },
  { username: "truongca1", password: "truongca123", role: "supervisor",  name: "Trưởng ca Lan" },
  { username: "baotri1",   password: "baotri123",   role: "maintenance", name: "Kỹ thuật Minh" },
  { username: "admin",     password: "admin123",    role: "admin",       name: "Quản trị Hùng" }
];

// Trang chủ của từng vai trò (đăng nhập xong tự chuyển tới đây)
const HOME = {
  operator: "operator-line-status.html",
  supervisor: "supervisor-shift-dashboard.html",
  maintenance: "maintenance-queue.html",
  admin: "admin-downtime-report.html"
};

// Hàm viết tắt để tạo dữ liệu mẫu cho gọn
const mach = (id, name, line, status) => ({ id, name, line, status });
const inc = (id, machine, title, desc, type, priority, status, time, shift, cause = "", downtime = 0) =>
  ({ id, machine, title, desc, type, priority, status, reporter: "congnhan1", time, shift, cause, downtime });

// status sự cố: new | assigned | fixing | done | cancelled
// shift: sang | chieu | dem
const SEED = {
  lines: [
    { id: "L1", name: "Line 1 - Đóng gói" },
    { id: "L2", name: "Line 2 - Lắp ráp" },
    { id: "L3", name: "Line 3 - Sơn phủ" },
    { id: "L4", name: "Line 4 - Kiểm tra chất lượng" }
  ],
  machines: [
    mach("M01", "Máy đóng thùng 01", "L1", "running"),
    mach("M02", "Băng tải đóng gói", "L1", "running"),
    mach("M03", "Máy dán nhãn", "L1", "error"),
    mach("M04", "Robot lắp ráp A", "L2", "running"),
    mach("M05", "Máy siết vít tự động", "L2", "stopped"),
    mach("M06", "Băng tải lắp ráp", "L2", "running"),
    mach("M07", "Buồng sơn tĩnh điện", "L3", "maintenance"),
    mach("M08", "Lò sấy sơn", "L3", "running"),
    mach("M09", "Robot phun sơn", "L3", "error"),
    mach("M10", "Máy đo kích thước 3D", "L4", "running"),
    mach("M11", "Camera kiểm tra lỗi", "L4", "running"),
    mach("M12", "Máy cân tự động", "L4", "stopped")
  ],
  incidents: [
    inc("INC-001", "M03", "Máy dán nhãn dán lệch nhãn", "Nhãn bị dán lệch sang trái, cảm biến vị trí báo sai", "Điện", "Trung bình", "new", "2026-10-26 08:10", "sang"),
    inc("INC-002", "M09", "Robot sơn rò dầu thủy lực", "Phát hiện dầu rò ở khớp tay robot, nền xưởng trơn", "Cơ khí", "Cao", "assigned", "2026-10-26 08:40", "sang"),
    inc("INC-003", "M05", "Máy siết vít dừng đột ngột", "Máy ngừng giữa chu kỳ, đèn đỏ sáng, có mùi khét nhẹ", "Điện", "Cao", "fixing", "2026-10-26 09:05", "sang"),
    inc("INC-004", "M02", "Băng tải kêu to và rung", "Băng tải phát tiếng ồn lớn, rung mạnh ở đoạn cuối", "Cơ khí", "Trung bình", "done", "2026-10-25 09:30", "sang", "Mòn vòng bi con lăn số 4", 45),
    inc("INC-005", "M12", "Cân tự động hiển thị sai khối lượng", "Số cân nhảy lung tung, sai lệch 200g", "Phần mềm", "Trung bình", "done", "2026-10-25 10:15", "sang", "Cần hiệu chuẩn lại loadcell", 30),
    inc("INC-006", "M03", "Máy dán nhãn kẹt giấy nhãn", "Cuộn nhãn bị kẹt, máy dừng", "Cơ khí", "Thấp", "done", "2026-10-25 13:20", "sang", "Con lăn kéo nhãn bị mòn", 20),
    inc("INC-007", "M09", "Robot sơn lệch quỹ đạo", "Robot phun lệch 5mm so với chương trình", "Phần mềm", "Cao", "done", "2026-10-25 14:30", "chieu", "Mất đồng bộ encoder, đã reset", 60),
    inc("INC-008", "M05", "Máy siết vít mất kết nối PLC", "Màn hình PLC báo mất kết nối, bị đơ", "Phần mềm", "Trung bình", "done", "2026-10-25 15:10", "chieu", "Lỏng cáp mạng, đã siết lại", 25),
    inc("INC-009", "M02", "Băng tải rung trở lại", "Băng tải rung mạnh, nghi mòn bạc đạn", "Cơ khí", "Trung bình", "done", "2026-10-24 10:00", "sang", "Mòn vòng bi con lăn số 4", 40),
    inc("INC-010", "M07", "Buồng sơn có khói", "Có khói trắng bốc ra từ khu vực gia nhiệt", "An toàn", "Cao", "done", "2026-10-24 15:45", "chieu", "Chập dây điện trở gia nhiệt", 120),
    inc("INC-011", "M08", "Lò sấy nhiệt độ không ổn định", "Nhiệt độ dao động khoảng 15 độ", "Điện", "Trung bình", "done", "2026-10-24 16:20", "chieu", "Cảm biến nhiệt lỗi, đã thay", 50),
    inc("INC-012", "M10", "Máy đo 3D báo lỗi hiệu chuẩn", "Màn hình báo lỗi mã E21 khi khởi động", "Phần mềm", "Thấp", "done", "2026-10-23 09:10", "sang", "Phần mềm treo, đã cài lại", 15),
    inc("INC-013", "M06", "Băng tải lắp ráp kẹt phôi", "Phôi kẹt ở cửa vào trạm 2", "Cơ khí", "Thấp", "done", "2026-10-23 14:50", "chieu", "Lệch thanh dẫn hướng", 10),
    inc("INC-014", "M03", "Máy dán nhãn dừng, motor nóng", "Động cơ kéo nhãn rất nóng, cầu dao nhảy", "Điện", "Cao", "done", "2026-10-23 16:00", "chieu", "Motor quá tải, đã thay motor", 90),
    inc("INC-015", "M11", "Camera kiểm tra mờ hình", "Hình ảnh mờ, nhận diện lỗi sai", "Phần mềm", "Thấp", "cancelled", "2026-10-22 11:00", "sang", "Hủy: báo nhầm"),
    inc("INC-016", "M01", "Máy đóng thùng hết băng keo", "Hết băng keo, máy dừng", "Cơ khí", "Thấp", "done", "2026-10-22 15:30", "chieu", "Thay cuộn keo mới", 5)
  ],
  notes: [
    { id: "N1", title: "Bàn giao ca sáng 25/10", content: "Băng tải M02 đã thay vòng bi, cần theo dõi thêm.\nMáy M03 dán lệch nhãn, ca sau kiểm tra cảm biến.", author: "truongca1", time: "2026-10-25 14:00" },
    { id: "N2", title: "Lưu ý an toàn Line 3", content: "Buồng sơn M07 đang bảo trì, không đứng gần khu gia nhiệt.", author: "truongca1", time: "2026-10-25 22:00" }
  ],
  reports: [
    { id: "R1", title: "Lỗi lặp lại: Băng tải đóng gói", content: "Lỗi Cơ khí lặp lại 2 lần cùng nguyên nhân mòn vòng bi con lăn số 4. Nên thay cả bộ vòng bi.", author: "baotri1", time: "2026-10-25 17:00" }
  ]
};

// Đọc / ghi dữ liệu. Lần đầu chạy sẽ tự nạp SEED vào localStorage
const DB = {
  get(name) {
    if (!localStorage.getItem("lw_" + name)) localStorage.setItem("lw_" + name, JSON.stringify(SEED[name]));
    return JSON.parse(localStorage.getItem("lw_" + name));
  },
  set(name, list) { localStorage.setItem("lw_" + name, JSON.stringify(list)); },
  newId(prefix) { return prefix + "-" + Date.now().toString().slice(-6); },
  reset() { Object.keys(SEED).forEach(k => localStorage.removeItem("lw_" + k)); }
};

// Đăng nhập: đúng tên + đúng mật khẩu mới trả về tài khoản
function login(username, password) {
  return USERS.find(u => u.username === username && u.password === password);
}
function currentUser() { return JSON.parse(sessionStorage.getItem("lw_user") || "null"); }
