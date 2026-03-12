import { useState } from "react";
import { useApp } from "../context/AppContext";
import { useTheme } from "../context/ThemeContext";
import Icon from "../components/Icon";
import { fmt } from "../utils/formatters";
import {
  Target,
  TrendingUp,
  PiggyBank,
  Trophy,
  Rocket,
} from "lucide-react";

const EMPTY_FORM = {
  name: "",
  target: "",
  saved: "0",
  icon: "target",
  deadline: "",
};

const GOAL_ICONS = [
  { id: "target", label: "Meta", Icon: Target },
  { id: "growth", label: "Crescimento", Icon: TrendingUp },
  { id: "saving", label: "Reserva", Icon: PiggyBank },
  { id: "achievement", label: "Conquista", Icon: Trophy },
  { id: "dream", label: "Sonho", Icon: Rocket },
];

const GOAL_ICON_MAP = Object.fromEntries(
  GOAL_ICONS.map(({ id, Icon }) => [id, Icon])
);

export default function Metas() {
  const { goals, addGoal, updateGoal, deleteGoal } = useApp();
  const { theme } = useTheme();

  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deposit, setDeposit] = useState({});

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.name || !form.target) return;

    setSaving(true);

    const data = {
      name: form.name.trim(),
      target: parseFloat(form.target),
      saved: parseFloat(form.saved) || 0,
      icon: form.icon,
      deadline: form.deadline || null,
    };

    if (editId) {
      await updateGoal(editId, data);
      setEditId(null);
    } else {
      await addGoal(data);
    }

    setForm(EMPTY_FORM);
    setSaving(false);
  };

  const handleDeposit = async (goal) => {
    const val = parseFloat(deposit[goal.id] || 0);
    if (!val || val <= 0) return;

    const newSaved = Math.min((goal.saved || 0) + val, goal.target);
    await updateGoal(goal.id, { saved: newSaved });

    setDeposit((d) => ({ ...d, [goal.id]: "" }));
  };

  const startEdit = (g) => {
    setForm({
      name: g.name,
      target: String(g.target),
      saved: String(g.saved || 0),
      icon: g.icon || "target",
      deadline: g.deadline || "",
    });
    setEditId(g.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const SelectedIcon = GOAL_ICON_MAP[form.icon] || Target;

  const card = {
    background: theme.bgCard,
    border: `1px solid ${theme.border}`,
    borderRadius: 16,
    padding: "1.5rem",
  };

  const inp = {
    background: theme.input,
    border: `1px solid ${theme.inputBorder}`,
    borderRadius: 10,
    padding: "0.65rem 1rem",
    color: theme.text,
    fontSize: 14,
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  };

  const lbl = {
    display: "block",
    fontSize: 11,
    fontWeight: 600,
    color: theme.textMuted,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: ".06em",
  };

  const completed = goals.filter((g) => (g.saved || 0) >= g.target);
  const active = goals.filter((g) => (g.saved || 0) < g.target);

  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <div
        className="metas-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "380px 1fr",
          gap: 24,
          alignItems: "start",
        }}
      >
        <div style={card}>
          <div style={{ fontSize: 16, fontWeight: 700, color: theme.text, marginBottom: 4 }}>
            {editId ? "Editar Meta" : "Nova Meta"}
          </div>
          <div style={{ fontSize: 13, color: theme.textMuted, marginBottom: 20 }}>
            {editId ? "Atualize os dados da meta" : "Defina um objetivo financeiro"}
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={lbl}>Ícone</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {GOAL_ICONS.map(({ id, Icon: LucideIcon }) => {
                const active = form.icon === id;

                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => set("icon", id)}
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 8,
                      border: `2px solid ${active ? theme.accent : theme.border}`,
                      background: active ? theme.accentGlow : theme.input,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: active ? theme.accent : theme.textMuted,
                    }}
                    title={id}
                  >
                    <LucideIcon size={18} />
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={lbl}>Nome da meta *</label>
            <input
              style={inp}
              placeholder="Ex: Viagem, reserva, carro novo..."
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              onFocus={(e) => (e.target.style.borderColor = theme.accent)}
              onBlur={(e) => (e.target.style.borderColor = theme.inputBorder)}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
              marginBottom: 14,
            }}
          >
            <div>
              <label style={lbl}>Valor alvo (R$) *</label>
              <input
                style={inp}
                type="number"
                step="0.01"
                placeholder="10.000,00"
                value={form.target}
                onChange={(e) => set("target", e.target.value)}
                onFocus={(e) => (e.target.style.borderColor = theme.accent)}
                onBlur={(e) => (e.target.style.borderColor = theme.inputBorder)}
              />
            </div>

            <div>
              <label style={lbl}>Já guardado (R$)</label>
              <input
                style={inp}
                type="number"
                step="0.01"
                placeholder="0,00"
                value={form.saved}
                onChange={(e) => set("saved", e.target.value)}
                onFocus={(e) => (e.target.style.borderColor = theme.accent)}
                onBlur={(e) => (e.target.style.borderColor = theme.inputBorder)}
              />
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={lbl}>Prazo (opcional)</label>
            <input
              style={inp}
              type="date"
              value={form.deadline}
              onChange={(e) => set("deadline", e.target.value)}
              onFocus={(e) => (e.target.style.borderColor = theme.accent)}
              onBlur={(e) => (e.target.style.borderColor = theme.inputBorder)}
            />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "0.65rem 1rem",
              background: theme.input,
              border: `1px solid ${theme.border}`,
              borderRadius: 10,
              marginBottom: 16,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: theme.accentGlow,
                border: `1px solid ${theme.accent}35`,
                color: theme.accent,
              }}
            >
              <SelectedIcon size={18} />
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: theme.text }}>
              {form.name || "Prévia da meta"}
            </span>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            {editId && (
              <button
                onClick={() => {
                  setEditId(null);
                  setForm(EMPTY_FORM);
                }}
                style={{
                  flex: 1,
                  background: theme.input,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 10,
                  padding: "0.65rem",
                  color: theme.textMuted,
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                Cancelar
              </button>
            )}

            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                flex: 1,
                background: saving ? theme.input : "linear-gradient(135deg, #4ade80, #22d3ee)",
                border: "none",
                borderRadius: 10,
                padding: "0.65rem",
                color: saving ? theme.textMuted : "#080c14",
                fontWeight: 700,
                fontSize: 14,
                cursor: saving ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <Icon name={editId ? "edit" : "plus"} size={15} />
              {saving ? "Salvando..." : editId ? "Atualizar" : "Criar Meta"}
            </button>
          </div>
        </div>

        <div>
          {goals.length === 0 ? (
            <div style={{ ...card, textAlign: "center", padding: "3rem" }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: theme.text, marginBottom: 6 }}>
                Nenhuma meta ainda
              </div>
              <div style={{ fontSize: 13, color: theme.textMuted }}>
                Crie sua primeira meta financeira ao lado
              </div>
            </div>
          ) : (
            <>
              {active.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: theme.textMuted,
                      textTransform: "uppercase",
                      letterSpacing: ".1em",
                      marginBottom: 12,
                    }}
                  >
                    Em andamento ({active.length})
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {active.map((g) => (
                      <GoalCard
                        key={g.id}
                        g={g}
                        theme={theme}
                        inp={inp}
                        deposit={deposit}
                        setDeposit={setDeposit}
                        handleDeposit={handleDeposit}
                        onEdit={startEdit}
                        onDelete={deleteGoal}
                      />
                    ))}
                  </div>
                </div>
              )}

              {completed.length > 0 && (
                <div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: theme.textMuted,
                      textTransform: "uppercase",
                      letterSpacing: ".1em",
                      marginBottom: 12,
                    }}
                  >
                    Concluídas 🎉 ({completed.length})
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {completed.map((g) => (
                      <GoalCard
                        key={g.id}
                        g={g}
                        theme={theme}
                        inp={inp}
                        deposit={deposit}
                        setDeposit={setDeposit}
                        handleDeposit={handleDeposit}
                        onEdit={startEdit}
                        onDelete={deleteGoal}
                        completed
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function GoalCard({
  g,
  theme,
  inp,
  deposit,
  setDeposit,
  handleDeposit,
  onEdit,
  onDelete,
  completed,
}) {
  const saved = g.saved || 0;
  const target = g.target || 1;
  const pct = Math.min((saved / target) * 100, 100);
  const missing = Math.max(target - saved, 0);

  const daysLeft = g.deadline
    ? Math.ceil((new Date(g.deadline) - new Date()) / (1000 * 60 * 60 * 24))
    : null;

  const barColor = completed
    ? "#4ade80"
    : pct > 66
      ? "#4ade80"
      : pct > 33
        ? "#fbbf24"
        : "#f87171";

  const GoalLucideIcon = completed
    ? Trophy
    : GOAL_ICON_MAP[g.icon] || Target;

  return (
    <div
      style={{
        background: theme.bgCard,
        border: `1px solid ${completed ? "#4ade8033" : theme.border}`,
        borderRadius: 16,
        padding: "1.25rem 1.5rem",
        transition: "border-color 0.2s",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 14,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: completed ? "#4ade8018" : theme.accentGlow,
            border: `1px solid ${completed ? "#4ade8040" : theme.accent + "35"}`,
            color: completed ? "#4ade80" : theme.accent,
          }}
        >
          <GoalLucideIcon size={22} />
        </div>

        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: theme.text,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            {g.name}
            {completed && (
              <span
                style={{
                  fontSize: 11,
                  background: "#4ade8020",
                  color: "#4ade80",
                  border: "1px solid #4ade8040",
                  borderRadius: 20,
                  padding: "1px 8px",
                }}
              >
                Concluída
              </span>
            )}
          </div>

          <div
            style={{
              fontSize: 12,
              color: theme.textMuted,
              marginTop: 2,
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <span style={{ color: theme.accent, fontWeight: 600 }}>{fmt(saved)}</span>
            <span>de {fmt(target)}</span>
            {daysLeft !== null && (
              <span style={{ color: daysLeft < 30 ? theme.danger : theme.textMuted }}>
                {daysLeft > 0 ? `${daysLeft} dias restantes` : "Prazo encerrado"}
              </span>
            )}
          </div>
        </div>

        <div style={{ fontSize: 18, fontWeight: 800, color: barColor }}>
          {pct.toFixed(0)}%
        </div>
      </div>

      <div
        style={{
          height: 8,
          background: theme.input,
          borderRadius: 8,
          marginBottom: 14,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: barColor,
            borderRadius: 8,
            transition: "width 0.6s ease",
          }}
        />
      </div>

      {!completed && (
        <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 14 }}>
          Faltam <span style={{ color: theme.text, fontWeight: 600 }}>{fmt(missing)}</span> para atingir a meta
        </div>
      )}

      {!completed && (
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <input
            style={{ ...inp, flex: 1 }}
            type="number"
            step="0.01"
            placeholder="Adicionar valor..."
            value={deposit[g.id] || ""}
            onChange={(e) => setDeposit((d) => ({ ...d, [g.id]: e.target.value }))}
            onKeyDown={(e) => e.key === "Enter" && handleDeposit(g)}
            onFocus={(e) => (e.target.style.borderColor = theme.accent)}
            onBlur={(e) => (e.target.style.borderColor = theme.inputBorder)}
          />
          <button
            onClick={() => handleDeposit(g)}
            disabled={!deposit[g.id]}
            style={{
              background: deposit[g.id] ? "linear-gradient(135deg, #4ade80, #22d3ee)" : theme.input,
              border: "none",
              borderRadius: 10,
              padding: "0 1rem",
              color: deposit[g.id] ? "#080c14" : theme.textMuted,
              fontWeight: 700,
              fontSize: 13,
              cursor: deposit[g.id] ? "pointer" : "not-allowed",
              whiteSpace: "nowrap",
            }}
          >
            + Adicionar
          </button>
        </div>
      )}

      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={() => onEdit(g)}
          style={{
            flex: 1,
            background: theme.input,
            border: `1px solid ${theme.border}`,
            borderRadius: 8,
            padding: "0.45rem",
            color: theme.textMuted,
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Editar
        </button>

        <button
          onClick={() => onDelete(g.id)}
          style={{
            background: "rgba(248,113,113,0.08)",
            border: "1px solid rgba(248,113,113,0.2)",
            borderRadius: 8,
            padding: "0.45rem 0.875rem",
            color: theme.danger,
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Remover
        </button>
      </div>
    </div>
  );
}