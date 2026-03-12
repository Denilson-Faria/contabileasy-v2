import { createContext, useContext, useState, useEffect } from "react";
import {
  subscribeToTransactions,
  subscribeToGoals,
  subscribeToCategories,
  addTransaction    as fsAdd,
  updateTransaction as fsUpdate,
  deleteTransaction as fsDelete,
  addGoal     as fsAddGoal,
  updateGoal  as fsUpdateGoal,
  deleteGoal  as fsDeleteGoal,
  addCategory    as fsAddCat,
  deleteCategory as fsDeleteCat,
} from "../services/firestoreService";
import { CATEGORIES as DEFAULT_CATS } from "../data/constants";

const AppContext = createContext(null);

export function AppProvider({ children, user }) {
  const [transactions,      setTransactions]      = useState([]);
  const [goals,             setGoals]             = useState([]);
  const [customCategories,  setCustomCategories]  = useState([]);
  const [loadingData,       setLoadingData]       = useState(true);

  const [activeTab,    setActiveTab]    = useState("dashboard");
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return `${String(now.getMonth() + 1).padStart(2,"0")}/${String(now.getFullYear()).slice(2)}`;
  });
  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [modal,        setModal]        = useState(null); 
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editTarget,   setEditTarget]   = useState(null); 
  const [toast,        setToast]        = useState(null);
  const [animKey,      setAnimKey]      = useState(0);


  useEffect(() => {
    if (!user?.uid) return;
    setLoadingData(true);
    let loaded = 0;
    const check = () => { if (++loaded === 3) setLoadingData(false); };

    const u1 = subscribeToTransactions(user.uid, d => { setTransactions(d); check(); });
    const u2 = subscribeToGoals(user.uid,        d => { setGoals(d);        check(); });
    const u3 = subscribeToCategories(user.uid,   d => { setCustomCategories(d); check(); });

    return () => { u1(); u2(); u3(); };
  }, [user?.uid]);

  const allCategories = [
    ...DEFAULT_CATS,
    ...customCategories.map(c => ({ ...c, custom: true })),
  ];

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const switchTab = (tab) => { setActiveTab(tab); setSidebarOpen(false); };
  const changeMonth = (dir) => {
    const [mm, yy] = currentMonth.split("/").map(Number);
    let m = mm + dir, y = yy;
    if (m > 12) { m = 1;  y++; }
    if (m < 1)  { m = 12; y--; }
    setCurrentMonth(`${String(m).padStart(2,"0")}/${String(y).padStart(2,"0")}`);
  };

  const addTransaction = async (form) => {
    const total   = parseFloat(form.amount);
    const base = {
      desc:     form.desc,
      type:     form.type,
      amount:   total,
      category: form.category,
      date:     form.date || new Date().toISOString().split("T")[0],
      month:    form.month,
    };

    const nextMonth = (month, i) => {
      const [mm, yy] = month.split("/").map(Number);
      let m = mm + i, y = yy;
      while (m > 12) { m -= 12; y++; }
      return `${String(m).padStart(2,"0")}/${String(y).padStart(2,"0")}`;
    };

    const promises = [];

    if (form.recurrent) {
     
      const groupId = `rec_${Date.now()}`; 
      for (let i = 0; i < 12; i++) {
        promises.push(fsAdd(user.uid, { ...base, month: nextMonth(form.month, i), recurrent: true, recurrentGroupId: groupId }));
      }
      await Promise.all(promises);
      showToast(`12 lançamentos recorrentes salvos! ✓`);

    } else if (form.installments) {
      
      const n           = parseInt(form.installmentCount) || 2;
      const perInstall  = parseFloat((total / n).toFixed(2));
      
      const lastInstall = parseFloat((total - perInstall * (n - 1)).toFixed(2));

      for (let i = 0; i < n; i++) {
        promises.push(fsAdd(user.uid, {
          ...base,
          desc:   `${form.desc} (${i + 1}/${n})`,
          amount: i === n - 1 ? lastInstall : perInstall,
          month:  nextMonth(form.month, i),
        }));
      }
      await Promise.all(promises);
      showToast(`${n} parcelas salvas! ✓`);

    } else {
      await fsAdd(user.uid, base);
      showToast("Lançamento salvo! ✓");
    }

    setAnimKey(k => k + 1);
  };

  const updateTransaction = async (id, data) => {
    await fsUpdate(user.uid, id, {
      ...data,
      amount: parseFloat(data.amount),
    });
    setEditTarget(null);
    setModal(null);
    showToast("Lançamento atualizado! ✓");
  };

  const deleteTransaction = async (id) => {
    await fsDelete(user.uid, id);
    setDeleteTarget(null);
    setModal(null);
    showToast("Transação removida", "info");
  };

  const deleteRecurrentGroup = async (groupId) => {
    const group = transactions.filter(t => t.recurrentGroupId === groupId);
    await Promise.all(group.map(t => fsDelete(user.uid, t.id)));
    setDeleteTarget(null);
    setModal(null);
    showToast(`${group.length} lançamentos recorrentes removidos`, "info");
  };

  const addGoal = async (data) => {
    await fsAddGoal(user.uid, data);
    showToast("Meta criada! 🎯");
  };
  const updateGoal = async (id, data) => {
    await fsUpdateGoal(user.uid, id, data);
    showToast("Meta atualizada! ✓");
  };
  const deleteGoal = async (id) => {
    await fsDeleteGoal(user.uid, id);
    showToast("Meta removida", "info");
  };

  const addCustomCategory = async (data) => {
    await fsAddCat(user.uid, data);
    showToast(`Categoria "${data.label}" criada!`);
  };
  const deleteCustomCategory = async (id) => {
    await fsDeleteCat(user.uid, id);
    showToast("Categoria removida", "info");
  };

  return (
    <AppContext.Provider value={{
     
      transactions, goals, allCategories, customCategories,
      loadingData,
     
      activeTab, currentMonth, sidebarOpen,
    
      modal, deleteTarget, editTarget,
      toast, animKey,
      
      setModal, setDeleteTarget, setEditTarget, setSidebarOpen,
    
      switchTab, changeMonth,
      addTransaction, updateTransaction, deleteTransaction, deleteRecurrentGroup,
      addGoal, updateGoal, deleteGoal,
      addCustomCategory, deleteCustomCategory,
      showToast,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp deve ser usado dentro de <AppProvider>");
  return ctx;
};