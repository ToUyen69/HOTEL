/* ============================================================
   KSAN Admin — Shared JS (1 tài khoản demo)
   ============================================================ */

/* ── Một tài khoản demo duy nhất ── */
const ADMIN_ACCOUNT = {
  id: 'A001', name: 'Nguyễn Thị Lan', role: 'admin',
  roleLabel: 'Quản trị viên', password: 'admin123'
};

/* ── Auth ── */
const AdminAuth = {
  login(password) {
    if (password !== ADMIN_ACCOUNT.password && password !== '123456')
      return { ok: false, msg: 'Sai mật khẩu.' };
    sessionStorage.setItem('ksan_admin', JSON.stringify(ADMIN_ACCOUNT));
    return { ok: true, account: ADMIN_ACCOUNT };
  },
  logout() {
    sessionStorage.removeItem('ksan_admin');
    location.href = 'index.html';
  },
  current() {
    try { return JSON.parse(sessionStorage.getItem('ksan_admin')); } catch { return null; }
  },
  require() {
    const acc = this.current();
    if (!acc) { location.href = 'index.html'; return null; }
    return acc;
  }
};

/* ── Toast ── */
function showToast(msg, type = 'info', duration = 3500) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const iconMap = {
    success: '../Public/icon/success.png',
    error:   '../Public/icon/crisis.png',
    warning: '../Public/icon/crisis.png',
    info:    '../Public/icon/info.png'
  };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <img src="${iconMap[type] || iconMap.info}" style="width:18px;height:18px;object-fit:contain;flex-shrink:0">
    <span class="toast-msg">${msg}</span>
    <button class="toast-close" onclick="this.parentElement.remove()">×</button>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'toastOut .25s ease forwards';
    setTimeout(() => toast.remove(), 250);
  }, duration);
}

/* ── Modal ── */
function openModal(id) {
  const el = document.getElementById(id);
  if (el) { el.classList.add('open'); document.body.style.overflow = 'hidden'; }
}
function closeModal(id) {
  const el = document.getElementById(id);
  if (el) { el.classList.remove('open'); document.body.style.overflow = ''; }
}
document.addEventListener('click', e => {
  if (e.target.matches('.modal-overlay')) closeModal(e.target.id);
});

/* ── Sidebar ── */
function renderSidebar(activePage) {
  const acc = AdminAuth.require();
  if (!acc) return;
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;
  sidebar.innerHTML = `
    <div class="sidebar-logo">
      <img src="../Public/logo KS.png" alt="KSAN">
      <div>
        <div class="sidebar-logo-text">KSAN</div>
        <div class="sidebar-logo-sub">Admin Panel</div>
      </div>
    </div>
    <div class="sidebar-section">Quản lý</div>
    <nav class="sidebar-nav">
      <a href="dashboard.html" class="${activePage==='dashboard'?'active':''}">
        <img src="../Public/icon/view.png"> Dashboard
      </a>
      <a href="bookings.html" class="${activePage==='bookings'?'active':''}">
        <img src="../Public/icon/bed.png"> Quản lý đặt phòng
      </a>
      <a href="rooms.html" class="${activePage==='rooms'?'active':''}">
        <img src="../Public/icon/room.png"> Quản lý phòng
      </a>
      <a href="customers.html" class="${activePage==='customers'?'active':''}">
        <img src="../Public/icon/user.png"> Khách hàng
      </a>
      <div class="sidebar-section">Hệ thống</div>
      <a href="../index.html">
        <img src="../Public/icon/home.png"> Trang khách hàng
      </a>
    </nav>
    <div class="sidebar-user">
      <div class="sidebar-avatar">${acc.name[0]}</div>
      <div>
        <div class="sidebar-user-name">${acc.name}</div>
        <div class="sidebar-user-role">${acc.roleLabel}</div>
      </div>
      <button class="sidebar-logout" onclick="AdminAuth.logout()" title="Đăng xuất">
        <img src="../Public/icon/cross.png">
      </button>
    </div>`;
}

/* ── Clock ── */
function startClock() {
  const el = document.getElementById('admin-time');
  if (!el) return;
  const update = () => {
    el.textContent = new Date().toLocaleString('vi-VN', {
      weekday:'short', day:'2-digit', month:'2-digit',
      year:'numeric', hour:'2-digit', minute:'2-digit', second:'2-digit'
    });
  };
  update(); setInterval(update, 1000);
}

/* ── Định dạng ── */
function formatCurrency(n) {
  return new Intl.NumberFormat('vi-VN', { style:'currency', currency:'VND' }).format(n||0);
}
function formatDate(str) {
  if (!str) return '—';
  return new Date(str).toLocaleDateString('vi-VN', { day:'2-digit', month:'2-digit', year:'numeric' });
}
function formatDateTime(str) {
  if (!str) return '—';
  return new Date(str).toLocaleString('vi-VN', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' });
}
function todayStr()    { return new Date().toISOString().split('T')[0]; }
function tomorrowStr() { const d=new Date(); d.setDate(d.getDate()+1); return d.toISOString().split('T')[0]; }

/* ── Badge ── */
function statusBadge(status) {
  const map = {
    confirmed:        ['badge-confirmed',  'Đã xác nhận'],
    checked_in:       ['badge-checkin',    'Đang lưu trú'],
    cleaning:         ['badge-inspecting', 'Đang dọn phòng'],
    checkout_pending: ['badge-noshow',     'Chờ thu tiền phát sinh'],
    checked_out:      ['badge-checkout',   'Đã trả phòng'],
    cancelled:        ['badge-cancelled',  'Đã hủy'],
    no_show:          ['badge-noshow',     'No-show'],
  };
  const [cls, label] = map[status] || ['badge-pending', status];
  return `<span class="badge ${cls}">${label}</span>`;
}
function roomStatusBadge(status) {
  const map = {
    empty:       ['badge-empty',       'Trống'],
    occupied:    ['badge-occupied',    'Đang sử dụng'],
    cleaning:    ['badge-inspecting',  'Đang dọn'],
    dirty:       ['badge-dirty',       'Cần dọn thêm'],
    maintenance: ['badge-maintenance', 'Bảo trì'],
  };
  const [cls, label] = map[status] || ['badge-pending', status];
  return `<span class="badge ${cls}">${label}</span>`;
}

/* ── Nhân viên kiểm tra phòng (random) ── */
const INSPECTORS = ['Nguyễn Thị Hoa', 'Trần Văn Khoa', 'Lê Thị Thu', 'Phạm Minh Đức', 'Hoàng Thị Lan'];
function randomInspector() { return INSPECTORS[Math.floor(INSPECTORS.length * 0.5)]; }
// dùng hash từ roomNumber để luôn assign cùng người cho cùng phòng trong ca
function assignInspector(roomNumber) {
  const idx = (parseInt(roomNumber) || 0) % INSPECTORS.length;
  return INSPECTORS[idx];
}

/* ── Danh sách đồ kiểm tra và giá ── */
const INSPECTION_ITEMS = [
  { id:'tv',        name:'TV & Remote',               price:2000000,  category:'Điện tử' },
  { id:'ac',        name:'Điều hòa',                  price:5000000,  category:'Điện tử' },
  { id:'fridge',    name:'Tủ lạnh / Minibar',         price:3000000,  category:'Điện tử' },
  { id:'phone',     name:'Điện thoại phòng',           price:800000,   category:'Điện tử' },
  { id:'hairdryer', name:'Máy sấy tóc',               price:600000,   category:'Điện tử' },
  { id:'lamp',      name:'Đèn ngủ / Đèn bàn',         price:500000,   category:'Nội thất' },
  { id:'mirror',    name:'Gương',                     price:800000,   category:'Nội thất' },
  { id:'chair',     name:'Bàn ghế (trầy xước/vỡ)',    price:1000000,  category:'Nội thất' },
  { id:'mattress',  name:'Nệm (vết bẩn / rách)',      price:2000000,  category:'Vải' },
  { id:'towel',     name:'Khăn tắm (mất/hỏng)',       price:150000,   category:'Vải' },
  { id:'robe',      name:'Áo choàng tắm (mất/hỏng)', price:300000,   category:'Vải' },
  { id:'minibar',   name:'Minibar chưa khai báo',     price:0,        category:'Minibar' },
];

/* ── Lưu kết quả kiểm tra phòng ── */
function saveInspection(bookingId, data) {
  const key = 'ksan_inspection_' + bookingId;
  localStorage.setItem(key, JSON.stringify({ ...data, savedAt: new Date().toISOString() }));
}
function getInspection(bookingId) {
  try { return JSON.parse(localStorage.getItem('ksan_inspection_' + bookingId)); } catch { return null; }
}

/* ── Step 1: Khởi động trả phòng → giao nhân viên dọn ── */
function initiateCheckout(bookingId) {
  const bks = KSAN.getBookings();
  const idx = bks.findIndex(b => b.id === bookingId);
  if (idx < 0) return null;
  const b = bks[idx];
  const cleaner = assignInspector(b.assignedRoomNumber || '1');
  bks[idx] = {
    ...b,
    status:           'cleaning',
    cleaningStarted:  new Date().toISOString(),
    assignedCleaner:  cleaner,
  };
  KSAN.saveBookings(bks);
  if (b.assignedRoomNumber) setRoomStatus_byNumber(b.assignedRoomNumber, 'cleaning');
  return bks[idx];
}

/* ── Step 2: Nhân viên hoàn thành kiểm tra → booking chờ thu tiền ── */
function completeInspection(bookingId, damageItems) {
  const bks = KSAN.getBookings();
  const idx = bks.findIndex(b => b.id === bookingId);
  if (idx < 0) return false;
  const b = bks[idx];
  bks[idx] = {
    ...b,
    status:              'checkout_pending',
    inspectionCompleted: new Date().toISOString(),
    inspectionDamages:   damageItems,
  };
  KSAN.saveBookings(bks);
  // Phòng chuyển sang "Đang dọn" thực tế (physical cleaning)
  if (b.assignedRoomNumber) setRoomStatus_byNumber(b.assignedRoomNumber, 'dirty');
  return true;
}

/* ── Step 3: Thu tiền phát sinh + hoàn tất check-out ── */
function finalizeCheckout(bookingId, paymentMethod) {
  const bks = KSAN.getBookings();
  const idx = bks.findIndex(b => b.id === bookingId);
  if (idx < 0) return { ok: false, msg: 'Không tìm thấy đặt phòng.' };
  const b = bks[idx];
  if (b.status !== 'checkout_pending')
    return { ok: false, msg: 'Phòng chưa hoàn thành kiểm tra.' };

  bks[idx] = {
    ...b,
    status:             'checked_out',
    actualCheckOut:     new Date().toISOString(),
    finalPaymentMethod: paymentMethod,
    checkoutBy:         AdminAuth.current()?.name || 'System',
  };
  KSAN.saveBookings(bks);
  // KHÔNG tự động về Trống ở đây
  // Nhân viên buồng phòng nhấn "Dọn xong" mới chuyển về Trống
  return { ok: true, booking: bks[idx] };
}

/* ── Room status trong localStorage ── */
function getRoomStatus_byNumber(roomNumber) {
  const stored = JSON.parse(localStorage.getItem('ksan_room_status') || '{}');
  // Check if any checked_in booking is assigned this room
  const bookings = KSAN.getBookings();
  const active = bookings.find(b => b.status === 'checked_in' && b.assignedRoomNumber === roomNumber);
  if (active) return { status: 'occupied', booking: active };
  return { status: stored[roomNumber] || 'empty', booking: null };
}
function setRoomStatus_byNumber(roomNumber, status) {
  const stored = JSON.parse(localStorage.getItem('ksan_room_status') || '{}');
  stored[roomNumber] = status;
  localStorage.setItem('ksan_room_status', JSON.stringify(stored));
}

/* ── Danh sách phòng theo loại ── */
const ROOM_INVENTORY = [
  { number:'101', typeId:'R001', floor:1 }, { number:'102', typeId:'R001', floor:1 },
  { number:'103', typeId:'R002', floor:1 },
  { number:'201', typeId:'R001', floor:2 }, { number:'202', typeId:'R002', floor:2 },
  { number:'203', typeId:'R002', floor:2 }, { number:'204', typeId:'R004', floor:2 },
  { number:'301', typeId:'R002', floor:3 }, { number:'302', typeId:'R002', floor:3 },
  { number:'303', typeId:'R004', floor:3 }, { number:'304', typeId:'R004', floor:3 },
  { number:'401', typeId:'R003', floor:4 }, { number:'402', typeId:'R003', floor:4 },
  { number:'403', typeId:'R001', floor:4 }, { number:'404', typeId:'R001', floor:4 },
  { number:'501', typeId:'R001', floor:5 }, { number:'502', typeId:'R002', floor:5 },
];

function getAvailableRoomNumbers(typeId, checkIn, checkOut) {
  const ofType  = ROOM_INVENTORY.filter(r => r.typeId === typeId);
  const checkin = bookings => bookings.find(b =>
    b.status === 'checked_in' && b.assignedRoomNumber === ofType.find(r => r.number === b.assignedRoomNumber)?.number
  );
  const activeBookings = KSAN.getBookings().filter(b =>
    b.status === 'checked_in' && new Date(b.checkOut) >= new Date(checkIn)
  );
  const occupiedNumbers = activeBookings.map(b => b.assignedRoomNumber).filter(Boolean);
  const storedStatus = JSON.parse(localStorage.getItem('ksan_room_status') || '{}');
  return ofType.filter(r => {
    if (occupiedNumbers.includes(r.number)) return false;
    if (storedStatus[r.number] === 'maintenance') return false;
    return true;
  });
}

/* ── Check-in ── */
function performCheckIn(bookingId, cccd, actualGuests, notes, assignedRoomNumber) {
  const bookings = KSAN.getBookings();
  const idx = bookings.findIndex(b => b.id === bookingId);
  if (idx < 0) return { ok: false, msg: 'Không tìm thấy đặt phòng.' };
  const b = bookings[idx];
  if (b.status !== 'confirmed') return { ok: false, msg: 'Đặt phòng không ở trạng thái chờ nhận phòng.' };

  bookings[idx] = {
    ...b, status: 'checked_in',
    actualCheckIn: new Date().toISOString(),
    actualGuests:  actualGuests || b.guests,
    guestCCCD:     cccd || b.guestCCCD || '',
    checkinNotes:  notes || '',
    assignedRoomNumber: assignedRoomNumber || null,
    checkinBy: AdminAuth.current()?.name || 'System'
  };
  KSAN.saveBookings(bookings);

  // Cập nhật trạng thái phòng cụ thể
  if (assignedRoomNumber) {
    setRoomStatus_byNumber(assignedRoomNumber, 'occupied');
  }
  return { ok: true, booking: bookings[idx] };
}

/* ── Check-out ── */
function performCheckOut(bookingId, extraCharges) {
  const bookings = KSAN.getBookings();
  const idx = bookings.findIndex(b => b.id === bookingId);
  if (idx < 0) return { ok: false, msg: 'Không tìm thấy đặt phòng.' };
  const b = bookings[idx];
  if (!['checked_in','inspecting'].includes(b.status))
    return { ok: false, msg: 'Khách chưa check-in hoặc đang trong quá trình kiểm tra.' };

  const actualOut   = new Date();
  const scheduledOut= new Date(b.checkOut + 'T12:00:00');
  const diffH = (actualOut - scheduledOut) / 36e5;
  let lateCharge = 0;
  if (diffH > 6)     lateCharge = Math.round(b.totalPrice / b.nights);
  else if (diffH > 3) lateCharge = Math.round(b.totalPrice / b.nights * 0.5);
  else if (diffH > 1) lateCharge = Math.round(b.totalPrice / b.nights * 0.3);

  bookings[idx] = {
    ...b, status: 'checked_out',
    actualCheckOut: actualOut.toISOString(),
    lateCharge, extraCharges: extraCharges || [],
    checkoutBy: AdminAuth.current()?.name || 'System'
  };
  KSAN.saveBookings(bookings);

  // Phòng → Cần dọn
  if (b.assignedRoomNumber) {
    setRoomStatus_byNumber(b.assignedRoomNumber, 'dirty');
  }
  return { ok: true, booking: bookings[idx], lateCharge };
}

/* ── Tính hoàn tiền khi hủy ── */
function calcCancelRefund(booking) {
  const now   = new Date();
  const cin   = new Date(booking.checkIn);
  const diffH = (cin - now) / 36e5;
  let penaltyPct = 0;
  if (diffH < 0)  penaltyPct = 100;
  else if (diffH < 24) penaltyPct = 100;
  else if (diffH < 48) penaltyPct = 30;
  const penalty = Math.round(booking.deposit * penaltyPct / 100);
  const refund  = booking.deposit - penalty;
  return { penaltyPct, penalty, refund };
}

/* ── Lấy dịch vụ của booking (gồm cả từ app khách hàng) ── */
function getBookingServices(bookingId) {
  return KSAN.getServiceOrders().filter(o =>
    o.bookingId === bookingId && o.status !== 'cancelled'
  );
}
