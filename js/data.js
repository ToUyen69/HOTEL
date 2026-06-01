/* ============================================================
   KSAN Hotel — Data Layer (localStorage)
   ============================================================ */

const KSAN = {

  /* ── Static seed data ─────────────────────────────── */
  ROOMS: [
    {
      id: 'R001', type: 'Standard', name: 'Phòng Standard',
      image: 'Public/room1.jpg', size: 25, capacity: 2,
      price: 800000, totalRooms: 5,
      shortDesc: 'Không gian ấm cúng, đầy đủ tiện nghi cơ bản cho kỳ nghỉ thoải mái.',
      description: 'Phòng Standard mang đến không gian nghỉ ngơi tiện nghi với đầy đủ thiết bị hiện đại. Phù hợp cho cặp đôi hoặc du khách đi một mình muốn trải nghiệm dịch vụ chất lượng với chi phí hợp lý.',
      amenities: ['WiFi miễn phí', 'TV LCD 40"', 'Điều hòa', 'Minibar', 'Phòng tắm riêng', 'Máy sấy tóc', 'Két an toàn'],
      beds: '1 giường đôi hoặc 2 giường đơn', view: 'View thành phố'
    },
    {
      id: 'R002', type: 'Deluxe', name: 'Phòng Deluxe',
      image: 'Public/room2.jpg', size: 35, capacity: 2,
      price: 1200000, totalRooms: 4,
      shortDesc: 'Nội thất sang trọng với tầm nhìn đẹp, nâng tầm trải nghiệm nghỉ dưỡng.',
      description: 'Phòng Deluxe được thiết kế tinh tế với nội thất cao cấp, mang lại không gian nghỉ ngơi thư giãn tuyệt vời. Tầm nhìn ra thành phố hoặc khu vườn tạo nên bầu không khí yên bình.',
      amenities: ['WiFi miễn phí', 'TV LCD 4K 50"', 'Điều hòa', 'Minibar đầy đủ', 'Bồn tắm', 'Phòng tắm đứng', 'Máy sấy tóc', 'Két an toàn', 'Ban công'],
      beds: '1 giường King size', view: 'View thành phố / View vườn'
    },
    {
      id: 'R003', type: 'Suite', name: 'Phòng Suite',
      image: 'Public/room3.jpg', size: 55, capacity: 4,
      price: 2500000, totalRooms: 2,
      shortDesc: 'Đỉnh cao sang trọng với phòng khách riêng và dịch vụ butler cá nhân.',
      description: 'Suite là lựa chọn hoàn hảo cho những ai tìm kiếm sự xa hoa và đẳng cấp. Với phòng khách riêng biệt, bồn tắm Jacuzzi và dịch vụ butler 24/7, đây là trải nghiệm nghỉ dưỡng không thể quên.',
      amenities: ['WiFi tốc độ cao', 'TV OLED 65"', 'Điều hòa cao cấp', 'Minibar premium', 'Bồn tắm Jacuzzi', 'Phòng tắm đứng riêng', 'Phòng khách riêng', 'Dịch vụ butler 24/7', 'Két an toàn lớn', 'Ban công rộng', 'Bàn làm việc', 'Dịch vụ đưa đón sân bay'],
      beds: '1 giường Super King', view: 'Toàn cảnh thành phố'
    },
    {
      id: 'R004', type: 'Family', name: 'Phòng Family',
      image: 'Public/room4.jpg', size: 45, capacity: 4,
      price: 1800000, totalRooms: 3,
      shortDesc: 'Không gian rộng rãi, lý tưởng cho gia đình với trẻ nhỏ.',
      description: 'Phòng Family được thiết kế đặc biệt cho các gia đình, với không gian rộng rãi và các tiện nghi dành riêng cho trẻ em. Hai phòng ngủ liên thông đảm bảo sự riêng tư tối đa cho mọi thành viên.',
      amenities: ['WiFi miễn phí', '2 TV LCD 40"', 'Điều hòa', 'Minibar', 'Phòng tắm đôi', 'Khu vui chơi trẻ em', 'Giường phụ miễn phí', 'Két an toàn', 'Ghế ăn cho bé'],
      beds: '1 giường đôi + 2 giường đơn', view: 'View vườn / View hồ bơi'
    }
  ],

  PROMOTIONS: [
    { code: 'SUMMER25',  discount: 25,     type: 'percent', description: 'Giảm 25% mùa hè',             exclusive: false, minNights: 2 },
    { code: 'WELCOME10', discount: 10,     type: 'percent', description: 'Chào mừng thành viên mới',    exclusive: false, minNights: 1 },
    { code: 'VIP500K',   discount: 500000, type: 'fixed',   description: 'Ưu đãi thành viên VIP',       exclusive: true,  minNights: 3 },
    { code: 'KSAN20',    discount: 20,     type: 'percent', description: 'Ưu đãi đặc biệt 20%',         exclusive: false, minNights: 1 }
  ],

  SERVICES: [
    { id: 'SPA',     name: 'Spa & Làm đẹp',    icon: '💆',  price: 350000,  unit: '/lần',   image: 'Public/spa.jpg'       },
    { id: 'POOL',    name: 'Hồ bơi',           icon: '🏊',  price: 0,       unit: 'miễn phí',image: 'Public/hồ bơi.jpg'   },
    { id: 'YOGA',    name: 'Yoga & Thể dục',   icon: '🧘',  price: 150000,  unit: '/buổi',  image: 'Public/yoga.jpg'      },
    { id: 'SAUNA',   name: 'Xông hơi',         icon: '♨️',  price: 200000,  unit: '/lần',   image: 'Public/xông hơi.jpg'  },
    { id: 'CAFE',    name: 'Nhà hàng & Cafe',  icon: '☕',  price: 0,       unit: 'phục vụ',image: 'Public/cafe.jpg'      },
    { id: 'TRANSFER',name: 'Đưa đón sân bay',  icon: '🚗',  price: 250000,  unit: '/chiều', image: 'Public/xe đưa đón.png'}
  ],

  CANCEL_POLICY: {
    freeHoursBefore: 48,
    tiers: [
      { label: 'Trên 48h',    penalty: 0 },
      { label: '24–48h',      penalty: 30 },
      { label: '< 24h',       penalty: 100 }
    ]
  },

  /* ── Storage helpers ─────────────────────────────── */
  _get(key)       { try { return JSON.parse(localStorage.getItem('ksan_'+key)) } catch { return null } },
  _set(key, val)  { localStorage.setItem('ksan_'+key, JSON.stringify(val)) },

  /* ── Customer API ────────────────────────────────── */
  getCustomers()              { return this._get('customers') || [] },
  saveCustomers(list)         { this._set('customers', list) },

  findCustomer(email)         { return this.getCustomers().find(c => c.email === email.toLowerCase()) },

  registerCustomer(data) {
    const customers = this.getCustomers();
    if (customers.find(c => c.email === data.email.toLowerCase()))
      return { ok: false, msg: 'Email đã được đăng ký.' };
    const customer = {
      id:        'C' + Date.now(),
      name:      data.name.trim(),
      email:     data.email.toLowerCase().trim(),
      phone:     data.phone.trim(),
      dob:       data.dob || '',
      password:  data.password,
      createdAt: new Date().toISOString(),
      tier:      'Silver',
      points:    0,
      totalSpend:0
    };
    customers.push(customer);
    this.saveCustomers(customers);
    return { ok: true, customer };
  },

  loginCustomer(email, password) {
    const c = this.findCustomer(email);
    if (!c) return { ok: false, msg: 'Email không tồn tại.' };
    if (c.password !== password) return { ok: false, msg: 'Mật khẩu không đúng.' };
    this._set('current_user', c.id);
    return { ok: true, customer: c };
  },

  logout()              { localStorage.removeItem('ksan_current_user') },
  getCurrentUser() {
    const id = this._get('current_user');
    if (!id) return null;
    return this.getCustomers().find(c => c.id === id) || null;
  },

  updateCustomer(id, updates) {
    const customers = this.getCustomers();
    const idx = customers.findIndex(c => c.id === id);
    if (idx < 0) return;
    customers[idx] = { ...customers[idx], ...updates };
    this.saveCustomers(customers);
    return customers[idx];
  },

  addPoints(customerId, amount) {
    const points = Math.floor(amount / 100000);  // 1 điểm / 100k
    const customer = this.getCustomers().find(c => c.id === customerId);
    if (!customer) return;
    const newPoints = (customer.points || 0) + points;
    const newSpend  = (customer.totalSpend || 0) + amount;
    let tier = 'Silver';
    if (newPoints >= 500) tier = 'Platinum';
    else if (newPoints >= 200) tier = 'Gold';
    this.updateCustomer(customerId, { points: newPoints, totalSpend: newSpend, tier });
  },

  /* ── Booking API ─────────────────────────────────── */
  getBookings()         { return this._get('bookings') || [] },
  saveBookings(list)    { this._set('bookings', list) },

  getBookingById(id)    { return this.getBookings().find(b => b.id === id) },
  getCustomerBookings(cid) {
    return this.getBookings()
      .filter(b => b.customerId === cid)
      .sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  createBooking(data) {
    const bookings = this.getBookings();
    const booking = {
      id:           'BK' + Date.now(),
      customerId:   data.customerId,
      guestName:    data.guestName,
      guestEmail:   data.guestEmail,
      guestPhone:   data.guestPhone,
      guestCCCD:    data.guestCCCD || '',
      roomId:       data.roomId,
      roomName:     data.roomName,
      roomImage:    data.roomImage,
      checkIn:      data.checkIn,
      checkOut:     data.checkOut,
      nights:       data.nights,
      guests:       data.guests,
      specialReq:   data.specialReq || '',
      basePrice:    data.basePrice,
      discount:     data.discount || 0,
      promoCode:    data.promoCode || '',
      totalPrice:   data.totalPrice,
      deposit:      data.deposit,
      status:       'confirmed',
      paymentMethod:data.paymentMethod || 'online',
      services:     [],
      createdAt:    new Date().toISOString()
    };
    bookings.push(booking);
    this.saveBookings(bookings);
    return booking;
  },

  cancelBooking(id) {
    const bookings = this.getBookings();
    const idx = bookings.findIndex(b => b.id === id);
    if (idx < 0) return { ok: false, msg: 'Không tìm thấy đặt phòng.' };
    const b = bookings[idx];
    if (['cancelled','checked_out','no_show'].includes(b.status))
      return { ok: false, msg: 'Đặt phòng này không thể hủy.' };

    const now = new Date();
    const checkin = new Date(b.checkIn);
    const diffH   = (checkin - now) / 36e5;

    let penaltyPct = 0;
    if (diffH < 0)   penaltyPct = 100;
    else if (diffH < 24)  penaltyPct = 100;
    else if (diffH < 48)  penaltyPct = 30;

    const penalty  = Math.round(b.deposit * penaltyPct / 100);
    const refund   = b.deposit - penalty;

    bookings[idx] = { ...b, status: 'cancelled', cancelledAt: new Date().toISOString(), penaltyPct, penalty, refund };
    this.saveBookings(bookings);
    return { ok: true, refund, penalty, penaltyPct };
  },

  /* ── Promo API ───────────────────────────────────── */
  validatePromo(code, nights) {
    const p = this.PROMOTIONS.find(x => x.code === code.toUpperCase());
    if (!p) return { ok: false, msg: 'Mã khuyến mãi không hợp lệ.' };
    if (nights < p.minNights)
      return { ok: false, msg: `Mã này yêu cầu tối thiểu ${p.minNights} đêm.` };
    return { ok: true, promo: p };
  },

  /* ── Room availability ───────────────────────────── */
  getAvailableRooms(checkIn, checkOut, guests) {
    const bookings = this.getBookings().filter(b => b.status === 'confirmed' || b.status === 'checked_in');
    return this.ROOMS.filter(room => {
      if (room.capacity < guests) return false;
      const occupied = bookings.filter(b => {
        if (b.roomId !== room.id) return false;
        const bIn  = new Date(b.checkIn);
        const bOut = new Date(b.checkOut);
        const rIn  = new Date(checkIn);
        const rOut = new Date(checkOut);
        return rIn < bOut && rOut > bIn;
      }).length;
      return occupied < room.totalRooms;
    });
  },

  /* ── Feedback API ────────────────────────────────── */
  getFeedbacks()      { return this._get('feedbacks') || [] },
  saveFeedback(data)  {
    const list = this.getFeedbacks();
    list.push({ id: 'FB' + Date.now(), ...data, createdAt: new Date().toISOString() });
    this._set('feedbacks', list);
  },

  /* ── Utils ───────────────────────────────────────── */
  formatCurrency(n) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);
  },

  formatDate(str) {
    if (!str) return '';
    const d = new Date(str);
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  },

  formatDateInput(d) {
    // returns YYYY-MM-DD for input[type=date]
    const dt = new Date(d);
    return dt.toISOString().split('T')[0];
  },

  nightsBetween(checkIn, checkOut) {
    const d = (new Date(checkOut) - new Date(checkIn)) / 864e5;
    return Math.max(1, Math.round(d));
  },

  calcTotal(room, nights, promo) {
    const base = room.price * nights;
    let disc = 0;
    if (promo) {
      disc = promo.type === 'percent'
        ? Math.round(base * promo.discount / 100)
        : Math.min(promo.discount, base);
    }
    const total   = base - disc;
    const deposit = Math.round(total * 0.3);   // 30% deposit
    return { base, disc, total, deposit };
  },

  statusLabel(s) {
    const map = {
      confirmed:   { label: 'Đã xác nhận', cls: 'badge-green' },
      checked_in:  { label: 'Đang lưu trú', cls: 'badge-blue' },
      checked_out: { label: 'Đã trả phòng', cls: 'badge-gray' },
      cancelled:   { label: 'Đã hủy',       cls: 'badge-red' },
      no_show:     { label: 'No-show',       cls: 'badge-orange' }
    };
    return map[s] || { label: s, cls: 'badge-gray' };
  },

  tierIcon(tier) {
    return tier === 'Platinum' ? '💎' : tier === 'Gold' ? '🥇' : '🥈';
  },

  /* ── Service Orders API ─────────────────────────────── */
  getServiceOrders()       { return this._get('service_orders') || [] },
  saveServiceOrders(list)  { this._set('service_orders', list) },

  getBookingServiceOrders(bookingId) {
    return this.getServiceOrders().filter(o => o.bookingId === bookingId);
  },
  getCustomerServiceOrders(customerId) {
    return this.getServiceOrders()
      .filter(o => o.customerId === customerId)
      .sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  createServiceOrder(data) {
    const orders = this.getServiceOrders();
    const order = {
      id:          'SV' + Date.now(),
      bookingId:   data.bookingId || '',
      customerId:  data.customerId || 'guest',
      guestName:   data.guestName,
      guestPhone:  data.guestPhone,
      guestEmail:  data.guestEmail,
      serviceId:   data.serviceId,
      serviceName: data.serviceName,
      serviceIcon: data.serviceIcon,
      date:        data.date,
      time:        data.time,
      quantity:    data.quantity || 1,
      unitPrice:   data.unitPrice,
      totalPrice:  data.unitPrice * (data.quantity || 1),
      notes:       data.notes || '',
      status:      'pending',
      createdAt:   new Date().toISOString()
    };
    orders.push(order);
    this.saveServiceOrders(orders);
    return order;
  },

  cancelServiceOrder(id) {
    const orders = this.getServiceOrders();
    const idx = orders.findIndex(o => o.id === id);
    if (idx < 0) return false;
    orders[idx].status = 'cancelled';
    orders[idx].cancelledAt = new Date().toISOString();
    this.saveServiceOrders(orders);
    return true;
  },

  serviceOrderStatusLabel(s) {
    const map = {
      pending:   { label: 'Chờ xử lý',   cls: 'badge-orange' },
      confirmed: { label: 'Đã xác nhận', cls: 'badge-green'  },
      done:      { label: 'Hoàn thành',  cls: 'badge-blue'   },
      cancelled: { label: 'Đã hủy',      cls: 'badge-red'    }
    };
    return map[s] || { label: s, cls: 'badge-gray' };
  }
};
