import { CATEGORIES } from "../data/constants";

export const fmt = (v) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

export const fmtShort = (v) => {
  const abs = Math.abs(v);
  if (abs >= 1000) return (v < 0 ? "-" : "") + "R$" + (abs / 1000).toFixed(1) + "k";
  return fmt(v);
};

export const getCatInfo = (id) =>
  CATEGORIES.find((c) => c.id === id) || CATEGORIES[7];

export const getLast6Months = (currentMonth, transactions) => {
  const [mm, yy] = currentMonth.split("/").map(Number);
  return Array.from({ length: 6 }, (_, i) => {
    let m = mm - (5 - i);
    let y = yy;
    while (m <= 0) { m += 12; y -= 1; }
    const key = `${String(m).padStart(2, "0")}/${String(y).padStart(2, "0")}`;
    const txns = transactions.filter((t) => t.month === key);
    const income   = txns.filter((t) => t.type === "in").reduce((a, b) => a + b.amount, 0);
    const expenses = txns.filter((t) => t.type === "out").reduce((a, b) => a + b.amount, 0);
    return { key, month: m, income, expenses, balance: income - expenses };
  });
};
