# 🌿 The Forest — Hotel Booking Website

Website đặt phòng và quản lý khu nghỉ dưỡng **The Forest** tại Đà Lạt, Việt Nam.  
Dự án demo sử dụng HTML/CSS/JavaScript thuần, không cần backend hay framework.

---

## ✨ Tính năng

### Phía khách hàng
- **Trang chủ** — Giới thiệu resort, tìm kiếm phòng, khuyến mãi
- **Đặt phòng** — Quy trình 3 bước: thông tin → thanh toán → xác nhận
- **Dịch vụ** — Spa, hồ bơi, yoga, gym, xông hơi, cafe, tour, giặt là...
- **Tra cứu đặt phòng** — Xem và quản lý lịch sử đặt phòng
- **Tài khoản** — Đăng ký, đăng nhập, tích điểm thành viên
- **Chương trình loyalty** — 3 hạng: Silver → Gold → Platinum
- **Cẩm nang du lịch** — Điểm đến, bài viết, mẹo du lịch Đà Lạt
- **Phản hồi** — Gửi đánh giá, nhận voucher

### Phía quản trị (`/admin`)
- Dashboard tổng quan: doanh thu, tỷ lệ lấp đầy, thống kê
- Quản lý đặt phòng: check-in, check-out, hủy phòng
- Quản lý khách hàng: lịch sử, điểm thưởng, feedback
- Quản lý phòng: trạng thái, dọn phòng, bảo trì
- Đăng nhập bảo mật (sessionStorage)

---

## 🛠️ Công nghệ sử dụng

| Thành phần | Chi tiết |
|-----------|---------|
| HTML5 | Cấu trúc trang |
| CSS3 | Responsive design, Flexbox, Grid |
| Vanilla JavaScript (ES6+) | Logic nghiệp vụ, DOM manipulation |
| localStorage | Lưu trữ dữ liệu phía client |
| Google Fonts | Playfair Display + Inter |

---

## 🚀 Cách chạy

Không cần cài đặt. Mở trực tiếp trên trình duyệt:

```bash
# Cách 1: Mở file trực tiếp
Mở file index.html trong trình duyệt

# Cách 2: Dùng live server (khuyến nghị)
npx serve .

# Cách 3: Python
python -m http.server 8080
```

Sau đó truy cập `http://localhost:8080`

---

## 📁 Cấu trúc dự án

```
HOTEL/
├── index.html              # Entry point → redirect tới pages/
├── pages/                  # Tất cả trang khách hàng
│   ├── index.html          # Trang chủ
│   ├── rooms.html          # Danh sách phòng
│   ├── booking.html        # Đặt phòng
│   ├── confirmation.html   # Xác nhận đặt phòng
│   ├── services.html       # Dịch vụ & tiện ích
│   ├── my-booking.html     # Quản lý đặt phòng
│   ├── account.html        # Tài khoản cá nhân
│   ├── about.html          # Về chúng tôi
│   ├── travel-guide.html   # Cẩm nang du lịch
│   └── feedback.html       # Gửi phản hồi
├── admin/                  # Hệ thống quản trị
│   ├── index.html          # Trang đăng nhập admin
│   ├── dashboard.html      # Tổng quan
│   ├── bookings.html       # Quản lý đặt phòng
│   ├── customers.html      # Quản lý khách hàng
│   ├── rooms.html          # Quản lý phòng
│   ├── css/admin.css
│   └── js/admin.js
├── css/
│   └── style.css           # Design system toàn cục
├── js/
│   ├── data.js             # Data layer — KSAN object, localStorage API
│   ├── main.js             # UI helpers — toast, modal, auth header
│   └── footer.js           # Footer injection
└── Public/                 # Ảnh và icons
    └── icon/
```

---

## 🏠 Các loại phòng

| Phòng | Diện tích | Sức chứa | Giá/đêm |
|-------|----------|---------|---------|
| Standard | 25m² | 2 khách | 800,000đ |
| Deluxe | 35m² | 2 khách | 1,200,000đ |
| Suite | 55m² | 4 khách | 2,500,000đ |
| Family | 45m² | 4 khách | 1,800,000đ |

---

## 🎟️ Mã khuyến mãi (demo)

| Mã | Giảm giá | Điều kiện |
|----|---------|----------|
| `SUMMER25` | 25% | Tối thiểu 2 đêm |
| `WELCOME10` | 10% | Tối thiểu 1 đêm |
| `KSAN20` | 20% | Tối thiểu 1 đêm |
| `VIP500K` | 500,000đ | Tối thiểu 3 đêm |

---

## 🔐 Tài khoản admin (demo)

```
Mật khẩu: admin123
```

Truy cập: `/admin/index.html`

---

## 📌 Lưu ý

- Dữ liệu lưu trong **localStorage** của trình duyệt — xóa cache sẽ mất dữ liệu
- Thanh toán chỉ là **UI demo**, không xử lý giao dịch thật
- Email xác nhận chỉ là **placeholder**, không gửi email thật
- Thêm phòng/dịch vụ mới cần chỉnh sửa trực tiếp trong `js/data.js`
