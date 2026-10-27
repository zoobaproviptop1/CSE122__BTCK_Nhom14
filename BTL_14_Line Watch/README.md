#  Hệ Thống Giám Sát Dây Chuyền Sản Xuất - LineWatch (BTL-14)
**Môn học:** Phát triển ứng dụng Web cơ bản (CSE122) - Khoa CNTT, Đại học Thủy Lợi  
**Giảng viên hướng dẫn:** ThS. Kiều Tuấn Dũng - ThS. Tạ Chí Hiếu  
**Nhóm sinh viên thực hiện:** Nhóm 14  

---

##  Liên kết Dự án
- **Live Deployment URL:** [https://zoobaproviptop1.github.io/CSE122__BTCK_Nhom14/LineWatch](https://zoobaproviptop1.github.io/CSE122__BTCK_Nhom14/LineWatch)
- **Figma / Canva Mockup Design:** [https://canva.link/z8iv2b971x7wnnu]
- **Bảng quản lý công việc (Trello/Jira/Notion):** [https://trello.com/invite/b/6adf39c4577883e16dc64536/ATTI23129661cbb5bcff598562240a0e5a55542230A2/linewatch-cse122-btl-nhom-14]

---

##  Phân công nhiệm vụ (3 Thành viên)
| STT | Thành viên | Mã SV | Phân hệ / Vai trò phụ trách | Trách nhiệm chéo (Cross-Responsibility) |

| SV1 | Ngô Quang Minh | 2551170922 | **Công nhân vận hành ** (`operator-*`) | Design System (`css/style.css`), Menu chung & A11y |
| SV2 | Cao Ngọc Thắng | 2551170947 | **Trưởng ca sản xuất ** (`supervisor-*`) | Kiến trúc JS, Dữ liệu `localStorage` (`js/api.js`), AI UX |
| SV3 | Phạm Đăng Tiến Thành | 2551170949 | **Bảo trì & Quản trị ** (`maintenance-*`, `admin-*`) | Kiểm thử Responsive, Merge nhánh Git & Triển khai |

---

##  Tài khoản Đăng nhập Demo nhanh
| Vai trò | Tên đăng nhập | Mật khẩu | Trang tự động chuyển hướng |

| Công nhân | `congnhan1` | `congnhan123` | `operator-line-status.html` |
| Trưởng ca | `truongca1` | `truongca123` | `supervisor-shift-dashboard.html` |
| Bảo trì | `baotri1` | `baotri123` | `maintenance-queue.html` |
| Quản trị | `admin` | `admin123` | `admin-downtime-report.html` |

---

##  Cấu trúc Thư mục Dự án
```text
linewatch/
├── index.html                           # Trang chủ & Đăng nhập phân quyền
├── operator-line-status.html            # SV1: Trạng thái dây chuyền
├── operator-incident-create.html        # SV1: Form báo sự cố (AI-1)
├── operator-shift-incidents.html        # SV1: Sự cố của tôi
├── supervisor-shift-dashboard.html      # SV2: Bảng điều khiển ca (AI-2)
├── supervisor-incident-board.html       # SV2: Điều phối Kanban sự cố
├── supervisor-handover-note.html        # SV2: Ghi chú bàn giao ca
├── maintenance-queue.html               # SV3: Hàng đợi bảo trì
├── maintenance-machine-history.html     # SV3: Lịch sử máy (AI-3)
├── admin-downtime-report.html           # SV3: Báo cáo downtime & Xuất CSV
├── admin-machine-management.html        # SV3: Quản lý máy & Line
├── css/
│   └── style.css                        # CSS biến chung, Layout & Design System
├── js/
│   ├── api.js                           # Dữ liệu mẫu SEED, localStorage, login
│   └── main.js                          # Hàm dùng chung, Auth Check, AI Panel
└── docs/
    ├── screen-inventory.md              # Bảng kiểm kê 11 màn hình (12 cột chuẩn)
    └── ai-usage-report.md               # Báo cáo khai báo sử dụng AI chi tiết
```
