
import { useMemo } from "react";
import { useApp } from "../context/AppContext";
import { CATEGORIES } from "../data/constants";
import { getLast6Months } from "../utils/formatters";

export function useTransactions() {
  const { transactions, currentMonth } = useApp();

  const monthTxns = useMemo(
    () => transactions.filter((t) => t.month === currentMonth),
    [transactions, currentMonth]
  );

  const income   = useMemo(() => monthTxns.filter(t => t.type === "in").reduce((a, b) => a + b.amount, 0), [monthTxns]);
  const expenses = useMemo(() => monthTxns.filter(t => t.type === "out").reduce((a, b) => a + b.amount, 0), [monthTxns]);
  const balance  = income - expenses;

  const recentTxns = useMemo(() => {
    const seenGroups = new Set();
    const deduped = [];

    const sorted = [...monthTxns].sort((a, b) => new Date(b.date) - new Date(a.date));

    for (const t of sorted) {
      if (t.recurrent && t.recurrentGroupId) {
        if (seenGroups.has(t.recurrentGroupId)) continue; 
        seenGroups.add(t.recurrentGroupId);
        deduped.push({ ...t, _showRecurrentBadge: true });
      } else {
        deduped.push(t);
      }
    }

    return deduped.slice(0, 6);
  }, [monthTxns]);

  const catBreakdown = useMemo(() =>
    CATEGORIES
      .map((c) => ({
        ...c,
        value: monthTxns
          .filter((t) => t.category === c.id && t.type === "out")
          .reduce((a, b) => a + b.amount, 0),
      }))
      .filter((c) => c.value > 0)
      .sort((a, b) => b.value - a.value),
    [monthTxns]
  );

  const last6 = useMemo(
    () => getLast6Months(currentMonth, transactions),
    [currentMonth, transactions]
  );

  return { monthTxns, income, expenses, balance, recentTxns, catBreakdown, last6 };
}