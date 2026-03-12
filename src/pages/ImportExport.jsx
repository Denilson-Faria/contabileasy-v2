import { useState, useRef } from "react";
import { useApp } from "../context/AppContext";
import { useTheme } from "../context/ThemeContext";
import Icon from "../components/Icon";
import { fmt } from "../utils/formatters";
import { exportCSV, exportPDF } from "../services/exportService";
import * as XLSX from "xlsx";

const CATEGORY_MAP = {
  profissional: ["profissional","trabalho","salario","salário","renda","freelance","consultoria"],
  moradia:      ["moradia","aluguel","essenciais","casa","condominio","condomínio","luz","internet","agua","água"],
  alimentacao:  ["alimentacao","alimentação","mercado","comida","restaurante","lanche","refeicao","refeição"],
  compras:      ["compras","roupa","roupas","shopping","loja"],
  assinaturas:  ["assinaturas","assinatura","streaming","netflix","spotify","amazon"],
  lazer:        ["lazer","entretenimento","viagem","cinema","show","festa","hobby"],
  transporte:   ["transporte","combustivel","combustível","gasolina","uber","onibus","ônibus","carro"],
  saude:        ["saude","saúde","medico","médico","farmacia","farmácia","academia","plano"],
  educacao:     ["educacao","educação","curso","livro","livros","escola","faculdade"],
  outros:       ["outros","outro","diverso","diversos","misc"],
};

const resolveCategory = (raw) => {
  const val = (raw || "").toLowerCase().trim();
  for (const [id, keywords] of Object.entries(CATEGORY_MAP)) {
    if (keywords.some(k => val.includes(k))) return id;
  }
  return "outros";
};

const parseRows = (rows, currentMonth) => {
  if (!rows.length) return [];
  const header = rows[0].map(h => String(h || "").trim().toLowerCase());
  return rows.slice(1).map(cols => {
    const get = (name) => {
      const i = header.findIndex(h => h.includes(name));
      return i >= 0 ? String(cols[i] ?? "").replace(/"/g, "").trim() : "";
    };
    const rawAmt = get("valor").replace(",", ".");
    const amount = parseFloat(rawAmt) || 0;
    const type   = amount < 0 || get("tipo").toLowerCase().includes("despesa") ? "out" : "in";
    const rawDate = get("data");
    let date = "", month = currentMonth;
    if (rawDate.includes("/")) {
      const parts = rawDate.split("/");
      if (parts.length === 3) {
        const y = parts[2].length === 2 ? "20" + parts[2] : parts[2];
        date  = `${y}-${parts[1].padStart(2,"0")}-${parts[0].padStart(2,"0")}`;
        month = `${parts[1].padStart(2,"0")}/${parts[2].slice(-2)}`;
      }
    } else if (rawDate.includes("-")) {
      const parts = rawDate.split("-");
      if (parts.length === 3) {
        date  = rawDate;
        month = `${parts[1]}/${parts[0].slice(-2)}`;
      }
    }
    return {
      desc:     get("descrição") || get("descricao") || get("desc") || "Importado",
      type, amount: Math.abs(amount),
      category: resolveCategory(get("categoria") || get("category")),
      date, month, _preview: true,
    };
  }).filter(r => r.amount > 0);
};

export default function ImportExport() {
  const { transactions, currentMonth, allCategories, addTransaction, showToast } = useApp();
  const { theme } = useTheme();

  const [exportPeriod, setExportPeriod] = useState("month");
  const [exportType,   setExportType]   = useState("all");
  const [exportCat,    setExportCat]    = useState("all");
  const [customFrom,   setCustomFrom]   = useState("");
  const [customTo,     setCustomTo]     = useState("");
  const [importData,   setImportData]   = useState(null);
  const [importing,    setImporting]    = useState(false);
  const [importDone,   setImportDone]   = useState(false);
  const fileRef = useRef(null);

  const filtered = transactions.filter(t => {
    if (exportType !== "all" && t.type !== exportType) return false;
    if (exportCat  !== "all" && t.category !== exportCat) return false;
    if (exportPeriod === "month" && t.month !== currentMonth) return false;
    if (exportPeriod === "custom") {
      if (customFrom && t.month < customFrom) return false;
      if (customTo   && t.month > customTo)   return false;
    }
    return true;
  });

  const filtIncome   = filtered.filter(t => t.type === "in").reduce((a, b)  => a + b.amount, 0);
  const filtExpenses = filtered.filter(t => t.type === "out").reduce((a, b) => a + b.amount, 0);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const isXlsx = file.name.endsWith(".xlsx") || file.name.endsWith(".xls");
    const reader = new FileReader();
    reader.onload = (ev) => {
      let rows;
      if (isXlsx) {
        const wb = XLSX.read(ev.target.result, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
      } else {
        const text = ev.target.result.replace(/^\uFEFF/, "");
        rows = text.trim().split("\n").map(l => l.split(";"));
      }
      setImportData(parseRows(rows, currentMonth));
      setImportDone(false);
    };
    if (isXlsx) reader.readAsArrayBuffer(file);
    else         reader.readAsText(file, "utf-8");
  };

  const handleImport = async () => {
    if (!importData?.length) return;
    setImporting(true);
    try {
      const BATCH = 10;
      for (let i = 0; i < importData.length; i += BATCH) {
        const chunk = importData.slice(i, i + BATCH);
        await Promise.all(chunk.map(row => {
          const { _preview, ...data } = row;
          return addTransaction({ ...data, recurrent: false, installments: false }, true);
        }));
      }
      setImportDone(true);
      setImportData(null);
      showToast(`${importData.length} transações importadas! ✓`);
      if (fileRef.current) fileRef.current.value = "";
    } catch (err) {
      showToast("Erro ao importar. Tente novamente.", "error");
    }
    setImporting(false);
  };

  const inp = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 10, padding: "0.6rem 0.875rem",
    color: theme.text, fontSize: 13, outline: "none",
    fontFamily: "inherit", boxSizing: "border-box",
  };

  const lbl = {
    display: "block", fontSize: 10, fontWeight: 700,
    color: theme.textMuted, marginBottom: 7,
    textTransform: "uppercase", letterSpacing: ".1em",
  };

  const periodBtns = [
    { id: "month",  label: "Mês atual" },
    { id: "all",    label: "Tudo" },
    { id: "custom", label: "Período" },
  ];

  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <style>{`
        /* ── ImportExport layout ── */
        .ie-wrap { max-width: 760px; width: 100%; }

        .ie-card {
          background: linear-gradient(160deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.02) 100%);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 1.75rem;
          backdrop-filter: blur(16px);
          margin-bottom: 20px;
          box-sizing: border-box;
          width: 100%;
        }

        /* Filtros exportar: 2 colunas no desktop */
        .ie-filters {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 20px;
        }

        /* Resumo: 4 colunas */
        .ie-summary {
          display: grid;
          grid-template-columns: repeat(4,1fr);
          gap: 12px;
          margin-bottom: 20px;
          padding: 1rem 1.25rem;
          background: rgba(255,255,255,0.03);
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.06);
        }

        /* Botões exportar */
        .ie-export-btns {
          display: flex;
          gap: 10px;
        }

        /* Período custom: 2 colunas */
        .ie-custom-range {
          display: flex;
          gap: 8px;
          margin-top: 10px;
        }

        /* Preview rows */
        .ie-preview-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0.625rem 0.875rem;
          border-radius: 10px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          min-width: 0;
          overflow: hidden;
        }

        /* ── Mobile (<= 767px) ── */
        @media (max-width: 767px) {
          .ie-card          { padding: 1.25rem !important; border-radius: 16px !important; }
          .ie-filters       { grid-template-columns: 1fr !important; gap: 14px !important; }
          .ie-summary       { grid-template-columns: repeat(2,1fr) !important; padding: 0.875rem !important; gap: 8px !important; }
          .ie-export-btns   { flex-direction: column !important; }
          .ie-export-btns button { width: 100% !important; }
          .ie-custom-range  { flex-direction: column !important; }
        }

        /* ── Muito pequeno (<= 360px) ── */
        @media (max-width: 360px) {
          .ie-card    { padding: 1rem !important; }
          .ie-summary { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      <div className="ie-wrap">
        {/* ── EXPORTAR ── */}
        <div className="ie-card">
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: `${theme.accent}18`, border: `1px solid ${theme.accent}35`, display: "flex", alignItems: "center", justifyContent: "center", color: theme.accent, flexShrink: 0 }}>
              <Icon name="arrowUp" size={18}/>
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: theme.text, letterSpacing: "-0.3px" }}>Exportar</div>
              <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 2 }}>Baixe suas transações em CSV ou PDF</div>
            </div>
          </div>

          {/* Filtros */}
          <div className="ie-filters">
            {/* Período */}
            <div>
              <label style={lbl}>Período</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {periodBtns.map(p => (
                  <button key={p.id} onClick={() => setExportPeriod(p.id)} style={{
                    ...inp, cursor: "pointer", fontWeight: 600, fontSize: 12,
                    border: `1px solid ${exportPeriod === p.id ? theme.accent + "66" : "rgba(255,255,255,0.08)"}`,
                    background: exportPeriod === p.id ? theme.accent + "14" : "rgba(255,255,255,0.04)",
                    color: exportPeriod === p.id ? theme.accent : theme.textMuted,
                    padding: "0.5rem 0.75rem", flexShrink: 0,
                  }}>{p.label}</button>
                ))}
              </div>
              {exportPeriod === "custom" && (
                <div className="ie-custom-range">
                  <div style={{ flex: 1 }}>
                    <label style={{ ...lbl, marginBottom: 4 }}>De (MM/AA)</label>
                    <input style={{ ...inp, width: "100%" }} placeholder="01/25" maxLength={5}
                      value={customFrom} onChange={e => setCustomFrom(e.target.value)}/>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ ...lbl, marginBottom: 4 }}>Até (MM/AA)</label>
                    <input style={{ ...inp, width: "100%" }} placeholder="12/25" maxLength={5}
                      value={customTo} onChange={e => setCustomTo(e.target.value)}/>
                  </div>
                </div>
              )}
            </div>

            {/* Tipo + Categoria */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={lbl}>Tipo</label>
                <select style={{ ...inp, width: "100%" }} value={exportType} onChange={e => setExportType(e.target.value)}>
                  <option value="all">Todos</option>
                  <option value="in">Receitas</option>
                  <option value="out">Despesas</option>
                </select>
              </div>
              <div>
                <label style={lbl}>Categoria</label>
                <select style={{ ...inp, width: "100%" }} value={exportCat} onChange={e => setExportCat(e.target.value)}>
                  <option value="all">Todas</option>
                  {allCategories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Resumo */}
          <div className="ie-summary">
            {[
              { label: "Transações", value: filtered.length,           color: theme.text,   fmt: v => v },
              { label: "Receitas",   value: filtIncome,                color: "#4ade80",    fmt: fmt },
              { label: "Despesas",   value: filtExpenses,              color: theme.danger, fmt: fmt },
              { label: "Saldo",      value: filtIncome - filtExpenses,  color: filtIncome - filtExpenses >= 0 ? "#4ade80" : theme.danger, fmt: fmt },
            ].map(item => (
              <div key={item.label} style={{ textAlign: "center", minWidth: 0 }}>
                <div style={{ fontSize: 10, color: theme.textMuted, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: item.color, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.fmt(item.value)}</div>
              </div>
            ))}
          </div>

          {/* Botões */}
          <div className="ie-export-btns">
            <button onClick={() => exportCSV(filtered, `contabileasy-${currentMonth}`)} disabled={filtered.length === 0} style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              padding: "0.8rem 1.25rem", borderRadius: 12, fontFamily: "inherit",
              border: `1px solid ${filtered.length ? theme.accent + "44" : "rgba(255,255,255,0.06)"}`,
              background: filtered.length ? theme.accent + "10" : "rgba(255,255,255,0.03)",
              color: filtered.length ? theme.accent : theme.textMuted,
              fontWeight: 700, fontSize: 14, cursor: filtered.length ? "pointer" : "not-allowed",
              transition: "all 0.2s",
            }}>
              <Icon name="list" size={16}/> Exportar CSV
            </button>
            <button onClick={() => exportPDF(filtered, currentMonth)} disabled={filtered.length === 0} style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              padding: "0.8rem 1.25rem", borderRadius: 12, fontFamily: "inherit",
              border: `1px solid ${filtered.length ? "#f472b644" : "rgba(255,255,255,0.06)"}`,
              background: filtered.length ? "#f472b610" : "rgba(255,255,255,0.03)",
              color: filtered.length ? "#f472b6" : theme.textMuted,
              fontWeight: 700, fontSize: 14, cursor: filtered.length ? "pointer" : "not-allowed",
              transition: "all 0.2s",
            }}>
              <Icon name="chart" size={16}/> Exportar PDF
            </button>
          </div>
        </div>

        {/* ── IMPORTAR ── */}
        <div className="ie-card">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "#60a5fa18", border: "1px solid #60a5fa35", display: "flex", alignItems: "center", justifyContent: "center", color: "#60a5fa", flexShrink: 0 }}>
              <Icon name="arrowDown" size={18}/>
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: theme.text, letterSpacing: "-0.3px" }}>Importar CSV</div>
              <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 2 }}>Importe transações de outro app ou planilha</div>
            </div>
          </div>

          <div style={{ padding: "0.875rem 1rem", borderRadius: 12, marginBottom: 20, background: "rgba(96,165,250,0.06)", border: "1px solid rgba(96,165,250,0.15)", fontSize: 12, color: theme.textMuted, lineHeight: 1.6 }}>
            O arquivo deve ter colunas: <strong style={{ color: theme.text }}>Data</strong>, <strong style={{ color: theme.text }}>Descrição</strong>, <strong style={{ color: theme.text }}>Tipo</strong> e <strong style={{ color: theme.text }}>Valor (R$)</strong>. Aceita <strong style={{ color: theme.text }}>.csv</strong> (separador <code>;</code>) e <strong style={{ color: theme.text }}>.xlsx</strong>.
          </div>

          {/* Drop zone */}
          <div onClick={() => fileRef.current?.click()} style={{
            border: `2px dashed ${importData ? "#60a5fa55" : "rgba(255,255,255,0.1)"}`,
            borderRadius: 16, padding: "2rem 1rem",
            textAlign: "center", cursor: "pointer",
            background: importData ? "rgba(96,165,250,0.06)" : "rgba(255,255,255,0.02)",
            transition: "all 0.2s", marginBottom: 16,
          }}>
            <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" style={{ display: "none" }} onChange={handleFile}/>
            <div style={{ fontSize: 28, marginBottom: 8 }}>📂</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: theme.text, marginBottom: 4 }}>
              {importData ? `${importData.length} linhas detectadas` : "Clique para selecionar o CSV"}
            </div>
            <div style={{ fontSize: 12, color: theme.textMuted }}>
              {importData ? "Clique novamente para trocar o arquivo" : "Formato: .csv ou .xlsx"}
            </div>
          </div>

          {/* Preview */}
          {importData && importData.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 10 }}>
                Preview ({Math.min(importData.length, 5)} de {importData.length})
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {importData.slice(0, 5).map((row, i) => (
                  <div key={i} className="ie-preview-row">
                    <div style={{ width: 6, height: 6, borderRadius: "50%", flexShrink: 0, background: row.type === "in" ? "#4ade80" : theme.danger }}/>
                    <span style={{ flex: 1, fontSize: 13, color: theme.text, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.desc}</span>
                    <span style={{ fontSize: 11, color: theme.textMuted, flexShrink: 0 }}>{row.month}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: row.type === "in" ? "#4ade80" : theme.danger, flexShrink: 0 }}>
                      {row.type === "in" ? "+" : "−"}{fmt(row.amount)}
                    </span>
                  </div>
                ))}
                {importData.length > 5 && (
                  <div style={{ fontSize: 12, color: theme.textMuted, textAlign: "center", padding: "0.5rem" }}>
                    + {importData.length - 5} mais...
                  </div>
                )}
              </div>
            </div>
          )}

          {importDone && (
            <div style={{ padding: "0.875rem 1rem", borderRadius: 12, marginBottom: 16, background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)", fontSize: 13, color: "#4ade80", fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name="check" size={14}/> Importação concluída com sucesso!
            </div>
          )}

          <button onClick={handleImport} disabled={!importData?.length || importing} style={{
            width: "100%", padding: "0.85rem", borderRadius: 12, border: "none",
            background: importData?.length && !importing ? "linear-gradient(135deg,#60a5fa,#818cf8)" : "rgba(255,255,255,0.05)",
            color: importData?.length && !importing ? "#080c14" : theme.textMuted,
            fontWeight: 800, fontSize: 14, cursor: importData?.length ? "pointer" : "not-allowed",
            fontFamily: "inherit", transition: "all 0.2s",
            boxShadow: importData?.length && !importing ? "0 4px 20px rgba(96,165,250,0.25)" : "none",
          }}>
            {importing ? "Importando..." : importData?.length ? `Importar ${importData.length} transações` : "Selecione um arquivo para importar"}
          </button>
        </div>
      </div>
    </div>
  );
}