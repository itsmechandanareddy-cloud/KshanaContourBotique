# Kshana Contour Boutique - Product Requirements Document

## Original Problem Statement
Build a website for Kshana Contour Boutique with customer portal and admin portal including partnership management.

## Architecture
- **Backend**: FastAPI + MongoDB
- **Frontend**: React + TailwindCSS + Shadcn UI
- **Storage**: Emergent Object Storage

## What's Been Implemented
- [x] Public landing page, gallery, services, contact
- [x] Admin & Customer JWT authentication
- [x] Order CRUD with measurements, billing, payments, delete with reason
- [x] Per-item reference image uploads + neck design references
- [x] Invoice/print generation
- [x] WhatsApp messaging on status change
- [x] Employee management (Master/Tailor/Worker types)
- [x] Employee work assignment, delete, documents
- [x] Gallery with file upload
- [x] Materials tracking
- [x] Reports: Net summary (Income/Outgoing/Profit)
- [x] Reports: Financial cards with view details
- [x] Reports: Clickable status cards (Pending/WIP/Ready/Due Soon)
- [x] Partnership: Chandana & Akanksha investment tracking
- [x] Partnership: Kshana Account (income/SBI outgoing)
- [x] Partnership: Profit split calculation (investments returned first, then 50/50)
- [x] Partnership: Monthly breakdown table
- [x] Partnership: View Details for each partner + Kshana account
- [x] 70+ partnership entries seeded from real data

## Test Credentials
- **Admin**: Phone: 9876543210, Password: admin123
- **Customer**: Phone: 9876543211, DOB: 1990-05-15
