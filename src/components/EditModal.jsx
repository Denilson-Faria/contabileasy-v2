
import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { useTheme } from "../context/ThemeContext";
import Icon from "./Icon";

export default function EditModal() {
  const { modal, editTarget, setModal, setEditTarget, updateTransaction, allCategories } = useApp();
  const { theme } = useTheme();

  const [form, setForm] = useState(null);

  useEffect(() => {
    if (modal?.type === "edit" && editTarget) {
      setForm({
        desc:     editTarget.desc,
        type:     editTarget.type,
        amount:   String(editTarget.amount),
        category: editTarget.category,
        date:     editTarget.date || "",
        month:    editTarget.month,
      });
    }
  }, [modal, editTarget]);

  if (modal?.type !== "edit" || !form) return null;

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const close = () => { setModal(null); setEditTarget(null); };

  const handleSave = async () => {
    if (!form.desc || !form.amount) return;
    await updateTransaction(editTarget.id, form);
  };

  const inp = {
    background:   theme.input,
    border:       `1px solid ${theme.inputBorder}`,
    borderRadius: 8,
    padding:      "0.6rem 0.875rem",
    color:        theme.text,
    fontSize:     14,
    outline:      "none",
    width:        "100%",
    boxSizing:    "border-box",
    transition:   "border-color 0.2s",
  };

  const label = {
    display:       "block",
    fontSize:      11,
    fontWeight:    600,
    color:         theme.textMuted,
    marginBottom:  5,
    textTransform: "uppercase",
    letterSpacing: ".06em",
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, background: theme.overlay, backdropFilter: "blur(8px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
      onClick={close}
    >
      <div
        style={{ background: theme.bgSecondary, border: `1px solid ${theme.border}`, borderRadius: 20, padding: "2rem", maxWidth: 480, width: "100%", boxShadow: "0 25px 60px rgba(0,0,0,0.4)", animation: "fadeIn 0.2s ease" }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: theme.text }}>Editar Lançamento</div>
            <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 2 }}>Altere os dados da transação</div>
          </div>
          <button onClick={close} style={{ background: "none", border: "none", color: theme.textMuted, cursor: "pointer", padding: 4 }}>
            <Icon name="x" size={18} />
          </button>
        </div>

        {/* Tipo */}
        <div style={{ marginBottom: 14 }}>
          <div style={label}>Tipo</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              { value: "in",  label: "Receita",  color: "#4ade80" },
              { value: "out", label: "Despesa",  color: "#f87171" },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => set("type", opt.value)}
                style={{
                  padding:      "0.6rem",
                  borderRadius: 8,
                  border:       `1.5px solid ${form.type === opt.value ? opt.color : theme.border}`,
                  background:   form.type === opt.value ? opt.color + "15" : theme.input,
                  color:        form.type === opt.value ? opt.color : theme.textMuted,
                  fontWeight:   600, fontSize: 13, cursor: "pointer",
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Descrição */}
        <div style={{ marginBottom: 14 }}>
          <label style={label}>Descrição</label>
          <input style={inp} value={form.desc} onChange={e => set("desc", e.target.value)}
            onFocus={e => e.target.style.borderColor = theme.accent}
            onBlur={e => e.target.style.borderColor = theme.inputBorder} />
        </div>

        {/* Valor + Mês */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
          <div>
            <label style={label}>Valor (R$)</label>
            <input style={inp} type="number" step="0.01" value={form.amount}
              onChange={e => set("amount", e.target.value)}
              onFocus={e => e.target.style.borderColor = theme.accent}
              onBlur={e => e.target.style.borderColor = theme.inputBorder} />
          </div>
          <div>
            <label style={label}>Mês (MM/AA)</label>
            <input style={inp} maxLength={5} value={form.month}
              onChange={e => set("month", e.target.value)}
              onFocus={e => e.target.style.borderColor = theme.accent}
              onBlur={e => e.target.style.borderColor = theme.inputBorder} />
          </div>
        </div>

        {/* Data */}
        <div style={{ marginBottom: 14 }}>
          <label style={label}>Data</label>
          <input style={inp} type="date" value={form.date}
            onChange={e => set("date", e.target.value)}
            onFocus={e => e.target.style.borderColor = theme.accent}
            onBlur={e => e.target.style.borderColor = theme.inputBorder} />
        </div>

        {/* Categoria */}
        <div style={{ marginBottom: 20 }}>
          <div style={label}>Categoria</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6 }}>
            {allCategories.map(c => (
              <button
                key={c.id}
                onClick={() => set("category", c.id)}
                style={{
                  padding: "0.5rem 0.3rem", borderRadius: 8, fontSize: 11, fontWeight: 600,
                  border:      `1.5px solid ${form.category === c.id ? c.color : theme.border}`,
                  background:  form.category === c.id ? c.color + "15" : theme.input,
                  color:       form.category === c.id ? theme.text : theme.textMuted,
                  cursor: "pointer", textAlign: "center",
                }}
              >
                {c.emoji}<br />{c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Ações */}
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button
            onClick={close}
            style={{ background: theme.input, border: `1px solid ${theme.border}`, borderRadius: 10, padding: "0.65rem 1.25rem", color: theme.textMuted, fontWeight: 600, fontSize: 14, cursor: "pointer" }}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            style={{ background: "linear-gradient(135deg, #4ade80, #22d3ee)", border: "none", borderRadius: 10, padding: "0.65rem 1.5rem", color: "#080c14", fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
          >
            <Icon name="edit" size={15} /> Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
