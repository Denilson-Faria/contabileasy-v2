
import {
  Briefcase, Home, ShoppingCart, ShoppingBag, CreditCard,
  Smile, Car, Heart, BookOpen, Package,
} from "lucide-react";

const CATEGORY_ICONS = {
  profissional:  { Icon: Briefcase,    color: "#6ee7b7" },
  moradia:       { Icon: Home,         color: "#93c5fd" },
  alimentacao:   { Icon: ShoppingCart, color: "#fcd34d" },
  compras:       { Icon: ShoppingBag,  color: "#fda4af" },
  assinaturas:   { Icon: CreditCard,   color: "#34d399" },
  lazer:         { Icon: Smile,        color: "#f9a8d4" },
  transporte:    { Icon: Car,          color: "#c4b5fd" },
  saude:         { Icon: Heart,        color: "#f87171" },
  educacao:      { Icon: BookOpen,     color: "#fdba74" },
  outros:        { Icon: Package,      color: "#94a3b8" },
};

export default function CategoryIcon({ categoryId, color, emoji, size = 40, radius = 12 }) {
  const match     = CATEGORY_ICONS[categoryId];
  const iconColor = color || match?.color || "#94a3b8";
  const iconSize  = Math.round(size * 0.46);

  return (
    <div style={{
      width: size, height: size, flexShrink: 0,
      borderRadius: radius,
      background: iconColor + "18",
      border: `1px solid ${iconColor}35`,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      {match
        ? <match.Icon size={iconSize} color={iconColor} strokeWidth={1.75} />
        : emoji
          ? <span style={{ fontSize: iconSize, lineHeight: 1 }}>{emoji}</span>
          : <Package size={iconSize} color={iconColor} strokeWidth={1.75} />
      }
    </div>
  );
}