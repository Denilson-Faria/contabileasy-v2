import { useState } from "react";
import { useApp } from "../context/AppContext";
import { useTheme } from "../context/ThemeContext";
import { useTransactions } from "../hooks/useTransactions";
import TransactionRow from "../components/TransactionRow";
import Icon from "../components/Icon";
import CategoryIcon from "../components/CategoryIcon";

const EMPTY_FORM = (month) => ({
  desc: "", type: "out", amount: "", category: "outros",
  date: "", month, recurrent: false,
  installments: false, installmentCount: "2",
});

export default function Lancamentos() {
  const { currentMonth, addTransaction, showToast, allCategories } = useApp();
  const { theme } = useTheme();
  const { monthTxns } = useTransactions();
  const [form, setForm] = useState(EMPTY_FORM(currentMonth));
  const [saving, setSaving] = useState(false);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const totalAmount   = parseFloat(form.amount) || 0;
  const installCount  = parseInt(form.installmentCount) || 2;
  const amountPerPart = form.installments && totalAmount > 0
    ? (totalAmount / installCount).toFixed(2) : null;

  const handleSubmit = async () => {
    if (!form.desc || !form.amount || !form.month) {
      showToast("Preencha os campos obrigatórios", "error"); return;
    }
    if (form.recurrent && form.installments) {
      showToast("Escolha apenas recorrente OU parcelado", "error"); return;
    }
    setSaving(true);
    await addTransaction(form);
    setForm(EMPTY_FORM(currentMonth));
    setSaving(false);
  };

  const isIncome = form.type === "in";
  const accentColor = isIncome ? "#4ade80" : "#f87171";

  const inp = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 12, padding: "0.8rem 1rem",
    color: theme.text, fontSize: 14, outline: "none",
    width: "100%", boxSizing: "border-box",
    transition: "border-color 0.2s, background 0.2s",
    fontFamily: "inherit",
  };

  const focus = e => { e.target.style.borderColor = accentColor + "88"; e.target.style.background = accentColor + "08"; };
  const blur  = e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.background = "rgba(255,255,255,0.04)"; };

  const lbl = {
    display: "block", fontSize: 10, fontWeight: 700,
    color: theme.textMuted, marginBottom: 7,
    textTransform: "uppercase", letterSpacing: ".1em",
  };

  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <style>{`
        /* ── Layout — TUDO via CSS, nada inline ── */
        .lnc-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          width: 100%;
        }
        .lnc-form {
          background: linear-gradient(160deg,rgba(255,255,255,0.05) 0%,rgba(255,255,255,0.02) 100%);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 24px;
          padding: 2rem;
          backdrop-filter: blur(20px);
          position: relative;
          overflow: hidden;
          width: 100%;
          box-sizing: border-box;
        }
        .lnc-valor-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 18px;
        }
        .lnc-cat-grid {
          display: grid;
          grid-template-columns: repeat(4,1fr);
          gap: 8px;
        }
        .lnc-actions { display: flex; gap: 10px; width: 100%; }
        .lnc-install-summary { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; margin-top: 10px; }

        /* Animações */
        .type-btn  { transition: all 0.25s cubic-bezier(.4,0,.2,1) !important; }
        .type-btn:hover { transform: translateY(-1px); }
        .cat-btn   { transition: all 0.2s ease !important; }
        .cat-btn:hover { transform: scale(1.04); }
        .submit-btn { transition: all 0.2s ease !important; }
        .submit-btn:hover:not(:disabled) { filter: brightness(1.08); transform: translateY(-1px); box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
        .rep-btn   { transition: all 0.2s ease !important; }
        .rep-btn:hover { opacity: 0.85; }
        .install-pill { transition: all 0.15s ease !important; }
        .install-pill:hover { transform: scale(1.06); }
        input[type=date]::-webkit-calendar-picker-indicator { filter: invert(0.5); cursor: pointer; }

        /* ── Tablet (<= 900px) ── */
        @media (max-width: 900px) {
          .lnc-grid { grid-template-columns: 1fr !important; }
        }

        /* ── Mobile (<= 767px) — todos os celulares ── */
        @media (max-width: 767px) {
          .lnc-grid       { grid-template-columns: 1fr !important; gap: 16px !important; }
          .lnc-form       { padding: 1rem !important; border-radius: 16px !important; }
          .lnc-valor-grid { grid-template-columns: 1fr 1fr !important; gap: 8px !important; }
          .lnc-cat-grid   { grid-template-columns: repeat(4,1fr) !important; gap: 5px !important; }
        }

        /* ── Só telas muito pequenas (<= 340px) ── */
        @media (max-width: 340px) {
          .lnc-form       { padding: 0.75rem !important; }
          .lnc-valor-grid { grid-template-columns: 1fr !important; }
          .lnc-cat-grid   { grid-template-columns: repeat(3,1fr) !important; }
          .lnc-actions    { flex-direction: column !important; }
        }
      `}</style>

      <div className="lnc-grid">
        {/* ── FORMULÁRIO ── */}
        <div className="lnc-form">
          {/* Glow dinâmico */}
          <div style={{
            position: "absolute", top: -60, right: -60, width: 200, height: 200,
            borderRadius: "50%", background: accentColor, opacity: 0.04,
            filter: "blur(60px)", pointerEvents: "none", transition: "background 0.4s ease",
          }}/>

          {/* Header */}
          <div style={{ marginBottom: 28, position: "relative" }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: theme.text, letterSpacing: "-0.5px" }}>Novo Lançamento</div>
            <div style={{ fontSize: 13, color: theme.textMuted, marginTop: 4 }}>Registre uma receita ou despesa</div>
            <div style={{ position: "absolute", bottom: -14, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,${accentColor}44,transparent)`, transition: "background 0.4s ease" }}/>
          </div>

          {/* Tipo */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 22 }}>
            {[
              { value: "out", label: "Despesa", icon: "arrowDown", color: "#f87171" },
              { value: "in",  label: "Receita", icon: "arrowUp",   color: "#4ade80" },
            ].map(opt => {
              const active = form.type === opt.value;
              return (
                <button key={opt.value} className="type-btn" onClick={() => set("type", opt.value)} style={{
                  padding: "0.9rem 1rem", borderRadius: 14, fontFamily: "inherit",
                  border: `1.5px solid ${active ? opt.color + "55" : "rgba(255,255,255,0.07)"}`,
                  background: active ? `linear-gradient(135deg,${opt.color}18,${opt.color}08)` : "rgba(255,255,255,0.03)",
                  color: active ? opt.color : theme.textMuted,
                  fontWeight: 700, fontSize: 14, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  boxShadow: active ? `0 0 20px ${opt.color}15` : "none",
                }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: active ? opt.color + "22" : "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon name={opt.icon} size={14}/>
                  </div>
                  {opt.label}
                </button>
              );
            })}
          </div>

          {/* Descrição */}
          <div style={{ marginBottom: 18 }}>
            <label style={lbl}>Descrição *</label>
            <input style={inp} placeholder="Ex: Salário, Aluguel, TV nova..."
              value={form.desc} onChange={e => set("desc", e.target.value)} onFocus={focus} onBlur={blur}/>
          </div>

          {/* Valor + Mês */}
          <div className="lnc-valor-grid">
            <div>
              <label style={lbl}>{form.installments ? "Valor total (R$) *" : "Valor (R$) *"}</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: theme.textMuted, fontWeight: 600, pointerEvents: "none" }}>R$</span>
                <input style={{ ...inp, paddingLeft: "2.5rem" }} type="number" step="0.01" placeholder="0,00"
                  value={form.amount} onChange={e => set("amount", e.target.value)} onFocus={focus} onBlur={blur}/>
              </div>
              {amountPerPart && (
                <div style={{ fontSize: 11, marginTop: 6, fontWeight: 600, color: accentColor, display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ opacity: 0.6 }}>→</span> {installCount}x de R$ {amountPerPart}
                </div>
              )}
            </div>
            <div>
              <label style={lbl}>Mês inicial *</label>
              <input style={inp} placeholder="MM/AA" maxLength={5}
                value={form.month} onChange={e => set("month", e.target.value)} onFocus={focus} onBlur={blur}/>
            </div>
          </div>

          {/* Data */}
          <div style={{ marginBottom: 22 }}>
            <label style={lbl}>Data</label>
            <input style={inp} type="date"
              value={form.date} onChange={e => set("date", e.target.value)} onFocus={focus} onBlur={blur}/>
          </div>

          {/* Categoria */}
          <div style={{ marginBottom: 22 }}>
            <label style={lbl}>Categoria</label>
            <div className="lnc-cat-grid">
              {allCategories.map(c => {
                const active = form.category === c.id;
                return (
                  <button key={c.id} className="cat-btn" onClick={() => set("category", c.id)} style={{
                    padding: "0.6rem 0.3rem", borderRadius: 12, fontFamily: "inherit",
                    border: `1.5px solid ${active ? c.color + "66" : "rgba(255,255,255,0.06)"}`,
                    background: active ? c.color + "14" : "rgba(255,255,255,0.03)",
                    color: active ? theme.text : theme.textMuted,
                    fontSize: 10, fontWeight: 600, cursor: "pointer",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
                    boxShadow: active ? `0 0 14px ${c.color}20` : "none",
                    minWidth: 0,
                  }}>
                    <CategoryIcon categoryId={c.id} color={active ? c.color : theme.textSubtle} emoji={c.emoji} size={28} radius={8}/>
                    <span style={{ fontSize: 9.5, letterSpacing: ".02em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "100%" }}>{c.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Repetição */}
          <div style={{ marginBottom: 22 }}>
            <label style={lbl}>Repetição</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { key: "recurrent",    label: "Recorrente", icon: "repeat", desc: "Todo mês" },
                { key: "installments", label: "Parcelado",  icon: "list",   desc: "Dividido" },
              ].map(opt => {
                const active = form[opt.key];
                return (
                  <button key={opt.key} className="rep-btn"
                    onClick={() => setForm(f => ({ ...f, [opt.key]: !f[opt.key], ...(opt.key === "recurrent" ? { installments: false } : { recurrent: false }) }))}
                    style={{
                      padding: "0.7rem 0.875rem", borderRadius: 12, fontFamily: "inherit",
                      border: `1.5px solid ${active ? accentColor + "55" : "rgba(255,255,255,0.07)"}`,
                      background: active ? accentColor + "12" : "rgba(255,255,255,0.03)",
                      color: active ? accentColor : theme.textMuted,
                      display: "flex", alignItems: "center", gap: 8,
                      cursor: "pointer", textAlign: "left", minWidth: 0,
                    }}>
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: active ? accentColor + "20" : "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon name={opt.icon} size={13}/>
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 700 }}>{opt.label}</div>
                      <div style={{ fontSize: 10, opacity: 0.6, marginTop: 1 }}>{opt.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {form.recurrent && (
              <div style={{ marginTop: 10, borderRadius: 12, padding: "0.75rem 1rem", background: accentColor + "0c", border: `1px solid ${accentColor}25`, fontSize: 12, color: theme.textMuted, display: "flex", alignItems: "center", gap: 8 }}>
                <Icon name="repeat" size={12}/>
                Cria lançamentos para os próximos <strong style={{ color: theme.text }}>12 meses</strong> a partir de {form.month || "MM/AA"}
              </div>
            )}

            {form.installments && (
              <div style={{ marginTop: 10, borderRadius: 12, padding: "0.875rem 1rem", background: "#60a5fa0c", border: "1px solid #60a5fa25" }}>
                <label style={{ ...lbl, marginBottom: 10 }}>Número de parcelas</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: amountPerPart ? 10 : 0 }}>
                  {["2","3","4","5","6","10","12","18","24"].map(n => (
                    <button key={n} className="install-pill" onClick={() => set("installmentCount", n)} style={{
                      padding: "0.3rem 0.7rem", borderRadius: 20, fontFamily: "inherit",
                      border: `1px solid ${form.installmentCount === n ? "#60a5fa" : "rgba(255,255,255,0.1)"}`,
                      background: form.installmentCount === n ? "#60a5fa20" : "rgba(255,255,255,0.04)",
                      color: form.installmentCount === n ? "#60a5fa" : theme.textMuted,
                      fontSize: 12, fontWeight: 700, cursor: "pointer",
                    }}>{n}x</button>
                  ))}
                </div>
                {amountPerPart && (
                  <div className="lnc-install-summary">
                    {[
                      { label: "Total",    value: `R$ ${totalAmount.toFixed(2)}` },
                      { label: "Parcelas", value: `${installCount}x` },
                      { label: "Por mês",  value: `R$ ${amountPerPart}` },
                    ].map(item => (
                      <div key={item.label} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "0.5rem 0.75rem", textAlign: "center" }}>
                        <div style={{ fontSize: 9, color: theme.textMuted, textTransform: "uppercase", letterSpacing: ".06em" }}>{item.label}</div>
                        <div style={{ fontSize: 13, fontWeight: 800, color: "#60a5fa", marginTop: 3 }}>{item.value}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Ações */}
          <div className="lnc-actions">
            <button onClick={() => setForm(EMPTY_FORM(currentMonth))} style={{
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 12, padding: "0.8rem 1.25rem",
              color: theme.textMuted, fontWeight: 600, fontSize: 13,
              cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap",
            }}>Limpar</button>
            <button className="submit-btn" onClick={handleSubmit} disabled={saving} style={{
              flex: 1, borderRadius: 12, border: "none", padding: "0.85rem 1.5rem",
              background: saving ? "rgba(255,255,255,0.06)" : `linear-gradient(135deg,${accentColor},${isIncome ? "#22d3ee" : "#fb923c"})`,
              color: saving ? theme.textMuted : "#080c14",
              fontWeight: 800, fontSize: 14, cursor: saving ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              fontFamily: "inherit",
              boxShadow: saving ? "none" : `0 4px 20px ${accentColor}30`,
            }}>
              {saving ? "Salvando..." : form.installments ? `Salvar ${installCount} parcelas` : `Salvar ${isIncome ? "Receita" : "Despesa"}`}
            </button>
          </div>
        </div>

        {/* ── LISTA ── */}
        <div style={{ minWidth: 0, overflow: "hidden" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 16 }}>
            Lançamentos do mês
          </div>
          {monthTxns.length === 0 ? (
            <div style={{ color: theme.textSubtle, fontSize: 13, textAlign: "center", padding: "4rem 0", border: "1px dashed rgba(255,255,255,0.06)", borderRadius: 20 }}>
              Nenhum lançamento neste mês
            </div>
          ) : (
            [...monthTxns]
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .slice(0, 8)
              .map(t => <TransactionRow key={t.id} t={t} showDelete/>)
          )}
        </div>
      </div>
    </div>
  );
}