/* ============================================================
   KSAN Hotel — Global UI helpers
   ============================================================ */

/* ── Toast ─────────────────────────────────────────────── */
function showToast(msg, type = 'info', duration = 3500) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || icons.info}</span>
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

  if (user) {
    actionsEl.innerHTML = `
      <span class="badge badge-gold">${KSAN.tierIcon(user.tier)} ${user.tier}</span>
      <div style="position:relative">
        <button class="btn btn-outline btn-sm" id="user-menu-btn">
          👤 ${user.name.split(' ').pop()}
        </button>
        <div id="user-dropdown" style="display:none;position:absolute;right:0;top:calc(100%+8px);
          background:#fff;border:1.5px solid var(--border);border-radius:10px;
          box-shadow:var(--shadow-md);min-width:180px;z-index:200;overflow:hidden;">
          <a href="account.html" style="display:block;padding:10px 16px;font-size:.85rem;color:var(--text);border-bottom:1px solid var(--border)">
            👤 Tài khoản của tôi
          </a>
          <a href="my-booking.html" style="display:block;padding:10px 16px;font-size:.85rem;color:var(--text);border-bottom:1px solid var(--border)">
            📋 Đặt phòng của tôi
          </a>
          <button onclick="doLogout()" style="display:block;width:100%;text-align:left;
            padding:10px 16px;font-size:.85rem;color:var(--danger);background:none;border:none;cursor:pointer">
            🚪 Đăng xuất
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
      <button class="btn btn-outline btn-sm" onclick="openModal('login-modal')">Đăng nhập</button>
      <button class="btn btn-primary btn-sm" onclick="openModal('register-modal')">Đăng ký</button>`;
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
    showToast('Đăng ký thành công! Chào mừng bạn đến với KSAN.', 'success');
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

/* ── Init on DOM ready ──────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  injectAuthModals();
  renderAuthHeader();
  initMobileNav();
  setActiveNav();
});
