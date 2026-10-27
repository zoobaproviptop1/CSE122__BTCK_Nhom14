# BẢNG KIỂM KÊ MÀN HÌNH (SCREEN INVENTORY) - LINEWATCH
**Đề tài:** Hệ Thống Giám Sát Dây Chuyền Sản Xuất LineWatch (BTL-14)
**Môn học:** Phát triển ứng dụng Web cơ bản

| STT | Role | User Goal | User Task | Screen Name | File Path | CRUD | States (Coverage) | AI Feature | Assignee | Branch | OBS Status |

| 1 | Visitor/Public | Tổng quan hệ thống | Chuyển luồng truy cập vai trò | Trang chủ | `index.html` | R | Normal | N/A | SV1 | `main` | Ready |
| 2 | Operator (SV1) | Kiểm tra trạng thái máy | Lọc & tìm kiếm máy theo dây chuyền | Trạng thái dây chuyền | `operator-line-status.html` | R | Normal, Empty, Loading | N/A | SV1 | `feature/operator` | Ready |
| 3 | Operator (SV1) | Báo sự cố máy dừng | Nhập mô tả, dùng AI gợi ý phân loại | Báo sự cố | `operator-incident-create.html` | C | Normal, Validation, AI Processing | AI-1 (Gợi ý lỗi) | SV1 | `feature/operator` | Ready |
| 4 | Operator (SV1) | Theo dõi sự cố đã báo | Xem danh sách, cập nhật thông tin | Sự cố của tôi | `operator-shift-incidents.html` | R, U, D | Normal, Empty | N/A | SV1 | `feature/operator` | Ready |
| 5 | Supervisor (SV2) | Quản lý ca làm việc | Xem KPI, tiến độ ca trực | Bảng điều khiển ca | `supervisor-shift-dashboard.html` | R | Normal, Loading | N/A | SV2 | `feature/supervisor` | Ready |
| 6 | Supervisor (SV2) | Điều phối sự cố | Chuyển trạng thái Kanban sự cố | Bảng Kanban | `supervisor-incident-board.html` | U | Normal, Drag/Update | AI-2 (Đánh giá rủi ro) | SV2 | `feature/supervisor` | Ready |
| 7 | Supervisor (SV2) | Bàn giao ca | Viết & lưu nhật ký ca làm việc | Ghi chú bàn giao | `supervisor-handover-note.html` | C, R | Normal, Validation | N/A | SV2 | `feature/supervisor` | Ready |
| 8 | Maintenance (SV3)| Xử lý lỗi kỹ thuật | Tiếp nhận hàng đợi sự cố | Hàng đợi bảo trì | `maintenance-queue.html` | R, U | Normal, Empty | N/A | SV3 | `feature/maintenance` | Ready |
| 9 | Maintenance (SV3)| Xem lịch sử thiết bị | Tra cứu lịch sử & nhận cảnh báo | Lịch sử máy | `maintenance-machine-history.html` | R | Normal, Chart | AI-3 (Cảnh báo lặp lỗi) | SV3 | `feature/maintenance` | Ready |
| 10 | Admin (SV3) | Phân tích Downtime | Thống kê tổng thời gian dừng | Báo cáo Downtime | `admin-downtime-report.html` | R | Normal, Filter | N/A | SV3 | `feature/maintenance` | Ready |
| 11 | Admin (SV3) | Quản lý danh mục | Thêm, sửa, xóa danh mục máy | Quản lý thiết bị | `admin-machine-management.html` | C, R, U, D | Normal, Modal | N/A | SV3 | `feature/maintenance` | Ready |
