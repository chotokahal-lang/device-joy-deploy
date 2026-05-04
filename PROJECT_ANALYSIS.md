# BOYAKO Project - Complete Analysis & Architecture Overview

**Project Name:** BOYAKO (Aplikasi Pencarian & Arsip Barang Bukti)  
**Organization:** chotokahal-lang/device-joy-deploy  
**Type:** Evidence Management & Tracking System for Law Enforcement  
**Framework:** Vite + React + TypeScript  
**Status:** Active Development  
**Last Updated:** May 4, 2026

---

## 🎯 Project Purpose

BOYAKO is a specialized evidence tracking and archival system for **RESMOB POLDA SULSEL** (Indonesian police unit). It serves as a comprehensive platform for managing stolen vehicle reports and evidence documentation.

**Translation of Name:**  
- BOYAKO = "Barang Bukti Cari Arsip Komprehensif"
- BOYA = "Cari" (Search in Makassar language)
- Core functionality: Search and archive evidence/stolen items

---

## 📊 Project Structure

### Directory Tree
```
/src
├── /assets                    # Static images, videos, icons
├── /components               
│   ├── /agents               # AI agent components (AutoFix, Debugger, Card)
│   ├── /layout               # Layout wrappers (MobileFrame, PageHeader, ResponsiveWrapper)
│   └── /ui                   # shadcn/ui component library (~40+ components)
├── /hooks                    # React custom hooks (useAgent, useMobile, useResponsive, useToast)
├── /integrations
│   └── /supabase             # Supabase client & types
├── /lib
│   ├── /agents               # Agent system (analyzer, router, types, config)
│   ├── export.ts             # Export utilities
│   ├── store.ts              # Hybrid cache store (localStorage + Supabase)
│   └── utils.ts              # General utilities
├── /pages                    # 30+ page components (routing via React Router)
├── /store                    # Zustand state store (LiveEditStore)
├── App.tsx                   # Main app with routing & layout
├── main.tsx                  # React entry point
├── index.css                 # Global styles (Tailwind + custom CSS variables)
└── vite-env.d.ts            # Vite environment types
```

---

## 🛠️ Tech Stack & Dependencies

### Core Framework
- **Vite 7.3.1** - Build tool & dev server
- **React 18** - UI library
- **TypeScript 5.8.3** - Type safety
- **React Router DOM 6** - Client-side routing

### UI & Styling
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Shadcn/ui** - High-quality React components (~40 components)
- **Radix UI** - Headless component primitives
- **Framer Motion 12.38.0** - Animation library
- **Lucide React 0.575** - Icon library (580+ icons)
- **Recharts 2.15.4** - Data visualization/charts

### State Management & Data
- **Zustand 5.0.12** - Lightweight state management
- **TanStack React Query 5.83** - Server state management
- **@supabase/supabase-js 2.105.3** - Backend & real-time sync
- **Zod 3.24.2** - Schema validation

### Forms & Input
- **React Hook Form 7.71.2** - Form state management
- **@hookform/resolvers 5.2.2** - Validation integrations
- **Input OTP 1.4.2** - OTP input components
- **Date-fns 4.1.0** - Date utilities
- **React Day Picker 9.14** - Calendar component

### Animation & Effects
- **Framer Motion 12.38** - Smooth animations
- **Tailwindcss-animate 1.0.7** - Tailwind animation utilities

### Additional Tools
- **Sonner 2.0.7** - Toast notifications
- **Next-themes 0.4.6** - Theme switching
- **React Icons 5.6** - Alternative icon library
- **Embla Carousel 8.6** - Carousel/slider component
- **Vaul 1.1.2** - Drawer component
- **React Resizable Panels 2** - Resizable layout panels

### Development
- **ESLint 9.32** - Code linting
- **Prettier 3.7.3** - Code formatting
- **Lovable-tagger 1.3** - Component tagging in development mode

---

## 🏗️ Architecture Overview

### 1. **Routing System**
React Router v6 with 30+ pages organized by user role:

#### Admin Routes
- `/admin` - Dashboard
- `/admin/input` - Evidence input
- `/admin/scan` - Barcode/QR scanning
- `/admin/riwayat` - History/Records
- `/admin/detail/:id` - Evidence details
- `/admin/accounts` - User management
- `/admin/logs` - System logs
- `/admin/tracking` - Location tracking

#### User Routes
- `/user` - User dashboard
- `/user/cek/:type` - Check item (mobil/motor/hp)
- `/user/hasil/:type/:query` - Check results
- `/user/lapor` - Report missing item
- `/user/daftar` - Register
- `/user/verifikasi-wajah` - Face verification

#### Public Routes
- `/` - Splash/home
- `/role-select` - Role selection
- `/login/:type` - Login
- `/profile` - User profile
- `/notifications` - Notifications
- `/help-faq` - Help & FAQ
- `/about` - About page
- `/privacy` - Privacy policy
- `/terms` - Terms & conditions
- `/presentasi` - Full-screen presentation
- `/testimoni` - Testimonials page
- `/agent-manager` - AI agent manager
- `/agent-autofix` - AI auto-fix agent
- `/file-manager` - File management

### 2. **Data Layer (`src/lib/store.ts`)**
**Hybrid Cache Architecture:**
- Primary: Supabase (remote source of truth)
- Secondary: localStorage (offline cache)
- Real-time: Postgres Change Event subscriptions

**Data Models:**
```typescript
// Evidence Items (Main Data)
- VehicleItem (mobil/motor): License plate, frame number, engine number, specs
- HpItem (phone): IMEI, brand, model, color
- BaseItem: Common fields (type, report number, date, reporter, location, status)

// User Management
- UserAccount: NRP, name, unit, role (admin/polri)

// System Tracking
- SystemLog: User actions, timestamps, details
- UserLocation: GPS tracking with speed, area, device info
```

**Store Functions:**
- `getEvidenceData()` - Fetch all evidence
- `saveEvidenceItem()` - Create new evidence
- `updateEvidenceItem()` - Update existing evidence
- `deleteEvidenceItem()` - Delete evidence
- `searchEvidence()` - Search by type & query
- `updateEvidenceStatus()` - Change case status
- `hydrateFromCloud()` - Sync with Supabase
- Account, log, and location tracking APIs

### 3. **Database Schema (Supabase)**
Tables created in migrations (May 4, 2026):

**evidence table:**
- id (UUID)
- type (mobil/motor/hp)
- no_lp, tgl_lp, pelapor, lokasi_tkp, satker, asal_lp
- Vehicle-specific: no_polisi, no_rangka, no_mesin, merk, tipe, jenis, warna, tahun
- Phone-specific: imei1, imei2, model
- status (baru/proses/selesai)
- status_note, foto, created_at, updated_at

**system_logs table:**
- user_id, user_name, user_role, action, details, created_at

**user_locations table:**
- user_id, latitude, longitude, recorded_at

**profiles table:**
- user_id, nrp, name, unit, created_at

**user_roles table:**
- user_id, role (admin/polri), created_at

### 4. **UI Component System**
Complete shadcn/ui component library with custom components:

**Layout Components:**
- `MobileFrame` - Phone-like viewport wrapper
- `ResponsiveWrapper` - Responsive container
- `PageHeader` - Page title with navigation
- `CornerDecor` - Decorative corner elements

**Custom Specialized Components:**
- `LiveText` - Editable text (live editing mode)
- `LiveEditToggle` - Enable/disable live editing
- `LiveToolbar` - Live editing toolbar
- `LiveImage` - Editable images
- `Logo3DImg` - 3D logo with animations
- `Icon3D` - 3D icon component

**UI Library (40+ components):**
- Forms: Input, TextArea, Select, Checkbox, Radio, Toggle, Switch, Input-OTP
- Layout: Card, Separator, AspectRatio, ScrollArea, Resizable
- Dialogs: Dialog, AlertDialog, Popover, HoverCard, Drawer, Sheet
- Navigation: Tabs, Breadcrumb, NavigationMenu, Pagination, Sidebar, Menubar
- Lists: Accordion, Collapsible, Command
- Display: Avatar, Badge, Progress, Skeleton, Tooltip, DropdownMenu
- Data: Table, Chart (Recharts integration), Carousel
- Feedback: Toast, Toaster (Sonner), Alert

### 5. **Styling System**
**Design System (CSS Variables in `src/index.css`):**

**Color Palette:**
- Primary: #FF7000 (Orange) - 22 100% 52%
- Primary Glow: #FFA030 - 32 100% 58%
- Secondary: #E35900 - 18 100% 44%
- Accent: #FFD030 (Yellow) - 42 100% 58%
- Background: #0B0908 (Dark Brown) - 24 45% 6%
- Foreground: #F7ECE0 (Warm White) - 30 18% 97%
- Destructive: Red - 0 82% 58%

**Typography:**
- Font: Inter (headings & body)
- Base size: Fluid 14px-18px (clamp)
- Line height: 1.4-1.6 (relaxed)

**Spacing:**
- Radius: 1.5rem (24px)
- Responsive breakpoints: xs(375px), sm(640px), md(768px), lg(1024px), xl, 2xl

**Gradients & Shadows:**
- Primary gradient: 135° from #FF7000 → #FFA030 → #FFD030
- Multiple shadow levels: soft, elevated, glow
- Custom animation keyframes: accordion, fade-in, scale-in, float, pulse-glow

### 6. **Animations & Effects**
**Framer Motion Usage:**
- Page transitions (AnimatePresence)
- Component entrance animations
- Staggered list animations
- Video overlay animations
- Logo animations (floating, 3D effects)
- Loading bar progress

**Custom Keyframes:**
- Accordion expand/collapse
- Fade-in with translate
- Scale-in pop effect
- Floating motion
- Pulsing glow effects

### 7. **Agent System**
Located in `/src/lib/agents/`:
- **analyzer.ts** - AI analysis engine
- **router.ts** - Route user requests to agents
- **config.ts** - Agent configuration
- **types.ts** - TypeScript interfaces

Components:
- `AgentManager` - Manage active agents
- `AgentAutoFix` - Auto-fix issues component
- `AgentDebugger` - Debug agent interface
- `AgentCard` - Display agent status

### 8. **Loading & Performance**
**Opening Sequence:**
1. Splash screen with video (4.5s fallback)
2. Custom "BOYAKO" loading animation
3. Progress bar with fill effect
4. LoadingFallback component during Suspense
5. SessionStorage flag to show video once per session

**Performance Optimizations:**
- Lazy-loaded pages (code splitting)
- Suspense boundaries with loading fallbacks
- TanStack React Query for caching
- localStorage hybrid cache
- Real-time sync via Supabase channels

---

## 🎨 Design & UX Features

### Mobile-First Approach
- Default mobile (375px) → tablet (768px) → desktop (1024px)
- Safe area insets for notches
- 100dvh viewport height
- Touch-optimized interactions

### Live Editing Mode
- Development-only feature
- Edit text, images, styling without code
- Lovable component tagging
- LiveText, LiveImage components

### Dark Theme
- Default dark mode (always on)
- Color-coded information (status, role)
- High contrast for accessibility
- Eye-friendly OLED-optimized colors

### Responsive Utilities
- Touch detection (`touch`/`no-touch`)
- Portrait/landscape orientation
- High-DPI/Retina display support
- Device-specific breakpoints

---

## 🔐 Security & Authentication

**Current Implementation:**
- Supabase Authentication
- Role-based access control (admin/polri)
- User profiles & permissions
- System activity logging
- Location tracking audit trail

**Data Privacy:**
- Row-level security (RLS) on Supabase tables
- Parameterized queries
- Password hashing (handled by Supabase Auth)
- Secure session management

---

## 📱 Pages Overview (30+ Pages)

### Authentication
- **splash.tsx** - Home/welcome page with logo and testimonials
- **role-select.tsx** - Select user role (admin/polri)
- **login.tsx** - Login form

### Admin Pages
- **admin-dashboard.tsx** - Main admin dashboard
- **admin-input.tsx** - Input new evidence
- **admin-scan.tsx** - Barcode/QR scanning
- **admin-riwayat.tsx** - Evidence history
- **admin-detail.tsx** - View evidence details
- **admin-accounts.tsx** - Manage user accounts
- **admin-logs.tsx** - View system logs
- **admin-tracking.tsx** - Map-based location tracking

### User Pages
- **user-dashboard.tsx** - User home
- **user-cek.tsx** - Search for items
- **user-hasil.tsx** - Display search results
- **user-lapor.tsx** - Report stolen item
- **user-daftar.tsx** - Register account
- **user-verifikasi-wajah.tsx** - Face ID verification

### General Pages
- **profile.tsx** - User profile
- **notifications.tsx** - Notification center
- **help-faq.tsx** - FAQ & help
- **about.tsx** - About BOYAKO
- **privacy.tsx** - Privacy policy
- **terms.tsx** - Terms & conditions

### Special Pages
- **presentasi.tsx** - Full-screen presentation mode
- **testimoni.tsx** - Customer testimonials/reviews
- **agent-manager.tsx** - AI agent management
- **agent-autofix.tsx** - AI auto-fix interface
- **file-manager.tsx** - File upload/management
- **not-found.tsx** - 404 page
- **Index.tsx** - Legacy index (may be deprecated)

---

## 🚀 Development Workflow

### Scripts
```bash
npm run dev        # Start Vite dev server (port 8080)
npm run build      # Production build
npm run build:dev  # Development build
npm run preview    # Preview production build
npm run lint       # ESLint check
npm run format     # Prettier format
```

### Build Configuration
- **Vite:** Port 8080, IPv6 support (::)
- **React Plugin:** @vitejs/plugin-react-swc (SWC compiler)
- **Path Alias:** @/* → ./src/*
- **Component Tagging:** Lovable tagger in development

### TypeScript
- Target: ES2022
- JSX: react-jsx
- Module: ESNext
- Strict mode enabled
- Path aliases configured

---

## 📦 Key Integrations

### Supabase (Backend)
- Real-time PostgreSQL database
- Authentication system
- Real-time subscriptions (channels)
- Row-level security
- Storage for evidence photos

### Vercel (Deployment)
- Project ID: prj_OtMmzx6kJepi9Hi5iylsBayJOtjr
- Configuration: `.vercel/project.json`
- GitHub integration enabled

### Git Repository
- Organization: chotokahal-lang
- Repository: device-joy-deploy
- Main Branch: main
- Current Branch: ai-assistant-overview

---

## 🎯 Key Features

### Evidence Management
1. **Create** - Input new stolen vehicle/phone reports
2. **Search** - Find evidence by license plate, frame number, IMEI, etc.
3. **Track** - Monitor case status (new/processing/completed)
4. **Archive** - Maintain historical records
5. **Export** - Generate reports and documentation

### User Roles
- **Admin** - Full system access, evidence input, user management, logs
- **Polri** (Police) - View reports, search database, track cases

### Real-Time Features
- Live data sync via Supabase channels
- Location tracking of police units
- System activity logging
- Offline-first with localStorage cache

### AI Features
- Agent-based system for automation
- Auto-fix capabilities
- Debugger interface
- Agent management dashboard

---

## 📊 Data Flow

```
User Action (UI)
    ↓
React Component (state update)
    ↓
Store/Query (src/lib/store.ts)
    ↓
localStorage (immediate - offline support)
    ↓
Supabase (background sync)
    ↓
Real-time Subscription (updates other sessions)
    ↓
Component listeners (notify subscribers)
    ↓
UI Re-render
```

---

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `vite.config.ts` | Vite build & dev configuration |
| `tailwind.config.ts` | Tailwind CSS configuration & theme |
| `tsconfig.json` | TypeScript compiler options |
| `postcss.config.js` | PostCSS plugins (autoprefixer) |
| `.prettierrc` | Code formatting rules |
| `eslint.config.js` | ESLint rules |
| `components.json` | shadcn/ui component registry |
| `.env` | Environment variables |
| `supabase/config.toml` | Supabase local config |
| `bunfig.toml` | Bun runtime config |

---

## 📝 Database Migrations

| Migration | Date | Purpose |
|-----------|------|---------|
| `20260504174437...sql` | May 4, 2026 | Initial schema: evidence, system_logs, user_locations |
| `20260504174546...sql` | May 4, 2026 | Additional schema updates: profiles, user_roles |

---

## 🎓 Development Best Practices (Observed)

1. **Component Organization:**
   - Split into smaller, reusable components
   - Clear separation of concerns
   - UI library for consistency

2. **State Management:**
   - Zustand for simple global state
   - TanStack Query for server state
   - Store module for data sync

3. **Performance:**
   - Code splitting with lazy loading
   - Real-time sync optimization
   - Offline-first caching strategy

4. **Type Safety:**
   - Full TypeScript usage
   - Zod validation
   - Strict mode enabled

5. **Styling:**
   - Tailwind utility-first CSS
   - CSS variables for theming
   - Responsive design from start

6. **Error Handling:**
   - ErrorBoundary component
   - Try-catch in async operations
   - User-friendly error messages

---

## 🚨 Known Limitations & TODOs

1. **Face Verification** - Page exists but may need backend implementation
2. **File Manager** - Full-screen page, may need storage integration
3. **Agent System** - Framework in place, may need AI backend connection
4. **Location Tracking** - Seeds sample data, needs real GPS integration
5. **Account Management** - Supabase Auth integration may need completion

---

## 📈 Metrics & Statistics

- **Total Pages:** 30+
- **Components:** 40+ UI components + custom components
- **Dependencies:** 50+
- **Color Variables:** 15+
- **Animation Keyframes:** 5+
- **Database Tables:** 5+
- **API Endpoints:** ~20 store functions

---

## 💡 Next Steps for Enhancement

1. **Complete face verification** using WebRTC/ML framework
2. **Integrate real GPS tracking** for location data
3. **Add image upload** to Supabase Storage
4. **Connect AI agent system** to language models
5. **Implement push notifications** for case updates
6. **Add barcode scanning** library (ZXing, jsQR)
7. **Optimize database queries** with proper indexing
8. **Add unit tests** for critical functions
9. **Create admin onboarding** flow
10. **Implement audit logging** for compliance

---

## 📞 Support & Resources

- **Repository:** https://github.com/chotokahal-lang/device-joy-deploy
- **Framework Docs:** https://react.dev, https://vitejs.dev
- **UI Library:** https://ui.shadcn.com
- **Database:** https://supabase.com/docs
- **Styling:** https://tailwindcss.com/docs

---

**Generated:** May 5, 2026  
**Analysis Version:** 1.0  
**Framework:** React 18 + Vite 7 + TypeScript 5.8 + Tailwind CSS 3.4

