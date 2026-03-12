
import { useApp } from "../context/AppContext";
import { useTheme } from "../context/ThemeContext";
import Icon from "./Icon";

export default function DeleteModal() {
  const { modal, deleteTarget, setModal, setDeleteTarget, deleteTransaction, deleteRecurrentGroup } = useApp();
  const { theme } = useTheme();

  if (modal?.type !== "delete") return null;

  const t = deleteTarget;
  const isRecurrent = t?.recurrentGroupId;

  const close = () => { setModal(null); setDeleteTarget(null); };
  const confirm = () => isRecurrent ? deleteRecurrentGroup(t.recurrentGroupId) : deleteTransaction(t.id);

  return (
    <div
      style={{ position:"fixed", inset:0, background:theme.overlay, backdropFilter:"blur(8px)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:"1rem" }}
      onClick={close}
    >
      <div
        style={{ background:theme.bgSecondary, border:`1px solid ${theme.border}`, borderRadius:20, padding:"2rem", maxWidth:420, width:"100%", boxShadow:"0 25px 60px rgba(0,0,0,0.5)" }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ fontSize:32, marginBottom:16 }}>🗑️</div>
        <div style={{ fontSize:18, fontWeight:700, color:theme.text, marginBottom:8 }}>Confirmar exclusão</div>
        <div style={{ fontSize:14, color:theme.textMuted, marginBottom:24 }}>
          {isRecurrent
            ? "Esta é uma transação recorrente. Ao confirmar, todos os 12 lançamentos do grupo serão excluídos permanentemente."
            : "Esta ação não pode ser desfeita. Deseja continuar?"}
        </div>
        <div style={{ display:"flex", gap:12, justifyContent:"flex-end" }}>
          <button style={{ background:theme.input, border:`1px solid ${theme.border}`, borderRadius:10, padding:"0.65rem 1.25rem", color:theme.textMuted, fontWeight:600, fontSize:14, cursor:"pointer", fontFamily:"inherit" }} onClick={close}>
            Cancelar
          </button>
          <button style={{ background:"#f87171", border:"none", borderRadius:10, padding:"0.65rem 1.5rem", color:"#fff", fontWeight:700, fontSize:14, cursor:"pointer", display:"flex", alignItems:"center", gap:8, fontFamily:"inherit" }} onClick={confirm}>
            <Icon name="trash" size={14} /> Excluir{isRecurrent ? " todos" : ""}
          </button>
        </div>
      </div>
    </div>
  );
}