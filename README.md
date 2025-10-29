# Rapchai Café - Frontend Application

A modern Next.js 16 frontend application for Rapchai Café, featuring customer ordering, event booking, and admin dashboard management.

## 🚀 Features

### Customer Features
- **Google OAuth Authentication** - Seamless sign-in with Google
- **Menu Browsing** - Browse menu items with category filtering (Veg/Non-Veg)
- **Global Shopping Cart** - Persistent cart across all pages with localStorage
- **UPI Payment** - Multi-app UPI payment integration (PhonePe, GPay, Paytm, etc.)
- **Event Booking** - Book events with mobile-based UPI payment reference
- **Responsive Design** - Mobile-first design with smooth animations

### Admin Features
- **Dashboard** - View orders, manage menu items and categories
- **Menu Management** - CRUD operations for categories and menu items
- **Image Upload** - Upload images for categories and items (Supabase Storage)
- **Order Management** - View and manage customer orders
- **Analytics** - Dashboard analytics and statistics

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (for authentication and storage)
- Backend API running (see `backend/README.md`)

## 🛠️ Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd rapchai
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp src/env.example .env.local
```

4. **Configure `.env.local`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 🏃 Running the Application

### Development Mode
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Build
```bash
npm run build
npm start
```

## 📁 Project Structure

```
src/app/
├── (site)/              # Customer routes
│   ├── home/           # Customer homepage
│   ├── menu/           # Menu browsing
│   ├── events/         # Event listings
│   ├── catering/       # Private dining
│   ├── gallery/        # Gallery
│   ├── contact/       # Contact page
│   ├── order/          # QR ordering page
│   ├── onboarding/     # Role selection
│   └── admin/         # Admin routes
│       ├── login/     # Admin login
│       └── dashboard/ # Admin dashboard
├── components/          # React components
│   ├── CustomerNavBar.tsx
│   ├── AdminNavBar.tsx
│   ├── UnifiedCart.tsx
│   ├── UPIPaymentModal.tsx
│   └── ...
├── lib/                # Utilities and contexts
│   ├── cart-context.tsx
│   ├── customer-auth.tsx
│   ├── auth-hydration-safe.tsx
│   ├── hooks.ts
│   └── services.ts
└── api/                # Next.js API routes
    └── upload/        # Image upload handling
```

## 🔑 Key Technologies

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Supabase** - Authentication and storage
- **Tailwind CSS** - Utility-first CSS framework
- **React Context** - State management for cart and auth

## 📱 Routes

### Customer Routes
- `/` - Landing page
- `/onboarding` - Role selection (Customer/Admin)
- `/home` - Customer homepage
- `/menu` - Menu browsing with category filtering
- `/events` - Event listings and booking
- `/catering` - Private dining
- `/gallery` - Gallery
- `/contact` - Contact page
- `/order` - QR-based ordering

### Admin Routes
- `/admin/login` - Admin login
- `/admin/dashboard` - Admin dashboard

## 💳 Payment Integration

The application supports UPI payment through multiple apps:
- PhonePe
- Google Pay
- Paytm
- BHIM UPI
- Amazon Pay
- CRED
- WhatsApp Pay

**UPI ID:** `8179299096@superyes`

## 🎨 Styling

The application uses CSS variables for theming:
- `--rc-orange` - Primary orange color
- `--rc-espresso-brown` - Brown color
- `--rc-creamy-beige` - Background color
- `--rc-text-secondary` - Secondary text color

## 🔒 Authentication

### Customer Authentication
- Google OAuth via Supabase
- Session management with automatic refresh
- Protected routes with automatic redirect

### Admin Authentication
- Email/password authentication
- JWT token-based auth
- Route protection via layout

## 📦 State Management

### Global Cart Context
- Persists cart across navigation
- localStorage synchronization
- Event-driven add to cart

### Authentication Contexts
- Customer auth context (Supabase)
- Admin auth context (JWT)

## 🧪 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Other Platforms
- Build: `npm run build`
- Output: `.next` directory
- Environment variables required: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ |

---

## 🔧 Supabase Setup

### Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up/Login with your GitHub account
3. Click "New Project"
4. Enter project details:
   - **Name**: `rapchai-restaurant`
   - **Database Password**: Generate a strong password (save this!)
   - **Region**: Choose closest to your location
5. Click "Create new project"

### Step 2: Get Supabase Credentials

Once your project is created:

1. Go to **Settings** → **API**
2. Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
3. Copy **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 3: Enable Google OAuth

1. Go to **Authentication** → **Providers**
2. Enable **Google** provider
3. Add Google OAuth credentials (Client ID & Secret)
4. Add authorized redirect URLs:
   - `http://localhost:3000` (development)
   - `https://your-domain.com` (production)

### Step 4: Configure Image Storage

1. Go to **Storage** → **Buckets**
2. Create a bucket named `restaurant-images`
3. Set bucket to **Public**
4. Run the SQL policies from `database-setup.sql` Section 1 in Supabase SQL Editor

**Storage Folder Structure:**
```
restaurant-images/
├── categories/    # Category images
└── menu-items/   # Menu item images
```

### Step 5: Update Environment Variables

Add to `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 📸 Image Upload Setup

### Prerequisites
- Supabase bucket `restaurant-images` created
- Storage policies configured (see `database-setup.sql`)

### How It Works
1. Admin uploads image via admin dashboard
2. Image is uploaded to Supabase Storage
3. Public CDN URL is stored in database
4. Images are displayed instantly via CDN

### Troubleshooting

**Error: "Failed to upload image"**
- Check Supabase bucket exists and is public
- Verify environment variables are set correctly
- Run storage policies from `database-setup.sql`

**Error: "next/image unconfigured host"**
- Add Supabase domain to `next.config.ts` `remotePatterns`

---

## 🔗 Related Documentation

- **Backend API**: See `backend/README.md`
- **Database Setup**: See `database-setup.sql`
- **Authentication System**: See `backend/README.md` (Authentication section)

## 📄 License

MIT
