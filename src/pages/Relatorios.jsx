import { useEffect, useRef, useState } from "react";
import { useApp } from "../context/AppContext";
import { useTheme } from "../context/ThemeContext";
import { useTransactions } from "../hooks/useTransactions";
import Icon from "../components/Icon";
import { MONTHS } from "../data/constants";
import { fmt, fmtShort } from "../utils/formatters";

function PizzaChart({ segments, size = 180 }) {
  const [progress, setProgress] = useState(0);
  const [hovered,  setHovered]  = useState(null);
  const rafRef = useRef(null);
  const key = segments.map(s => s.value).join(",");

  useEffect(() => {
    setProgress(0);
    if (!segments.some(s => s.value > 0)) return;
    let t0 = null;
    const tick = ts => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / 900, 1);
      setProgress(1 - Math.pow(1 - p, 3));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [key]);

  const total = segments.reduce((a, b) => a + b.value, 0) || 1;
  const cx = size / 2, cy = size / 2, r = size / 2 - 8;
  let startAngle = -Math.PI / 2;
  const slices = segments.map(seg => {
    const angle = (seg.value / total) * 2 * Math.PI * progress;
    const endAngle = startAngle + angle;
    const x1 = cx + r * Math.cos(startAngle), y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle),   y2 = cy + r * Math.sin(endAngle);
    const large = angle > Math.PI ? 1 : 0;
    const midAngle = startAngle + angle / 2;
    const path = angle < 0.01 ? "" : `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
    const slice = { path, color: seg.color, value: seg.value, label: seg.label, midAngle };
    startAngle = endAngle;
    return slice;
  });
  const hovSeg = hovered !== null ? slices[hovered] : null;

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ overflow: "visible" }}>
        {slices.map((s, i) => {
          const isHov = hovered === i;
          const offset = isHov ? 7 : 0;
          const tx = offset * Math.cos(s.midAngle), ty = offset * Math.sin(s.midAngle);
          return (
            <g key={i}>
              <path d={s.path} fill={s.color} opacity={hovered !== null && !isHov ? 0.35 : 1}
                transform={`translate(${tx},${ty})`} style={{ cursor: "pointer", transition: "opacity 0.2s" }}
                onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}/>
              <path d={s.path} fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="2" transform={`translate(${tx},${ty})`}/>
            </g>
          );
        })}
      </svg>
      {hovSeg && (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
          <div style={{ width: size * 0.4, height: size * 0.4, borderRadius: "50%", background: "rgba(8,12,22,0.92)", border: `2px solid ${hovSeg.color}55`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontSize: 13, color: hovSeg.color, fontWeight: 800 }}>{((hovSeg.value / total) * 100).toFixed(0)}%</div>
            <div style={{ fontSize: 9, color: "#64748b", textAlign: "center", padding: "0 4px", marginTop: 2 }}>{hovSeg.label}</div>
          </div>
        </div>
      )}
    </div>
  );
}

function AnimBar({ pct, color, delay = 0 }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(pct), delay + 80); return () => clearTimeout(t); }, [pct]);
  return (
    <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 99, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${w}%`, background: `linear-gradient(90deg,${color}77,${color})`, borderRadius: 99, transition: "width 0.9s cubic-bezier(0.34,1.56,0.64,1)", boxShadow: `0 0 8px ${color}55` }}/>
    </div>
  );
}

function Timeline({ months, currentMonth, theme }) {
  return (
    <div style={{ position: "relative" }}>
      <div style={{ position: "absolute", left: 19, top: 16, bottom: 16, width: 2, background: `linear-gradient(180deg,${theme.accent}66,transparent)`, borderRadius: 99 }}/>
      {months.map((m, i) => {
        const isCur = m.key === currentMonth;
        const pct = m.income > 0 ? Math.min((m.expenses / m.income) * 100, 100) : 0;
        const barColor = pct > 80 ? "#f87171" : pct > 60 ? "#fbbf24" : "#4ade80";
        return (
          <div key={m.key} style={{ display: "flex", gap: 16, marginBottom: i < months.length - 1 ? 14 : 0, animation: `fadeIn 0.4s ease ${i * 0.07}s both` }}>
            <div style={{ width: 40, flexShrink: 0, display: "flex", justifyContent: "center", paddingTop: 6 }}>
              <div style={{ width: isCur ? 14 : 9, height: isCur ? 14 : 9, borderRadius: "50%", background: isCur ? theme.accent : "rgba(255,255,255,0.12)", border: `2px solid ${isCur ? theme.accent : "rgba(255,255,255,0.08)"}`, boxShadow: isCur ? `0 0 14px ${theme.accent}99` : "none", zIndex: 1 }}/>
            </div>
            <div style={{ flex: 1, minWidth: 0, background: isCur ? `linear-gradient(135deg,${theme.accentGlow},rgba(255,255,255,0.01))` : "rgba(255,255,255,0.02)", border: `1px solid ${isCur ? theme.accent + "33" : "rgba(255,255,255,0.05)"}`, borderRadius: 14, padding: "0.8rem 1rem", transition: "transform 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateX(4px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateX(0)"}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: isCur ? theme.accent : theme.text }}>{MONTHS[m.month - 1]}</span>
                  {isCur && <span style={{ fontSize: 9, fontWeight: 700, background: theme.accent + "22", color: theme.accent, border: `1px solid ${theme.accent}33`, borderRadius: 20, padding: "1px 6px" }}>ATUAL</span>}
                </div>
                <span style={{ fontSize: 13, fontWeight: 800, color: m.balance >= 0 ? theme.accent : theme.danger }}>{m.balance >= 0 ? "+" : ""}{fmtShort(m.balance)}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                <div><div style={{ fontSize: 10, color: theme.textMuted, marginBottom: 1 }}>Receitas</div><div style={{ fontSize: 12, fontWeight: 700, color: theme.accent }}>{fmtShort(m.income)}</div></div>
                <div><div style={{ fontSize: 10, color: theme.textMuted, marginBottom: 1 }}>Despesas</div><div style={{ fontSize: 12, fontWeight: 700, color: theme.danger }}>{fmtShort(m.expenses)}</div></div>
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 10, color: theme.textMuted }}>Comprometido</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: barColor }}>{pct.toFixed(0)}%</span>
                </div>
                <AnimBar pct={pct} color={barColor} delay={i * 70}/>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function Relatorios() {
  const { currentMonth } = useApp();
  const { theme, isDark } = useTheme();
  const { income, expenses, balance, catBreakdown, last6 } = useTransactions();
  const insights = buildInsights({ balance, expenses, income, catBreakdown, last6 });

  const glass = {
    background: isDark
      ? "linear-gradient(135deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.02) 100%)"
      : "linear-gradient(135deg,rgba(255,255,255,0.8) 0%,rgba(255,255,255,0.6) 100%)",
    backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
    border: `1px solid ${theme.border}`, borderRadius: 20, padding: "1.5rem",
    boxSizing: "border-box",
  };

  const sectionLabel = txt => (
    <div style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, textTransform: "uppercase", letterSpacing: ".12em", marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ width: 3, height: 12, background: theme.accent, borderRadius: 99 }}/>{txt}
    </div>
  );

  return (
    <div style={{ animation: "fadeIn 0.4s ease", paddingBottom: "4rem" }}>
      <style>{`
        /* ── Relatorios layout — tudo via CSS ── */
        .rel-metrics-grid {
          display: grid;
          grid-template-columns: repeat(3,1fr);
          gap: 14px;
          margin-bottom: 22px;
        }
        .rel-main-grid {
          display: grid;
          grid-template-columns: 1fr 1.1fr;
          gap: 20px;
          margin-bottom: 20px;
        }
        .rel-insights-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        /* ── Tablet (<= 900px) ── */
        @media (max-width: 900px) {
          .rel-main-grid { grid-template-columns: 1fr !important; }
          .rel-insights-grid { grid-template-columns: 1fr 1fr !important; }
        }

        /* ── Mobile (<= 767px) ── */
        @media (max-width: 767px) {
          .rel-metrics-grid { grid-template-columns: 1fr 1fr !important; gap: 8px !important; }
          .rel-main-grid    { grid-template-columns: 1fr !important; gap: 12px !important; }
          .rel-insights-grid { grid-template-columns: 1fr !important; }
        }

        /* ── Mobile pequeno (<= 414px) ── */
        @media (max-width: 414px) {
          .rel-metrics-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Métricas */}
      <div className="rel-metrics-grid">
        {[
          { label: "Receitas", value: income,   color: "#4ade80", icon: "arrowUp",   sub: "Total do mês" },
          { label: "Despesas", value: expenses, color: "#f87171", icon: "arrowDown", sub: "Total do mês" },
          { label: "Saldo",    value: balance,  color: balance >= 0 ? "#4ade80" : "#f87171", icon: "wallet", sub: "Líquido" },
        ].map((m, i) => (
          <div key={m.label} style={{ ...glass, padding: "1.2rem", borderTop: `2px solid ${m.color}55`, animation: `fadeIn 0.4s ease ${i * 0.08}s both`, transition: "transform 0.2s, box-shadow 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 12px 32px ${m.color}18`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 10, color: theme.textMuted, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 5 }}>{m.label}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: m.color, letterSpacing: "-0.5px" }}>{fmtShort(m.value)}</div>
                <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 2 }}>{m.sub}</div>
              </div>
              <div style={{ width: 38, height: 38, borderRadius: 11, background: `${m.color}18`, border: `1px solid ${m.color}33`, display: "flex", alignItems: "center", justifyContent: "center", color: m.color, flexShrink: 0 }}>
                <Icon name={m.icon} size={16}/>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Timeline + Pizza */}
      <div className="rel-main-grid">
        <div style={{ ...glass, animation: "fadeIn 0.4s ease 0.2s both" }}>
          {sectionLabel("Linha do Tempo")}
          <div style={{ maxHeight: 440, overflowY: "auto", scrollbarWidth: "thin", paddingRight: 4 }}>
            <Timeline months={last6} currentMonth={currentMonth} theme={theme}/>
          </div>
        </div>

        <div style={{ ...glass, animation: "fadeIn 0.4s ease 0.28s both" }}>
          {sectionLabel("Despesas por Categoria")}
          {catBreakdown.length === 0 ? (
            <div style={{ color: theme.textMuted, fontSize: 13, textAlign: "center", padding: "3rem 0", opacity: 0.5 }}>Sem despesas neste mês</div>
          ) : (
            <>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
                <PizzaChart segments={catBreakdown.map(c => ({ value: c.value, color: c.color, label: c.label }))} size={160}/>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {catBreakdown.map((c, i) => (
                  <div key={c.id} style={{ animation: `fadeIn 0.3s ease ${i * 0.05}s both` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                      <div style={{ width: 8, height: 8, borderRadius: 3, background: c.color, flexShrink: 0 }}/>
                      <span style={{ fontSize: 12, color: theme.textMuted, flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.label}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: theme.text, flexShrink: 0 }}>{fmt(c.value)}</span>
                      <span style={{ fontSize: 11, color: c.color, fontWeight: 700, minWidth: 30, textAlign: "right", flexShrink: 0 }}>{((c.value / expenses) * 100).toFixed(0)}%</span>
                    </div>
                    <AnimBar pct={(c.value / expenses) * 100} color={c.color} delay={i * 60}/>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Insights */}
      <div style={{ ...glass, animation: "fadeIn 0.4s ease 0.36s both" }}>
        {sectionLabel("Insights Automáticos")}
        {insights.length === 0 ? (
          <div style={{ color: theme.textMuted, fontSize: 13, opacity: 0.5, textAlign: "center", padding: "1rem 0" }}>Adicione mais transações para ver insights.</div>
        ) : (
          <div className="rel-insights-grid">
            {insights.map((ins, i) => (
              <div key={i} style={{ display: "flex", gap: 12, padding: "1rem", background: `linear-gradient(135deg,${ins.color}0a,transparent)`, border: `1px solid ${ins.color}22`, borderLeft: `3px solid ${ins.color}`, borderRadius: 14, animation: `fadeIn 0.4s ease ${i * 0.08}s both`, transition: "transform 0.2s, box-shadow 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateX(3px)"; e.currentTarget.style.boxShadow = `0 4px 20px ${ins.color}18`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
              >
                <div style={{ width: 34, height: 34, borderRadius: 10, flexShrink: 0, background: `${ins.color}18`, border: `1px solid ${ins.color}33`, display: "flex", alignItems: "center", justifyContent: "center", color: ins.color }}>
                  <Icon name={ins.icon} size={15}/>
                </div>
                <span style={{ fontSize: 12.5, color: theme.textMuted, lineHeight: 1.6, paddingTop: 1 }}>{ins.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function buildInsights({ balance, expenses, income, catBreakdown, last6 }) {
  const list = [];
  if (balance > 0)
    list.push({ icon: "edit",      color: "#4ade80", text: `Saldo positivo de ${fmt(balance)} neste mês. Bom trabalho! 🎉` });
  else if (balance < 0)
    list.push({ icon: "info",      color: "#f87171", text: `Despesas superam receitas em ${fmt(Math.abs(balance))} este mês.` });
  if (catBreakdown[0])
    list.push({ icon: "target",    color: "#fcd34d", text: `Maior gasto: ${catBreakdown[0].label} com ${fmt(catBreakdown[0].value)} (${((catBreakdown[0].value / expenses) * 100).toFixed(0)}% do total).` });
  const prev = last6[last6.length - 2];
  if (prev && prev.expenses > 0) {
    const diff = ((expenses - prev.expenses) / prev.expenses) * 100;
    list.push({ icon: diff > 0 ? "arrowUp" : "arrowDown", color: diff > 0 ? "#f87171" : "#4ade80", text: `Despesas ${diff > 0 ? "aumentaram" : "reduziram"} ${Math.abs(diff).toFixed(0)}% em relação ao mês anterior.` });
  }
  if (income > 0) {
    const sr = ((income - expenses) / income) * 100;
    list.push({ icon: "wallet", color: sr >= 20 ? "#4ade80" : sr >= 0 ? "#fbbf24" : "#f87171", text: `Taxa de poupança: ${sr.toFixed(0)}% da renda${sr >= 20 ? " — excelente! 🚀" : sr >= 0 ? " — pode melhorar." : " — mês no negativo."}` });
  }
  if (catBreakdown.length >= 2) {
    const top2pct = ((catBreakdown[0].value + catBreakdown[1].value) / expenses * 100).toFixed(0);
    list.push({ icon: "chart", color: "#a78bfa", text: `${catBreakdown[0].label} e ${catBreakdown[1].label} concentram ${top2pct}% dos seus gastos.` });
  }
  if (last6.length >= 3) {
    const avg = last6.slice(0, -1).reduce((a, m) => a + m.expenses, 0) / (last6.length - 1);
    const diff = expenses - avg;
    list.push({ icon: "chart", color: diff > 0 ? "#fb923c" : "#22d3ee", text: `Média histórica: ${fmtShort(avg)}. Você está ${diff > 0 ? `${fmtShort(diff)} acima` : `${fmtShort(Math.abs(diff))} abaixo`} da média.` });
  }
  return list;
}