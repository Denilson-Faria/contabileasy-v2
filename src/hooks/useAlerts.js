import { useMemo } from "react";
import { useApp } from "../context/AppContext";

export function useAlerts() {
  const { transactions } = useApp();

  const alerts = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayStr    = today.toISOString().split("T")[0];
    const tomorrowStr = tomorrow.toISOString().split("T")[0];

    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yy = String(today.getFullYear()).slice(-2);
    const currentMonth = `${mm}/${yy}`;

    const result = [];
    const seenGroups = new Set();

    for (const t of transactions) {
      if (!t.date || t.type !== "out" || t.month !== currentMonth) continue;

      const isRecurrent   = t.recurrent && t.recurrentGroupId;
      const isInstallment = !!t.installmentGroupId;

      if (!isRecurrent && !isInstallment) continue;

     
      const groupKey = t.recurrentGroupId || t.installmentGroupId;
      if (seenGroups.has(groupKey)) continue;
      seenGroups.add(groupKey);

      let urgency = null;
      if (t.date === todayStr)    urgency = "today";
      if (t.date === tomorrowStr) urgency = "tomorrow";
      if (!urgency) continue;

      result.push({
        ...t,
        urgency,
        label: urgency === "today" ? "vence hoje" : "vence amanhã",
        kind:  isRecurrent ? "recorrente" : "parcelada",
      });
    }

    return result.sort((a, b) => (a.urgency === "today" ? -1 : 1));
  }, [transactions]);

  return alerts;
}