"use client";

import { IRAN_PROVINCES } from "@/lib/provinces";

export function ProvinceFilter({ value }: { value: string | undefined }) {
  return (
    <select
      name="province"
      defaultValue={value || ""}
      onChange={(e) => e.target.form?.requestSubmit()}
      className="h-11 rounded-xl border border-input bg-background px-4 text-sm text-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 focus:outline-none min-w-[160px]"
    >
      <option value="">همه استان‌ها</option>
      {IRAN_PROVINCES.map((p) => (
        <option key={p} value={p}>
          {p}
        </option>
      ))}
    </select>
  );
}
