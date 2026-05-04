# BOYAKO - Quick Reference Guide

## 🎯 Project at a Glance

**BOYAKO** = Evidence & Stolen Items Tracking System for Indonesian Police  
**Stack:** React 18 + Vite + TypeScript + Tailwind + Supabase  
**Purpose:** Search, archive, and manage evidence records

---

## 📂 Directory Structure Quick Map

```
src/
├── assets/          → Images, videos, logos, icons
├── components/
│   ├── agents/      → AI agent components
│   ├── layout/      → Page wrappers (MobileFrame, PageHeader)
│   └── ui/          → 40+ shadcn/ui components
├── hooks/           → Custom React hooks
├── integrations/    → Supabase client
├── lib/
│   ├── agents/      → AI system (analyzer, router, config)
│   ├── store.ts     → Data management (localStorage + Supabase sync)
│   └── utils.ts     → Helper functions
├── pages/           → 30+ route pages
├── store/           → Zustand state (LiveEditStore)
├── App.tsx          → Main router setup
└── index.css        → Global styles & CSS variables
```

---

## 🛣️ Route Map

### Admin Routes
- `/admin` → Dashboard
- `/admin/input` → Add evidence
- `/admin/scan` → QR/barcode scan
- `/admin/riwayat` → History
- `/admin/detail/:id` → View details
- `/admin/accounts` → Users
- `/admin/logs` → Activity log
- `/admin/tracking` → Map tracking

### User Routes
- `/user` → Dashboard
- `/user/cek/:type` → Search (mobil/motor/hp)
- `/user/hasil/:type/:query` → Results
- `/user/lapor` → Report item
- `/user/daftar` → Sign up
- `/user/verifikasi-wajah` → Face ID

### Other Routes
- `/` → Splash/home
- `/role-select` → Choose role
- `/login/:type` → Login
- `/profile` → Settings
- `/notifications` → Messages
- `/help-faq` → Help
- `/presentasi` → Full-screen presentation
- `/testimoni` → Reviews
- `/agent-manager` → AI agents
- `/file-manager` → Files

---

## 🎨 Design System

### Colors
| Name | Value | Usage |
|------|-------|-------|
| Primary | #FF7000 | Main brand color, buttons, highlights |
| Primary Glow | #FFA030 | Hover states, accents |
| Accent | #FFD030 | Yellow highlights, badges |
| Destructive | Red | Alerts, delete actions |
| Background | #0B0908 | Page background |
| Foreground | #F7ECE0 | Text, content |

### Spacing & Sizing
- **Radius:** 1.5rem (24px)
- **Safe area:** Respects device notches
- **Breakpoints:**
  - xs: 375px (mobile)
  - sm: 640px (large phone)
  - md: 768px (tablet)
  - lg: 1024px (desktop)

### Typography
- **Font:** Inter (headings & body)
- **Base size:** Fluid 14px-18px
- **Line height:** 1.4-1.6

---

## 📊 Data Models

### Evidence Item (Main Data)
```typescript
// Vehicle (mobil/motor)
{
  id, type, noLp, tglLp, pelapor, lokasiTkp,
  noPolisi, noRangka, noMesin, merk, warna, tahun,
  status, statusNote, foto, createdAt
}

// Phone (hp)
{
  id, type, noLp, tglLp, pelapor, lokasiTkp,
  merk, model, imei1, imei2, warna,
  status, statusNote, foto, createdAt
}

// Status values: 'baru' | 'proses' | 'selesai'
```

### User Account
```typescript
{
  id, nrp, name, unit,
  role: 'admin' | 'polri',
  createdAt
}
```

### System Log
```typescript
{
  id, timestamp, user, role, action, details
}
```

### User Location
```typescript
{
  id, timestamp, user, role, lat, lng,
  action, area, speed, device
}
```

---

## 🔧 Key Store Functions (`src/lib/store.ts`)

### Evidence Management
```typescript
getEvidenceData()                    // Get all items
searchEvidence(type, query)          // Find item by type & query
saveEvidenceItem(item)               // Create new
updateEvidenceItem(item)             // Update existing
deleteEvidenceItem(id)               // Remove
updateEvidenceStatus(id, status)     // Change status
```

### User Management
```typescript
fetchAccounts()                      // Get user list
getUserAccounts()                    // Get cached accounts
```

### Logging
```typescript
getLogs()                            // Get activity log
addLog(user, role, action, details)  // Log action
```

### Location Tracking
```typescript
getUserLocations()                   // Get tracked locations
trackLocation(user, role, lat, lng, ...) // Log location
clearLocations()                     // Clear history
```

### Sync
```typescript
hydrateFromCloud()                   // Sync from Supabase
subscribeStore(callback)             // Listen for changes
```

---

## 🎨 Common Component Patterns

### Using UI Components
```tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function Example() {
  return (
    <Card>
      <CardContent className="pt-6">
        <Input placeholder="Type here..." />
        <Button>Submit</Button>
      </CardContent>
    </Card>
  );
}
```

### Form with React Hook Form
```tsx
import { useForm } from 'react-hook-form';

export default function Form() {
  const { register, handleSubmit } = useForm();
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
      <button type="submit">Save</button>
    </form>
  );
}
```

### Using Store
```tsx
import { getEvidenceData, searchEvidence } from '@/lib/store';

export default function Search() {
  const [results, setResults] = useState([]);
  
  const handleSearch = (query) => {
    const item = searchEvidence('mobil', query);
    setResults(item ? [item] : []);
  };
  
  return <input onChange={(e) => handleSearch(e.target.value)} />;
}
```

### Responsive Layout
```tsx
<div className="p-4 md:p-8 lg:p-12">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {/* Content */}
  </div>
</div>
```

### Animations
```tsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>
```

---

## 📱 Development Commands

```bash
# Start dev server (http://localhost:8080)
npm run dev

# Build for production
npm run build

# Preview build
npm run preview

# Format code
npm run format

# Check for errors
npm run lint
```

---

## 🔐 Authentication Flow

1. User lands on `/` (splash)
2. Clicks to login
3. Chooses role → `/role-select`
4. Enters credentials → `/login/:type`
5. Supabase Auth verifies
6. Redirected to role dashboard
   - Admin → `/admin`
   - User → `/user`

---

## 💾 Data Sync Strategy

1. **User creates/updates data** → Saved to localStorage (instant)
2. **Background sync** → Sent to Supabase
3. **Real-time updates** → Postgres channel notifies other sessions
4. **Offline support** → App works with localStorage if offline

---

## 🎯 Common Tasks

### Add New Page
1. Create file in `/src/pages/new-page.tsx`
2. Add route in `App.tsx`
3. Create components in `/src/components/`
4. Use store functions for data

### Use Evidence Data
```tsx
import { getEvidenceData, searchEvidence, updateEvidenceStatus } from '@/lib/store';

const evidence = getEvidenceData();
const item = searchEvidence('mobil', 'B1234CD');
updateEvidenceStatus(item.id, 'selesai', 'Found and returned');
```

### Create Form
```tsx
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function NewForm() {
  const { register, handleSubmit } = useForm();
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input {...register('field')} />
      <Button type="submit">Save</Button>
    </form>
  );
}
```

### Style Component
```tsx
// Use Tailwind classes
<div className="bg-primary text-white p-4 rounded-lg">
  Styled content
</div>

// Use CSS variables
<div style={{ color: 'hsl(var(--primary))' }}>
  Dynamic color
</div>
```

---

## ⚠️ Important Notes

1. **Mobile-first design** - Always test on 375px viewport first
2. **Dark theme only** - No light mode needed
3. **Offline support** - localStorage is cached automatically
4. **Real-time sync** - Supabase channels sync data between sessions
5. **Role-based access** - Check user role before showing admin features
6. **Type safety** - Use TypeScript, no `any` types

---

## 🔗 Useful Links

| Resource | URL |
|----------|-----|
| React Docs | https://react.dev |
| Vite Docs | https://vitejs.dev |
| Tailwind CSS | https://tailwindcss.com |
| shadcn/ui | https://ui.shadcn.com |
| Supabase | https://supabase.com/docs |
| Framer Motion | https://www.framer.com/motion |
| React Router | https://reactrouter.com |

---

## 📊 Component Inventory

### Layout (4)
- MobileFrame
- ResponsiveWrapper
- PageHeader
- CornerDecor

### Custom (4)
- LiveText (editable)
- LiveImage (editable)
- LiveEditToggle
- LiveToolbar

### UI Library (40+)
- Buttons, inputs, forms
- Cards, layouts
- Modals, dialogs
- Tables, lists
- Charts, progress
- Avatars, badges
- And more...

---

## 🚀 Quick Checklist

- [ ] Environment variables set (`.env`)
- [ ] Supabase project connected
- [ ] Database migrations run
- [ ] Dev server running (`npm run dev`)
- [ ] Code follows TypeScript best practices
- [ ] Responsive on mobile (375px), tablet (768px), desktop (1024px)
- [ ] Uses existing components from shadcn/ui
- [ ] Data persists to Supabase
- [ ] Errors handled gracefully
- [ ] Accessibility considerations (alt text, ARIA, semantic HTML)

---

**Last Updated:** May 5, 2026  
**Version:** 1.0

