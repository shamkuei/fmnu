"use client";

import { Loader2, Save } from "lucide-react";
import { useState } from "react";
import { updateRestaurantAction } from "@/actions/restaurants";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  matchPreset,
  themeKeys,
  themeLabels,
  themePresets,
  type ThemeColors,
} from "@/lib/theme-presets";

type ThemeEditorProps = {
  restaurantId: string;
  theme: Record<string, string> | null;
};

function defaultColors(): ThemeColors {
  return {
    "--text-primary": "#111827",
    "--text-secondary": "#6b7280",
    "--bg-base": "#ffffff",
    "--bg-card": "#ffffff",
    "--border": "#e5e7eb",
    "--text-accent": "#171717",
  };
}

function themeFromRecord(theme: Record<string, string> | null): ThemeColors {
  const base = defaultColors();
  if (!theme) return base;
  for (const key of themeKeys) {
    if (theme[key]) base[key] = theme[key];
  }
  return base;
}

export function ThemeEditor({ restaurantId, theme }: ThemeEditorProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const initialColors = themeFromRecord(theme);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(
    matchPreset(theme),
  );
  const [colors, setColors] = useState<ThemeColors>(initialColors);

  function applyPreset(key: string) {
    const preset = themePresets.find((p) => p.key === key);
    if (!preset) return;
    setSelectedPreset(key);
    setColors({ ...preset.colors });
  }

  function updateColor(key: keyof ThemeColors, value: string) {
    setColors((prev) => {
      const next = { ...prev, [key]: value };
      const preset = themePresets.find((p) => p.key === selectedPreset);
      if (preset) {
        const stillMatches = themeKeys.every(
          (k) => next[k] === preset.colors[k],
        );
        if (!stillMatches) setSelectedPreset(null);
      }
      return next;
    });
  }

  async function handleSave() {
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      await updateRestaurantAction({
        restaurantId,
        theme: { ...colors },
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در ذخیره تم");
    } finally {
      setLoading(false);
    }
  }

  const previewVars = {
    "--background": colors["--bg-base"],
    "--foreground": colors["--text-primary"],
    "--card": colors["--bg-card"],
    "--card-foreground": colors["--text-primary"],
    "--primary": colors["--text-accent"],
    "--primary-foreground": colors["--bg-base"],
    "--muted-foreground": colors["--text-secondary"],
    "--border": colors["--border"],
  } as React.CSSProperties;

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
          تم با موفقیت ذخیره شد
        </div>
      )}

      {/* Preset Picker */}
      <section className="space-y-3">
        <h3 className="font-semibold text-foreground">پوسته آماده</h3>
        <div className="grid grid-cols-5 gap-3">
          {themePresets.map((preset) => (
            <button
              key={preset.key}
              type="button"
              onClick={() => applyPreset(preset.key)}
              className={`group relative overflow-hidden rounded-lg border-2 p-2 transition-all ${
                selectedPreset === preset.key
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div
                className="mb-2 h-12 w-full rounded"
                style={{
                  backgroundColor: preset.colors["--bg-base"],
                  borderColor: preset.colors["--border"],
                  borderWidth: 1,
                }}
              >
                <div className="flex h-full flex-col items-center justify-center gap-1 p-1">
                  <div
                    className="h-1.5 w-8 rounded-full"
                    style={{
                      backgroundColor: preset.colors["--text-primary"],
                    }}
                  />
                  <div
                    className="h-1 w-6 rounded-full"
                    style={{
                      backgroundColor: preset.colors["--text-secondary"],
                    }}
                  />
                  <div
                    className="h-1 w-5 rounded-full"
                    style={{
                      backgroundColor: preset.colors["--text-accent"],
                    }}
                  />
                </div>
              </div>
              <p className="text-center text-xs font-medium text-foreground">
                {preset.name}
              </p>
            </button>
          ))}
        </div>
      </section>

      <Separator />

      {/* Color Overrides */}
      <section className="space-y-4">
        <h3 className="font-semibold text-foreground">سفارشی‌سازی رنگ‌ها</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {themeKeys.map((key) => (
            <div key={key} className="flex items-center gap-3">
              <input
                type="color"
                value={colors[key]}
                onChange={(e) => updateColor(key, e.target.value)}
                className="h-9 w-12 shrink-0 cursor-pointer rounded border border-border"
              />
              <Label className="text-sm">{themeLabels[key]}</Label>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* Live Preview */}
      <section className="space-y-3">
        <h3 className="font-semibold text-foreground">پیش‌نمایش</h3>
        <div
          style={previewVars}
          className="overflow-hidden rounded-lg border border-border"
        >
          <div className="p-4">
            <div className="mb-3 flex items-center gap-2">
              <div
                className="size-8 rounded-lg"
                style={{ backgroundColor: "var(--text-accent)" }}
              />
              <div>
                <div
                  className="h-3 w-20 rounded font-bold"
                  style={{
                    backgroundColor: "var(--foreground)",
                    opacity: 0.8,
                  }}
                />
                <div
                  className="mt-1 h-2 w-14 rounded"
                  style={{
                    backgroundColor: "var(--muted-foreground)",
                    opacity: 0.5,
                  }}
                />
              </div>
            </div>

            <div
              className="mb-3 rounded-lg border p-3"
              style={{
                backgroundColor: "var(--card)",
                borderColor: "var(--border)",
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div
                    className="mb-1 h-2.5 w-16 rounded font-medium"
                    style={{
                      backgroundColor: "var(--card-foreground)",
                      opacity: 0.8,
                    }}
                  />
                  <div
                    className="h-2 w-24 rounded"
                    style={{
                      backgroundColor: "var(--muted-foreground)",
                      opacity: 0.4,
                    }}
                  />
                </div>
                <div
                  className="h-2 w-10 rounded font-semibold"
                  style={{
                    backgroundColor: "var(--primary)",
                    opacity: 0.7,
                  }}
                />
              </div>
            </div>

            <div
              className="rounded-lg border p-3 opacity-60"
              style={{
                backgroundColor: "var(--card)",
                borderColor: "var(--border)",
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div
                    className="mb-1 h-2.5 w-20 rounded font-medium"
                    style={{
                      backgroundColor: "var(--card-foreground)",
                      opacity: 0.8,
                    }}
                  />
                  <div
                    className="h-2 w-28 rounded"
                    style={{
                      backgroundColor: "var(--muted-foreground)",
                      opacity: 0.4,
                    }}
                  />
              </div>
            </div>
            </div>
          </div>
        </div>
      </section>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : <Save />}
          {loading ? "در حال ذخیره..." : "ذخیره تم"}
        </Button>
      </div>
    </div>
  );
}
