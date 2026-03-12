// pages/Dashboard.jsx
import { useState, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import { useTheme } from "../context/ThemeContext";
import { useTransactions } from "../hooks/useTransactions";
import TransactionRow from "../components/TransactionRow";
import Icon from "../components/Icon";
import CategoryIcon from "../components/CategoryIcon";
import { MONTHS } from "../data/constants";
import { fmt, fmtShort } from "../utils/formatters";
import MobileBottomNav from "../components/MobileBottomNav";

// ── Gráfico de área ───────────────────────────────────────────────────────────
function PizzaChart({ segments, size = 140 }) {
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

function AreaChart({ datasets, height = 200 }) {
  const [progress, setProgress] = useState(0);
  const rafRef  = useRef(null);
  const keyRef  = useRef("");
  const [hoverIdx, setHoverIdx] = useState(null);

  const hasRealData = datasets.flatMap(d => d.data.map(p => p.value)).some(v => v > 0);

  useEffect(() => {
    cancelAnimationFrame(rafRef.current);
    setProgress(0);
    if (!hasRealData) return;
    let t0 = null;
    const dur = 800;
    const tick = (ts) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / dur, 1);
      setProgress(1 - Math.pow(1 - p, 3));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [hasRealData]);

  if (!datasets.length || !datasets[0].data.length) return null;

  const n   = datasets[0].data.length;
  const W   = 1000;
  const H   = height;
  const PAD = { top: 12, right: 8, bottom: 4, left: 8 };

  // Max global entre todos os datasets
  const allValues = datasets.flatMap(d => d.data.map(p => p.value));
  const max = Math.max(...allValues, 1);

  // Converte valor → coordenada Y (com animação)
  const toY = (v) => {
    const fullY = PAD.top + (1 - v / max) * (H - PAD.top - PAD.bottom);
    // Anima de H até fullY
    return H + (fullY - H) * progress;
  };

  const toX = (i) => PAD.left + (i / (n - 1)) * (W - PAD.left - PAD.right);

  // Linha suave (monotone)
  const buildPath = (pts) => {
    if (pts.length < 2) return `M ${pts[0].x} ${pts[0].y}`;
    return pts.reduce((acc, p, i) => {
      if (i === 0) return `M ${p.x} ${p.y}`;
      const prev = pts[i - 1];
      const cpx  = (prev.x + p.x) / 2;
      return `${acc} C ${cpx},${prev.y} ${cpx},${p.y} ${p.x},${p.y}`;
    }, "");
  };

  return (
    <div style={{ position: "relative", height, userSelect: "none" }}>
      <svg
        width="100%" height={H}
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ display: "block", overflow: "visible" }}
        onMouseMove={e => {
          const rect = e.currentTarget.getBoundingClientRect();
          const mx = ((e.clientX - rect.left) / rect.width) * W;
          let best = 0, bestDist = Infinity;
          for (let i = 0; i < n; i++) {
            const d = Math.abs(toX(i) - mx);
            if (d < bestDist) { bestDist = d; best = i; }
          }
          setHoverIdx(best);
        }}
        onMouseLeave={() => setHoverIdx(null)}
      >
        <defs>
          {datasets.map((ds, di) => (
            <linearGradient key={di} id={`ag-${di}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor={ds.color} stopOpacity="0.28" />
              <stop offset="100%" stopColor={ds.color} stopOpacity="0.02" />
            </linearGradient>
          ))}
        </defs>

        {/* Linhas guia horizontais */}
        {[0, 0.25, 0.5, 0.75, 1].map(t => {
          const y = PAD.top + (1 - t) * (H - PAD.top - PAD.bottom);
          return <line key={t} x1={PAD.left} x2={W - PAD.right} y1={y} y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />;
        })}

        {/* Áreas e linhas */}
        {datasets.map((ds, di) => {
          const pts = ds.data.map((p, i) => ({ x: toX(i), y: toY(p.value) }));
          const linePath  = buildPath(pts);
          const areaPath  = `${linePath} L ${pts[pts.length-1].x},${H} L ${pts[0].x},${H} Z`;
          return (
            <g key={di}>
              <path d={areaPath} fill={`url(#ag-${di})`} />
              <path d={linePath} fill="none" stroke={ds.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          );
        })}

        {/* Tooltip line + pontos */}
        {hoverIdx !== null && (() => {
          const x = toX(hoverIdx);
          return (
            <>
              <line x1={x} x2={x} y1={PAD.top} y2={H} stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeDasharray="4 3" />
              {datasets.map((ds, di) => {
                const y = toY(ds.data[hoverIdx].value);
                return <circle key={di} cx={x} cy={y} r="5" fill={ds.color} stroke="rgba(0,0,0,0.5)" strokeWidth="2" />;
              })}
            </>
          );
        })()}
      </svg>

      {/* Tooltip HTML (fora do SVG para melhor renderização) */}
      {hoverIdx !== null && (() => {
        const x    = toX(hoverIdx) / W * 100;
        const label = datasets[0].data[hoverIdx].label;
        return (
          <div style={{
            position: "absolute", top: 8,
            left: `clamp(0px, calc(${x}% - 56px), calc(100% - 120px))`,
            background: "rgba(8,12,22,0.92)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 10, padding: "8px 12px", pointerEvents: "none",
            backdropFilter: "blur(12px)", zIndex: 10, minWidth: 112,
          }}>
            <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4, fontWeight: 600 }}>{label}</div>
            {datasets.map((ds, di) => (
              <div key={di} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: di < datasets.length - 1 ? 3 : 0 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: ds.color, flexShrink: 0 }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: ds.color }}>{fmt(ds.data[hoverIdx].value)}</span>
              </div>
            ))}
          </div>
        );
      })()}
    </div>
  );
}

// ── Contador animado ──────────────────────────────────────────────────────────
function AnimatedValue({ value, accent, animKey }) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    cancelAnimationFrame(rafRef.current);
    const end = value;
    let t0 = null;
    const dur = 750;
    const tick = (ts) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setDisplay(end * e);
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
      else setDisplay(end);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value, animKey]);

  return (
    <span style={{ fontSize: 28, fontWeight: 800, color: accent, letterSpacing: "-1px", fontVariantNumeric: "tabular-nums" }}>
      {fmt(display)}
    </span>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { switchTab, animKey, currentMonth } = useApp();
  const { theme } = useTheme();
  const { income, expenses, balance, recentTxns, catBreakdown, last6 } = useTransactions();
  const [chartMode, setChartMode] = useState("expenses");

  const metrics = [
    { label: "Saldo do Mês",   value: balance,  accent: balance >= 0 ? theme.accent : theme.danger, icon: "wallet",    hint: "Receitas − Despesas" },
    { label: "Total Receitas", value: income,   accent: theme.accent, icon: "arrowUp",   hint: "Entradas no período" },
    { label: "Total Despesas", value: expenses, accent: theme.danger, icon: "arrowDown", hint: "Saídas no período" },
  ];

  const card = {
    background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)",
    backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
    border: `1px solid ${theme.border}`, borderRadius: 16, padding: "1.5rem",
  };

  const labels = last6.map(m => MONTHS[m.month - 1]);

  const datasets = {
    expenses: [{ data: last6.map((m, i) => ({ value: m.expenses, label: labels[i] })), color: theme.danger }],
    income:   [{ data: last6.map((m, i) => ({ value: m.income,   label: labels[i] })), color: theme.accent }],
    compare:  [
      { data: last6.map((m, i) => ({ value: m.expenses, label: labels[i] })), color: theme.danger },
      { data: last6.map((m, i) => ({ value: m.income,   label: labels[i] })), color: theme.accent },
    ],
  };

  const maxVal = Math.max(...last6.map(m => Math.max(m.income, m.expenses)), 1);
  const noData = last6.every(m => m.expenses === 0 && m.income === 0);

  const chartModes = [
    { id: "expenses", label: "Gastos",   icon: "arrowDown", color: theme.danger },
    { id: "income",   label: "Ganhos",   icon: "arrowUp",   color: theme.accent },
    { id: "compare",  label: "Comparar", icon: "repeat",    color: theme.textMuted },
  ];

  const MetricIcon = ({ icon, color }) => {
    if (icon === "arrowUp") return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
        <polyline points="17 6 23 6 23 12"/>
      </svg>
    );
    if (icon === "arrowDown") return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/>
        <polyline points="17 18 23 18 23 12"/>
      </svg>
    );
    return <Icon name={icon} size={24}/>;
  };

  return (
    <div style={{ animation: "fadeIn 0.4s ease", paddingBottom: "5rem" }}>
      <style>{`
        @keyframes cardIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes iconSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .metric-icon:hover { animation: iconSpin 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards !important; }
      `}</style>

      {/* ── Métricas ─────────────────────────────────────── */}
      <div className="metrics-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 24 }}>
        {metrics.map((m, idx) => (
          <div key={m.label} style={{
            background: "linear-gradient(135deg,rgba(255,255,255,0.05) 0%,rgba(255,255,255,0.02) 100%)",
            backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
            border: `1px solid ${m.accent}22`, borderRadius: 16, padding: "1.5rem",
            position: "relative", overflow: "hidden",
            transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s", cursor: "default",
            animation: `cardIn 0.4s ease ${idx * 0.08}s both`,
          }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = `0 12px 40px ${m.accent}33`;
              e.currentTarget.style.borderColor = `${m.accent}55`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.borderColor = `${m.accent}22`;
            }}
          >
            {/* Brilho de fundo */}
            <div style={{ position:"absolute", top:-20, right:-20, width:100, height:100, borderRadius:"50%", background:m.accent, opacity:0.07, filter:"blur(24px)", pointerEvents:"none" }}/>
            {/* Linha topo */}
            <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:`linear-gradient(90deg,transparent,${m.accent}55,transparent)` }}/>

            {/* Ícone grande */}
            <div
              className="metric-icon"
              style={{
                width: 52, height: 52, borderRadius: 14,
                background: `${m.accent}18`,
                border: `1px solid ${m.accent}33`,
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 14, color: m.accent,
                boxShadow: `0 0 20px ${m.accent}22`,
                cursor: "default",
                transformOrigin: "center",
              }}
            >
              <MetricIcon icon={m.icon} color={m.accent}/>
            </div>

            <div style={{ fontSize:11, fontWeight:600, color:theme.textMuted, textTransform:"uppercase", letterSpacing:".06em", marginBottom: 6 }}>{m.label}</div>
            <AnimatedValue value={m.value} accent={m.accent} animKey={animKey}/>
            <div style={{ fontSize:11, color:theme.textSubtle, marginTop:4 }}>{m.hint}</div>
          </div>
        ))}
      </div>

      {/* ── Gráfico de área ──────────────────────────────── */}
      <div style={{ ...card, marginBottom: 24, animation: "cardIn 0.4s ease 0.24s both" }}>
        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16, flexWrap:"wrap", gap:10 }}>
          <div style={{ fontSize:15, fontWeight:700, color:theme.text }}>Evolução dos Gastos</div>
          <div style={{ display:"flex", gap:6 }}>
            {chartModes.map(m => {
              const active = chartMode === m.id;
              return (
                <button key={m.id} onClick={() => setChartMode(m.id)} style={{
                  display:"flex", alignItems:"center", gap:6,
                  padding:"0.4rem 0.8rem", borderRadius:20, fontFamily:"inherit",
                  border:`1px solid ${active ? m.color + "55" : theme.border}`,
                  background: active ? m.color + "18" : "transparent",
                  color: active ? m.color : theme.textMuted,
                  fontSize:12, fontWeight:600, cursor:"pointer", transition:"all 0.2s",
                }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.color = theme.text; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.color = theme.textMuted; }}
                >
                  <Icon name={m.icon} size={12}/>{m.label}
                </button>
              );
            })}
          </div>
        </div>

        {noData ? (
          <div style={{ height:200, display:"flex", alignItems:"center", justifyContent:"center", color:theme.textSubtle, fontSize:13 }}>
            Sem dados para exibir
          </div>
        ) : (
          <>
            {/* Eixo Y + gráfico lado a lado */}
            <div style={{ display:"flex", gap:8 }}>
              {/* Labels Y */}
              <div style={{ display:"flex", flexDirection:"column", justifyContent:"space-between", height:200, paddingBottom:4, flexShrink:0 }}>
                {[1, 0.75, 0.5, 0.25, 0].map(t => (
                  <span key={t} style={{ fontSize:10, color:theme.textSubtle, textAlign:"right", whiteSpace:"nowrap" }}>
                    {fmtShort(maxVal * t)}
                  </span>
                ))}
              </div>

              {/* Gráfico */}
              <div style={{ flex:1, minWidth:0 }}>
                <AreaChart key={datasets[chartMode].map(d => d.data.map(p => p.value).join(",")).join("|")} datasets={datasets[chartMode]} height={200} />
              </div>
            </div>

            {/* Eixo X */}
            <div style={{ display:"flex", justifyContent:"space-between", marginLeft:40, marginTop:8 }}>
              {last6.map(m => (
                <span key={m.key} style={{ fontSize:10, color: m.key === currentMonth ? theme.accent : theme.textSubtle, fontWeight: m.key === currentMonth ? 700 : 400 }}>
                  {MONTHS[m.month - 1]}
                </span>
              ))}
            </div>

            {/* Legenda */}
            <div style={{ display:"flex", justifyContent:"center", gap:16, marginTop:12 }}>
              {chartMode === "compare" ? (
                <>
                  <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:theme.textMuted }}>
                    <div style={{ width:8, height:8, borderRadius:"50%", background:theme.danger }}/> Gastos
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:theme.textMuted }}>
                    <div style={{ width:8, height:8, borderRadius:"50%", background:theme.accent }}/> Receitas
                  </div>
                </>
              ) : (
                <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:theme.textMuted }}>
                  <div style={{ width:8, height:8, borderRadius:"50%", background: chartMode === "expenses" ? theme.danger : theme.accent }}/>
                  {chartMode === "expenses" ? "Gastos" : "Receitas"}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* ── Donut + Resumo ────────────────────────────────── */}
      <div className="charts-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:24 }}>

        <div style={{ ...card, animation:"cardIn 0.4s ease 0.32s both" }}>
          <div style={{ fontSize:12, fontWeight:700, color:theme.textMuted, textTransform:"uppercase", letterSpacing:".1em", marginBottom:16 }}>
            Gastos por categoria
          </div>
          {catBreakdown.length === 0 ? (
            <div style={{ color:theme.textSubtle, fontSize:13, textAlign:"center", padding:"2rem 0" }}>Nenhuma despesa neste mês</div>
          ) : (
            <div style={{ display:"flex", gap:20, alignItems:"center" }}>
              <PizzaChart segments={catBreakdown.map(c => ({ value: c.value, color: c.color, label: c.label }))} size={110}/>
              <div style={{ flex:1 }}>
                {catBreakdown.slice(0,5).map(c => (
                  <div key={c.id} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                    <div style={{ width:8, height:8, borderRadius:2, background:c.color, flexShrink:0 }}/>
                    <span style={{ fontSize:12, color:theme.textMuted, flex:1 }}>{c.label}</span>
                    <span style={{ fontSize:12, fontWeight:700, color:theme.text }}>{fmt(c.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{ ...card, animation:"cardIn 0.4s ease 0.4s both" }}>
          <div style={{ fontSize:12, fontWeight:700, color:theme.textMuted, textTransform:"uppercase", letterSpacing:".1em", marginBottom:16 }}>
            Resumo do mês
          </div>
          {[
            { label:"Receitas", value:income,              color:theme.accent, pct: income > 0 ? 100 : 0 },
            { label:"Despesas", value:expenses,            color:theme.danger, pct: income > 0 ? Math.min((expenses/income)*100,100) : 0 },
            { label:"Poupança", value:Math.max(balance,0), color:"#60a5fa",    pct: income > 0 ? Math.max((balance/income)*100,0) : 0 },
          ].map((row, i) => (
            <div key={row.label} style={{ marginBottom:14 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                <span style={{ fontSize:12, color:theme.textMuted }}>{row.label}</span>
                <span style={{ fontSize:12, fontWeight:700, color:row.color }}>{fmt(row.value)}</span>
              </div>
              <div style={{ height:5, background:theme.input, borderRadius:4, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${row.pct}%`, background:row.color, borderRadius:4, transition:"width 0.8s cubic-bezier(0.34,1.56,0.64,1)", boxShadow:`0 0 8px ${row.color}66` }}/>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Transações recentes ───────────────────────────── */}
      <div style={{ animation:"cardIn 0.4s ease 0.48s both" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
          <div style={{ fontSize:12, fontWeight:700, color:theme.textMuted, textTransform:"uppercase", letterSpacing:".1em" }}>
            Transações recentes
          </div>
          <button onClick={() => switchTab("extrato")} style={{ background:"none", border:"none", color:theme.accent, fontSize:12, fontWeight:600, cursor:"pointer" }}>
            Ver todas →
          </button>
        </div>
        {recentTxns.length === 0 ? (
          <div style={{ color:theme.textSubtle, fontSize:14, textAlign:"center", padding:"3rem 0" }}>
            Nenhuma transação ainda.{" "}
            <button onClick={() => switchTab("lancamentos")} style={{ background:"none", border:"none", color:theme.accent, cursor:"pointer", fontSize:13 }}>
              + Adicionar primeira transação
            </button>
          </div>
        ) : (
          recentTxns.map((t, i) => (
            <div key={t.id} style={{ animation:`cardIn 0.3s ease ${0.48 + i*0.06}s both` }}>
              <TransactionRow t={t}/>
            </div>
          ))
        )}
      </div>
    </div>
  );
}