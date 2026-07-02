# Styling System Documentation

## Overview

This project uses a **CSS-variable-driven theming architecture** built on Tailwind CSS v4, Shadcn UI (base-nova style), and per-restaurant runtime theme customization. The entire color system flows through CSS custom properties, enabling both dark mode support and dynamic per-restaurant theming without rebuilds.

---

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Utility CSS | Tailwind CSS v4 | Class-based styling, no config file (uses `@theme` inline) |
| UI Components | Shadcn UI (base-nova) | Pre-built accessible components using `@base-ui/react` primitives |
| Variant System | `class-variance-authority` (CVA) | Type-safe component variants (`button`, `badge`, etc.) |
| Class Merging | `clsx` + `tailwind-merge` via `cn()` | Safe conditional class composition |
| Animations | `tw-animate-css` | Transition/animation utilities |
| Color Space | OKLCH | Perceptually uniform colors in `:root` defaults |
| Typography | Vazirmatn (Google Fonts) | Persian/Arabic font with RTL support |
| Icons | Lucide React | SVG icon library |

---

## Architecture

### Three-Layer Variable System

```
Layer 1: Source Variables (restaurant theme)
  --text-primary, --bg-base, --text-accent, ...

       ↓ mapped via themeVars

Layer 2: Semantic Variables (Tailwind integration)
  --background, --foreground, --primary, --card, ...

       ↓ mapped via @theme inline

Layer 3: Tailwind Color Tokens
  bg-background, text-foreground, bg-primary, text-muted-foreground, ...
```

**Why three layers?** The source variables are restaurant-specific and user-editable (6 colors). The semantic variables provide the full set that Shadcn components expect. The `@theme` directive bridges them into Tailwind classes.

---

## File Map

```
src/
├── app/
│   ├── globals.css              # Root CSS: @theme, :root variables, base layer
│   ├── layout.tsx               # Font loading (Vazirmatn), RTL direction
│   └── [restaurantSlug]/
│       └── page.tsx             # Restaurant theme application (inline styles)
├── lib/
│   ├── utils.ts                 # cn() helper (clsx + tailwind-merge)
│   └── theme-presets.ts         # 10 preset themes, ThemeColors type, matchPreset()
├── components/
│   ├── ui/                      # Shadcn UI components (CVA variants)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── separator.tsx
│   │   ├── tabs.tsx
│   │   └── ...
│   └── admin/
│       └── theme-editor.tsx     # Admin theme picker + color overrides + preview
└── db/
    └── schema.ts                # Restaurant.theme field (JSON)
```

---

## Layer 1: globals.css

**File:** `src/app/globals.css`

### `@theme inline` — Tailwind Token Mapping

Maps CSS variables to Tailwind color/radius/font tokens:

```css
@theme inline {
  /* Colors → Tailwind tokens */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);

  /* Radii (derived from --radius) */
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --radius-2xl: calc(var(--radius) + 8px);

  /* Fonts */
  --font-sans: var(--font-vazirmatn), system-ui, sans-serif;
  --font-mono: var(--font-geist-mono), monospace;
}
```

This means `bg-background`, `text-foreground`, `bg-primary`, etc. all resolve through CSS variables.

### `:root` — Default Light Theme (OKLCH)

```css
:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);           /* white */
  --foreground: oklch(0.145 0 0);       /* near-black */
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);          /* dark */
  --primary-foreground: oklch(0.985 0 0); /* off-white */
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325); /* red */
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
}
```

### Dark Mode

Dark mode is triggered by OS preference (`prefers-color-scheme: dark`), not a class toggle. All semantic variables are redefined with inverted values under the media query.

### `@layer base` — Global Defaults

```css
@layer base {
  * { @apply border-border outline-ring/50; }
  body { @apply bg-background text-foreground; }
}
```

Every element gets `border-color: var(--border)` by default. Body uses semantic colors.

---

## Layer 2: Restaurant Theme System

### Database Storage

**Schema:** `src/db/schema.ts`

```typescript
export const restaurants = sqliteTable("restaurant", {
  // ...
  theme: text({ mode: "json" }).$type<Record<string, string>>(),
});
```

Stored as JSON, e.g.:
```json
{
  "--text-primary": "#1a1a2e",
  "--text-secondary": "#555",
  "--bg-base": "#fafafa",
  "--bg-card": "#ffffff",
  "--border": "#e0e0e0",
  "--text-accent": "#e63946"
}
```

### Theme Presets

**File:** `src/lib/theme-presets.ts`

10 predefined themes:

| Key | Name | Vibe |
|-----|------|------|
| `classic` | کلاسیک | White background, dark text, red accent |
| `dark` | تیره | Dark background, light text, purple accent |
| `warm` | گرم | Cream background, brown text, orange accent |
| `cool` | سرد | Blue-gray background, navy text, blue accent |
| `forest` | جنگلی | Green-tinted background, green accent |
| `gold` | طلایی | Warm cream, golden accent |
| `metro` | مترو | Stark white/black, red accent |
| `coral` | مرجانی | Pink-tinted background, coral accent |
| `lavender` | لاوندر | Purple-tinted background, violet accent |
| `minimal` | مینیمال | Pure white, black text, black accent |

Each preset defines 6 source variables:

| Variable | Label | Role |
|----------|-------|------|
| `--text-primary` | رنگ متن اصلی | Headings, important text |
| `--text-secondary` | رنگ متن فرعی | Descriptions, subtitles |
| `--bg-base` | رنگ پس‌زمینه | Page background |
| `--bg-card` | رنگ کارت‌ها | Card/product backgrounds |
| `--border` | رنگ حاشیه | Borders, dividers |
| `--text-accent` | رنگ تاکیدی | CTAs, links, prices, highlights |

### Theme Application on Public Menu

**File:** `src/app/[restaurantSlug]/page.tsx`

```typescript
const themeVars = {
  // Map source variables → semantic variables with fallbacks
  "--background": "var(--bg-base, #ffffff)",
  "--foreground": "var(--text-primary, #111827)",
  "--card": "var(--bg-card, #ffffff)",
  "--card-foreground": "var(--text-primary, #111827)",
  "--primary": "var(--text-accent, #171717)",
  "--primary-foreground": "var(--bg-base, #ffffff)",
  "--muted-foreground": "var(--text-secondary, #6b7280)",
  "--border": "var(--border, #e5e7eb)",
  // Restaurant theme overrides everything above
  ...((restaurant.theme as Record<string, string>) || {}),
};

return (
  <div style={themeVars as React.CSSProperties}>
    {/* menu content using Tailwind semantic classes */}
  </div>
);
```

The spread `...restaurant.theme` allows the theme JSON to override either:
- **Source variables** (`--text-primary`, `--bg-base`) — which are referenced by the semantic mappings
- **Semantic variables directly** (`--background`, `--primary`) — bypassing the indirection

### Theme Override Flow

```
1. Base fallbacks are set:
   --background: "var(--bg-base, #ffffff)"

2. Restaurant theme JSON spreads on top:
   { "--bg-base": "#121212", "--text-accent": "#bb86fc" }

3. CSS resolves:
   --background → var(--bg-base) → #121212 ✓
   --primary    → var(--text-accent) → #bb86fc ✓

4. Tailwind classes resolve:
   bg-background → #121212
   text-primary  → #bb86fc
```

---

## Layer 3: Component System

### `cn()` Utility

**File:** `src/lib/utils.ts`

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

Used in every UI component for safe class merging. Handles conflicts (e.g., `cn("p-4", "p-6")` → `"p-6"`).

### Shadcn UI Components

All components in `src/components/ui/` follow the same pattern:

1. **Base primitive** from `@base-ui/react` (accessible, unstyled)
2. **Variants** via `cva()` from `class-variance-authority`
3. **Class merging** via `cn()`
4. **Semantic color classes** (not hardcoded colors)

#### Button Variants

| Variant | Classes |
|---------|---------|
| `default` | `bg-primary text-primary-foreground` |
| `outline` | `border-border bg-background hover:bg-muted` |
| `secondary` | `bg-secondary text-secondary-foreground` |
| `ghost` | `hover:bg-muted hover:text-foreground` |
| `destructive` | `bg-destructive/10 text-destructive` |
| `link` | `text-primary underline-offset-4 hover:underline` |

#### Button Sizes

| Size | Height | Notes |
|------|--------|-------|
| `xs` | 24px | Extra small |
| `sm` | 28px | Small |
| `default` | 32px | Standard |
| `lg` | 36px | Large |
| `icon` | 32×32px | Square icon-only |
| `icon-xs` | 24×24px | Small icon-only |
| `icon-sm` | 28×28px | Medium icon-only |
| `icon-lg` | 36×36px | Large icon-only |

#### Card

Uses `bg-card text-card-foreground ring-1 ring-foreground/10`. Supports `size="sm"` for compact cards.

#### Badge Variants

Same pattern as button: `default`, `secondary`, `destructive`, `outline`, `ghost`, `link`.

### Full Component List

| Component | File | Key Features |
|-----------|------|-------------|
| Button | `button.tsx` | 6 variants, 8 sizes |
| Card | `card.tsx` | Header, Content, Footer, Title, Description, Action |
| Badge | `badge.tsx` | 6 variants |
| Dialog | `dialog.tsx` | Modal overlay |
| Dropdown Menu | `dropdown-menu.tsx` | Context menus |
| Input | `input.tsx` | Text inputs |
| Label | `label.tsx` | Form labels |
| Separator | `separator.tsx` | Horizontal/vertical dividers |
| Switch | `switch.tsx` | Toggle switch |
| Tabs | `tabs.tsx` | Tab navigation |
| Textarea | `textarea.tsx` | Multi-line input |
| Tooltip | `tooltip.tsx` | Hover info |
| Skeleton | `skeleton.tsx` | Loading placeholder |
| Alert Dialog | `alert-dialog.tsx` | Confirmation dialogs |

---

## RTL & Typography

### Layout

**File:** `src/app/layout.tsx`

```tsx
<html lang="fa" dir="rtl" suppressHydrationWarning>
  <body className={`${vazirmatn.variable} font-sans antialiased min-h-full flex flex-col`}>
```

- **Direction:** `dir="rtl"` on `<html>` — all layouts flow right-to-left
- **Font:** Vazirmatn loaded via `next/font/google`, exposed as CSS variable `--font-vazirmatn`
- **Tailwind font:** `font-sans` resolves to `var(--font-vazirmatn), system-ui, sans-serif`
- **Smoothing:** `antialiased` for better font rendering

### RTL Considerations in Components

- Phone numbers and English text use `dir="ltr"` to prevent visual bugs
- `justify-between` and `flex items-center gap-*` work correctly in both directions
- Margin/padding utilities like `mr-*` / `ml-*` are **not** used — `gap-*` and `px-*` are direction-agnostic

---

## Color Usage Patterns

### Semantic Color Map

| Tailwind Class | CSS Variable | Usage |
|---------------|-------------|-------|
| `bg-background` | `--background` | Page backgrounds |
| `text-foreground` | `--foreground` | Primary text |
| `bg-card` | `--card` | Card surfaces |
| `text-card-foreground` | `--card-foreground` | Card text |
| `bg-primary` | `--primary` | CTAs, buttons, active states |
| `text-primary` | `--primary` | Links, accent text, prices |
| `text-primary-foreground` | `--primary-foreground` | Text on primary backgrounds |
| `bg-secondary` | `--secondary` | Secondary surfaces |
| `bg-muted` | `--muted` | Subtle backgrounds |
| `text-muted-foreground` | `--muted-foreground` | Descriptions, secondary text |
| `border-border` | `--border` | All borders |
| `bg-destructive` | `--destructive` | Error states, danger zones |
| `text-destructive` | `--destructive` | Error text |

### Opacity Patterns

Colors are frequently used with opacity modifiers:
- `bg-primary/10` — 10% primary for subtle tints
- `bg-primary/5` — 5% primary for hero gradient
- `bg-destructive/10` — 10% red for error backgrounds
- `ring-foreground/10` — 10% foreground for card ring
- `border-border/50` — 50% border for subtle separators

---

## Admin Theme Editor

**File:** `src/components/admin/theme-editor.tsx`

Located at `/admin/[restaurantId]` → "تم" tab.

### Features

1. **Preset Picker** — Grid of 10 color-swatch cards. Clicking a preset fills all 6 color values.
2. **Color Overrides** — Native `<input type="color">` pickers for each of the 6 source variables.
3. **Live Preview** — Miniature menu mockup that updates in real-time as colors change.
4. **Save** — Calls `updateRestaurantAction({ restaurantId, theme: {...colors} })`.

### Preset Matching Logic

`matchPreset()` checks if the current theme exactly matches any preset. If the admin has overridden even one color, the preset is deselected (visual indicator disappears).

---

## Adding a New Preset

1. Open `src/lib/theme-presets.ts`
2. Add to the `themePresets` array:
   ```typescript
   {
     key: "ocean",
     name: "اقیانوس",
     colors: {
       "--text-primary": "#0a2540",
       "--text-secondary": "#5a7a9a",
       "--bg-base": "#f0f7ff",
       "--bg-card": "#ffffff",
       "--border": "#c4ddf0",
       "--text-accent": "#0066cc",
     },
   }
   ```
3. The grid auto-renders from the array — no other changes needed.

---

## Adding a New Theme Variable

1. Add the key to `ThemeColors` type in `theme-presets.ts`
2. Add it to `themeKeys` and `themeLabels`
3. Add the value to every preset in `themePresets`
4. Add it to `defaultColors()` in `theme-editor.tsx`
5. Map it to a semantic variable in `[restaurantSlug]/page.tsx` if needed

---

## Dark Mode Notes

- Dark mode uses `@custom-variant dark (&:is(.dark *))` but is currently triggered by `prefers-color-scheme: dark` media query
- The restaurant theme system **does not** support separate light/dark themes — the admin-picked theme applies to all visitors
- Components use `dark:` prefixed classes (e.g., `dark:bg-destructive/20`) for OS-level dark mode in the admin panel
- The public menu page (`[restaurantSlug]`) overrides variables via inline styles, which bypasses the dark media query

---

## Responsive Design

The project uses mobile-first responsive patterns:

| Breakpoint | Prefix | Typical Usage |
|-----------|--------|--------------|
| ≥640px | `sm:` | Two-column grids, larger text |
| ≥768px | `md:` | (not heavily used) |
| ≥1024px | `lg:` | Hero text sizing |

Common patterns:
- `grid gap-4 sm:grid-cols-2` — single column mobile, two columns desktop
- `text-4xl sm:text-6xl lg:text-7xl` — progressive text scaling
- `flex-col sm:flex-row` — stack on mobile, row on desktop
- `hidden sm:flex` — hide on mobile, show on desktop
- Menu page constrained with `mx-auto max-w-3xl` — readable width on all screens
