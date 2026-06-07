/* ============================================================
   The Forest — Standard Footer (inject vào tất cả trang khách hàng)
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const footer = document.querySelector('footer.footer');
  if (!footer) return;
  footer.id = 'contact';

  /* Phát hiện depth (cho pages ở root vs sub-folder) */
  const inAdmin = location.pathname.includes('/admin/');
  const inPages = location.pathname.includes('/pages/');
  const base    = (inAdmin || inPages) ? '../' : '';

  footer.innerHTML = `
    <!-- Google Maps -->
    <div class="footer-map">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3900.8!2d108.4449!3d11.9401!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31757a5a0e20b6f3%3A0xd5da4832e6a8cd8d!2zxJDDoCBM4bqhdA!5e0!3m2!1svi!2svn!4v1700000000000"
        width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy"
        referrerpolicy="no-referrer-when-downgrade">
      </iframe>
    </div>

    <!-- Footer main -->
    <div class="footer-top">
      <div class="container">
        <div style="display:grid;grid-template-columns:2fr 1fr 1fr 1.3fr;gap:36px;flex-wrap:wrap">

          <!-- Col 1: Brand -->
          <div>
            <img src="${base}Public/logo KS.png" alt="The Forest" style="height:52px;margin-bottom:14px">
            <p style="font-size:.84rem;line-height:1.9;color:rgba(255,255,255,.7);margin-bottom:16px">
              The Forest — Khu nghỉ dưỡng núi rừng Đà Lạt. Nơi bạn chữa lành, hòa mình vào thiên nhiên và tìm lại bình yên.
            </p>
            <div class="social-links">
              <a href="#" class="social-link" title="Facebook">
                <img src="${base}Public/icon/facebook.png" style="width:15px;filter:invert(1);opacity:.8">
              </a>
              <a href="#" class="social-link" title="Instagram">
                <img src="${base}Public/icon/instagram.png" style="width:15px;filter:invert(1);opacity:.8">
              </a>
              <a href="#" class="social-link" title="YouTube">
                <img src="${base}Public/icon/youtube.png" style="width:15px;filter:invert(1);opacity:.8">
              </a>
              <a href="#" class="social-link" title="LinkedIn">
                <img src="${base}Public/icon/linkedin.png" style="width:15px;filter:invert(1);opacity:.8">
              </a>
            </div>
          </div>

          <!-- Col 2: Khám phá -->
          <div>
            <h4>Khám phá</h4>
            <ul class="footer-links">
              <li><a href="${base}index.html">Trang chủ</a></li>
              <li><a href="${base}rooms.html">Các loại phòng</a></li>
              <li><a href="${base}services.html">Dịch vụ & Tiện ích</a></li>
              <li><a href="${base}about.html">Về chúng tôi</a></li>
              <li><a href="${base}travel-guide.html">Cẩm nang du lịch</a></li>
            </ul>
          </div>

          <!-- Col 3: Hỗ trợ -->
          <div>
            <h4>Hỗ trợ</h4>
            <ul class="footer-links">
              <li><a href="${base}my-booking.html">Đặt phòng của tôi</a></li>
              <li><a href="${base}feedback.html">Gửi phản hồi</a></li>
              <li><a href="${base}account.html">Tài khoản & Điểm thưởng</a></li>
              <li><a href="#">Chính sách hủy phòng</a></li>
              <li><a href="#">Câu hỏi thường gặp</a></li>
            </ul>
          </div>

          <!-- Col 4: Liên hệ + Newsletter -->
          <div>
            <h4>Liên hệ</h4>
            <div class="footer-contact-item">
              <span class="footer-contact-icon">
                <img src="${base}Public/icon/placeholder.png" style="height:14px;filter:invert(1);opacity:.75">
              </span>
              <span>Km 4 Đường Trần Hưng Đạo, Đà Lạt, Lâm Đồng</span>
            </div>
            <div class="footer-contact-item">
              <span class="footer-contact-icon">
                <img src="${base}Public/icon/call.png" style="height:14px;filter:invert(1);opacity:.75">
              </span>
              <span>(0263) 3822 888</span>
            </div>
            <div class="footer-contact-item">
              <span class="footer-contact-icon">
                <img src="${base}Public/icon/info.png" style="height:14px;filter:invert(1);opacity:.75">
              </span>
              <span>hello@theforest.vn</span>
            </div>
            <div class="footer-contact-item">
              <span class="footer-contact-icon">
                <img src="${base}Public/icon/24-hours-support.png" style="height:14px;filter:invert(1);opacity:.75">
              </span>
              <span>Lễ tân phục vụ 24/7</span>
            </div>

            <div style="margin-top:18px">
              <h4 style="margin-bottom:8px">Đăng ký nhận tin</h4>
              <p style="font-size:.78rem;color:rgba(255,255,255,.6);margin-bottom:10px">
                Nhận ưu đãi độc quyền và tin tức mới nhất.
              </p>
              <div class="footer-newsletter">
                <input type="email" id="footer-email" placeholder="Email của bạn...">
                <button onclick="
                  const v=document.getElementById('footer-email').value;
                  if(v&&v.includes('@')){showToast('Đã đăng ký nhận tin!','success');document.getElementById('footer-email').value='';}
                  else showToast('Vui lòng nhập email hợp lệ.','warning');">
                  Đăng ký
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- Footer bottom -->
    <div class="footer-bottom">
      <div class="container" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
        <span>© 2025 The Forest. Khu nghỉ dưỡng thiên nhiên Đà Lạt.</span>
        <div style="display:flex;gap:20px;font-size:.78rem">
          <a href="#" style="color:rgba(255,255,255,.5)">Chính sách bảo mật</a>
          <a href="#" style="color:rgba(255,255,255,.5)">Điều khoản sử dụng</a>
          <a href="${base}admin/index.html" style="color:rgba(255,255,255,.3)">Admin — The Forest</a>
        </div>
      </div>
    </div>
  `;
});


