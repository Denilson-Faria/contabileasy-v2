
import { useState } from "react";
import { useApp } from "../context/AppContext";
import { useTheme } from "../context/ThemeContext";
import TransactionRow from "../components/TransactionRow";
import Icon from "../components/Icon";
import { CATEGORIES } from "../data/constants";
import { fmt } from "../utils/formatters";

const EMPTY_FILTERS = {
  search:    "",
  type:      "all",
  category:  "all",
  sort:      "date-desc",
  amountMin: "",
  amountMax: "",
};

export default function Extrato() {
  const { transactions, currentMonth } = useApp();
  const { theme } = useTheme();
  const [filters,      setFilters]      = useState(EMPTY_FILTERS);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const set = (key, val) => setFilters(f => ({ ...f, [key]: val }));

  const filtered = transactions
    .filter(t => {
      if (t.month !== currentMonth)                                                         return false;
      if (filters.type !== "all"     && t.type     !== filters.type)                        return false;
      if (filters.category !== "all" && t.category !== filters.category)                    return false;
      if (filters.search && !t.desc.toLowerCase().includes(filters.search.toLowerCase()))  return false;
      if (filters.amountMin && t.amount < parseFloat(filters.amountMin))                    return false;
      if (filters.amountMax && t.amount > parseFloat(filters.amountMax))                    return false;
      return true;
    })
    .sort((a, b) => {
      if (filters.sort === "date-desc")  return new Date(b.date) - new Date(a.date);
      if (filters.sort === "date-asc")   return new Date(a.date) - new Date(b.date);
      if (filters.sort === "value-desc") return b.amount - a.amount;
      if (filters.sort === "value-asc")  return a.amount - b.amount;
      return a.desc.localeCompare(b.desc);
    });

  const filtIncome   = filtered.filter(t => t.type === "in").reduce((a, b)  => a + b.amount, 0);
  const filtExpenses = filtered.filter(t => t.type === "out").reduce((a, b) => a + b.amount, 0);
  const activeCount  = Object.entries(filters).filter(([, v]) => v !== "" && v !== "all" && v !== "date-desc").length;

  const inp = {
    background: theme.input, border: `1px solid ${theme.inputBorder}`,
    borderRadius: 8, padding: "0.4rem 0.65rem",
    color: theme.text, fontSize: 12, outline: "none", fontFamily: "inherit",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, animation: "fadeIn 0.4s ease" }}>

      {/* ── Filtros ── */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 160 }}>
          <span style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", color: theme.textMuted, pointerEvents: "none" }}>
            <Icon name="search" size={13} />
          </span>
          <input
            style={{ ...inp, paddingLeft: 28, width: "100%", boxSizing: "border-box" }}
            placeholder="Buscar transação..."
            value={filters.search}
            onChange={e => set("search", e.target.value)}
          />
        </div>

        <select style={inp} value={filters.type} onChange={e => set("type", e.target.value)}>
          <option value="all">Todos</option>
          <option value="in">Receitas</option>
          <option value="out">Despesas</option>
        </select>

        <select style={inp} value={filters.category} onChange={e => set("category", e.target.value)}>
          <option value="all">Categorias</option>
          {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>

        <select style={inp} value={filters.sort} onChange={e => set("sort", e.target.value)}>
          <option value="date-desc">Recente</option>
          <option value="date-asc">Antigo</option>
          <option value="value-desc">Maior valor</option>
          <option value="value-asc">Menor valor</option>
          <option value="alpha">A-Z</option>
        </select>

        <button
          onClick={() => setShowAdvanced(v => !v)}
          style={{ ...inp, cursor: "pointer", display: "flex", alignItems: "center", gap: 5, color: showAdvanced ? theme.accent : theme.textMuted, borderColor: showAdvanced ? theme.accent : theme.inputBorder, whiteSpace: "nowrap" }}
        >
          <Icon name="target" size={13} />
          Avançado
          {activeCount > 0 && (
            <span style={{ background: theme.accent, color: "#080c14", borderRadius: 10, fontSize: 10, fontWeight: 700, padding: "1px 5px" }}>
              {activeCount}
            </span>
          )}
        </button>

        {activeCount > 0 && (
          <button onClick={() => setFilters(EMPTY_FILTERS)} style={{ ...inp, cursor: "pointer", color: theme.danger, borderColor: theme.danger + "44", padding: "0.4rem 0.6rem" }}>
            <Icon name="x" size={13} />
          </button>
        )}
      </div>

      {/* ── Filtros avançados ── */}
      {showAdvanced && (
        <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 10, padding: "0.75rem 1rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, animation: "fadeIn 0.2s ease" }}>
          {[["amountMin","Valor mínimo","0,00"],["amountMax","Valor máximo","9999,00"]].map(([key, label, ph]) => (
            <div key={key}>
              <div style={{ fontSize: 10, fontWeight: 700, color: theme.textSubtle, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 4 }}>{label}</div>
              <input style={{ ...inp, width: "100%", boxSizing: "border-box" }} type="number" placeholder={ph} value={filters[key]} onChange={e => set(key, e.target.value)} />
            </div>
          ))}
        </div>
      )}

      {/* ── Resumo ── */}
      <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
        <span style={{ fontSize: 11, color: theme.textMuted }}>{filtered.length} transações</span>
        <span style={{ fontSize: 11, color: "#4ade80", fontWeight: 600 }}>+{fmt(filtIncome)}</span>
        <span style={{ fontSize: 11, color: theme.danger, fontWeight: 600 }}>−{fmt(filtExpenses)}</span>
      </div>

      {/* ── Lista com scroll próprio ── */}
      {filtered.length === 0 ? (
        <div style={{ color: theme.textSubtle, fontSize: 14, textAlign: "center", padding: "3rem 0" }}>
          Nenhuma transação encontrada
        </div>
      ) : (
        <div style={{
          overflowY: "auto",
          maxHeight: "calc(100vh - 320px)",
          paddingRight: 4,
          scrollbarWidth: "thin",
          scrollbarColor: `${theme.border} transparent`,
        }}>
          {filtered.map(t => <TransactionRow key={t.id} t={t} showDelete compact />)}
        </div>
      )}
    </div>
  );
}