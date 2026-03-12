import { useState } from "react";
import { useApp } from "../context/AppContext";
import { useTheme } from "../context/ThemeContext";
import Icon from "../components/Icon";
import CategoryIcon from "../components/CategoryIcon";
import {
  Target,
  Gamepad2,
  Pill,
  PawPrint,
  Plane,
  Pizza,
  Music,
  Smartphone,
  Dumbbell,
  Lightbulb,
  Gift,
  Wrench,
  Home,
  Rocket,
  Leaf,
  Wallet,
  GraduationCap,
  ShoppingBag,
  Waves,
  Trophy,
} from "lucide-react";

const ICON_OPTIONS = [
  { id: "target", Icon: Target },
  { id: "gamepad2", Icon: Gamepad2 },
  { id: "pill", Icon: Pill },
  { id: "pawprint", Icon: PawPrint },
  { id: "plane", Icon: Plane },
  { id: "pizza", Icon: Pizza },
  { id: "music", Icon: Music },
  { id: "smartphone", Icon: Smartphone },
  { id: "dumbbell", Icon: Dumbbell },
  { id: "lightbulb", Icon: Lightbulb },
  { id: "gift", Icon: Gift },
  { id: "wrench", Icon: Wrench },
  { id: "home", Icon: Home },
  { id: "rocket", Icon: Rocket },
  { id: "leaf", Icon: Leaf },
  { id: "wallet", Icon: Wallet },
  { id: "graduationcap", Icon: GraduationCap },
  { id: "shoppingbag", Icon: ShoppingBag },
  { id: "waves", Icon: Waves },
  { id: "trophy", Icon: Trophy },
];

const ICON_MAP = Object.fromEntries(
  ICON_OPTIONS.map(({ id, Icon }) => [id, Icon])
);

const COLORS = [
  "#f87171",
  "#fb923c",
  "#fbbf24",
  "#a3e635",
  "#34d399",
  "#22d3ee",
  "#00ff4c",
  "#a78bfa",
  "#f472b6",
  "#94a3b8",
];

export default function Categorias() {
  const { allCategories, customCategories, addCustomCategory, deleteCustomCategory } = useApp();
  const { theme } = useTheme();

  const [form, setForm] = useState({
    label: "",
    icon: "target",
    color: "#60a5fa",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleAdd = async () => {
    if (!form.label.trim()) {
      setError("Dê um nome para a categoria");
      return;
    }

    if (allCategories.some((c) => c.label.toLowerCase() === form.label.toLowerCase())) {
      setError("Já existe uma categoria com este nome");
      return;
    }

    setError("");
    setSaving(true);

    await addCustomCategory({
      id: form.label
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "_"),
      label: form.label.trim(),
      icon: form.icon,
      color: form.color,
      custom: true,
    });

    setForm({
      label: "",
      icon: "target",
      color: "#60a5fa",
    });

    setSaving(false);
  };

  const SelectedPreviewIcon = ICON_MAP[form.icon] || Target;

  const card = {
    background: theme.bgCard,
    border: `1px solid ${theme.border}`,
    borderRadius: 16,
    padding: "1.5rem",
    marginBottom: 20,
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

  return (
    <div style={{ animation: "fadeIn 0.4s ease", maxWidth: 700 }}>
      <div style={card}>
        <div style={{ fontSize: 16, fontWeight: 700, color: theme.text, marginBottom: 4 }}>
          Nova Categoria
        </div>
        <div style={{ fontSize: 13, color: theme.textMuted, marginBottom: 20 }}>
          Crie categorias personalizadas para suas transações
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={lbl}>Nome *</label>
          <input
            style={inp}
            placeholder="Ex: Pets, Hobbies, Viagem..."
            value={form.label}
            onChange={(e) => {
              set("label", e.target.value);
              setError("");
            }}
            onFocus={(e) => (e.target.style.borderColor = theme.accent)}
            onBlur={(e) => (e.target.style.borderColor = theme.inputBorder)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          {error && (
            <div style={{ fontSize: 12, color: theme.danger, marginTop: 6 }}>
              {error}
            </div>
          )}
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={lbl}>Ícone</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {ICON_OPTIONS.map(({ id, Icon: LucideIcon }) => {
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
                    transition: "all 0.15s",
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

        <div style={{ marginBottom: 20 }}>
          <label style={lbl}>Cor</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => set("color", c)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: c,
                  border: `3px solid ${form.color === c ? theme.text : "transparent"}`,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  boxShadow: form.color === c ? `0 0 0 1px ${theme.border}` : "none",
                }}
              />
            ))}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "0.6rem 1rem",
              background: form.color + "15",
              border: `1px solid ${form.color}44`,
              borderRadius: 10,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 9,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: form.color + "18",
                border: `1px solid ${form.color}35`,
                color: form.color,
              }}
            >
              <SelectedPreviewIcon size={18} />
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: theme.text }}>
              {form.label || "Prévia"}
            </span>
          </div>

          <button
            onClick={handleAdd}
            disabled={saving}
            style={{
              background: saving ? theme.input : "linear-gradient(135deg, #4ade80, #22d3ee)",
              border: "none",
              borderRadius: 10,
              padding: "0.65rem 1.5rem",
              color: saving ? theme.textMuted : "#080c14",
              fontWeight: 700,
              fontSize: 14,
              cursor: saving ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Icon name="plus" size={15} />
            {saving ? "Salvando..." : "Criar Categoria"}
          </button>
        </div>
      </div>

      <div style={card}>
        <div style={{ fontSize: 14, fontWeight: 700, color: theme.text, marginBottom: 16 }}>
          Categorias Padrão{" "}
          <span style={{ fontSize: 12, color: theme.textMuted, fontWeight: 400 }}>
            (não editáveis)
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
            gap: 8,
          }}
        >
          {allCategories
            .filter((c) => !c.custom)
            .map((c) => (
              <div
                key={c.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "0.6rem 0.875rem",
                  background: c.color + "12",
                  border: `1px solid ${c.color}33`,
                  borderRadius: 10,
                }}
              >
                <CategoryIcon
                  categoryId={c.id}
                  color={c.color}
                  emoji={c.emoji}
                  size={28}
                  radius={8}
                />
                <span style={{ fontSize: 13, color: theme.text, fontWeight: 500 }}>
                  {c.label}
                </span>
              </div>
            ))}
        </div>
      </div>

      {customCategories.length > 0 && (
        <div style={card}>
          <div style={{ fontSize: 14, fontWeight: 700, color: theme.text, marginBottom: 16 }}>
            Suas Categorias{" "}
            <span style={{ fontSize: 12, color: theme.textMuted }}>
              ({customCategories.length})
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {customCategories.map((c) => {
              const CustomIcon = ICON_MAP[c.icon] || Target;

              return (
                <div
                  key={c.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "0.75rem 1rem",
                    background: c.color + "10",
                    border: `1px solid ${c.color}30`,
                    borderRadius: 12,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: c.color + "18",
                      border: `1px solid ${c.color}35`,
                      color: c.color,
                      flexShrink: 0,
                    }}
                  >
                    <CustomIcon size={20} />
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: theme.text }}>
                      {c.label}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                      <div
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 3,
                          background: c.color,
                        }}
                      />
                      <span style={{ fontSize: 11, color: theme.textMuted }}>
                        Personalizada
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteCustomCategory(c.id)}
                    style={{
                      background: "rgba(248,113,113,0.08)",
                      border: "1px solid rgba(248,113,113,0.2)",
                      borderRadius: 8,
                      padding: "0.4rem 0.6rem",
                      color: theme.danger,
                      cursor: "pointer",
                      display: "flex",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "rgba(248,113,113,0.18)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "rgba(248,113,113,0.08)")
                    }
                  >
                    <Icon name="trash" size={13} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}