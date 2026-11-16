import { useState, useEffect } from "react";

export type Theme = "light" | "dark" | "system";

export interface QuickNewsSettings {
  theme: Theme;
  defaultCategory: string;
  pageSize: number;
}

const SETTINGS_KEY = "quick-news:settings";

export const DEFAULT_SETTINGS: QuickNewsSettings = {
  theme: "system",
  defaultCategory: "All",
  pageSize: 10,
};

export function useQuickNewsSettings() {
  const [settings, setSettings] = useState<QuickNewsSettings>(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch {
      // fallback
    }
    return DEFAULT_SETTINGS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {
      // fallback
    }
  }, [settings]);

  const updateSettings = (partial: Partial<QuickNewsSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  };

  return {
    settings,
    updateSettings,
  };
}
