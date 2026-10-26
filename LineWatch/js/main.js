// ===== main.js: các hàm dùng chung cho mọi trang =====
const $ = id => document.getElementById(id);

// Chống XSS: đổi ký tự đặc biệt trước khi chèn vào HTML
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const MENU = {
  operator: [["operator-line-status.html", "Trạng thái Line"], ["operator-incident-create.html", "Báo sự cố"], ["operator-shift-incidents.html", "Sự cố của tôi"]],
  supervisor: [["supervisor-shift-dashboard.html", "Bảng điều khiển ca"], ["supervisor-incident-board.html", "Bảng sự cố"], ["supervisor-handover-note.html", "Ghi chú bàn giao"]],
  maintenance: [["maintenance-queue.html", "Hàng đợi bảo trì"], ["maintenance-machine-history.html", "Lịch sử máy"]],
  admin: [["admin-downtime-report.html", "Báo cáo downtime"], ["admin-machine-management.html", "Quản lý máy & Line"]]
};
const ROLE_NAME = { operator: "Công nhân", supervisor: "Trưởng ca", maintenance: "Bảo trì", admin: "Quản trị" };

// Nhãn + màu cho huy hiệu trạng thái
const STATUS = { new: ["Mới", "secondary"], assigned: ["Đã giao", "info"], fixing: ["Đang sửa", "warning"], done: ["Hoàn thành", "success"], cancelled: ["Đã hủy", "dark"] };
const MSTATUS = { running: ["Đang chạy", "success"], stopped: ["Dừng", "secondary"], error: ["Lỗi", "danger"], maintenance: ["Bảo trì", "warning"] };
const PRI = { "Cao": "danger", "Trung bình": "warning", "Thấp": "success" };
const SHIFT = { sang: "Ca sáng", chieu: "Ca chiều", dem: "Ca đêm" };

const badge = (map, key) => `<span class="badge text-bg-${map[key][1]}">${map[key][0]}</span>`;
const priBadge = p => `<span class="badge text-bg-${PRI[p]}">${esc(p)}</span>`;
const machineName = id => (DB.get("machines").find(m => m.id === id) || { name: "(đã xóa)" }).name;
const lineName = id => (DB.get("lines").find(l => l.id === id) || { name: "(đã xóa)" }).name;
const now = () => new Date().toLocaleString("sv-SE").slice(0, 16);   // vd: 2026-10-26 11:44
const getShift = () => { const h = new Date().getHours(); return h >= 6 && h < 14 ? "sang" : h >= 14 && h < 22 ? "chieu" : "dem"; };

// Trạng thái Rỗng và Đang tải
const empty = (msg, btn = "") => `<div class="text-center text-muted p-5"><div style="font-size:3rem">📭</div><p>${msg}</p>${btn}</div>`;
const spinner = () => `<div class="text-center p-5"><div class="spinner-border text-primary"></div><p class="mt-2">Đang tải...</p></div>`;

// Thông báo nổi
function toast(msg, type = "success") {
  const d = document.createElement("div");
  d.className = `alert alert-${type} position-fixed top-0 end-0 m-3 shadow`;
  d.style.zIndex = 2000;
  d.textContent = msg;
  document.body.appendChild(d);
  setTimeout(() => d.remove(), 2500);
}

function logout() { sessionStorage.removeItem("lw_user"); location.href = "index.html"; }

// Gọi ở đầu mỗi trang: kiểm tra đăng nhập + đúng vai trò + vẽ thanh menu
function initPage(role) {
  const user = currentUser();
  if (!user) { location.href = "index.html"; return null; }
  if (user.role !== role) {                       // sai vai trò -> 403
    alert("403 - Tài khoản của bạn không có quyền vào trang này!");
    location.href = HOME[user.role];
    return null;
  }
  const page = location.pathname.split("/").pop();
  const links = MENU[role].map(([url, text]) =>
    `<li class="nav-item"><a class="nav-link ${url === page ? "active fw-bold" : ""}" href="${url}">${text}</a></li>`).join("");
  $("nav").innerHTML = `<nav class="navbar navbar-expand-lg navbar-dark navbar-lw"><div class="container">
    <a class="navbar-brand" href="${HOME[role]}">🏭 LineWatch</a>
    <button class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#menu" aria-label="Mở menu"><span class="navbar-toggler-icon"></span></button>
    <div class="collapse navbar-collapse" id="menu"><ul class="navbar-nav me-auto">${links}</ul>
    <span class="text-white me-3">👤 ${esc(user.name)} (${ROLE_NAME[role]})</span>
    <button class="btn btn-sm btn-warning" onclick="logout()">Đăng xuất</button></div></div></nav>`;
  return user;
}

// ===== KHUNG AI DÙNG CHUNG =====
// Nhập -> Đang xử lý -> Kết quả -> Giải thích -> Chấp nhận / Sửa / Từ chối / Tạo lại -> Lưu
// run(n): hàm tính kết quả {text, confidence, reasons} hoặc {error}; n = số lần "Tạo lại"
// onSave(text, kết quả): hàm lưu vào dữ liệu khi bấm Chấp nhận
function aiPanel(box, run, onSave, canEdit = true, onEdit) {
  let n = 0;
  async function go() {
    box.innerHTML = `<div class="text-center p-4"><div class="spinner-border text-primary"></div><p class="mt-2">🤖 AI đang phân tích...</p></div>`;
    await new Promise(r => setTimeout(r, 1200));          // giả lập AI đang nghĩ 1,2 giây
    const r = run(n);
    if (r.error) {                                        // AI thất bại / thiếu dữ liệu
      box.innerHTML = `<div class="alert alert-warning"><b>⚠️ AI chưa đủ dữ liệu:</b> ${esc(r.error)}
        <div class="mt-2"><button class="btn btn-sm btn-dark" id="aiRetry">Thử lại</button>
        <button class="btn btn-sm btn-outline-dark" id="aiSkip">Bỏ qua, làm thủ công</button></div></div>`;
      $("aiRetry").onclick = go;
      $("aiSkip").onclick = () => box.innerHTML = "";
      return;
    }
    const low = r.confidence < 60;
    box.innerHTML = `<div class="card border-primary"><div class="card-body">
      <h5>🤖 Kết quả AI <span class="badge text-bg-${low ? "warning" : "success"}">Độ tin cậy ${r.confidence}%</span></h5>
      ${low ? '<div class="alert alert-warning py-1">AI chưa chắc chắn – cần người xác nhận lại.</div>' : ""}
      ${canEdit ? `<textarea id="aiText" class="form-control" rows="5" aria-label="Kết quả AI">${esc(r.text)}</textarea>
                   <small class="text-muted">✏️ Bạn có thể sửa trực tiếp nội dung trước khi lưu.</small>`
                : `<p class="fs-5">${esc(r.text)}</p>`}
      <details class="my-3" open><summary><b>Vì sao AI đề xuất như vậy?</b></summary>
        <ul class="mb-0">${r.reasons.map(x => `<li>${esc(x)}</li>`).join("")}</ul></details>
      <button class="btn btn-success" id="aiOk">✔ Chấp nhận & lưu</button>
      <button class="btn btn-outline-secondary" id="aiEdit">✏️ Sửa</button>
      <button class="btn btn-outline-danger" id="aiNo">✖ Từ chối</button>
      <button class="btn btn-outline-primary" id="aiAgain">🔄 Tạo lại</button>
    </div></div>`;
    $("aiOk").onclick = () => { onSave(canEdit ? $("aiText").value : r.text, r); box.innerHTML = ""; };
    $("aiEdit").onclick = () => canEdit ? $("aiText").focus() : onEdit && onEdit(r);   // Sửa
    $("aiNo").onclick = () => { box.innerHTML = ""; toast("Đã từ chối kết quả AI", "secondary"); };
    $("aiAgain").onclick = () => { n++; go(); };
  }
  go();
}
