# Kshana Contour Boutique - PRD

## Architecture
- **Backend**: FastAPI + MongoDB | **Frontend**: React + TailwindCSS + Shadcn UI (native `<select>` for dropdowns) | **Storage**: Emergent Object Storage

## Implemented Features
- [x] Landing page, Gallery, Services, Contact (all links verified)
- [x] **Dynamic gallery carousel** — fetches from admin gallery, auto-rotates every 15 seconds, arrows + dots navigation
- [x] **Landing page testimonials** — dynamic review cards from API
- [x] Admin & Customer JWT auth
- [x] **Luxury Admin Dashboard** — dark hero header, 4 key metrics, urgent deliveries, order pipeline, recent orders, quick access grid (8 sections), reviews snapshot, team avatars, revenue charts
- [x] Order CRUD (items, measurements, billing, payments, delete with reason)
- [x] Invoice generation + Send Invoice via WhatsApp + Save & Generate Invoice
- [x] WhatsApp/SMS manual notify modal on status change
- [x] Employee management (Master/Tailor/Worker), work assignment, docs upload, delete
- [x] Employee pay types (Hourly/Weekly), auto-calculation from hours
- [x] Gallery with file upload + always-visible delete button (mobile-friendly)
- [x] Materials tracking with Edit/Delete
- [x] Reports: Net summary, financial cards, clickable status cards
- [x] Partnership page (Chandana/Akanksha investment CRUD, Kshana Account, profit split)
- [x] Order search/filter: search, status, date range, sort, result counts
- [x] Reviews management with rating distribution graph
- [x] Sequential order IDs (KSH-01, KSH-02, etc.)
- [x] All external links fixed (Instagram, Google Maps, WhatsApp, Email)

## Test Credentials
- **Admin**: Phone: 9187202605, Password: admin123
- **Customer**: Phone: 9876543211, DOB: 1990-05-15

## Upcoming Tasks
- P1: Bulk order import functionality
- P1: Ensure native `<select>` elements styled consistently with luxury aesthetic
- P2: Customer email notifications
