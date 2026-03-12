// components/Header.jsx
import { useApp } from "../context/AppContext";
import { useTheme } from "../context/ThemeContext";
import Icon from "./Icon";
import { TABS, MONTHS } from "../data/constants";
import { useTransactions } from "../hooks/useTransactions";

export default function Header() {
  const { activeTab, currentMonth, changeMonth } = useApp();
  const { monthTxns } = useTransactions();
  const { theme } = useTheme();

  const [mm, yy]   = currentMonth.split("/");
  const monthLabel = `${MONTHS[parseInt(mm) - 1]} 20${yy}`;
  const tabLabel   = TABS.find(t => t.id === activeTab)?.label ?? "";

  // Abas sem navegação de mês
  const noMonthNav = ["metas", "categorias"];

  return (
    <header className="header-el" style={{ position: "sticky", top: 0, background: theme.header, backdropFilter: "blur(20px)", borderBottom: `1px solid ${theme.border}`, padding: "1.25rem 2rem", paddingTop: "max(1.25rem, calc(1.25rem + env(safe-area-inset-top)))", display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 50 }}>
      <div>
        <h1 className="header-title" style={{ fontSize: 18, fontWeight: 700, color: theme.text, margin: 0 }}>{tabLabel}</h1>
        {!noMonthNav.includes(activeTab) && (
          <p style={{ fontSize: 12, color: theme.textMuted, margin: 0, marginTop: 2 }}>
            {monthLabel} · {monthTxns.length} transações
          </p>
        )}
      </div>

      {!noMonthNav.includes(activeTab) && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 12, padding: "0.4rem 0.75rem" }}>
          <button style={{ background: "none", border: "none", color: theme.textMuted, cursor: "pointer", display: "flex", alignItems: "center", padding: 4, borderRadius: 6, transition: "color 0.2s" }}
            onClick={() => changeMonth(-1)}
            onMouseEnter={e => e.currentTarget.style.color = theme.accent}
            onMouseLeave={e => e.currentTarget.style.color = theme.textMuted}>
            <Icon name="chevLeft" size={16} />
          </button>
          <span style={{ fontSize: 13, fontWeight: 600, color: theme.text, minWidth: 72, textAlign: "center" }}>{monthLabel}</span>
          <button style={{ background: "none", border: "none", color: theme.textMuted, cursor: "pointer", display: "flex", alignItems: "center", padding: 4, borderRadius: 6, transition: "color 0.2s" }}
            onClick={() => changeMonth(1)}
            onMouseEnter={e => e.currentTarget.style.color = theme.accent}
            onMouseLeave={e => e.currentTarget.style.color = theme.textMuted}>
            <Icon name="chevRight" size={16} />
          </button>
        </div>
      )}
    </header>
  );
}