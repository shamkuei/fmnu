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
      "--text-primary": "#1a1a2e",
      "--text-secondary": "#555555",
      "--bg-base": "#fafafa",
      "--bg-card": "#ffffff",
      "--border": "#e0e0e0",
      "--text-accent": "#e63946",
    },
  },
  {
    key: "dark",
    name: "تیره",
    colors: {
      "--text-primary": "#f0f0f0",
      "--text-secondary": "#a0a0a0",
      "--bg-base": "#121212",
      "--bg-card": "#1e1e1e",
      "--border": "#333333",
      "--text-accent": "#bb86fc",
    },
  },
  {
    key: "warm",
    name: "گرم",
    colors: {
      "--text-primary": "#3d2b1f",
      "--text-secondary": "#8b6914",
      "--bg-base": "#fdf6ec",
      "--bg-card": "#fff8f0",
      "--border": "#e8d5b7",
      "--text-accent": "#d4763c",
    },
  },
  {
    key: "cool",
    name: "سرد",
    colors: {
      "--text-primary": "#1a2332",
      "--text-secondary": "#5a7a9a",
      "--bg-base": "#f0f4f8",
      "--bg-card": "#ffffff",
      "--border": "#c8d8e8",
      "--text-accent": "#2e86ab",
    },
  },
  {
    key: "forest",
    name: "جنگلی",
    colors: {
      "--text-primary": "#1b2e1b",
      "--text-secondary": "#5a7a5a",
      "--bg-base": "#f2f5f0",
      "--bg-card": "#ffffff",
      "--border": "#c0d4b8",
      "--text-accent": "#2d6a2d",
    },
  },
  {
    key: "gold",
    name: "طلایی",
    colors: {
      "--text-primary": "#2c1810",
      "--text-secondary": "#7a6040",
      "--bg-base": "#fdf8ef",
      "--bg-card": "#fffdf7",
      "--border": "#e0cfa8",
      "--text-accent": "#b8860b",
    },
  },
  {
    key: "metro",
    name: "مترو",
    colors: {
      "--text-primary": "#0d0d0d",
      "--text-secondary": "#666666",
      "--bg-base": "#ffffff",
      "--bg-card": "#f5f5f5",
      "--border": "#d9d9d9",
      "--text-accent": "#e50000",
    },
  },
  {
    key: "coral",
    name: "مرجانی",
    colors: {
      "--text-primary": "#2d1f1f",
      "--text-secondary": "#8a5a5a",
      "--bg-base": "#fdf0ef",
      "--bg-card": "#ffffff",
      "--border": "#e8c4c0",
      "--text-accent": "#e76f51",
    },
  },
  {
    key: "lavender",
    name: "لاوندر",
    colors: {
      "--text-primary": "#1f1a2e",
      "--text-secondary": "#6b5a8a",
      "--bg-base": "#f5f0fa",
      "--bg-card": "#ffffff",
      "--border": "#d4c4e8",
      "--text-accent": "#7c3aed",
    },
  },
  {
    key: "minimal",
    name: "مینیمال",
    colors: {
      "--text-primary": "#111111",
      "--text-secondary": "#888888",
      "--bg-base": "#ffffff",
      "--bg-card": "#ffffff",
      "--border": "#eeeeee",
      "--text-accent": "#111111",
    },
  },
];

export function matchPreset(theme: Record<string, string> | null): string | null {
  if (!theme) return null;
  for (const preset of themePresets) {
    const allMatch = themeKeys.every(
      (key) => theme[key] === preset.colors[key],
    );
    if (allMatch) return preset.key;
  }
  return null;
}
