
import { useApp } from "../context/AppContext";
import { useTheme } from "../context/ThemeContext";
import Icon from "./Icon";
import CategoryIcon from "./CategoryIcon";
import { getCatInfo } from "../utils/formatters";
import { fmt } from "../utils/formatters";

export default function TransactionRow({ t, showDelete = false, compact = false }) {
  const { setDeleteTarget, setModal, setEditTarget, allCategories } = useApp();
  const { theme } = useTheme();

  const cat = allCategories?.find(c => c.id === t.category) || getCatInfo(t.category);

  const iconSize   = compact ? 36 : 40;
  const iconRadius = compact ? 9 : 10;

  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: compact ? 12 : 14,
        padding: compact ? "0.7rem 1.1rem" : "1rem 1.25rem",
        background: theme.bgCard,
        border: `1px solid ${theme.border}`,
        borderRadius: compact ? 11 : 12,
        marginBottom: compact ? 6 : 8,
        transition: "background 0.2s",
        minWidth: 0, overflow: "hidden",
      }}
      onMouseEnter={e => e.currentTarget.style.background = theme.accentGlow}
      onMouseLeave={e => e.currentTarget.style.background = theme.bgCard}
    >
      <CategoryIcon categoryId={t.category} color={cat.color} emoji={cat.emoji} size={iconSize} radius={iconRadius} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: compact ? 13.5 : 14, fontWeight: 600, color: theme.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.desc}</span>
          {(t._showRecurrentBadge || t.recurrent) && (
            <span style={{ fontSize: 10, fontWeight: 600, color: "#a78bfa", background: "#a78bfa15", border: "1px solid #a78bfa33", borderRadius: 20, padding: "1px 6px", letterSpacing: ".03em", flexShrink: 0 }}>
              recorrente
            </span>
          )}
          {t.installmentGroupId && (
            <span style={{ fontSize: 10, fontWeight: 600, color: "#60a5fa", background: "#60a5fa15", border: "1px solid #60a5fa33", borderRadius: 20, padding: "1px 6px", letterSpacing: ".03em", flexShrink: 0 }}>
              parcelado
            </span>
          )}
        </div>
        <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 2 }}>
          {cat.label} · {t.date ? new Date(t.date + "T00:00:00").toLocaleDateString("pt-BR") : t.month}
        </div>
      </div>

      <div style={{ fontSize: compact ? 14 : 15, fontWeight: 700, color: t.type === "in" ? theme.accent : theme.danger, flexShrink: 0 }}>
        {t.type === "in" ? "+" : "−"}{fmt(t.amount)}
      </div>

      {showDelete && (
        <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
          <button
            title="Editar"
            onClick={() => { setEditTarget(t); setModal({ type: "edit" }); }}
            style={{ background: theme.input, border: `1px solid ${theme.border}`, borderRadius: 7, padding: compact ? "0.3rem 0.5rem" : "0.4rem 0.6rem", color: theme.textMuted, cursor: "pointer", display: "flex", alignItems: "center", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.color = theme.accent; e.currentTarget.style.borderColor = theme.accent; }}
            onMouseLeave={e => { e.currentTarget.style.color = theme.textMuted; e.currentTarget.style.borderColor = theme.border; }}
          >
            <Icon name="edit" size={12} />
          </button>
          <button
            title="Excluir"
            onClick={() => { setDeleteTarget(t); setModal({ type: "delete" }); }}
            style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 7, padding: compact ? "0.3rem 0.5rem" : "0.4rem 0.6rem", color: theme.danger, cursor: "pointer", display: "flex", alignItems: "center", transition: "all 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(248,113,113,0.18)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(248,113,113,0.08)"}
          >
            <Icon name="trash" size={12} />
          </button>
        </div>
      )}
    </div>
  );
}