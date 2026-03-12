
import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("ce_theme");
    if (saved) return saved === "dark";
    
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    localStorage.setItem("ce_theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggle = () => setIsDark(d => !d);

 
  const dark = {
    bg:          "#080c14",
    bgSecondary: "#0d1424",
    bgCard:      "rgba(255,255,255,0.03)",
    border:      "rgba(255,255,255,0.07)",
    text:        "#e2e8f0",
    textMuted:   "#64748b",
    textSubtle:  "#334155",
    accent:      "#4ade80",
    accentGlow:  "rgba(74,222,128,0.15)",
    danger:      "#f87171",
    input:       "rgba(255,255,255,0.05)",
    inputBorder: "rgba(255,255,255,0.1)",
    sidebar:     "linear-gradient(180deg, #0d1424 0%, #080c14 100%)",
    header:      "rgba(8,12,20,0.85)",
    overlay:     "rgba(0,0,0,0.7)",
  };

 
  const light = {
    bg:          "#f8fafc",
    bgSecondary: "#ffffff",
    bgCard:      "rgba(0,0,0,0.02)",
    border:      "rgba(0,0,0,0.08)",
    text:        "#0f172a",
    textMuted:   "#64748b",
    textSubtle:  "#94a3b8",
    accent:      "#16a34a",
    accentGlow:  "rgba(22,163,74,0.12)",
    danger:      "#dc2626",
    input:       "rgba(0,0,0,0.04)",
    inputBorder: "rgba(0,0,0,0.12)",
    sidebar:     "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
    header:      "rgba(248,250,252,0.9)",
    overlay:     "rgba(0,0,0,0.5)",
  };

  const theme = isDark ? dark : light;

  return (
    <ThemeContext.Provider value={{ isDark, toggle, theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme deve ser usado dentro de <ThemeProvider>");
  return ctx;
};
