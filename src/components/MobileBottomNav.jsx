import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { useTheme } from "../context/ThemeContext";
import Icon from "./Icon";
import { Avatar } from "./ProfileMenu";
import { auth } from "../services/firebase";
import { updateProfile } from "firebase/auth";

// mesmos avatares do ProfileMenu
const AVATARS = [
  {
    id: "m1", label: "Homem 1", bg: "#1e3a5f",
    el: (s) => (
      <svg width={s} height={s} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="80" height="80" fill="#1e3a5f"/>
        <rect x="20" y="58" width="40" height="22" rx="6" fill="#2d5986"/>
        <rect x="33" y="50" width="14" height="12" fill="#f5c5a3"/>
        <ellipse cx="40" cy="36" rx="17" ry="18" fill="#f5c5a3"/>
        <path d="M23 32 Q23 16 40 15 Q57 16 57 32 Q54 22 40 21 Q26 22 23 32Z" fill="#2c1810"/>
        <ellipse cx="23" cy="37" rx="3" ry="4" fill="#f5c5a3"/>
        <ellipse cx="57" cy="37" rx="3" ry="4" fill="#f5c5a3"/>
        <ellipse cx="33" cy="36" rx="3" ry="3.5" fill="white"/>
        <ellipse cx="47" cy="36" rx="3" ry="3.5" fill="white"/>
        <circle cx="33" cy="37" r="2" fill="#3d2b1f"/>
        <circle cx="47" cy="37" r="2" fill="#3d2b1f"/>
        <circle cx="34" cy="36" r="0.8" fill="white"/>
        <circle cx="48" cy="36" r="0.8" fill="white"/>
        <path d="M29 31 Q33 29 37 31" stroke="#2c1810" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        <path d="M43 31 Q47 29 51 31" stroke="#2c1810" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        <path d="M39 40 Q40 44 41 40" stroke="#d4956a" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        <path d="M34 47 Q40 51 46 47" stroke="#c47a5a" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <path d="M37 58 L40 72 L43 58 L40 54Z" fill="#e74c3c"/>
      </svg>
    ),
  },
  {
    id: "m2", label: "Homem 2", bg: "#1a3d2b",
    el: (s) => (
      <svg width={s} height={s} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="80" height="80" fill="#1a3d2b"/>
        <rect x="18" y="58" width="44" height="22" rx="6" fill="#27593e"/>
        <rect x="33" y="50" width="14" height="12" fill="#d4956a"/>
        <ellipse cx="40" cy="36" rx="17" ry="18" fill="#d4956a"/>
        <path d="M23 30 Q24 14 40 13 Q56 14 57 30 Q55 18 40 17 Q25 18 23 30Z" fill="#0a0a0a"/>
        <ellipse cx="23" cy="37" rx="3" ry="4" fill="#d4956a"/>
        <ellipse cx="57" cy="37" rx="3" ry="4" fill="#d4956a"/>
        <ellipse cx="33" cy="36" rx="3" ry="3.5" fill="white"/>
        <ellipse cx="47" cy="36" rx="3" ry="3.5" fill="white"/>
        <circle cx="33" cy="37" r="2" fill="#1a0a00"/>
        <circle cx="47" cy="37" r="2" fill="#1a0a00"/>
        <circle cx="34" cy="36" r="0.8" fill="white"/>
        <circle cx="48" cy="36" r="0.8" fill="white"/>
        <path d="M29 31 Q33 29 37 31" stroke="#0a0a0a" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        <path d="M43 31 Q47 29 51 31" stroke="#0a0a0a" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        <path d="M39 40 Q40 44 41 40" stroke="#b5784a" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        <path d="M34 47 Q40 51 46 47" stroke="#a0623a" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <path d="M26 42 Q28 52 40 53 Q52 52 54 42 Q50 48 40 49 Q30 48 26 42Z" fill="#111" opacity="0.6"/>
        <path d="M25 60 L18 80 L62 80 L55 60 L48 64 L40 61 L32 64Z" fill="#2ecc71"/>
      </svg>
    ),
  },
  {
    id: "m3", label: "Homem 3", bg: "#3b1f5e",
    el: (s) => (
      <svg width={s} height={s} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="80" height="80" fill="#3b1f5e"/>
        <rect x="20" y="58" width="40" height="22" rx="6" fill="#562d8a"/>
        <rect x="33" y="50" width="14" height="12" fill="#f0c8a0"/>
        <ellipse cx="40" cy="36" rx="17" ry="18" fill="#f0c8a0"/>
        <path d="M23 33 Q22 15 40 14 Q58 15 57 33 Q57 20 50 17 Q44 24 40 22 Q36 24 30 17 Q23 20 23 33Z" fill="#d4a017"/>
        <ellipse cx="23" cy="37" rx="3" ry="4" fill="#f0c8a0"/>
        <ellipse cx="57" cy="37" rx="3" ry="4" fill="#f0c8a0"/>
        <ellipse cx="33" cy="36" rx="3" ry="3.5" fill="white"/>
        <ellipse cx="47" cy="36" rx="3" ry="3.5" fill="white"/>
        <circle cx="33" cy="37" r="2" fill="#1e6eb5"/>
        <circle cx="47" cy="37" r="2" fill="#1e6eb5"/>
        <circle cx="34" cy="36" r="0.8" fill="white"/>
        <circle cx="48" cy="36" r="0.8" fill="white"/>
        <path d="M29 31 Q33 29 37 31" stroke="#a07810" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        <path d="M43 31 Q47 29 51 31" stroke="#a07810" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        <path d="M39 40 Q40 44 41 40" stroke="#c9a070" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        <path d="M34 47 Q40 52 46 47" stroke="#b08060" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <rect x="27" y="32" width="12" height="9" rx="3" stroke="#444" strokeWidth="1.5" fill="none"/>
        <rect x="41" y="32" width="12" height="9" rx="3" stroke="#444" strokeWidth="1.5" fill="none"/>
        <line x1="39" y1="36" x2="41" y2="36" stroke="#444" strokeWidth="1.5"/>
        <path d="M22 60 L17 80 L63 80 L58 60 L50 63 L40 60 L30 63Z" fill="#8e44ad"/>
      </svg>
    ),
  },
  {
    id: "f1", label: "Mulher 1", bg: "#5e1f4a",
    el: (s) => (
      <svg width={s} height={s} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="80" height="80" fill="#5e1f4a"/>
        <rect x="18" y="58" width="44" height="22" rx="6" fill="#8b2d6e"/>
        <rect x="33" y="50" width="14" height="12" fill="#fbbf80"/>
        <ellipse cx="40" cy="36" rx="17" ry="18" fill="#fbbf80"/>
        <path d="M23 35 Q21 12 40 11 Q59 12 57 35 Q58 18 52 15 L40 19 L28 15 Q22 18 23 35Z" fill="#c0392b"/>
        <path d="M21 35 Q19 55 23 65 Q26 58 24 45Z" fill="#c0392b"/>
        <path d="M59 35 Q61 55 57 65 Q54 58 56 45Z" fill="#c0392b"/>
        <ellipse cx="23" cy="37" rx="3" ry="4" fill="#fbbf80"/>
        <ellipse cx="57" cy="37" rx="3" ry="4" fill="#fbbf80"/>
        <ellipse cx="33" cy="36" rx="3" ry="3.5" fill="white"/>
        <ellipse cx="47" cy="36" rx="3" ry="3.5" fill="white"/>
        <circle cx="33" cy="37" r="2" fill="#2d1b4e"/>
        <circle cx="47" cy="37" r="2" fill="#2d1b4e"/>
        <circle cx="34" cy="36" r="0.8" fill="white"/>
        <circle cx="48" cy="36" r="0.8" fill="white"/>
        <path d="M30 33 Q33 31 36 33" stroke="#c0392b" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
        <path d="M44 33 Q47 31 50 33" stroke="#c0392b" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
        <path d="M39 40 Q40 44 41 40" stroke="#e8956a" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        <path d="M34 47 Q40 52 46 47" fill="#e74c3c"/>
        <path d="M34 47 Q40 44 46 47" fill="#c0392b"/>
        <circle cx="20" cy="42" r="2.5" fill="#f1c40f"/>
        <circle cx="60" cy="42" r="2.5" fill="#f1c40f"/>
        <path d="M22 60 L16 80 L64 80 L58 60 L50 65 L40 62 L30 65Z" fill="#e91e8c"/>
      </svg>
    ),
  },
  {
    id: "f2", label: "Mulher 2", bg: "#1f3d5e",
    el: (s) => (
      <svg width={s} height={s} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="80" height="80" fill="#1f3d5e"/>
        <rect x="18" y="58" width="44" height="22" rx="6" fill="#2d5986"/>
        <rect x="33" y="50" width="14" height="12" fill="#d4956a"/>
        <ellipse cx="40" cy="36" rx="17" ry="18" fill="#d4956a"/>
        <path d="M23 34 Q22 12 40 11 Q58 12 57 34 Q58 17 50 14 L40 18 L30 14 Q22 17 23 34Z" fill="#0d0d0d"/>
        <path d="M21 36 Q18 58 22 68 Q25 60 23 46Z" fill="#0d0d0d"/>
        <path d="M59 36 Q62 58 58 68 Q55 60 57 46Z" fill="#0d0d0d"/>
        <ellipse cx="23" cy="37" rx="3" ry="4" fill="#d4956a"/>
        <ellipse cx="57" cy="37" rx="3" ry="4" fill="#d4956a"/>
        <ellipse cx="33" cy="36" rx="3" ry="3.5" fill="white"/>
        <ellipse cx="47" cy="36" rx="3" ry="3.5" fill="white"/>
        <circle cx="33" cy="37" r="2" fill="#1a0a00"/>
        <circle cx="47" cy="37" r="2" fill="#1a0a00"/>
        <circle cx="34" cy="36" r="0.8" fill="white"/>
        <circle cx="48" cy="36" r="0.8" fill="white"/>
        <path d="M30 32 Q33 30 36 32" stroke="#0d0d0d" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        <path d="M44 32 Q47 30 50 32" stroke="#0d0d0d" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        <path d="M39 40 Q40 44 41 40" stroke="#b5784a" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        <path d="M34 47 Q40 52 46 47" fill="#e74c3c"/>
        <path d="M34 47 Q40 44 46 47" fill="#c0392b"/>
        <circle cx="20" cy="42" r="2" fill="#3498db"/>
        <circle cx="60" cy="42" r="2" fill="#3498db"/>
        <path d="M22 60 L16 80 L64 80 L58 60 L50 65 L40 62 L30 65Z" fill="#2980b9"/>
      </svg>
    ),
  },
  {
    id: "f3", label: "Mulher 3", bg: "#2d4a1e",
    el: (s) => (
      <svg width={s} height={s} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="80" height="80" fill="#2d4a1e"/>
        <rect x="18" y="58" width="44" height="22" rx="6" fill="#3d6628"/>
        <rect x="33" y="50" width="14" height="12" fill="#f0c8a0"/>
        <ellipse cx="40" cy="36" rx="17" ry="18" fill="#f0c8a0"/>
        <path d="M23 38 Q22 14 40 13 Q58 14 57 38" fill="#6b3a2a"/>
        <circle cx="26" cy="24" r="7" fill="#6b3a2a"/>
        <circle cx="33" cy="18" r="7" fill="#6b3a2a"/>
        <circle cx="40" cy="15" r="7" fill="#6b3a2a"/>
        <circle cx="47" cy="18" r="7" fill="#6b3a2a"/>
        <circle cx="54" cy="24" r="7" fill="#6b3a2a"/>
        <circle cx="22" cy="33" r="5" fill="#6b3a2a"/>
        <circle cx="58" cy="33" r="5" fill="#6b3a2a"/>
        <ellipse cx="23" cy="38" rx="3" ry="4" fill="#f0c8a0"/>
        <ellipse cx="57" cy="38" rx="3" ry="4" fill="#f0c8a0"/>
        <ellipse cx="33" cy="36" rx="3" ry="3.5" fill="white"/>
        <ellipse cx="47" cy="36" rx="3" ry="3.5" fill="white"/>
        <circle cx="33" cy="37" r="2" fill="#2d5a1b"/>
        <circle cx="47" cy="37" r="2" fill="#2d5a1b"/>
        <circle cx="34" cy="36" r="0.8" fill="white"/>
        <circle cx="48" cy="36" r="0.8" fill="white"/>
        <path d="M30 32 Q33 30 36 32" stroke="#6b3a2a" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        <path d="M44 32 Q47 30 50 32" stroke="#6b3a2a" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        <path d="M39 40 Q40 44 41 40" stroke="#c9a070" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        <path d="M34 47 Q40 52 46 47" fill="#e8956a"/>
        <path d="M34 47 Q40 44 46 47" fill="#c07050"/>
        <circle cx="20" cy="42" r="2.5" fill="#27ae60"/>
        <circle cx="60" cy="42" r="2.5" fill="#27ae60"/>
        <path d="M22 60 L16 80 L64 80 L58 60 L50 65 L40 62 L30 65Z" fill="#27ae60"/>
      </svg>
    ),
  },
];

const PRIMARY_ITEMS = [
  { id: "dashboard",   label: "Início",  icon: "home"  },
  { id: "lancamentos", label: "Lançar",  icon: "plus"  },
  { id: "extrato",     label: "Extrato", icon: "list"  },
  { id: "relatorios",  label: "Análise", icon: "chart" },
];

const MORE_ITEMS = [
  { id: "importexport", label: "Imp/Exp",    icon: "repeat" },
  { id: "metas",        label: "Metas",      icon: "target" },
  { id: "categorias",   label: "Categorias", icon: "wallet" },
];

export default function MobileBottomNav({ onLogout, user, setUser }) {
  const { activeTab, switchTab } = useApp();
  const { theme, isDark, toggle } = useTheme();
  const [moreOpen, setMoreOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const isMoreActive = MORE_ITEMS.some(i => i.id === activeTab);

  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Captura o evento de instalação
    const handler = (e) => { e.preventDefault(); setInstallPrompt(e); };
    window.addEventListener("beforeinstallprompt", handler);
    // Verifica se já está instalado
    if (window.matchMedia("(display-mode: standalone)").matches) setIsInstalled(true);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") { setIsInstalled(true); setInstallPrompt(null); }
  };

  const handlePrimaryTab = (id) => {
    setMoreOpen(false);
    switchTab(id);
  };

  const handleSelectAvatar = async (avatarId) => {
    setSaving(true);
    try {
      await updateProfile(auth.currentUser, { photoURL: `avatar:${avatarId}` });
      setUser?.(prev => ({ ...prev, avatarId, photo: `avatar:${avatarId}` }));
    } catch {}
    setSaving(false);
  };

  return (
    <div className="mobile-nav-wrapper">
      <style>{`
        .mobile-nav-wrapper { display: none; }
        @media (max-width: 767px) { .mobile-nav-wrapper { display: contents; } }
      `}</style>

      {moreOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 149, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
          onClick={() => setMoreOpen(false)}/>
      )}

      {moreOpen && (
        <div style={{
          position: "fixed", bottom: 90, left: 16, right: 16, zIndex: 150,
          background: isDark ? "rgba(13,20,36,0.98)" : "rgba(255,255,255,0.98)",
          border: `1px solid rgba(255,255,255,0.08)`,
          borderRadius: 20, padding: "1.25rem 1rem 1rem",
          backdropFilter: "blur(20px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          animation: "slideUp 0.2s ease",
        }}>

          {/* Perfil */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "0.75rem", borderRadius: 14, background: "rgba(255,255,255,0.04)", border: `1px solid rgba(255,255,255,0.07)`, marginBottom: 14 }}>
            <Avatar user={user} size={40}/>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: theme.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user?.name || user?.email?.split("@")[0] || "Usuário"}
              </div>
              <div style={{ fontSize: 11, color: theme.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user?.email || ""}
              </div>
            </div>
          </div>

          {/* Avatares */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: theme.textMuted, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 8 }}>Escolher avatar</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {AVATARS.map(av => {
                const selected = user?.avatarId === av.id;
                return (
                  <button key={av.id} onClick={() => handleSelectAvatar(av.id)} disabled={saving}
                    style={{
                      width: 44, height: 44, borderRadius: 12, padding: 0,
                      border: `2px solid ${selected ? theme.accent : theme.border}`,
                      background: "transparent", cursor: "pointer", overflow: "hidden",
                      boxShadow: selected ? `0 0 0 2px ${theme.accent}44` : "none",
                      transition: "all 0.15s", opacity: saving ? 0.6 : 1,
                    }}
                    title={av.label}>
                    {av.el(44)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mais itens */}
          <div style={{ fontSize: 10, fontWeight: 700, color: theme.textMuted, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 10 }}>
            Mais opções
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 12 }}>
            {MORE_ITEMS.map(item => {
              const active = activeTab === item.id;
              return (
                <button key={item.id} onClick={() => { switchTab(item.id); setMoreOpen(false); }}
                  style={{
                    background: active ? theme.accent + "18" : theme.input,
                    border: `1px solid ${active ? theme.accent + "44" : theme.border}`,
                    borderRadius: 14, padding: "0.875rem 0.5rem",
                    color: active ? theme.accent : theme.textMuted,
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                    cursor: "pointer", fontFamily: "inherit",
                  }}>
                  <Icon name={item.icon} size={20}/>
                  <span style={{ fontSize: 11, fontWeight: 600 }}>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Instalar PWA */}
          {!isInstalled && installPrompt && (
            <button onClick={handleInstall} style={{
              width: "100%", marginBottom: 10, padding: "0.75rem", borderRadius: 12,
              background: `${theme.accent}12`, border: `1px solid ${theme.accent}33`,
              color: theme.accent, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit",
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v13M8 11l4 4 4-4"/><rect x="3" y="17" width="18" height="4" rx="2"/>
              </svg>
              Instalar app
            </button>
          )}

          {/* Tema + Sair */}
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={toggle} style={{
              flex: 1, padding: "0.75rem", borderRadius: 12,
              background: theme.input, border: `1px solid ${theme.border}`,
              color: theme.textMuted, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit",
            }}>
              <Icon name={isDark ? "sun" : "moon"} size={16}/>
              {isDark ? "Tema claro" : "Tema escuro"}
            </button>
            <button onClick={() => { setMoreOpen(false); onLogout?.(); }} style={{
              padding: "0.75rem 1rem", borderRadius: 12,
              background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)",
              color: "#f87171", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit",
            }}>
              <Icon name="logout" size={16}/>
              Sair
            </button>
          </div>
        </div>
      )}

      <nav style={{
        position: "fixed", bottom: "max(16px, calc(16px + env(safe-area-inset-bottom)))", left: 16, right: 16, zIndex: 150,
        background: isDark ? "rgba(15,20,35,0.97)" : "rgba(255,255,255,0.97)",
        borderRadius: 22, border: `1px solid rgba(255,255,255,0.1)`,
        backdropFilter: "blur(32px)", WebkitBackdropFilter: "blur(32px)",
        display: "flex", alignItems: "center", height: 64,
        boxShadow: "0 12px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}>
        {PRIMARY_ITEMS.map(item => {
          const active = activeTab === item.id;
          return (
            <button key={item.id} onClick={() => handlePrimaryTab(item.id)} style={{
              flex: 1, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 5,
              background: "none", border: "none",
              color: active ? theme.accent : theme.textMuted,
              cursor: "pointer", fontFamily: "inherit",
              transition: "color 0.2s", height: "100%",
            }}>
              <Icon name={item.icon} size={20}/>
              <span style={{ fontSize: 10, fontWeight: active ? 700 : 400, letterSpacing: ".02em" }}>{item.label}</span>
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: active ? theme.accent : "transparent", boxShadow: active ? `0 0 6px ${theme.accent}` : "none", transition: "all 0.2s" }}/>
            </button>
          );
        })}

        <button onClick={() => setMoreOpen(o => !o)} style={{
          flex: 1, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 5,
          background: "none", border: "none",
          color: isMoreActive || moreOpen ? theme.accent : theme.textMuted,
          cursor: "pointer", fontFamily: "inherit", transition: "color 0.2s", height: "100%",
        }}>
          <Icon name="menu" size={20}/>
          <span style={{ fontSize: 10, fontWeight: isMoreActive || moreOpen ? 700 : 400 }}>Mais</span>
          <div style={{ width: 4, height: 4, borderRadius: "50%", background: isMoreActive ? theme.accent : "transparent", boxShadow: isMoreActive ? `0 0 6px ${theme.accent}` : "none", transition: "all 0.2s" }}/>
        </button>
      </nav>
    </div>
  );
}