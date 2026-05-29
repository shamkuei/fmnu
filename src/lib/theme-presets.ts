export type ThemeColors = {
  "--text-primary": string;
  "--text-secondary": string;
  "--bg-base": string;
  "--bg-card": string;
  "--border": string;
  "--text-accent": string;
};

export type ThemePreset = {
  key: string;
  name: string;
  colors: ThemeColors;
};

export const themeKeys: (keyof ThemeColors)[] = [
  "--text-primary",
  "--text-secondary",
  "--bg-base",
  "--bg-card",
  "--border",
  "--text-accent",
];

export const themeLabels: Record<keyof ThemeColors, string> = {
  "--text-primary": "رنگ متن اصلی",
  "--text-secondary": "رنگ متن فرعی",
  "--bg-base": "رنگ پس‌زمینه",
  "--bg-card": "رنگ کارت‌ها",
  "--border": "رنگ حاشیه",
  "--text-accent": "رنگ تاکیدی",
};

export const themePresets: ThemePreset[] = [
  {
    key: "classic",
    name: "کلاسیک",
    colors: {
      "--text-primary": "#1C1917",
      "--text-secondary": "#78716C",
      "--bg-base": "#FAFAF9",
      "--bg-card": "#FFFFFF",
      "--border": "#E7E5E4",
      "--text-accent": "#991B1B",
    },
  },
  {
    key: "dark",
    name: "تیره",
    colors: {
      "--text-primary": "#F5F5F4",
      "--text-secondary": "#A8A29E",
      "--bg-base": "#0C0A09",
      "--bg-card": "#1C1917",
      "--border": "#292524",
      "--text-accent": "#D97706",
    },
  },
  {
    key: "warm",
    name: "کافه",
    colors: {
      "--text-primary": "#3E2723",
      "--text-secondary": "#6D4C41",
      "--bg-base": "#FDF6EC",
      "--bg-card": "#FFFBF5",
      "--border": "#E0D2C0",
      "--text-accent": "#BF360C",
    },
  },
  {
    key: "cool",
    name: "اقیانوسی",
    colors: {
      "--text-primary": "#0F172A",
      "--text-secondary": "#64748B",
      "--bg-base": "#F0F9FF",
      "--bg-card": "#FFFFFF",
      "--border": "#CBD5E1",
      "--text-accent": "#0D9488",
    },
  },
  {
    key: "forest",
    name: "سبز",
    colors: {
      "--text-primary": "#14532D",
      "--text-secondary": "#3F7C5F",
      "--bg-base": "#F0FFF4",
      "--bg-card": "#FFFFFF",
      "--border": "#BBF7D0",
      "--text-accent": "#16A34A",
    },
  },
  {
    key: "gold",
    name: "لوکس",
    colors: {
      "--text-primary": "#FEF3C7",
      "--text-secondary": "#92702C",
      "--bg-base": "#18181B",
      "--bg-card": "#27272A",
      "--border": "#3F3F46",
      "--text-accent": "#EAB308",
    },
  },
  {
    key: "coral",
    name: "رز",
    colors: {
      "--text-primary": "#4C1D3E",
      "--text-secondary": "#9F5880",
      "--bg-base": "#FDF2F8",
      "--bg-card": "#FFFFFF",
      "--border": "#FBCFE8",
      "--text-accent": "#BE185D",
    },
  },
  {
    key: "metro",
    name: "مدرن",
    colors: {
      "--text-primary": "#0F172A",
      "--text-secondary": "#475569",
      "--bg-base": "#F8FAFC",
      "--bg-card": "#FFFFFF",
      "--border": "#E2E8F0",
      "--text-accent": "#1E40AF",
    },
  },
  {
    key: "lavender",
    name: "غروب",
    colors: {
      "--text-primary": "#431407",
      "--text-secondary": "#9A3412",
      "--bg-base": "#FFF7ED",
      "--bg-card": "#FFFFFF",
      "--border": "#FED7AA",
      "--text-accent": "#EA580C",
    },
  },
  {
    key: "minimal",
    name: "مینیمال",
    colors: {
      "--text-primary": "#09090B",
      "--text-secondary": "#71717A",
      "--bg-base": "#FFFFFF",
      "--bg-card": "#FFFFFF",
      "--border": "#E4E4E7",
      "--text-accent": "#09090B",
    },
  },
];

export function matchPreset(
  theme: Record<string, string> | null,
): string | null {
  if (!theme) return null;
  for (const preset of themePresets) {
    const allMatch = themeKeys.every(
      (key) => theme[key] === preset.colors[key],
    );
    if (allMatch) return preset.key;
  }
  return null;
}
