/* ============================================================
   The Forest — Global UI helpers
   ============================================================ */

/* Phát hiện depth giống footer.js */
const _BASE = (location.pathname.includes('/pages/') || location.pathname.includes('/admin/')) ? '../' : '';

/* ── Toast ─────────────────────────────────────────────── */
function showToast(msg, type = 'info', duration = 3500) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const iconSrc = {
    success: _BASE+'Public/icon/success.png',
    error:   _BASE+'Public/icon/crisis.png',
    warning: _BASE+'Public/icon/crisis.png',
    info:    _BASE+'Public/icon/info.png'
  };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <img src="${iconSrc[type] || iconSrc.info}" style="width:18px;height:18px;object-fit:contain;flex-shrink:0">
    <span class="toast-msg">${msg}</span>
    <button class="toast-close" onclick="this.parentElement.remove()">×</button>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'fadeOut .3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/* ── Modal helpers ─────────────────────────────────────── */
function openModal(id)  {
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

/* ── Tabs ───────────────────────────────────────────────── */
function initTabs(containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  const tabBtns = container.querySelectorAll('.tab-btn');

  // Lấy danh sách tất cả pane ID từ các tab buttons (panes là siblings, không nằm trong container)
  const paneIds = [...tabBtns].map(b => b.dataset.tab).filter(Boolean);

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Ẩn/reset tất cả buttons
      tabBtns.forEach(b => b.classList.remove('active'));
      // Ẩn tất cả panes bằng getElementById (đúng, vì panes ở ngoài container)
      paneIds.forEach(id => {
        const p = document.getElementById(id);
        if (p) p.classList.remove('active');
      });
      // Hiện tab + pane được chọn
      btn.classList.add('active');
      const pane = document.getElementById(btn.dataset.tab);
      if (pane) pane.classList.add('active');
    });
  });
}

/* ── Auth header UI ─────────────────────────────────────── */
function renderAuthHeader() {
  const user = KSAN.getCurrentUser();
  const actionsEl = document.getElementById('header-actions');
  if (!actionsEl) return;

  /* Icon hạng thành viên — dùng ảnh thật */
  const tierIconMap = {
    Silver:   _BASE+'Public/icon/silver-badge.png',
    Gold:     _BASE+'Public/icon/gold.png',
    Platinum: _BASE+'Public/icon/platinum.png',
  };
  const tierImgSrc = tierIconMap[user?.tier] || tierIconMap.Silver;

  if (user) {
    const unread = getUnreadCount(user.id);
    actionsEl.innerHTML = `
      <!-- Chuông thông báo -->
      <div style="position:relative" id="notif-wrapper">
        <button id="notif-btn" onclick="toggleNotifPanel()" title="Thông báo"
          style="background:rgba(255,255,255,.12);border:1.5px solid rgba(255,255,255,.25);
            border-radius:50%;width:38px;height:38px;cursor:pointer;display:flex;
            align-items:center;justify-content:center;transition:all .2s;position:relative">
          <img src="${_BASE}Public/icon/notification.png" style="width:18px;height:18px;filter:invert(1);opacity:.9">
          ${unread > 0 ? `<span style="position:absolute;top:-4px;right:-4px;background:#ef4444;
            color:#fff;font-size:.6rem;font-weight:700;width:17px;height:17px;border-radius:50%;
            display:flex;align-items:center;justify-content:center;border:2px solid var(--secondary)"
            id="notif-count">${unread > 9 ? '9+' : unread}</span>` : ''}
        </button>
        <!-- Panel thông báo -->
        <div id="notif-panel" style="display:none;position:absolute;right:-60px;top:calc(100% + 10px);
          background:#fff;border-radius:14px;box-shadow:0 8px 40px rgba(0,0,0,.18);
          width:340px;max-height:460px;overflow:hidden;z-index:300;border:1px solid var(--border)">
          <div id="notif-panel-content"></div>
        </div>
      </div>
      <!-- Hạng thành viên: nhấn để xem ưu đãi -->
      <span class="badge badge-gold" id="tier-badge-btn"
        style="display:inline-flex;align-items:center;gap:5px;cursor:pointer;
          transition:all .2s;user-select:none"
        onclick="openModal('tier-modal')"
        title="Xem ưu đãi thành viên">
        <img src="${tierImgSrc}" style="height:15px;vertical-align:middle">
        ${user.tier}
        <span style="font-size:.65rem;opacity:.6;margin-left:1px">▾</span>
      </span>
      <div style="position:relative">
        <button class="btn btn-outline btn-sm" id="user-menu-btn" style="display:inline-flex;align-items:center;gap:7px">
          ${user.name.split(' ').pop()}
        </button>
        <div id="user-dropdown" style="display:none;position:absolute;right:0;top:calc(100% + 8px);
          background:#fff;border:1.5px solid var(--border);border-radius:10px;
          box-shadow:var(--shadow-md);min-width:190px;z-index:200;overflow:hidden;">
          <a href="account.html" style="display:block;padding:11px 16px;
            font-size:.88rem;color:var(--text);border-bottom:1px solid var(--border);text-decoration:none">
            Tài khoản của tôi
          </a>
          <a href="my-booking.html" style="display:block;padding:11px 16px;
            font-size:.88rem;color:var(--text);border-bottom:1px solid var(--border);text-decoration:none">
            Đặt phòng của tôi
          </a>
          <button onclick="doLogout()" style="display:block;width:100%;
            text-align:left;padding:11px 16px;font-size:.88rem;color:var(--danger);background:none;border:none;cursor:pointer">
            Đăng xuất
          </button>
        </div>
      </div>`;

    document.getElementById('user-menu-btn').addEventListener('click', e => {
      e.stopPropagation();
      const dd = document.getElementById('user-dropdown');
      dd.style.display = dd.style.display === 'none' ? 'block' : 'none';
    });
    document.addEventListener('click', () => {
      const dd = document.getElementById('user-dropdown');
      if (dd) dd.style.display = 'none';
    });
  } else {
    actionsEl.innerHTML = `
      <button onclick="openModal('login-modal')" style="
        padding:8px 20px; border-radius:24px; font-size:.85rem; font-weight:600; cursor:pointer;
        background:transparent; color:#fff; border:2px solid rgba(255,255,255,.7);
        transition:all .2s;">
        Đăng nhập
      </button>
      <button onclick="openModal('register-modal')" style="
        padding:8px 20px; border-radius:24px; font-size:.85rem; font-weight:700; cursor:pointer;
        background:var(--primary-pale); color:var(--secondary); border:2px solid var(--primary-pale);
        transition:all .2s;">
        Đăng ký
      </button>`;
  }
}

function doLogout() {
  KSAN.logout();
  showToast('Đã đăng xuất thành công.', 'info');
  setTimeout(() => location.reload(), 800);
}

/* ── Auth modals markup ─────────────────────────────────── */
function injectAuthModals() {
  const html = `
  <!-- Login Modal -->
  <div class="modal-overlay" id="login-modal">
    <div class="modal" style="max-width:420px">
      <div class="modal-header">
        <h3>Đăng nhập</h3>
        <button class="modal-close" onclick="closeModal('login-modal')">×</button>
      </div>
      <div class="modal-body">
        <div id="login-alert"></div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" class="form-control" id="login-email" placeholder="your@email.com">
        </div>
        <div class="form-group">
          <label>Mật khẩu</label>
          <input type="password" class="form-control" id="login-pw" placeholder="••••••••">
        </div>
        <button class="btn btn-primary btn-full mt-16" id="login-btn">Đăng nhập</button>
        <p class="text-center mt-16" style="font-size:.85rem">
          Chưa có tài khoản?
          <a href="#" onclick="closeModal('login-modal');openModal('register-modal')">Đăng ký ngay</a>
        </p>
      </div>
    </div>
  </div>

  <!-- Register Modal -->
  <div class="modal-overlay" id="register-modal">
    <div class="modal" style="max-width:480px">
      <div class="modal-header">
        <h3>Tạo tài khoản</h3>
        <button class="modal-close" onclick="closeModal('register-modal')">×</button>
      </div>
      <div class="modal-body">
        <div id="register-alert"></div>
        <div class="form-row">
          <div class="form-group">
            <label>Họ và tên *</label>
            <input type="text" class="form-control" id="reg-name" placeholder="Nguyễn Văn A">
          </div>
          <div class="form-group">
            <label>Số điện thoại *</label>
            <input type="tel" class="form-control" id="reg-phone" placeholder="0901234567">
          </div>
        </div>
        <div class="form-group">
          <label>Email *</label>
          <input type="email" class="form-control" id="reg-email" placeholder="your@email.com">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Mật khẩu *</label>
            <input type="password" class="form-control" id="reg-pw" placeholder="Tối thiểu 6 ký tự">
          </div>
          <div class="form-group">
            <label>Ngày sinh</label>
            <input type="date" class="form-control" id="reg-dob">
          </div>
        </div>
        <button class="btn btn-primary btn-full mt-8" id="register-btn">Tạo tài khoản</button>
        <p class="text-center mt-16" style="font-size:.85rem">
          Đã có tài khoản?
          <a href="#" onclick="closeModal('register-modal');openModal('login-modal')">Đăng nhập</a>
        </p>
      </div>
    </div>
  </div>`;

  document.body.insertAdjacentHTML('beforeend', html);
  /* Inject Tier Modal */
  injectTierModal();

  /* Login handler */
  document.getElementById('login-btn').addEventListener('click', () => {
    const email = document.getElementById('login-email').value.trim();
    const pw    = document.getElementById('login-pw').value;
    const alert = document.getElementById('login-alert');
    if (!email || !pw) { alert.innerHTML = '<div class="alert alert-warning">Vui lòng điền đầy đủ thông tin.</div>'; return; }
    const res = KSAN.loginCustomer(email, pw);
    if (!res.ok) { alert.innerHTML = `<div class="alert alert-danger">${res.msg}</div>`; return; }
    showToast(`Chào mừng trở lại, ${res.customer.name}! 👋`, 'success');
    closeModal('login-modal');
    setTimeout(() => location.reload(), 600);
  });

  /* Register handler */
  document.getElementById('register-btn').addEventListener('click', () => {
    const name  = document.getElementById('reg-name').value.trim();
    const phone = document.getElementById('reg-phone').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const pw    = document.getElementById('reg-pw').value;
    const dob   = document.getElementById('reg-dob').value;
    const alert = document.getElementById('register-alert');

    if (!name || !phone || !email || !pw) {
      alert.innerHTML = '<div class="alert alert-warning">Vui lòng điền đầy đủ các trường bắt buộc.</div>'; return;
    }
    if (pw.length < 6) {
      alert.innerHTML = '<div class="alert alert-warning">Mật khẩu tối thiểu 6 ký tự.</div>'; return;
    }
    const res = KSAN.registerCustomer({ name, phone, email, password: pw, dob });
    if (!res.ok) { alert.innerHTML = `<div class="alert alert-danger">${res.msg}</div>`; return; }
    KSAN._set('current_user', res.customer.id);
    showToast('Đăng ký thành công! Chào mừng đến The Forest.', 'success');
    closeModal('register-modal');
    setTimeout(() => location.reload(), 700);
  });
}

/* ── Mobile nav toggle ─────────────────────────────────── */
function initMobileNav() {
  const toggle = document.getElementById('mobile-toggle');
  const nav    = document.getElementById('main-nav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => nav.classList.toggle('open'));
}

/* ── Active nav link ────────────────────────────────────── */
function setActiveNav() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) a.classList.add('active');
  });
}

/* ── Copy to clipboard ──────────────────────────────────── */
function copyText(text, btn) {
  navigator.clipboard.writeText(text).then(() => {
    const orig = btn.textContent;
    btn.textContent = 'Đã copy!';
    setTimeout(() => btn.textContent = orig, 1500);
  });
}

/* ── Date helpers ───────────────────────────────────────── */
function todayStr()     { return KSAN.formatDateInput(new Date()); }
function tomorrowStr()  { const d = new Date(); d.setDate(d.getDate()+1); return KSAN.formatDateInput(d); }
function addDays(str, n){ const d = new Date(str); d.setDate(d.getDate()+n); return KSAN.formatDateInput(d); }

/* ── Tier Modal — xem hạng thành viên & ưu đãi ── */
function injectTierModal() {
  if (document.getElementById('tier-modal')) return; // tránh inject 2 lần

  const TIERS = [
    {
      id: 'Silver', icon: _BASE+'Public/icon/silver-badge.png', color: '#78716c',
      bg: '#f5f5f4', points: '0 – 199',
      perks: [
        'Ưu tiên đặt phòng online 24/7',
        'Check-in nhanh tại quầy lễ tân',
        'Tích 10 điểm / 100,000đ chi tiêu',
        'Nhận voucher chào mừng',
      ]
    },
    {
      id: 'Gold', icon: _BASE+'Public/icon/gold.png', color: '#d97706',
      bg: '#fffbeb', points: '200 – 499',
      perks: [
        'Giảm 10% toàn bộ tiền phòng',
        'Late check-out đến 14:00 miễn phí',
        'Tất cả ưu đãi Silver',
        'Quà tặng sinh nhật đặc biệt',
        'Ưu tiên nâng hạng phòng khi còn chỗ',
      ]
    },
    {
      id: 'Platinum', icon: _BASE+'Public/icon/platinum.png', color: '#1B4332',
      bg: '#f0fdf4', points: '500+',
      perks: [
        'Giảm 20% toàn bộ dịch vụ & phòng',
        'Nâng hạng phòng tự động khi còn chỗ',
        'Dịch vụ butler cá nhân',
        'Tất cả ưu đãi Gold',
        'Early check-in từ 10:00',
        'Lounge access & minibar miễn phí',
        'Đưa đón sân bay 1 chiều miễn phí/tháng',
      ]
    }
  ];

  const modalHTML = `
  <div class="modal-overlay" id="tier-modal">
    <div class="modal" style="max-width:580px">
      <div class="modal-header" style="background:var(--secondary)">
        <h3 style="color:var(--primary-pale);font-size:1rem;margin:0">
          Chương trình thành viên The Forest
        </h3>
        <button class="modal-close" onclick="closeModal('tier-modal')" style="color:rgba(255,255,255,.8)">×</button>
      </div>
      <div class="modal-body" style="padding:0" id="tier-modal-body">
        <div style="padding:16px 20px;background:var(--bg);text-align:center;color:var(--text-light);font-size:.82rem">
          Đăng nhập để xem hạng thành viên của bạn
        </div>
      </div>
      <div style="padding:14px 20px;border-top:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;background:#fafafa">
        <span style="font-size:.78rem;color:var(--text-light)">Tích điểm mỗi lần đặt phòng</span>
        <a href="account.html" style="font-size:.82rem;font-weight:600;color:var(--primary)">Xem tài khoản →</a>
      </div>
    </div>
  </div>`;

  document.body.insertAdjacentHTML('beforeend', modalHTML);

  /* Fill modal khi mở */
  document.getElementById('tier-modal').addEventListener('click', function(e) {
    if (e.target !== this) return;
    closeModal('tier-modal');
  });

  /* Re-render content mỗi lần modal mở */
  const origOpen = window.openModal;
  window.openModal = function(id) {
    if (id === 'tier-modal') renderTierModal();
    origOpen(id);
  };
}

function renderTierModal() {
  const user = KSAN.getCurrentUser();
  const body = document.getElementById('tier-modal-body');
  if (!body) return;

  const TIERS_DATA = [
    {
      id:'Silver', icon:_BASE+'Public/icon/silver-badge.png', color:'#78716c',
      bg:'#f5f5f4', border:'#d6d3d1', points:'0 – 199',
      perks:['Ưu tiên đặt phòng 24/7','Check-in nhanh','Tích 10 điểm / 100,000đ','Voucher chào mừng']
    },
    {
      id:'Gold', icon:_BASE+'Public/icon/gold.png', color:'#d97706',
      bg:'#fffbeb', border:'#fde68a', points:'200 – 499',
      perks:['Giảm 10% tiền phòng','Late check-out 14:00 miễn phí','Tất cả ưu đãi Silver','Quà tặng sinh nhật','Ưu tiên nâng hạng phòng']
    },
    {
      id:'Platinum', icon:_BASE+'Public/icon/platinum.png', color:'#1B4332',
      bg:'#f0fdf4', border:'#86efac', points:'500+',
      perks:['Giảm 20% toàn bộ dịch vụ','Nâng hạng phòng tự động','Dịch vụ butler cá nhân','Tất cả ưu đãi Gold','Early check-in 10:00','Lounge access & minibar','Đưa đón sân bay miễn phí']
    }
  ];

  if (!user) {
    body.innerHTML = `<div style="padding:32px 20px;text-align:center;color:var(--text-light)">
      Vui lòng <a href="#" onclick="closeModal('tier-modal');openModal('login-modal')">đăng nhập</a> để xem hạng thành viên.
    </div>`;
    return;
  }

  const pts      = user.points || 0;
  const curTier  = user.tier || 'Silver';
  const tierIdx  = TIERS_DATA.findIndex(t => t.id === curTier);
  const nextTier = TIERS_DATA[tierIdx + 1];
  const ptsToNext = nextTier
    ? (tierIdx === 0 ? 200 : 500) - pts
    : 0;
  const ptsNeeded = nextTier ? (tierIdx === 0 ? 200 : 500) : 500;
  const pct = nextTier ? Math.min(100, Math.round(pts / ptsNeeded * 100)) : 100;

  body.innerHTML = `
    <!-- Current status -->
    <div style="padding:18px 20px;background:var(--secondary);color:#fff;display:flex;align-items:center;gap:14px">
      <img src="${TIERS_DATA[tierIdx].icon}" style="height:44px">
      <div style="flex:1">
        <div style="font-size:.72rem;color:rgba(255,255,255,.6);letter-spacing:1px;text-transform:uppercase">Hạng của bạn</div>
        <div style="font-size:1.3rem;font-weight:700;font-family:Playfair Display,serif;color:var(--primary-pale)">${curTier}</div>
        <div style="font-size:.8rem;color:rgba(255,255,255,.7);margin-top:2px">
          ${pts} điểm tích lũy ${nextTier ? `· còn ${ptsToNext} điểm lên ${nextTier.id}` : '· Hạng cao nhất!'}
        </div>
      </div>
      <div style="text-align:right">
        <div style="font-size:1.6rem;font-weight:700;font-family:Playfair Display,serif;color:var(--primary-pale)">${pts}</div>
        <div style="font-size:.7rem;color:rgba(255,255,255,.5)">điểm</div>
      </div>
    </div>
    ${nextTier ? `
    <div style="padding:10px 20px;background:rgba(255,255,255,.05)">
      <div style="display:flex;justify-content:space-between;font-size:.72rem;color:rgba(255,255,255,.6);margin-bottom:5px;background:var(--secondary);padding:0 0 5px">
        <span style="color:rgba(255,255,255,.5)">${curTier}</span>
        <span style="color:rgba(255,255,255,.8);font-weight:600">${nextTier.id} (${ptsNeeded} điểm)</span>
      </div>
      <div style="height:6px;background:rgba(255,255,255,.15);border-radius:3px;overflow:hidden;margin:0 0 8px">
        <div style="height:100%;width:${pct}%;background:var(--primary-pale);border-radius:3px;transition:width .8s ease"></div>
      </div>
    </div>` : ''}

    <!-- Tier cards -->
    <div style="padding:16px 20px;display:flex;flex-direction:column;gap:10px">
      ${TIERS_DATA.map(t => {
        const isCurrent = t.id === curTier;
        return `
        <div style="border-radius:12px;overflow:hidden;border:2px solid ${isCurrent ? t.color : t.border};
          ${isCurrent ? `box-shadow:0 0 0 3px ${t.color}22` : ''}">
          <div style="background:${t.bg};padding:12px 14px;display:flex;align-items:center;gap:10px">
            <img src="${t.icon}" style="height:30px">
            <div style="flex:1">
              <div style="font-weight:700;font-size:.9rem;color:${t.color}">${t.id}</div>
              <div style="font-size:.72rem;color:#888">${t.points} điểm</div>
            </div>
            ${isCurrent ? `<span style="background:${t.color};color:#fff;font-size:.68rem;font-weight:700;
              padding:3px 10px;border-radius:20px">Hạng của bạn</span>` : ''}
          </div>
          <div style="padding:10px 14px 12px;background:#fff">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px">
              ${t.perks.map(p => `
                <div style="display:flex;align-items:flex-start;gap:5px;font-size:.78rem;color:#555;padding:2px 0">
                  <img src="${_BASE}Public/icon/check.png" style="height:11px;margin-top:2px;flex-shrink:0;filter:${isCurrent?'none':'grayscale(1) opacity(.4)'}">
                  <span style="${!isCurrent?'opacity:.55':''}">${p}</span>
                </div>`).join('')}
            </div>
          </div>
        </div>`;
      }).join('')}
    </div>`;
}

/* ════════════════════════════════
   NOTIFICATION SYSTEM
════════════════════════════════ */

const NOTIF_TYPES = {
  checkin:  { icon:_BASE+'Public/icon/calendar.png',  color:'#2563eb', label:'Check-in' },
  checkout: { icon:_BASE+'Public/icon/invoice.png',   color:'#7c3aed', label:'Check-out' },
  payment:  { icon:_BASE+'Public/icon/deposit.png',   color:'#d97706', label:'Thanh toán' },
  booking:  { icon:_BASE+'Public/icon/check.png',     color:'#16a34a', label:'Đặt phòng' },
  service:  { icon:_BASE+'Public/icon/spa.png',       color:'#0891b2', label:'Dịch vụ' },
  points:   { icon:_BASE+'Public/icon/gold.png',      color:'#ca8a04', label:'Điểm thưởng' },
  promo:    { icon:_BASE+'Public/icon/promo-code.png',color:'#dc2626', label:'Khuyến mãi' },
  info:     { icon:_BASE+'Public/icon/info.png',      color:'#6b7280', label:'Thông tin' },
};

/* Lấy thông báo đã lưu trong localStorage */
function getSavedNotifs(userId) {
  try { return JSON.parse(localStorage.getItem('ksan_notifs_' + userId) || '[]'); }
  catch { return []; }
}
function saveNotifs(userId, list) {
  localStorage.setItem('ksan_notifs_' + userId, JSON.stringify(list.slice(0, 50)));
}

/* Đếm chưa đọc */
function getUnreadCount(userId) {
  if (!userId) return 0;
  const all = buildNotifications(userId);
  return all.filter(n => !n.read).length;
}

/* Tạo thông báo tự động từ bookings */
function generateAutoNotifs(userId) {
  const user = KSAN.getCustomers().find(c => c.id === userId);
  if (!user) return [];
  const bookings = KSAN.getCustomerBookings(userId);
  const today    = new Date().toISOString().split('T')[0];
  const tomorrow = (() => { const d = new Date(); d.setDate(d.getDate()+1); return d.toISOString().split('T')[0]; })();
  const in2days  = (() => { const d = new Date(); d.setDate(d.getDate()+2); return d.toISOString().split('T')[0]; })();
  const notifs   = [];
  const fmt = (str) => KSAN.formatDate(str);

  bookings.forEach(b => {
    const room = KSAN.ROOMS.find(r => r.id === b.roomId);
    const rName = room?.name || b.roomName;
    const remaining = b.totalPrice - b.deposit;

    /* Check-in hôm nay */
    if (b.status === 'confirmed' && b.checkIn === today) {
      notifs.push({ id:`ci-today-${b.id}`, type:'checkin', urgent:true,
        title:'Hôm nay là ngày check-in!',
        message:`${rName} — Nhận phòng từ 14:00. Mang CCCD & mã booking <strong>${b.id}</strong>. Lễ tân đang chờ bạn!`,
        link:'my-booking.html', bookingId:b.id, time: today });
    }
    /* Check-in ngày mai */
    if (b.status === 'confirmed' && b.checkIn === tomorrow) {
      notifs.push({ id:`ci-tmr-${b.id}`, type:'checkin', urgent:false,
        title:'Nhắc nhở: Check-in ngày mai',
        message:`${rName} — Check-in lúc 14:00 ngày <strong>${fmt(b.checkIn)}</strong>. Đừng quên mang CCCD & mã booking.`,
        link:'my-booking.html', bookingId:b.id, time: today });
    }
    /* Check-in 2 ngày nữa */
    if (b.status === 'confirmed' && b.checkIn === in2days) {
      notifs.push({ id:`ci-2d-${b.id}`, type:'info', urgent:false,
        title:'Chuyến đi sắp đến',
        message:`${rName} — Còn 2 ngày nữa đến kỳ nghỉ của bạn tại The Forest! Check-in ngày ${fmt(b.checkIn)}.`,
        link:'my-booking.html', bookingId:b.id, time: today });
    }
    /* Check-out hôm nay */
    if (b.status === 'checked_in' && b.checkOut === today) {
      notifs.push({ id:`co-today-${b.id}`, type:'checkout', urgent:true,
        title:'Trả phòng hôm nay trước 12:00',
        message:`${rName} — Vui lòng trả phòng trước <strong>12:00 trưa</strong>. Liên hệ lễ tân nếu cần hỗ trợ hoặc gia hạn.`,
        link:'my-booking.html', bookingId:b.id, time: today });
    }
    /* Bill còn lại khi check-in */
    if (b.status === 'confirmed' && b.checkIn <= in2days && remaining > 0) {
      notifs.push({ id:`pay-${b.id}`, type:'payment', urgent:b.checkIn === today,
        title:'Thanh toán khi nhận phòng',
        message:`Còn <strong>${KSAN.formatCurrency(remaining)}</strong> cần thanh toán khi check-in ${rName} ngày ${fmt(b.checkIn)}.`,
        link:'my-booking.html', bookingId:b.id, time: today });
    }
    /* Dịch vụ đang chờ xử lý */
    const pendingSvcs = KSAN.getBookingServiceOrders(b.id).filter(o => o.status === 'pending');
    if (pendingSvcs.length > 0 && b.status === 'checked_in') {
      notifs.push({ id:`svc-${b.id}`, type:'service', urgent:false,
        title:`${pendingSvcs.length} dịch vụ đang xử lý`,
        message:`${pendingSvcs.map(s=>s.serviceName).join(', ')} — Nhân viên sẽ liên hệ xác nhận trong 30 phút.`,
        link:'my-booking.html', bookingId:b.id, time: today });
    }
  });

  /* Thông báo điểm thưởng */
  const pts = user.points || 0;
  const tier = user.tier || 'Silver';
  if (tier === 'Silver' && pts >= 150) {
    notifs.push({ id:'pts-close-gold', type:'points', urgent:false,
      title:'Sắp lên hạng Gold!',
      message:`Bạn đang có <strong>${pts} điểm</strong> — chỉ cần thêm ${200 - pts} điểm nữa là lên hạng Gold và nhận ưu đãi 10%!`,
      link:'account.html', time: today });
  }
  if (tier === 'Gold' && pts >= 420) {
    notifs.push({ id:'pts-close-plat', type:'points', urgent:false,
      title:'Sắp lên hạng Platinum!',
      message:`Bạn đang có <strong>${pts} điểm</strong> — còn ${500 - pts} điểm nữa là lên hạng Platinum đặc quyền!`,
      link:'account.html', time: today });
  }

  return notifs;
}

/* Merge auto + saved (từ admin push) */
function buildNotifications(userId) {
  const auto  = generateAutoNotifs(userId);
  const saved = getSavedNotifs(userId);
  /* Merge: auto notifs override saved nếu cùng id, giữ trạng thái read */
  const readMap = {};
  saved.forEach(n => { if (n.read) readMap[n.id] = true; });
  auto.forEach(n => { if (readMap[n.id]) n.read = true; });
  /* Thêm saved notifs không phải auto (do admin push) */
  const autoIds = new Set(auto.map(n => n.id));
  const manual = saved.filter(n => !autoIds.has(n.id) && !n.expired);
  return [...(auto.filter(n => n.urgent)), ...manual,
          ...(auto.filter(n => !n.urgent))].slice(0, 20);
}

function markRead(userId, notifId) {
  const saved = getSavedNotifs(userId);
  if (!saved.find(n => n.id === notifId)) saved.push({ id: notifId, read: true });
  else saved.find(n => n.id === notifId).read = true;
  saveNotifs(userId, saved);
}

function markAllRead(userId) {
  const all = buildNotifications(userId);
  const saved = getSavedNotifs(userId);
  all.forEach(n => {
    if (!saved.find(s => s.id === n.id)) saved.push({ id: n.id, read: true });
    else saved.find(s => s.id === n.id).read = true;
  });
  saveNotifs(userId, saved);
}

/* Toggle panel */
function toggleNotifPanel() {
  const panel = document.getElementById('notif-panel');
  if (!panel) return;
  const isOpen = panel.style.display !== 'none';
  if (isOpen) { panel.style.display = 'none'; return; }
  const user = KSAN.getCurrentUser();
  if (user) renderNotifPanel(user);
  panel.style.display = 'block';
}

/* Render panel nội dung */
function renderNotifPanel(user) {
  const panel = document.getElementById('notif-panel-content');
  if (!panel) return;
  const all = buildNotifications(user.id);
  const unread = all.filter(n => !n.read).length;

  panel.innerHTML = `
    <!-- Header -->
    <div style="padding:14px 16px 10px;display:flex;align-items:center;justify-content:space-between;
      border-bottom:1px solid var(--border)">
      <div>
        <div style="font-weight:700;font-size:.9rem;color:var(--secondary)">Thông báo</div>
        ${unread > 0 ? `<div style="font-size:.72rem;color:#ef4444">${unread} chưa đọc</div>` :
          '<div style="font-size:.72rem;color:var(--text-light)">Tất cả đã đọc</div>'}
      </div>
      ${unread > 0 ? `<button onclick="markAllReadAndRefresh()" style="font-size:.75rem;color:var(--primary);
        background:none;border:none;cursor:pointer;font-weight:600">Đọc tất cả</button>` : ''}
    </div>
    <!-- List -->
    <div style="max-height:360px;overflow-y:auto">
      ${all.length === 0 ? `
        <div style="padding:32px 16px;text-align:center;color:var(--text-light)">
          <img src="${_BASE}Public/icon/info.png" style="height:28px;opacity:.3;display:block;margin:0 auto 10px">
          Không có thông báo nào
        </div>` :
        all.map(n => {
          const t = NOTIF_TYPES[n.type] || NOTIF_TYPES.info;
          const timeAgo = n.time === new Date().toISOString().split('T')[0] ? 'Hôm nay' : KSAN.formatDate(n.time);
          return `
          <div onclick="handleNotifClick('${n.id}','${n.link||'my-booking.html'}','${user.id}')"
            style="display:flex;gap:11px;padding:12px 14px;cursor:pointer;transition:background .15s;
              border-bottom:1px solid var(--border);${!n.read?'background:#f8fffe':''}"
            onmouseover="this.style.background='#f3f9f3'" onmouseout="this.style.background='${!n.read?'#f8fffe':''}'">
            <div style="width:36px;height:36px;border-radius:50%;background:${t.color}18;
              display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px">
              <img src="${t.icon}" style="width:18px;height:18px;object-fit:contain">
            </div>
            <div style="flex:1;min-width:0">
              <div style="display:flex;align-items:center;gap:6px;margin-bottom:2px">
                ${n.urgent ? '<span style="background:#ef4444;color:#fff;font-size:.6rem;font-weight:700;padding:1px 6px;border-radius:10px">Khẩn</span>' : ''}
                <div style="font-weight:${!n.read?'700':'600'};font-size:.83rem;color:var(--secondary);
                  white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${n.title}</div>
              </div>
              <div style="font-size:.76rem;color:var(--text-light);line-height:1.5" class="notif-msg">${n.message}</div>
              <div style="font-size:.7rem;color:#9ca3af;margin-top:3px">${timeAgo}</div>
            </div>
            ${!n.read ? '<div style="width:8px;height:8px;border-radius:50%;background:#3b82f6;flex-shrink:0;margin-top:6px"></div>' : ''}
          </div>`;
        }).join('')
      }
    </div>
    <!-- Footer -->
    <div style="padding:10px 14px;border-top:1px solid var(--border);text-align:center">
      <a href="my-booking.html" style="font-size:.8rem;color:var(--primary);font-weight:600">
        Xem tất cả đặt phòng →
      </a>
    </div>`;

  /* Allow HTML in message */
  panel.querySelectorAll('.notif-msg').forEach((el, i) => {
    el.innerHTML = all[i]?.message || '';
  });
}

function handleNotifClick(notifId, link, userId) {
  markRead(userId, notifId);
  document.getElementById('notif-panel').style.display = 'none';
  if (link && link !== location.pathname.split('/').pop()) {
    location.href = link;
  } else {
    /* Refresh badge */
    updateNotifBadge(userId);
  }
}

function markAllReadAndRefresh() {
  const user = KSAN.getCurrentUser();
  if (!user) return;
  markAllRead(user.id);
  renderNotifPanel(user);
  updateNotifBadge(user.id);
}

function updateNotifBadge(userId) {
  const count  = getUnreadCount(userId);
  const badge  = document.getElementById('notif-count');
  const btn    = document.getElementById('notif-btn');
  if (!btn) return;
  if (badge) {
    if (count > 0) { badge.textContent = count > 9 ? '9+' : count; badge.style.display = 'flex'; }
    else badge.style.display = 'none';
  } else if (count > 0) {
    const span = document.createElement('span');
    span.id = 'notif-count';
    span.style.cssText = 'position:absolute;top:-4px;right:-4px;background:#ef4444;color:#fff;font-size:.6rem;font-weight:700;width:17px;height:17px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid var(--secondary)';
    span.textContent = count > 9 ? '9+' : count;
    btn.appendChild(span);
  }
}

/* Đóng panel khi click ra ngoài */
document.addEventListener('click', e => {
  const wrapper = document.getElementById('notif-wrapper');
  if (wrapper && !wrapper.contains(e.target)) {
    const panel = document.getElementById('notif-panel');
    if (panel) panel.style.display = 'none';
  }
});

/* ── Scroll reveal (Intersection Observer) ── */
function initScrollAnimations() {
  // Auto-tag các elements phổ biến
  const selectors = [
    '.section-header', '.card', '.amenity-card',
    '.testimonial-card', '.room-card', '.svc-card',
    '.service-hero-card', '.gallery-item',
    '.amenity-img-card', '.hero-stat', '.divider-gold',
    '.promo-banner .container > *',
    '.loyalty-card', '.stat-card',
    '.booking-card', '.order-item',
  ];
  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      if (!el.dataset.animate && !el.closest('[data-animate]')) {
        el.dataset.animate = 'fade-up';
        if (i > 0 && i < 6) el.dataset.delay = String(i * 100);
      }
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('[data-animate], .divider-gold').forEach(el => observer.observe(el));
}

/* ── Counter animation for hero stats ── */
function initCounters() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting || entry.target.dataset.counted) return;
      entry.target.dataset.counted = '1';
      const original = entry.target.textContent.trim();
      const num = parseFloat(original.replace(/[^0-9.]/g, ''));
      const suffix = original.replace(/[0-9.]/g, '');
      if (isNaN(num) || num === 0) return;
      const duration = 1400;
      const start = performance.now();
      const update = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = num % 1 !== 0
          ? (eased * num).toFixed(1)
          : Math.floor(eased * num);
        entry.target.textContent = val + suffix;
        if (p < 1) requestAnimationFrame(update);
      };
      requestAnimationFrame(update);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('.hero-stat-num').forEach(el => observer.observe(el));
}

/* ── Header shadow on scroll ── */
function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ── Button ripple ── */
function initRipple() {
  document.addEventListener('click', e => {
    const btn = e.target.closest('.btn');
    if (!btn || btn.disabled) return;
    const r = document.createElement('span');
    r.className = 'btn-ripple';
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    r.style.cssText = `width:${size}px;height:${size}px;` +
      `left:${e.clientX - rect.left - size/2}px;` +
      `top:${e.clientY - rect.top - size/2}px`;
    btn.appendChild(r);
    r.addEventListener('animationend', () => r.remove());
  });
}

/* ── Subtle parallax on hero ── */
function initParallax() {
  const bg = document.querySelector('.hero-bg');
  if (!bg) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y < window.innerHeight * 1.5) {
          bg.style.transform = `translateY(${y * 0.22}px) scale(1.05)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ── Init on DOM ready ──────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  injectAuthModals();
  renderAuthHeader();
  initMobileNav();
  setActiveNav();
  initScrollAnimations();
  initHeaderScroll();
  initRipple();
  initParallax();
  initCounters();
});



