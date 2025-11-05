# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Project Name**: E-Commerce Platform (电商平台)
**Type**: Graduation project (毕业设计)
**Tech Stack**: Next.js 15 + Supabase + TypeScript + Tailwind CSS v4
**Port**: http://localhost:3000 (default, may auto-assign 3001 if 3000 is in use)

## Technology Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript 5.7
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **Styling**: Tailwind CSS v4 (@tailwindcss/postcss)
- **Auth**: Supabase Auth with standard `createClient`
- **State**: React Context (AuthProvider, CartProvider)

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (usually port 3000)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Architecture Overview

### ⚠️ CRITICAL: Supabase SDK Browser Hang Issue

**Problem**: `@supabase/supabase-js` v2.47.10 completely hangs in browser environments. All queries hang indefinitely without making any network requests.

**Workaround**: Use direct fetch to Supabase REST API via `lib/supabase-fetch.ts`.

```typescript
// ❌ AVOID in browser components - SDK hangs
import { supabase } from '@/lib/supabase'
const { data } = await supabase.from('products').select('*')

// ✅ USE instead - direct fetch works
import { getProducts } from '@/lib/supabase-fetch'
const data = await getProducts()
```

**Implementation** (`lib/supabase-fetch.ts`):
- Direct fetch wrapper to Supabase REST API (`/rest/v1/`)
- Reads user token from localStorage for authenticated requests
- Falls back to anon key for guest access
- Type-safe functions matching Supabase query patterns

**When to Use Each Approach**:
- **Auth operations**: Still use SDK (`supabase.auth.*`) - auth works fine
- **Data queries in browser**: Use `lib/supabase-fetch.ts` functions
- **Server-side queries**: Can use SDK if needed (not implemented yet)

**Available Fetch Functions**:
- `getProducts(limit)` - Featured products ordered by sales
- `getAllProducts(limit)` - All products with seller info
- `getProductById(id)` - Single product with seller and category
- `getProductsByCategory(categorySlug, limit)` - Products filtered by category slug
- `getCategories(limit)` - Product categories
- `getCartItems(userId)` - User's cart with product details
- `addCartItem(userId, productId, quantity)` - Add to cart
- `updateCartItem(itemId, quantity)` - Update cart item quantity
- `removeCartItem(itemId)` - Remove from cart
- `clearCartItems(userId)` - Clear entire cart
- **Reviews**: `submitReview()`, `getProductReviews()`, `getProductReviewStats()`, `getUserReviews()`, `hasUserReviewedProduct()`
- **Chat**: `getChatConversations()`, `getConversationMessages()`, `sendChatMessage()`, `createChatConversation()`, `markConversationAsRead()`

**Guest Mode Support**: All product browsing functions work without authentication using the anon key.

### Authentication Flow

**Critical Pattern**: Use standard `@supabase/supabase-js` client for auth (NOT `@supabase/ssr`).

```typescript
// lib/supabase.ts - Single unified client
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Alias for backwards compatibility
export const supabaseAuth = supabase
```

**Why standard client**: Automatically handles localStorage session persistence for browser-only apps. The `@supabase/ssr` package is for SSR scenarios with cookies, which adds unnecessary complexity for pure client-side auth.

**AuthProvider** (`app/providers/AuthProvider.tsx`):
- Wraps entire app in root layout
- Provides: `{ user, profile, loading, signOut, refreshProfile }`
- Auto-fetches profile from `profiles` table on auth state change
- Uses `supabase.auth.getSession()` and `onAuthStateChange()`
- **Session timeout**: 3-second timeout for guest-friendly experience

```typescript
// AuthProvider has 3-second timeout to prevent hanging on session fetch
const sessionPromise = supabaseAuth.auth.getSession()
const timeoutPromise = new Promise((_, reject) =>
  setTimeout(() => reject(new Error('Session timeout - continuing as guest')), 3000)
)
const { data: { session } } = await Promise.race([sessionPromise, timeoutPromise])
```

**Usage Pattern**:
```typescript
import { useAuth } from '@/hooks/useAuth'

function Component() {
  const { user, profile, loading } = useAuth()

  if (loading) return <LoadingSpinner />
  if (!user) router.push('/login')
  if (profile?.role !== 'admin') return <Unauthorized />

  return <Content />
}
```

### Login Implementation

**Critical Bug Fix Applied**: Login pages must NOT use `finally` block to reset loading state.

```typescript
// ❌ WRONG - finally executes even with return, causing button flicker
try {
  setLoading(true)
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error

  if (data.user) {
    window.location.replace('/destination')
    return
  }
} catch (error) {
  setError(error.message)
} finally {
  setLoading(false) // BUG: Executes before redirect completes
}

// ✅ CORRECT - Only reset loading in catch block
try {
  setLoading(true)
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error

  if (data.user) {
    window.location.replace('/destination') // Keeps loading=true until redirect
  }
} catch (error) {
  setError(error.message)
  setLoading(false) // Only reset on error
}
```

**Why `window.location.replace()`**: Hard page reload ensures AuthProvider properly loads session from localStorage. Using `router.push()` alone can cause race conditions where the page loads before auth state updates.

### Role-Based Access Control

Three roles defined in `profiles.role`:
- **`user`**: Regular shoppers, can apply to become seller
- **`seller`**: Can manage products, view orders
- **`admin`**: Full access to admin dashboard and user management

**Admin Access Pattern** (`app/admin/layout.tsx`):
```typescript
useEffect(() => {
  if (!loading && !isLoginPage) {
    if (!user) {
      router.push('/admin/login')
    } else if (profile?.role !== 'admin') {
      // Non-admin: just redirect (no alert, no logout)
      router.push('/admin/login')
    }
  }
}, [user, profile, loading, isLoginPage])
```

**Key Feature**: `/admin/login` is independent from main site login:
- Non-admin users can access `/admin/login` form while staying logged into main site
- Allows admin account switching without affecting main site session
- No forced logout for non-admin users attempting admin access

### Seller Application Workflow

1. User visits `/apply-seller` (requires `role='user'`)
2. Submits application → creates record in `seller_applications` table with `status='pending'`
3. Admin reviews at `/admin/applications`
4. On approval → user's `profiles.role` updated to `'seller'`
5. Seller gains access to `/seller/*` pages

**Admin User Management** (`/admin/users`):
- View all users with roles and status
- Upgrade users to seller role
- Downgrade sellers to user role
- Products from downgraded sellers show "商家被审查中" warning badge

**Important**:
- Only users with `role='user'` can apply
- Users with pending applications see "商家申请中" status
- `seller_applications` table has two foreign keys to `profiles`: `user_id` (applicant) and `reviewed_by` (admin)

### Seller Status Warnings

**Product Display Logic**: Products from sellers whose role has been changed to non-seller show warning badges.

Implementation in `ProductCard.tsx`:
```typescript
// Products query must join seller info
const { data } = await supabase
  .from('products')
  .select(`
    *,
    seller:profiles!products_seller_id_fkey(id, role, full_name)
  `)

// In component:
{product.seller && product.seller.role !== 'seller' && (
  <div className="badge">⚠️ 商家被审查中</div>
)}
```

### Supabase Query Patterns

**Multiple Foreign Keys to Same Table**:
```typescript
// ❌ WRONG - causes PGRST201 error
const { data } = await supabase
  .from('seller_applications')
  .select('*, profiles(email, full_name)')

// ✅ CORRECT - specify exact FK relationship
const { data } = await supabase
  .from('seller_applications')
  .select('*, profiles!seller_applications_user_id_fkey(email, full_name)')
```

**Joining Seller Info for Products**:
```typescript
// Products with seller role check
const { data } = await supabase
  .from('products')
  .select(`
    *,
    seller:profiles!products_seller_id_fkey(id, role, full_name)
  `)
```

### Toast Notifications

Replace `alert()` with `Toast` component (`components/ui/Toast.tsx`):

```typescript
const [toast, setToast] = useState<{
  message: string
  type: 'success' | 'error' | 'warning'
} | null>(null)

// Usage
setToast({ message: '操作成功', type: 'success' })

// In JSX
{toast && <Toast {...toast} onClose={() => setToast(null)} />}
```

Animation defined in `globals.css` as `.animate-slide-in`.

### Responsive Design Patterns

**Mobile-First Approach**: All pages use responsive design with Tailwind CSS breakpoints.

**Common Patterns**:
```typescript
// Typography - responsive font sizes
className="text-xs md:text-sm"      // Small text
className="text-sm md:text-base"     // Body text
className="text-xl md:text-2xl"      // Headings

// Spacing - responsive padding/margins
className="p-3 md:p-4 lg:p-6"        // Padding
className="gap-2 md:gap-4"           // Grid/flex gaps
className="mb-3 md:mb-6 lg:mb-8"     // Margins

// Layout - responsive grids
className="grid-cols-2 md:grid-cols-4"           // Stats cards
className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"  // Product grid

// Touch Targets - iOS/Android standards
className="min-h-[44px] md:min-h-0"  // Mobile buttons (44px minimum)

// Tables to Cards - responsive conversion
className="hidden md:block"          // Desktop table
className="md:hidden"                // Mobile cards

// Navigation - horizontal scrolling on mobile
className="overflow-x-auto scrollbar-hide"  // Tab bars
```

**Breakpoints**:
- `sm:` 640px (small phones)
- `md:` 768px (tablets/landscape)
- `lg:` 1024px (desktops)
- `xl:` 1280px (large screens)

### Homepage Category Carousel

**Feature**: Auto-rotating image carousel for each product category card.

**Implementation** (`app/page.tsx`):
- Each category has 3 curated Unsplash images
- Auto-rotates every 3 seconds using `setInterval`
- Pauses rotation on mouse hover
- Clickable indicator dots in top-right corner
- Smooth 700ms fade transitions with scale effects
- Maintains category links to `/products?category={slug}`

```typescript
function CategoryCard({ category, images }: { category: string; images: string[] }) {
  const [currentImage, setCurrentImage] = useState(0)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    if (isHovering) return // Pause on hover
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [images.length, isHovering])

  return (
    <Link href={`/products?category=${category}`}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}>
      {/* Multiple images with fade/scale transitions */}
      {images.map((image, index) => (
        <img className={index === currentImage ? 'opacity-100 scale-100' : 'opacity-0 scale-105'} />
      ))}
    </Link>
  )
}
```

**Categories with Images**:
- **electronics** (电子产品): Tech workstations, devices
- **fashion** (服装鞋包): Clothing displays, shopping scenes
- **home** (家居生活): Interior design, living spaces
- **books** (图书音像): Bookshelves, reading environments

### Category Filtering

**URL-Based Filtering**: Products page supports category filtering via URL parameters.

**Implementation Pattern**:
```typescript
// app/products/page.tsx
import { useSearchParams } from 'next/navigation'
import { getAllProducts, getProductsByCategory } from '@/lib/supabase-fetch'

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const category = searchParams.get('category')

  useEffect(() => {
    const fetchProducts = async () => {
      if (category) {
        // Filter by category slug
        const data = await getProductsByCategory(category, 50)
      } else {
        // Get all products
        const data = await getAllProducts(50)
      }
      setProducts(data || [])
    }
    fetchProducts()
  }, [category])
}
```

**Category Links**: Use `/products?category={slug}` format (e.g., `/products?category=fashion`)

### Review System

**Features**:
- Users can review products from delivered orders
- 1-5 star ratings with optional text and images
- Filter reviews by rating (all, 5-star, 4-star, etc.)
- Sellers can view and reply to reviews
- Prevents duplicate reviews per order-product combination

**Implementation** (`hooks/useReviews.ts` pattern):
```typescript
// Submit review (requires delivered order)
await submitReview({
  product_id: productId,
  order_id: orderId,
  user_id: userId,
  rating: 5,
  content: 'Great product!',
  images: ['url1', 'url2']
})

// Check if user already reviewed
const hasReviewed = await hasUserReviewedProduct(userId, productId, orderId)

// Get product reviews with pagination
const reviews = await getProductReviews(productId, limit, offset)

// Get review statistics
const stats = await getProductReviewStats(productId)
```

**UI Components**:
- `ReviewForm.tsx` - Submit reviews with rating, text, and image uploads
- `ReviewList.tsx` - Display reviews with filtering
- `ReviewStats.tsx` - Show rating distribution

### Chat System

**Architecture**: Real-time messaging between buyers and sellers, conversation-based.

**useChat Hook** (`hooks/useChat.ts`):
```typescript
const {
  conversations,        // List of user's conversations
  currentConversation,  // Selected conversation
  messages,            // Messages in current conversation
  loading,
  messagesLoading,
  sending,
  selectConversation,  // Switch conversation
  sendMessage,         // Send message
  createConversation,  // Start new conversation
  getUnreadCount       // Badge count
} = useChat(userId)
```

**Database Schema**:
- `conversations` table: Links buyer, seller, and product
- `messages` table: Stores message content with `is_read` flag
- Foreign keys: `conversations_buyer_id_fkey`, `conversations_seller_id_fkey`, `conversations_product_id_fkey`

**Important**: Table names are `conversations` and `messages` (NOT `chat_conversations`/`chat_messages`)

**UI Pages**:
- `/chat` - Buyer's chat interface (contact sellers)
- `/seller/chat` - Seller's chat interface (respond to buyers)
- Responsive: Desktop shows split view, mobile shows list/chat toggle

**Mobile-First Pattern**:
```typescript
const [isMobile, setIsMobile] = useState(false)
const [showConversationList, setShowConversationList] = useState(true)

// Toggle between list and chat on mobile
const handleSelectConversation = (conversation) => {
  selectConversation(conversation)
  if (isMobile) {
    setShowConversationList(false) // Show chat window
  }
}

const handleBack = () => {
  setShowConversationList(true) // Back to list
  selectConversation(null)
}
```

**Dependencies**: Requires `date-fns` for timestamp formatting (`formatDistanceToNow`)

## Database Schema

### profiles
- `id` (uuid, FK to auth.users)
- `email` (text)
- `full_name` (text)
- `avatar_url` (text)
- `role` (text): 'user' | 'seller' | 'admin'
- `created_at`, `updated_at` (timestamptz)

### seller_applications
- `id` (bigint, PK)
- `user_id` (uuid, FK to profiles)
- `business_name` (text) *required
- `business_description` (text) *required
- `contact_phone` (text) *required
- `contact_address` (text) optional
- `business_license` (text) optional
- `id_card` (text) optional
- `status` (text): 'pending' | 'approved' | 'rejected'
- `reviewed_by` (uuid, FK to profiles) nullable
- `reviewed_at` (timestamptz) nullable
- `created_at` (timestamptz)

### categories
- `id` (uuid, PK)
- `name` (text) - Display name (e.g., "电子产品")
- `slug` (text) - URL-friendly identifier
- `description` (text)
- `parent_id` (uuid, FK to categories) nullable
- `image_url` (text)
- `display_order` (int)
- `created_at` (timestamptz)

**Default Categories**:
```sql
INSERT INTO categories (name, slug, description, display_order) VALUES
('电子产品', 'electronics', '手机、电脑、相机等电子产品', 0),
('服装鞋包', 'fashion', '时尚服装和配饰', 1),
('家居生活', 'home', '家具、家纺、厨具等', 2),
('图书音像', 'books', '图书、音乐、影视作品', 3),
('运动户外', 'sports', '运动器材和户外装备', 4);
```

### products
- `id` (bigint, PK)
- `seller_id` (uuid, FK to profiles)
- `category_id` (uuid, FK to categories) **NOT** text field
- `name`, `description` (text)
- `price` (numeric)
- `original_price` (numeric) nullable
- `stock` (integer)
- `images` (text array)
- `status` (text): 'active' | 'inactive'
- `created_at`, `updated_at` (timestamptz)

**Important**: Use `category_id` (UUID foreign key), NOT a text `category` field.

### cart_items
- `id` (bigint, PK)
- `user_id` (uuid, FK to profiles)
- `product_id` (bigint, FK to products)
- `quantity` (integer)
- `created_at` (timestamptz)

### orders
- `id` (bigint, PK)
- `user_id` (uuid, FK to profiles)
- `total_amount` (numeric)
- `status` (text): 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
- `shipping_address` (jsonb)
- `created_at`, `updated_at` (timestamptz)

### order_items
- `id` (bigint, PK)
- `order_id` (bigint, FK to orders)
- `product_id` (bigint, FK to products)
- `quantity` (integer)
- `price` (numeric) - Price at time of purchase
- `created_at` (timestamptz)

### reviews
- `id` (bigint, PK)
- `product_id` (bigint, FK to products)
- `order_id` (bigint, FK to orders)
- `user_id` (uuid, FK to profiles)
- `rating` (integer) - 1 to 5 stars
- `content` (text) - Optional review text
- `images` (text array) - Optional review images
- `created_at`, `updated_at` (timestamptz)
- **Constraint**: Unique combination of (user_id, product_id, order_id) to prevent duplicate reviews

### conversations
- `id` (uuid, PK)
- `buyer_id` (uuid, FK to profiles)
- `seller_id` (uuid, FK to profiles)
- `product_id` (bigint, FK to products)
- `last_message` (text) - Cached for list display
- `last_message_at` (timestamptz) - For sorting
- `created_at`, `updated_at` (timestamptz)

### messages
- `id` (uuid, PK)
- `conversation_id` (uuid, FK to conversations)
- `sender_id` (uuid, FK to profiles)
- `content` (text)
- `is_read` (boolean)
- `created_at` (timestamptz)

## Current Implementation Status

### ✅ Fully Implemented
- Authentication (login/signup) with email+password
- User profiles with role management
- Admin dashboard (`/admin`) with stats overview
- **Admin user management** (`/admin/users`) - upgrade/downgrade user roles
- **Admin orders management** (`/admin/orders`) - view and update all orders
- Seller application system (`/apply-seller`)
- Admin application approval (`/admin/applications`)
- Seller product management (`/seller/products/*`)
- **Seller orders management** (`/seller/orders`) - view orders containing seller's products
- **Seller reviews management** (`/seller/reviews`) - view and reply to product reviews
- **Seller settings** (`/seller/settings`) - profile and address management
- **Seller chat** (`/seller/chat`) - messaging system with buyers
- Product browsing (`/products`) with seller status warnings and **category filtering**
- **Product reviews** - submit, view, filter by rating
- **Buyer chat** (`/chat`) - contact sellers about products
- **Order management** (`/orders`) - view order history, status tracking, submit reviews
- Toast notification system
- Independent admin login
- **Category-based product organization** with URL parameter filtering
- **Guest mode** - browse products without login
- **Homepage category carousel** - auto-rotating image cards
- **Cart functionality** - add/remove/update with direct fetch workaround
- **Product detail pages** - with seller info and add-to-cart
- **Responsive design** - mobile-first approach across all pages

### 🚧 Placeholder/Partial
- Checkout flow (functional but basic UI)
- Payment integration (mocked)

## Common Issues & Solutions

### Supabase Queries Hanging in Browser (CRITICAL)
**Symptoms**:
- Products not loading on homepage for guests
- Product detail pages stuck on loading spinner
- Cart operations never complete
- "添加中..." button stays disabled forever
- No network requests appear in DevTools

**Cause**: `@supabase/supabase-js` v2.47.10 completely hangs in browser environment

**Fix**: Use `lib/supabase-fetch.ts` functions instead of SDK for data queries:
```typescript
// ❌ AVOID - hangs forever
const { data } = await supabase.from('products').select('*')

// ✅ USE instead
import { getAllProducts } from '@/lib/supabase-fetch'
const data = await getAllProducts()
```

**Important**: This only affects data queries. Auth operations (`supabase.auth.*`) work fine.

### Cart "添加中..." Button Stuck
**Causes**:
1. CartProvider using hanging SDK for data queries
2. Missing `finally` block to reset button state

**Fix**:
1. Update CartProvider to use `lib/supabase-fetch.ts` functions
2. Add `finally { setAdding(false) }` to button click handlers

### 401 Unauthorized Error on Cart Operations
**Cause**: Cart operations require user auth token, but only using anon key
**Fix**: Ensure `lib/supabase-fetch.ts` reads user token from localStorage:
```typescript
function getUserToken(): string | null {
  const authData = localStorage.getItem('sb-{project}-auth-token')
  if (authData) {
    const parsed = JSON.parse(authData)
    return parsed?.access_token || null
  }
  return null
}
```

### Navigation Links Not Working
**Symptoms**: Clicking category links or "查看全部" causes infinite loading
**Cause**: Destination page using hanging SDK for queries
**Fix**: Update all page components to use `lib/supabase-fetch.ts` functions

### Login Stuck on "登录中..."
**Cause**: Using `finally` block that executes before `window.location.replace()` completes
**Fix**: Remove `finally` block, only call `setLoading(false)` in `catch` block

### Session Not Persisting After Login
**Cause**: Using `@supabase/ssr` createBrowserClient without proper cookie setup
**Fix**: Use standard `@supabase/supabase-js` createClient (auto-handles localStorage)

### Admin Page Shows Blank/Loading Forever
**Causes**:
1. Profile record missing in database
2. Wrong Supabase client being used

**Fix**:
- Use standard `createClient` from `@supabase/supabase-js`
- Verify profile exists with same ID as auth.users

### Products Query Error: "Could not find 'category' column"
**Cause**: Using old text `category` field instead of `category_id` FK
**Fix**: Update queries to use `category_id` and join with categories table:
```typescript
.select('*, category:categories(id, name, slug)')
```

### Seller Applications Query Error (PGRST201)
**Cause**: Ambiguous foreign key relationship
**Fix**: Use explicit FK syntax: `profiles!seller_applications_user_id_fkey`

### Orders Query Error: Foreign Key Not Found (PGRST200)
**Symptoms**: `Could not find a relationship between 'orders' and 'profiles'` when trying to join user info
**Cause**: Attempting to use a non-existent or incorrectly named foreign key relationship
**Fix**: Let PostgREST auto-detect relationships or verify actual FK names in database
```typescript
// ❌ WRONG - may not exist
.select('*, user:profiles!orders_user_id_fkey(id,email,full_name)')

// ✅ CORRECT - omit join if FK doesn't exist, use user_id directly
.select('*, order_items(...)')
// Then display order.user_id directly in UI
```

### Chat Table Name Errors
**Symptoms**: `Could not find the table 'public.chat_conversations'` or `'public.chat_messages'`
**Cause**: Code using `chat_conversations`/`chat_messages` but database tables are `conversations`/`messages`
**Fix**: Use correct table names without `chat_` prefix:
```typescript
// ❌ WRONG
supabaseFetch('chat_conversations?...')
supabaseFetch('chat_messages?...')

// ✅ CORRECT
supabaseFetch('conversations?...')
supabaseFetch('messages?...')
```

### Chat Foreign Key Explicit Specification
**Symptoms**: `Could not find a relationship between 'conversations' and 'products'`
**Cause**: PostgREST cannot auto-detect the FK relationship
**Fix**: Explicitly specify the foreign key name:
```typescript
// ❌ WRONG - implicit relationship
.select('*, product:products(id,name,images)')

// ✅ CORRECT - explicit FK
.select('*, product:products!conversations_product_id_fkey(id,name,images)')
```

### Missing date-fns Dependency
**Symptoms**: `Module not found: Can't resolve 'date-fns'` in chat components
**Cause**: Chat UI uses `formatDistanceToNow` from date-fns for timestamps
**Fix**: Install the package:
```bash
npm install date-fns
```

## File Structure

```
app/
├── (auth)/
│   ├── login/page.tsx              # Main site login
│   └── signup/page.tsx             # User registration
├── admin/
│   ├── layout.tsx                  # Admin auth guard (no forced logout)
│   ├── login/page.tsx              # Independent admin login
│   ├── page.tsx                    # Dashboard with stats
│   ├── applications/page.tsx       # Approve/reject seller applications
│   └── users/page.tsx              # User management (role upgrades/downgrades)
├── seller/
│   ├── products/
│   │   ├── page.tsx               # Product list
│   │   ├── new/page.tsx           # Create product
│   │   └── [id]/edit/page.tsx     # Edit product
│   ├── orders/page.tsx            # Orders containing seller's products
│   ├── reviews/page.tsx           # Product reviews management
│   ├── chat/page.tsx              # Seller chat with buyers
│   ├── settings/page.tsx          # Seller profile settings
│   └── page.tsx                   # Seller dashboard
├── apply-seller/page.tsx          # Seller application form
├── profile/page.tsx               # User profile + seller status
├── products/
│   ├── page.tsx                   # Browse all products (with category filtering)
│   └── [id]/page.tsx              # Product detail page with reviews
├── orders/page.tsx                # User order history (submit reviews)
├── cart/page.tsx                  # Shopping cart
├── checkout/page.tsx              # Checkout flow
├── chat/page.tsx                  # Buyer chat with sellers
├── page.tsx                       # Homepage with category carousel
└── providers/
    ├── AuthProvider.tsx           # Global auth state
    └── CartProvider.tsx           # Cart state (uses supabase-fetch)

components/
├── layout/
│   ├── Header.tsx                 # Site header with cart count
│   └── Footer.tsx                 # Site footer
├── product/
│   └── ProductCard.tsx            # Product card with seller status badge
├── review/
│   ├── ReviewForm.tsx             # Submit review form
│   ├── ReviewList.tsx             # Display reviews with filtering
│   └── ReviewStats.tsx            # Rating distribution display
├── chat/
│   ├── ConversationList.tsx       # List of conversations
│   └── ChatWindow.tsx             # Message display and input
└── ui/
    └── Toast.tsx                  # Notification component

hooks/
├── useAuth.ts                     # Authentication hook
├── useCart.ts                     # Shopping cart hook
└── useChat.ts                     # Chat messaging hook

lib/
├── supabase.ts                    # Standard Supabase client (auth only)
└── supabase-fetch.ts              # ⚠️ CRITICAL - Direct fetch workaround for data queries
```

## Environment Variables

Required in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
```

Optional (for server-side operations):
```env
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Development Notes

- **Port**: Usually runs on port 3000, auto-assigns 3001 if busy
- **Language**: UI is in Chinese (Simplified)
- **Hot Reload**: Fast Refresh enabled, full reloads on provider changes
- **Database**: Run SQL scripts in Supabase SQL Editor, not via API (RLS policies block API inserts)
- **Adding Products**: Use UI at `/seller/products/new` or SQL scripts in Supabase dashboard
- **Scripts**: Node.js scripts in `/scripts` folder for database operations (require `dotenv` package)
  - Scripts will fail with RLS errors - always use SQL Editor for batch operations
  - See `add-more-products.sql` for example batch product insertion

## Initial Setup

### 1. Create Admin Account
```sql
-- First create user via Supabase Auth UI, then:
UPDATE profiles
SET role = 'admin'
WHERE email = 'admin@gmail.com';
```

### 2. Create Categories
```sql
INSERT INTO categories (name, slug, description, display_order) VALUES
('电子产品', 'electronics', '手机、电脑、相机等电子产品', 0),
('服装鞋包', 'fashion', '时尚服装和配饰', 1),
('家居生活', 'home', '家具、家纺、厨具等', 2),
('图书音像', 'books', '图书、音乐、影视作品', 3),
('运动户外', 'sports', '运动器材和户外装备', 4);
```

### 3. Add Test Products
See `/add-products.sql` for batch product insertion script. Execute in Supabase SQL Editor.
