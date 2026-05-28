# fmnu — Online Restaurant Menu

fmnu is a Next.js application for creating and managing online restaurant menus. It is built with RTL/Persian (Farsi) as the primary language and uses phone-based OTP authentication.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Database | SQLite (via better-sqlite3) |
| ORM | Drizzle ORM |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui (base-ui) |
| Validation | Zod v4 |
| Font | Vazirmatn (Persian/Arabic) |
| Linter/Formatter | Biome |
| Auth | Phone OTP + session cookies |

---

## Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Landing page
│   ├── layout.tsx                # Root layout (RTL, Vazirmatn font)
│   ├── globals.css               # Global styles
│   ├── auth/login/page.tsx       # Phone login page
│   ├── [restaurantSlug]/page.tsx # Public menu view (with contact/socials)
│   └── admin/
│       ├── page.tsx              # Admin dashboard (restaurant list + create)
│       └── [restaurantId]/
│           ├── page.tsx          # Restaurant detail (tabs: overview + edit)
│           └── menu/page.tsx     # Menu editor (full CRUD)
│
├── actions/                      # Next.js Server Actions
│   ├── auth.ts                   # OTP request, login, logout, session
│   ├── menu.ts                   # Menu CRUD + reorder
│   ├── restaurants.ts           # Restaurant CRUD + stats + delete
│   └── upload.ts                 # File upload (saves to public/uploads/)
│
├── modules/                      # Domain business logic (services)
│   ├── auth/
│   │   ├── auth.service.ts       # Session creation (loginUser)
│   │   ├── authorizer.service.ts # Session validation from sessionId
│   │   ├── complete-user.type.ts # UserWithRoles type definition
│   │   └── flows/
│   │       ├── request-otp.ts    # Flow: request OTP for a phone number
│   │       ├── check-code.ts     # Flow: verify a code without consuming it
│   │       └── otp-login.ts      # Flow: consume code + find/create user + create session
│   ├── users/
│   │   └── users.service.ts      # User lookup, find-or-create by phone
│   ├── verification/
│   │   ├── verification.service.ts # OTP code generation, storage, sending, validation
│   │   └── reasons.ts            # Verification reason types (login, phoneVerification)
│   ├── phone/
│   │   └── sender.service.ts     # SMS sending via Payamak Panel API (or console log in dev)
│   └── restaurants/
│       └── restaurants.service.ts # Restaurant, category, and product CRUD + stats
│
├── db/                           # Database layer
│   ├── schema.ts                 # Drizzle table definitions (8 tables)
│   ├── relations.ts              # Drizzle relation definitions
│   └── index.ts                  # Database client initialization
│
├── lib/                          # Shared utilities
│   ├── flow/
│   │   ├── core.ts               # Flow & Layer types (middleware pipeline system)
│   │   ├── base.ts               # publicFlow() and defaultFlow() constructors
│   │   └── layers.ts             # Built-in layers: validator, authorize, cursorPaginate
│   ├── errors.ts                 # Exception classes (400, 401, 403, 404, 409)
│   ├── phone-zod.ts              # Zod phone number validator (Iran default)
│   └── utils.ts                  # General utility functions
│
├── components/
│   ├── ui/                       # shadcn/ui components
│   │   ├── alert-dialog.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── separator.tsx
│   │   ├── skeleton.tsx
│   │   ├── switch.tsx
│   │   ├── tabs.tsx
│   │   ├── textarea.tsx
│   │   └── tooltip.tsx
│   └── admin/                    # Admin panel components
│       ├── category-form-dialog.tsx    # Create/edit category dialog
│       ├── create-restaurant-dialog.tsx # New restaurant dialog
│       ├── delete-confirm-dialog.tsx   # Reusable delete confirmation
│       ├── delete-restaurant-button.tsx # Restaurant delete with confirm
│       ├── image-uploader.tsx          # File upload component
│       ├── menu-editor.tsx             # Full menu CRUD editor
│       ├── product-form-dialog.tsx     # Create/edit product dialog
│       ├── qr-code-card.tsx            # QR code display + download
│       └── restaurant-info-form.tsx    # Restaurant edit form
│
├── seed.ts                       # Database seeder (sample restaurant + products)
│
└── public/uploads/               # Uploaded images (logo, hero, product photos)
```

---

## Database Schema

### Users & Auth

| Table | Description |
|---|---|
| `users` | User accounts keyed by phone number. Tracks if user has ever logged in. |
| `sessions` | Session tokens (base64url random bytes). Expires after 30 days. Can be revoked. |
| `verifications` | OTP codes tied to a phone number and reason. Tracks resend count and cooldowns. |

### Restaurants & Menu

| Table | Description |
|---|---|
| `restaurants` | Restaurant profile: slug, name, brandText, description, logoUrl, heroImageUrl, address, phone, socialMedia (JSON), isAvailable, theme (JSON). |
| `restaurant_admins` | Many-to-many junction between users and restaurants (who can manage what). |
| `categories` | Menu categories per restaurant, with sort ordering. |
| `products` | Menu items belonging to a category and restaurant. Has price, description, imageUrl, availability flag, sort ordering. |

### Relations

```
User 1──N Sessions
User 1──N RestaurantAdmins N──1 Restaurant
Restaurant 1──N Categories 1──N Products
Restaurant 1──N Products
```

---

## Modules

### `auth` — Authentication & Session Management

Handles the full OTP login lifecycle.

**Services:**
- `auth.service.ts` — Creates a session for a user (30-day expiry, returns sessionId).
- `authorizer.service.ts` — Validates a sessionId, loads the user with roles, checks expiry/revocation.

**Flows (use the Flow pipeline system):**
- `request-otp` — Validates phone number, creates a verification record, sends SMS. Returns `verificationId` and `nextResend` timestamp.
- `check-code` — Validates phone + code without consuming it. Returns `{ valid, verificationId }`.
- `otp-login` — Consumes the code, finds or creates the user, creates a session. Returns `{ sessionId, user }`.

**Auth flow in Server Actions (`actions/auth.ts`):**
1. `requestOtpAction(phone)` — Initiates OTP
2. `checkCodeAction(phone, code)` — Pre-validates code
3. `otpLoginAction(phone, code)` — Completes login, sets `session-id` cookie
4. `getMeAction()` — Returns current user from session cookie
5. `logoutAction()` — Revokes session, deletes cookie
6. `resendOtpAction(verificationId)` — Resends a new code

### `users` — User Management

- `getFullUser(id)` — Loads user with admin roles and associated restaurants.
- `getFullUserByPhone(phone)` — Same lookup by phone.
- `findOrCreateByPhone(phone)` — Idempotent: returns existing user or creates one.

### `verification` — OTP Verification

- `generateCode()` — Generates a random 6-digit code.
- `createVerificationRecord(phone, reason)` — Creates or returns an existing active verification. Handles expiry.
- `sendVerificationSMS(phone, code)` — Delegates to SMS sender.
- `checkCode(phone, code, reason)` — Validates code without consuming it.
- `consumeCode(phone, code, reason)` — Validates AND marks code as used (one-time use).
- `resendCode(verificationId)` — Generates a new code, updates record, sends SMS. Enforces cooldown (resend count * 2 minutes).

**Verification reasons:** `login` (3 min expiry), `phoneVerification` (24h expiry).

### `phone` — SMS Sending

- `sendSMS({ to, text })` — In development (`NO_SMS !== "false"`), logs to console. In production, sends via the Payamak Panel SMS API using `SMS_USERNAME`, `SMS_PASSWORD`, `SMS_FROM` env vars.

### `restaurants` — Restaurant & Menu CRUD

**Restaurant operations:**
- `getRestaurantBySlug(slug)` — Loads restaurant with categories and products (sorted by sortOrder).
- `getRestaurantById(id)` — Loads restaurant by ID with categories and products.
- `getRestaurantsForAdmin(userId)` — Returns all restaurants a user can manage.
- `createRestaurant(data, userId)` — Creates restaurant and makes the user its admin.
- `updateRestaurant(restaurantId, data)` — Partial update of restaurant fields (including address, phone, socialMedia, isAvailable).
- `deleteRestaurant(restaurantId)` — Deletes restaurant and all associated data (cascade).
- `getRestaurantStats(restaurantId)` — Returns category count, product count, available product count.
- `isRestaurantAdmin(userId, restaurantId)` — Permission check.

**Category operations:**
- `createCategory`, `updateCategory`, `deleteCategory`

**Product operations:**
- `createProduct`, `updateProduct`, `deleteProduct`

---

## Flow Pipeline System (`lib/flow/`)

A custom middleware/pipeline abstraction inspired by layered architectures.

### Core Concepts

- **`Layer<Input, Adds, HKT>`** — A middleware function that receives context, can add to it, and calls `next()`.
- **`Flow`** — Composes multiple layers into a pipeline. Layers are executed in order, each adding context that the next layer (and the final action) can use.
- **`Action<Context, Output>`** — The final handler at the end of the pipeline.

### Built-in Layers

| Layer | Purpose |
|---|---|
| `validator(schema)` | Parses and validates raw input using a Zod schema. Adds `input` to context. Throws `BadRequestException` on failure. |
| `authorize(check?)` | Ensures `currentUser` exists (throws 401). Optional type-narrowing check (throws 403). Adds `authorizedUser` to context. |
| `cursorPaginate(toCursor)` | Handles cursor-based pagination input (`first/after/last/before`). Wraps array results into `{ pageInfo, edges }`. |

### Flow Constructors

- `publicFlow()` — No layers. Used for unauthenticated endpoints (e.g., OTP request).
- `defaultFlow(check?)` — Includes the `authorize` layer. Used for authenticated endpoints.

### Example

```typescript
export const requestOtp = publicFlow()
  .layer(validator(RequestOTPInput))    // validates phone
  .build(async ({ input }) => {         // handler receives validated input
    const { verification, isNew } = await createVerificationRecord(input.phone, "login");
    if (isNew) await sendVerificationSMS(input.phone, verification.code);
    return { verificationId: verification.id, nextResend: verification.nextResend };
  });
```

---

## Error Handling (`lib/errors.ts`)

Custom exception hierarchy:

| Exception | Status | Usage |
|---|---|---|
| `BadRequestException` | 400 | Validation errors, invalid input |
| `UnauthorizedException` | 401 | Missing or invalid session |
| `ForbiddenException` | 403 | Authenticated but not authorized |
| `NotFoundException` | 404 | Resource not found |
| `ConflictException` | 409 | Duplicate resource |
| `BaseException` | 500 | Base class, unexpected errors |

All exceptions have `.addMeta(data)` for attaching debug info and `.toResponse()` for consistent JSON error format.

---

## Server Actions

Server actions bridge the frontend and modules. Each action handles:
1. Reading the session cookie to authenticate the user
2. Calling the appropriate module service
3. Enforcing authorization (is this user an admin of this restaurant?)

| File | Actions |
|---|---|
| `auth.ts` | `requestOtpAction`, `checkCodeAction`, `otpLoginAction`, `getMeAction`, `logoutAction`, `resendOtpAction` |
| `menu.ts` | `getMenuAction`, `createCategoryAction`, `updateCategoryAction`, `deleteCategoryAction`, `createProductAction`, `updateProductAction`, `deleteProductAction`, `reorderCategoriesAction`, `reorderProductsAction` |
| `restaurants.ts` | `createRestaurantAction`, `updateRestaurantAction`, `deleteRestaurantAction`, `getMyRestaurantsAction`, `getRestaurantAction`, `getRestaurantStatsAction` |
| `upload.ts` | `uploadFile` — accepts FormData, saves file to `public/uploads/`, returns `/uploads/{name}` URL. Max 5MB, accepts jpg/png/webp/gif. |

---

## File Uploads

Images are uploaded via a server action (`actions/upload.ts`) and stored locally in `public/uploads/`. The `ImageUploader` component provides a click-to-upload UI with preview, remove button, and file validation.

Uploaded files are saved with a random hex filename to avoid collisions. The returned URL (`/uploads/{name}`) is stored in the database as a text field.

---

## Admin Dashboard

### `/admin` — Dashboard
- Lists user's restaurants with logo, slug preview, and action buttons
- "ساخت رستوران جدید" button opens create dialog (name, auto-generated slug, brandText, description)

### `/admin/[restaurantId]` — Restaurant Detail
- **Overview tab**: Stats cards (categories, products, available), QR code with download, danger zone for deletion
- **Edit tab**: Full edit form — basic info, availability toggle, image uploads (logo, hero), contact info, social media

### `/admin/[restaurantId]/menu` — Menu Editor
- Full CRUD for categories (create, edit, delete, reorder up/down)
- Full CRUD for products (create, edit, delete, reorder, toggle availability)
- Products can be moved between categories

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | No | SQLite database path (defaults to `dev.db`) |
| `NO_SMS` | No | Set to `"false"` to enable real SMS sending (default: console log) |
| `SMS_USERNAME` | Yes (prod) | Payamak Panel API username |
| `SMS_PASSWORD` | Yes (prod) | Payamak Panel API password |
| `SMS_FROM` | Yes (prod) | Payamak Panel sender number (bodyId) |
| `NODE_ENV` | No | `production` enables secure cookies |

---

## Styling

### Stack

| Tool | Version | Role |
|---|---|---|
| Tailwind CSS | v4 | Utility-first CSS (CSS-based config, no `tailwind.config.ts`) |
| @tailwindcss/postcss | v4 | PostCSS integration |
| shadcn/ui | base-nova | Pre-built UI primitives on `@base-ui/react` |
| class-variance-authority (CVA) | 0.7 | Variant definitions for shadcn components |
| clsx + tailwind-merge | — | `cn()` utility for conditional/merged class names |
| tw-animate-css | 1.4 | Animation utilities (`@import "tw-animate-css"`) |
| Vazirmatn | Google Fonts | Primary typeface (Arabic subset, Persian/RTL) |

### RTL & Font

- `<html lang="fa" dir="rtl">` — full RTL layout
- Vazirmatn loaded via `next/font/google` with CSS variable `--font-vazirmatn`
- Mapped to Tailwind's `--font-sans` so `font-sans` uses Vazirmatn everywhere
- Phone numbers and code inputs use `dir="ltr"` override with `font-mono` (Geist Mono)

### Color System (oklch)

All colors defined as CSS custom properties in `globals.css` using oklch color space.

**Semantic tokens (light):**

| Token | Value | Usage |
|---|---|---|
| `--background` | `oklch(1 0 0)` (white) | Page background |
| `--foreground` | `oklch(0.145 0 0)` (near-black) | Primary text |
| `--card` | `oklch(1 0 0)` | Card backgrounds |
| `--primary` | `oklch(0.205 0 0)` (dark) | Buttons, emphasis |
| `--primary-foreground` | `oklch(0.985 0 0)` | Text on primary |
| `--secondary` | `oklch(0.97 0 0)` | Secondary backgrounds |
| `--muted` | `oklch(0.97 0 0)` | Muted backgrounds |
| `--muted-foreground` | `oklch(0.556 0 0)` | Secondary/helper text |
| `--accent` | `oklch(0.97 0 0)` | Accent backgrounds |
| `--destructive` | `oklch(0.577 0.245 27.325)` | Error/danger states |
| `--border` | `oklch(0.922 0 0)` | Borders |
| `--input` | `oklch(0.922 0 0)` | Input borders |
| `--ring` | `oklch(0.708 0 0)` | Focus rings |

**Dark mode** activates via `@media (prefers-color-scheme: dark)` — no manual toggle. Dark values use the same tokens with inverted lightness and adjusted opacity for borders/inputs.

### Border Radius

Driven by a single `--radius: 0.625rem` (10px) variable with computed scales:

| Token | Value |
|---|---|
| `--radius-sm` | `--radius - 4px` (6px) |
| `--radius-md` | `--radius - 2px` (8px) |
| `--radius-lg` | `--radius` (10px) |
| `--radius-xl` | `--radius + 4px` (14px) |
| `--radius-2xl` | `--radius + 8px` (18px) |

### Theme System (Per-Restaurant)

The public menu page (`[restaurantSlug]/page.tsx`) supports per-restaurant theming. The `restaurants.theme` JSON column can override any CSS variable:

```tsx
const themeVars = {
  "--background": "var(--bg-base, #ffffff)",
  "--foreground": "var(--text-primary, #111827)",
  ...((restaurant.theme as Record<string, string>) || {}),
};
// Applied via: <div style={themeVars}>
```

Restaurant-level CSS vars like `--bg-base`, `--text-primary`, `--bg-card`, `--text-accent`, `--text-secondary` are defined as fallbacks and can be overridden by the stored theme object.

### shadcn/ui Components

Installed components (all in `src/components/ui/`):

| Component | Primitive | Variants |
|---|---|---|
| **AlertDialog** | `@base-ui/react/alert-dialog` | Confirmation dialogs with action/cancel |
| **Badge** | `@base-ui/react/use-render` | `default`, `secondary`, `destructive`, `outline`, `ghost`, `link` |
| **Button** | `@base-ui/react/Button` | `default`, `outline`, `secondary`, `ghost`, `destructive`, `link` × sizes: `xs`, `sm`, `default`, `lg`, `icon`, `icon-xs`, `icon-sm`, `icon-lg` |
| **Card** | `<div>` | `default`, `sm` (via `size` prop) — includes `CardHeader`, `CardTitle`, `CardDescription`, `CardAction`, `CardContent`, `CardFooter` |
| **Dialog** | `@base-ui/react/dialog` | Modal dialogs with header, footer, trigger |
| **DropdownMenu** | `@base-ui/react/menu` | Context menus with items, groups, separators |
| **Input** | `@base-ui/react/Input` | Single variant with focus/invalid/disabled states |
| **Label** | `<label>` | Single variant with disabled states |
| **Separator** | `@base-ui/react/Separator` | Horizontal/vertical |
| **Skeleton** | `<div>` | Loading placeholder with pulse animation |
| **Switch** | `@base-ui/react/switch` | Toggle switch (sm/default sizes) |
| **Tabs** | `@base-ui/react/tabs` | Tab navigation (default/line variants) |
| **Textarea** | `<textarea>` | Auto-sizing with focus/invalid states |
| **Tooltip** | `@base-ui/react/tooltip` | Hover tooltips (requires `TooltipProvider`) |

shadcn config (`components.json`): style `base-nova`, base color `neutral`, icon library `lucide`, RTL enabled.

### Tailwind Config

Tailwind v4 uses CSS-based configuration (no `tailwind.config.ts`). Everything is in `globals.css`:

- `@import "tailwindcss"` — base Tailwind
- `@import "tw-animate-css"` — animation utilities
- `@custom-variant dark (&:is(.dark *))` — dark mode variant (class-based fallback)
- `@theme inline { ... }` — maps CSS variables to Tailwind theme tokens (colors, radii, fonts)
- `@layer base { ... }` — global resets: border color, body background/text

### Utility: `cn()`

```typescript
// src/lib/utils.ts
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

Used throughout all components and pages for conditional class merging.

### Layout Patterns

- **Body**: `font-sans antialiased min-h-full flex flex-col`
- **Landing page**: `flex min-h-screen flex-col items-center justify-center px-4`
- **Admin pages**: `mx-auto max-w-3xl px-4 py-8` (or `max-w-4xl` for dashboard)
- **Public menu**: `mx-auto min-h-screen max-w-3xl px-4 py-8`
- **Grid layouts**: `grid gap-4 sm:grid-cols-2` for responsive card grids
- **Card hover**: `transition-colors hover:border-primary/30`
- **Unavailable items**: `opacity-50` class

---

## Running the Project

```bash
pnpm install        # Install dependencies
pnpm db:push        # Push schema to SQLite
pnpm db:seed        # Seed sample data (restaurant "dolopi" with 9 products)
pnpm dev            # Start dev server at http://localhost:3000
```

After seeding, visit:
- **Menu:** http://localhost:3000/dolopi
- **Admin:** http://localhost:3000/admin
