# MASTER_PLAN.md

# 🏗️ Dang Construction & Builders (Branch of Butwal Construction & Builders)
## Complete Website Master Plan & System Architecture Tree

> **Document Version:** 1.0.0  
> **Target Production Domains:** `dangconstruction.com.np` / `butwalconstruction.com.np`  
> **Brand Identity:** **Dang Construction & Builders** *(A Unit / Branch of Butwal Construction & Builders)*  
> **Regional Focus:** Dang (Ghorahi, Tulsipur, Lamahi) & Butwal (Rupandehi, Lumbini Province)  

---

## 📑 Table of Contents
1. [Site Map & Routing Tree](#1-site-map--routing-tree)
2. [Module & Feature Breakdown](#2-module--feature-breakdown)
   - [Public Marketing & Portfolio](#21-public-marketing--portfolio)
   - [Smart Engineering & Interactive Tools](#22-smart-engineering--interactive-tools)
   - [Portals & Authentication](#23-portals--authentication)
   - [Admin CMS & Management](#24-admin-cms--management)
3. [Database Schema (Firebase Firestore)](#3-database-schema-firebase-firestore)
4. [Branding & SEO Strategy](#4-branding--seo-strategy)
5. [Pre-Launch Checklist](#5-pre-launch-checklist)

---

## 1. Site Map & Routing Tree

```text
🌐 ROOT (/)
│
├── 🏠 PUBLIC MARKETING & PORTFOLIO
│   ├── /                          → Home (Hero, Trust Badges, 3D Elevation Preview, Featured Works)
│   ├── /about                     → Company Heritage, Mission, Leadership & Engineering Credentials
│   ├── /group-companies           → Subsidiary & Allied Companies Network
│   ├── /projects                  → Construction Portfolio (Filter by Residential, Commercial, Infrastructure)
│   ├── /designs                   → 3D House Design Gallery (Modern, Traditional, Box-type Renders)
│   ├── /blog                      → Construction & Engineering Insights
│   │   └── /blog/:id              → Blog Article Detail & Reader View
│   ├── /estimate                  → Quick Cost Estimation & Quote Request
│   ├── /contact                   → Contact Us (Dang & Butwal Offices, Interactive Map, Consultation Form)
│   ├── /testimonials              → Client Reviews & Video Testimonials
│   ├── /partnerships              → Material Suppliers & Engineering Partnerships
│   └── /under-construction        → 3D Construction Animation & Live Building Simulator
│
├── 🛠️ SMART CIVIL ENGINEERING & CLIENT TOOLS (/tools)
│   ├── /tools                     → Tools Hub & Directory
│   ├── /floor-planner             → Interactive 2D/3D Floor Planner (Draw rooms, add furniture, export)
│   ├── /tools/calculators         → Material Estimator (Bricks, Cement, Sand, Aggregates, TMT Steel)
│   ├── /tools/permits             → Municipality Naksa Pass & Permit Checklist Guide
│   ├── /tools/vastu               → Vastu Shastra Consultant (Room orientation & energy alignment)
│   ├── /tools/buy-or-build        → Buy vs. Build Financial Decision Matrix
│   ├── /tools/timeline            → Construction Milestone & Handover Forecaster
│   └── /tools/green-calculator    → Eco & Sustainable Building Energy Calculator
│
├── 🔐 AUTHENTICATION & CLIENT PORTALS
│   ├── /login                     → Unified Role-based Authentication (Client, Staff, Admin)
│   ├── /customer/dashboard        → Client Portal (Milestone tracking, payment receipts, CCTV feeds)
│   └── /staff/dashboard           → Field Engineer Portal (Daily site logs, task checklist, photos)
│
├── ⚙️ ADMIN CONTENT MANAGEMENT SYSTEM (CMS)
│   ├── /admin/setup               → Master CMS Dashboard
│   │   ├── 📁 Tab: Projects       → CRUD Construction Projects & Sync to Firestore
│   │   ├── 📁 Tab: Blog Articles  → Rich Article Editor, Markdown, Image Uploader, Publishing
│   │   ├── 📁 Tab: House Designs  → Elevation Uploads, Floor Details, Views Counter
│   │   ├── 📁 Tab: Global Setup   → Site Titles, Announcement Bar, Phone Numbers, Office Addresses
│   │   └── 📁 Tab: Key Metrics    → Dynamic Counter (Delivered Projects, Experience, Satisfied Clients)
│   └── /admin/users               → User Management & Role Permissions
│
├── 📜 LEGAL & UTILITY
│   ├── /privacy                   → Privacy Policy
│   ├── /terms                     → Terms of Service & Structural Warranty Guidelines
│   ├── /sitemap                   → Visual & Search-Engine Sitemap
│   └── /*                         → Custom 404 Error Page
│
└── 🤖 FLOATING & PERSISTENT SERVICES
    ├── AI Smart Assistant Chatbot (24/7 client instant answering)
    ├── Emergency Floating Action (Direct Dial: +977 9847890123 / WhatsApp)
    └── Top Announcement Banner (Configurable in Admin CMS)
```

---

## 2. Module & Feature Breakdown

### 2.1 Public Marketing & Portfolio
| Page Route | Purpose | Key Components |
| :--- | :--- | :--- |
| `/` | Primary conversion & brand introduction | Hero with dual branding, Interactive 3D Model preview, Quick Tools Cards, Testimonial Carousel, Trust Badges |
| `/about` | Build institutional credibility | 15+ years timeline, Er. Suresh Pokhrel & Ar. Anjali Thapa profiles, NBC-Code Seismic Compliance |
| `/projects` | Showcase completed & ongoing builds | Category tabs (Residential, Commercial, Institutional), Live Progress Bars, Detailed project modal with image gallery |
| `/designs` | House design catalog & inspiration | Style filters (Modern, Contemporary, Classical), bedroom & floor specs, dynamic view counters |
| `/blog` | Organic SEO & authority building | Category filtering, Kathmandu formatted date/time, full markdown reader, share options |
| `/contact` | Lead generation & physical locations | Dual branch contact details (Dang & Butwal), dynamic map embed, consultation booking form |

### 2.2 Smart Engineering & Interactive Tools
- **2D/3D Floor Planner (`/floor-planner`)**: Canvas-based architectural layout builder with wall drawing, door/window placement, and 3D preview.
- **Material Estimator (`/tools/calculators`)**: Exact quantity calculation for Cement (bags), Sand (cu.ft), Aggregates (cu.ft), Bricks (pcs), and TMT Steel (kg/ton) based on built-up area.
- **Vastu Shastra Consultant (`/tools/vastu`)**: Evaluates cardinal directions (NE, SE, SW, NW) for Pooja Room, Kitchen, Master Bedroom, and Main Entrance.
- **Municipality Permit Assistant (`/tools/permits`)**: Step-by-step checklist for building permit drawings, Setback guidelines, and FAR rules for Dang and Butwal sub-metropolises.

### 2.3 Portals & Authentication
- **Customer Dashboard (`/customer/dashboard`)**: Enables clients to view real-time photo logs from site engineers, track structural phase progress (Foundation → Plinth → Pillar Casting → Finishing), and download invoices.
- **Staff Dashboard (`/staff/dashboard`)**: Site engineers submit daily labor attendance, material deliveries, and progress photos directly from mobile devices.

### 2.4 Admin CMS & Management (`/admin/setup`)
- **Real-Time Data Persistence**: Zero-refresh updates using Firebase Firestore.
- **Manual Sample Data Restorer**: On-demand buttons to restore sample blogs or house designs without automatic re-seeding upon deletion.
- **Website Settings Control**: Live edit site contact numbers, hero titles, social links, and top announcement banner.

---

## 3. Database Schema (Firebase Firestore)

```typescript
// 1. blogPosts Collection
interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: "Construction Tips" | "Architecture & Design" | "Vastu Shastra" | "Material Guides";
  date: string;
  readTime: string;
  image: string;
  author: string;
  isPublished: boolean;
}

// 2. projects Collection
interface WebsiteProject {
  id: string;
  code: string;
  title: string;
  client: string;
  location: string;
  type: "Residential" | "Commercial" | "Interior" | "Renovation";
  status: "Completed" | "Ongoing" | "Planning";
  progress: number;
  area: string;
  floors: string;
  image: string;
  gallery?: string[];
  description: string;
  costEstimate?: string;
  completionDate?: string;
}

// 3. designs Collection
interface HouseDesign {
  id: string;
  title: string;
  description: string;
  floors: string;
  style: "Modern Box" | "Contemporary" | "Classical Nepali" | "Minimalist";
  bedrooms: number;
  bathrooms: number;
  plinthArea: string;
  images: string[];
  baseViews: number;
  currentViews?: number;
}

// 4. settings/global Document
interface WebsiteContentSettings {
  siteName: string;            // "Dang Construction & Builders"
  tagline: string;
  heroHeading: string;
  heroSubheading: string;
  contactPhone: string;        // "+977 9847890123 / +977 9857012345"
  contactEmail: string;        // "dang@butwalconstruction.com.np"
  contactAddress: string;      // "Ghorahi-15, Main Road, Dang | Head Office: Butwal"
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  projectsCompleted: number;
  ongoingProjects: number;
  happyClients: number;
  yearsExperience: number;
}
```

---

## 4. Branding & SEO Strategy

| Metric | Implementation Detail |
| :--- | :--- |
| **Primary SEO Target** | `Dang Construction & Builders`, `Construction Company in Dang`, `Builders in Ghorahi`, `Tulsipur House Design` |
| **Institutional Trust Tagline** | *A Branch & Unit of Butwal Construction & Builders* |
| **Search Engine Schema (JSON-LD)** | Structured `GeneralContractor` with `parentOrganization: Butwal Construction & Builders` embedded in `index.html` |
| **Social OpenGraph** | Dynamic OpenGraph previews for Facebook, Twitter/X, and WhatsApp sharing |

---

## 5. Pre-Launch Checklist

- [x] Dual-Brand hierarchy validated across Navbar, Hero, and Footer.
- [x] Fixed auto-reseeding bug so deleted blogs and projects stay deleted.
- [x] Added manual "Restore Sample Articles" and "Restore Sample Designs" buttons in CMS.
- [x] Real-time Firestore sync configured for Blog, Projects, Designs, and Global Settings.
- [x] Responsive layout tested for mobile devices, tablets, and desktops.
- [x] SEO meta tags and Google Schema JSON-LD updated for Dang & Butwal.
- [x] All engineering tools (Floor Planner, Estimator, Vastu Guide) fully functional.
