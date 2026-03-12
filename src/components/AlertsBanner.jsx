
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useAlerts } from "../hooks/useAlerts";
import { fmt } from "../utils/formatters";

export default function AlertsBanner() {
  const { theme } = useTheme();
  const alerts = useAlerts();
  const [dismissed, setDismissed] = useState(new Set());

  const visible = alerts.filter(a => !dismissed.has(a.id));
  if (!visible.length) return null;

  const dismiss = (id) => setDismissed(prev => new Set([...prev, id]));
  const dismissAll = () => setDismissed(new Set(alerts.map(a => a.id)));

  return (
    <div style={{
      margin: "0 0 1.25rem 0",
      display: "flex",
      flexDirection: "column",
      gap: 6,
      animation: "fadeIn 0.3s ease",
    }}>
      {visible.map(alert => {
        const isToday = alert.urgency === "today";
        const color   = isToday ? "#f87171" : "#fbbf24";
        const bg      = isToday ? "rgba(248,113,113,0.07)" : "rgba(251,191,36,0.07)";
        const border  = isToday ? "rgba(248,113,113,0.25)" : "rgba(251,191,36,0.25)";
        const icon    = isToday ? "🔴" : "🟡";

        return (
          <div
            key={alert.id}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "0.6rem 1rem",
              background: bg,
              border: `1px solid ${border}`,
              borderRadius: 10,
              borderLeft: `3px solid ${color}`,
            }}
          >
            <span style={{ fontSize: 13 }}>{icon}</span>

            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>
                {alert.desc}
              </span>
              <span style={{ fontSize: 11, color: alert.kind === "recorrente" ? "#a78bfa" : "#60a5fa", background: alert.kind === "recorrente" ? "#a78bfa15" : "#60a5fa15", border: `1px solid ${alert.kind === "recorrente" ? "#a78bfa33" : "#60a5fa33"}`, borderRadius: 20, padding: "1px 6px", marginLeft: 6, fontWeight: 600 }}>
                {alert.kind}
              </span>
              <span style={{ fontSize: 12, color: theme.textMuted, marginLeft: 6 }}>
                {fmt(alert.amount)} · <span style={{ color, fontWeight: 600 }}>{alert.label}</span>
              </span>
            </div>

            <button
              onClick={() => dismiss(alert.id)}
              title="Fechar"
              style={{
                background: "none", border: "none", color: theme.textMuted,
                cursor: "pointer", fontSize: 14, padding: "0 2px", lineHeight: 1,
                flexShrink: 0,
              }}
              onMouseEnter={e => e.currentTarget.style.color = theme.text}
              onMouseLeave={e => e.currentTarget.style.color = theme.textMuted}
            >
              ✕
            </button>
          </div>
        );
      })}

      {/* Fechar todos se tiver mais de um */}
      {visible.length > 1 && (
        <button
          onClick={dismissAll}
          style={{
            alignSelf: "flex-end",
            background: "none", border: "none",
            color: theme.textMuted, fontSize: 11,
            cursor: "pointer", padding: "2px 4px",
            textDecoration: "underline",
          }}
        >
          Fechar todos
        </button>
      )}
    </div>
  );
}