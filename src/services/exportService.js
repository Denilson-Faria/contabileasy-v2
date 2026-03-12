// services/exportService.js
// Exportação para CSV e PDF — sem bibliotecas externas.

import { fmt } from "../utils/formatters";
import { getCatInfo } from "../utils/formatters";

// ── CSV ──────────────────────────────────────────────────────────────────────
export function exportCSV(transactions, filename = "contabileasy-extrato") {
  const header = ["Data", "Descrição", "Tipo", "Categoria", "Valor (R$)"];

  const rows = transactions.map(t => {
    const date = t.date
      ? new Date(t.date + "T00:00:00").toLocaleDateString("pt-BR")
      : t.month;
    const type = t.type === "in" ? "Receita" : "Despesa";
    const cat  = getCatInfo(t.category).label;
    const sign = t.type === "in" ? "" : "-";
    return [date, `"${t.desc}"`, type, cat, `${sign}${t.amount.toFixed(2)}`];
  });

  const csv = [header, ...rows].map(r => r.join(";")).join("\n");
  // BOM UTF-8 para o Excel abrir com acentos corretamente
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  download(blob, `${filename}.csv`);
}

// ── PDF ──────────────────────────────────────────────────────────────────────
// Gera um HTML formatado e abre a janela de impressão do browser.
// O usuário salva como PDF — funciona em todos os dispositivos sem bibliotecas.
export function exportPDF(transactions, period = "") {
  const income   = transactions.filter(t => t.type === "in").reduce((a, b) => a + b.amount, 0);
  const expenses = transactions.filter(t => t.type === "out").reduce((a, b) => a + b.amount, 0);
  const balance  = income - expenses;

  const rows = transactions.map(t => {
    const date  = t.date
      ? new Date(t.date + "T00:00:00").toLocaleDateString("pt-BR")
      : t.month;
    const cat   = getCatInfo(t.category);
    const color = t.type === "in" ? "#16a34a" : "#dc2626";
    const sign  = t.type === "in" ? "+" : "−";
    return `
      <tr>
        <td>${date}</td>
        <td>${t.desc}</td>
        <td>${cat.label}</td>
        <td style="color:${color};font-weight:600;text-align:right">${sign} ${fmt(t.amount)}</td>
      </tr>`;
  }).join("");

  const balColor = balance >= 0 ? "#16a34a" : "#dc2626";

  const html = `
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
      <meta charset="UTF-8">
      <title>ContabilEasy — Extrato ${period}</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Segoe UI', sans-serif; color: #0f172a; padding: 40px; font-size: 13px; }
        header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; }
        h1 { font-size: 22px; font-weight: 800; color: #0f172a; }
        .period { font-size: 13px; color: #64748b; margin-top: 4px; }
        .summary { display: flex; gap: 24px; margin-bottom: 28px; }
        .summary-card { flex: 1; padding: 16px; border-radius: 10px; border: 1px solid #e2e8f0; }
        .summary-card .label { font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: .06em; margin-bottom: 6px; }
        .summary-card .value { font-size: 20px; font-weight: 800; }
        table { width: 100%; border-collapse: collapse; }
        thead tr { background: #f1f5f9; }
        th { padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: .06em; }
        td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; }
        tr:last-child td { border-bottom: none; }
        tr:nth-child(even) { background: #fafafa; }
        footer { margin-top: 32px; text-align: center; font-size: 11px; color: #94a3b8; }
        @media print { body { padding: 20px; } }
      </style>
    </head>
    <body>
      <header>
        <div>
          <h1>● ContabilEasy</h1>
          <div class="period">Extrato ${period ? `— ${period}` : ""} · Gerado em ${new Date().toLocaleDateString("pt-BR")}</div>
        </div>
        <div style="text-align:right;font-size:12px;color:#64748b">${transactions.length} transações</div>
      </header>

      <div class="summary">
        <div class="summary-card">
          <div class="label">Receitas</div>
          <div class="value" style="color:#16a34a">${fmt(income)}</div>
        </div>
        <div class="summary-card">
          <div class="label">Despesas</div>
          <div class="value" style="color:#dc2626">${fmt(expenses)}</div>
        </div>
        <div class="summary-card">
          <div class="label">Saldo</div>
          <div class="value" style="color:${balColor}">${fmt(balance)}</div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Descrição</th>
            <th>Categoria</th>
            <th style="text-align:right">Valor</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>

      <footer>ContabilEasy v2.0 — Relatório gerado automaticamente</footer>
    </body>
    </html>`;

  const win = window.open("", "_blank");
  win.document.write(html);
  win.document.close();
  // Aguarda carregar antes de abrir impressão
  win.onload = () => win.print();
}

// ── Helper ───────────────────────────────────────────────────────────────────
function download(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a   = document.createElement("a");
  a.href     = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}