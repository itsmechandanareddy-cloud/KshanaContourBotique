# Kshana Contour Boutique - Product Requirements Document

## Original Problem Statement
Build a website for Kshana Contour Boutique with customer portal (login, order tracking, gallery) and admin portal (dashboard, orders, employees, materials, reports).

## Architecture
- **Backend**: FastAPI + MongoDB
- **Frontend**: React + TailwindCSS + Shadcn UI
- **Storage**: Emergent Object Storage (documents, gallery, order images)

## What's Been Implemented
- [x] Public landing page with custom logo, gallery, services, contact
- [x] Admin & Customer JWT authentication
- [x] Order CRUD with items, measurements (order-level), billing, payments
- [x] Order delete with reason (archived for records)
- [x] Per-item reference image uploads (front/back neck + general)
- [x] Invoice/print generation (items + billing only)
- [x] WhatsApp messaging on status change
- [x] Employee management: 3 types (Master/Tailor/Worker)
- [x] Master = weekly pay (no hours tracking required)
- [x] Employee work assignment linked to orders/items
- [x] Employee delete, payment, hours, documents
- [x] Gallery with file upload via object storage
- [x] Materials tracking
- [x] Reports: Financial summary (orders, pending, employee pay, material costs)
- [x] Reports: Clickable status cards (Pending, WIP, Ready, Due Soon) with detail modals
- [x] Customer portal with order detail + measurements view

## Test Credentials
- **Admin**: Phone: 9876543210, Password: admin123
- **Customer**: Phone: 9876543211, DOB: 1990-05-15
