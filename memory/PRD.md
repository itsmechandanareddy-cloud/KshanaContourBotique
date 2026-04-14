# Kshana Contour Boutique - Product Requirements Document

## Original Problem Statement
Build a website for Kshana Contour Boutique with:
- Customer facing portal with login (phone + DOB), gallery, reviews, WhatsApp chat, order tracking
- Admin portal with dashboard, order management with measurements, billing, employees, materials, reports

## User Choices
- **Authentication**: JWT-based custom auth (phone + password for admin, phone + DOB for customers)
- **Payment**: Manual tracking (no gateway integration)
- **SMS**: Twilio (to be integrated when keys provided)
- **Gallery**: Real boutique images with admin upload capability

## Architecture
- **Backend**: FastAPI + MongoDB
- **Frontend**: React + TailwindCSS + Shadcn UI
- **Database**: MongoDB (kshana_boutique)
- **Storage**: Emergent Object Storage for employee documents

## User Personas
1. **Admin** - Boutique owner managing orders, employees, materials
2. **Customer** - Clients tracking their orders and measurements

## Core Requirements (Static)
- Customer login with phone + DOB
- Order management with detailed measurements (matching physical measurement chart)
- Service types: Bridal/Normal/Traditional blouses, Handwork, Saree work, etc.
- Billing with advance/balance tracking
- Employee management with payments, hours, and document uploads
- Raw materials tracking
- Reports dashboard with charts

## What's Been Implemented
- [x] Public landing page with logo, About, Gallery, Services, Contact
- [x] Login modal with Customer/Admin portal selection
- [x] Admin authentication (phone: 9876543210, password: admin123)
- [x] Admin Dashboard with stats, charts, due-soon warnings
- [x] Order creation with FULL measurement chart (15 body measurements + neckline + garment options)
- [x] Garment options: Padded, Princess Cut, Open (Front/Back)
- [x] Service dropdown with 17 service types + blouse type radio
- [x] Order status management (pending > in_progress > ready > delivered)
- [x] Payment tracking with multiple payments per order
- [x] Employee management with payments, hours logging, and DOCUMENT UPLOADS
- [x] Employee document upload/view/delete via Object Storage
- [x] Materials/Raw materials tracking
- [x] Gallery management (admin can add/delete images)
- [x] Reports page with monthly/weekly stats and bar/area charts
- [x] Customer portal with welcome page, order list, order details (shows all measurements)
- [x] WhatsApp floating button on all pages
- [x] Google Reviews link
- [x] Contact info with phone, email, maps, Instagram
- [x] Updated logo and about section image with user-provided branding assets

## Prioritized Backlog
### P0 (Critical)
- None remaining

### P1 (High)
- Twilio SMS integration (requires API keys from user)
- Admin Gallery Image Upload UI (connect to object storage)

### P2 (Medium)
- Order print/invoice generation
- Customer notifications on status change
- WhatsApp direct messaging integration

## Test Credentials
- **Admin**: Phone: 9876543210, Password: admin123
- **Customer**: Phone: 9876543211, DOB: 1990-05-15 (Vishala)
- **Customer**: Phone: 9999988888, DOB: 1995-01-01 (Test Measurement)

## Contact Info (Pre-configured)
- Email: kshanaconture@gmail.com
- WhatsApp: 9187202605, 9108253760
- Google Maps: https://maps.app.goo.gl/c7z46uTDaKbCNvNr9
- Instagram: https://www.instagram.com/kshana_contour
