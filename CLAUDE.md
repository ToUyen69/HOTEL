# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

KSAN is a static hotel booking and management demo for "The Forest" resort in Da Lat, Vietnam. No build process, no backend, no framework — pure HTML/CSS/JS with `localStorage` as the sole data store.

## Running the Project

Open `index.html` directly in a browser. No server required (all data is client-side localStorage). For development with live reload, use any static server:

```
npx serve .
# or
python -m http.server 8080
```

There are no build, lint, or test commands.

## Architecture

### Data Layer — `js/data.js`

The global `KSAN` object is the single API for all data operations. It owns:

- **Static data**: `KSAN.ROOMS[]`, `KSAN.SERVICES[]`, `KSAN.PROMOTIONS[]`, `KSAN.CANCEL_POLICY` — hardcoded, not fetched
- **Customer operations**: `registerCustomer`, `loginCustomer`, `getCurrentUser`, `updateCustomer`, `addPoints`
- **Booking operations**: `createBooking`, `getBookingById`, `getCustomerBookings`, `cancelBooking`, `getAvailableRooms`
- **Service orders**: `createServiceOrder`, `getCustomerServiceOrders`, `cancelServiceOrder`
- **Pricing**: `validatePromo`, `calcTotal`
- **Feedback**: `saveFeedback`, `replyFeedback`
- **Storage abstraction**: `_get(key)` / `_set(key, val)` wrapping localStorage; all keys prefixed with `ksan_`

### UI Layer — `js/main.js`

Shared helpers used across all pages:

- Toast notifications: `showToast(msg, type, duration)`
- Modal system: `openModal(id)` / `closeModal(id)`
- Auth header rendering: `renderAuthHeader()`, `injectAuthModals()`, `doLogout()`
- Date/currency utilities: `todayStr()`, `tomorrowStr()`, `KSAN.formatDate()`, `KSAN.formatCurrency()`
- Notification panel: `toggleNotifPanel()`, `renderNotifPanel()`

Footer is injected into every page by `js/footer.js`.

### localStorage Schema

```
ksan_customers        → [{ id, name, email, phone, dob, password, tier, points, totalSpend }]
ksan_bookings         → [{ id, customerId, roomId, checkIn, checkOut, nights, totalPrice, deposit, status }]
ksan_service_orders   → [{ id, bookingId, serviceId, date, time, quantity, totalPrice, status }]
ksan_feedback         → [{ id, bookingId, guestEmail, type, comment, adminReply, voucherCode }]
ksan_current_user     → "<customerId>"   (session)
ksan_custom_promos    → [{ code, discount, type, expiry, forEmail }]
ksan_notifs_<userId>  → [{ id, type, message, read }]
```

### Page Flow

```
index.html → rooms.html → booking.html → confirmation.html
                        → services.html
                        → my-booking.html → feedback.html
                        → account.html
```

URL parameters thread data between pages:
- Rooms → Booking: `?room=R001&checkin=2025-06-10&checkout=2025-06-12&guests=2`
- Confirmation: `?id=BK1234567890`

### Admin Section

`/admin/` contains a separate mini-app (dashboard, bookings, customers, rooms) with its own `admin/css/admin.css` and `admin/js/admin.js`. Admin pages are currently **not protected** by authentication — any visitor can access them.

## Design System

Defined in `css/style.css`:

- **Colors**: Forest green `#3E7B27`, dark navy `#123524`, accent gold `#85A947`
- **Typography**: Playfair Display (headings) + Inter (body)
- **Spacing**: 8px grid
- **Key component classes**: `.btn`, `.btn-primary`, `.btn-outline`, `.card`, `.modal`, `.toast`, `.tabs`, `.badge`, `.loyalty-*`, `.booking-*`

## Key Constraints

- **No real payments**: Payment step is UI-only; confirmation always succeeds.
- **No email sending**: Email confirmations are UI placeholders only.
- **Hardcoded rooms/services**: Adding a new room type or service requires editing `KSAN.ROOMS`/`KSAN.SERVICES` in `data.js`.
- **Promo codes**: Defined in `KSAN.PROMOTIONS` in `data.js` (`SUMMER25`, `WELCOME10`, `KSAN20`, `VIP500K`).
- **Loyalty tiers**: Silver (0 pts) → Gold (200 pts) → Platinum (500 pts); 10 pts per 100k VND spent.
- **Cancellation fees**: 0% (>7 days), 30% (2–7 days), 100% (<2 days before check-in).
