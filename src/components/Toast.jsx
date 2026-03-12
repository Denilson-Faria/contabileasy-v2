import { useApp } from "../context/AppContext";
import { useTheme } from "../context/ThemeContext";

export default function Toast() {
  const { toast } = useApp();
  const { theme } = useTheme();
  if (!toast) return null;
  const bg = toast.type === "error" ? "#f87171" : toast.type === "info" ? "#38bdf8" : theme.accent;
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, background: bg, color: "#080c14", borderRadius: 12, padding: "0.75rem 1.25rem", fontWeight: 700, fontSize: 14, zIndex: 300, boxShadow: "0 8px 24px rgba(0,0,0,0.3)", animation: "slideUp 0.3s ease", fontFamily: "'DM Sans', sans-serif" }}>
      {toast.msg}
    </div>
  );
}
