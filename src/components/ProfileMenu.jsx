
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useApp } from "../context/AppContext";
import { db, auth } from "../services/firebase";
import { updateProfile } from "firebase/auth";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";


const AVATARS = [
  {
    id: "m1", label: "Homem 1",
    bg: "#1e3a5f",
    el: (s) => (
      <svg width={s} height={s} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="80" height="80" fill="#1e3a5f"/>
        {/* corpo */}
        <rect x="20" y="58" width="40" height="22" rx="6" fill="#2d5986"/>
        {/* pescoço */}
        <rect x="33" y="50" width="14" height="12" fill="#f5c5a3"/>
        {/* cabeça */}
        <ellipse cx="40" cy="36" rx="17" ry="18" fill="#f5c5a3"/>
        {/* cabelo curto */}
        <path d="M23 32 Q23 16 40 15 Q57 16 57 32 Q54 22 40 21 Q26 22 23 32Z" fill="#2c1810"/>
        {/* orelhas */}
        <ellipse cx="23" cy="37" rx="3" ry="4" fill="#f5c5a3"/>
        <ellipse cx="57" cy="37" rx="3" ry="4" fill="#f5c5a3"/>
        {/* olhos */}
        <ellipse cx="33" cy="36" rx="3" ry="3.5" fill="white"/>
        <ellipse cx="47" cy="36" rx="3" ry="3.5" fill="white"/>
        <circle cx="33" cy="37" r="2" fill="#3d2b1f"/>
        <circle cx="47" cy="37" r="2" fill="#3d2b1f"/>
        <circle cx="34" cy="36" r="0.8" fill="white"/>
        <circle cx="48" cy="36" r="0.8" fill="white"/>
        {/* sobrancelhas */}
        <path d="M29 31 Q33 29 37 31" stroke="#2c1810" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        <path d="M43 31 Q47 29 51 31" stroke="#2c1810" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        {/* nariz */}
        <path d="M39 40 Q40 44 41 40" stroke="#d4956a" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        {/* boca */}
        <path d="M34 47 Q40 51 46 47" stroke="#c47a5a" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        {/* gravata */}
        <path d="M37 58 L40 72 L43 58 L40 54Z" fill="#e74c3c"/>
      </svg>
    ),
  },
  {
    id: "m2", label: "Homem 2",
    bg: "#1a3d2b",
    el: (s) => (
      <svg width={s} height={s} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="80" height="80" fill="#1a3d2b"/>
        <rect x="18" y="58" width="44" height="22" rx="6" fill="#27593e"/>
        <rect x="33" y="50" width="14" height="12" fill="#d4956a"/>
        <ellipse cx="40" cy="36" rx="17" ry="18" fill="#d4956a"/>
        {/* cabelo black */}
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
        {/* barba */}
        <path d="M26 42 Q28 52 40 53 Q52 52 54 42 Q50 48 40 49 Q30 48 26 42Z" fill="#111" opacity="0.6"/>
        {/* camisa */}
        <path d="M25 60 L18 80 L62 80 L55 60 L48 64 L40 61 L32 64Z" fill="#2ecc71"/>
      </svg>
    ),
  },
  {
    id: "m3", label: "Homem 3",
    bg: "#3b1f5e",
    el: (s) => (
      <svg width={s} height={s} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="80" height="80" fill="#3b1f5e"/>
        <rect x="20" y="58" width="40" height="22" rx="6" fill="#562d8a"/>
        <rect x="33" y="50" width="14" height="12" fill="#f0c8a0"/>
        <ellipse cx="40" cy="36" rx="17" ry="18" fill="#f0c8a0"/>
        {/* cabelo loiro */}
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
        {/* óculos */}
        <rect x="27" y="32" width="12" height="9" rx="3" stroke="#444" strokeWidth="1.5" fill="none"/>
        <rect x="41" y="32" width="12" height="9" rx="3" stroke="#444" strokeWidth="1.5" fill="none"/>
        <line x1="39" y1="36" x2="41" y2="36" stroke="#444" strokeWidth="1.5"/>
        <path d="M27 36 L24 35" stroke="#444" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M53 36 L56 35" stroke="#444" strokeWidth="1.5" strokeLinecap="round"/>
        {/* hoodie */}
        <path d="M22 60 L17 80 L63 80 L58 60 L50 63 L40 60 L30 63Z" fill="#8e44ad"/>
      </svg>
    ),
  },
  {
    id: "f1", label: "Mulher 1",
    bg: "#5e1f4a",
    el: (s) => (
      <svg width={s} height={s} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="80" height="80" fill="#5e1f4a"/>
        <rect x="18" y="58" width="44" height="22" rx="6" fill="#8b2d6e"/>
        <rect x="33" y="50" width="14" height="12" fill="#fbbf80"/>
        <ellipse cx="40" cy="36" rx="17" ry="18" fill="#fbbf80"/>
        {/* cabelo longo ruivo */}
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
        {/* cílios */}
        <path d="M30 33 Q33 31 36 33" stroke="#c0392b" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
        <path d="M44 33 Q47 31 50 33" stroke="#c0392b" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
        <path d="M39 40 Q40 44 41 40" stroke="#e8956a" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        {/* boca batom */}
        <path d="M34 47 Q40 52 46 47" fill="#e74c3c"/>
        <path d="M34 47 Q40 44 46 47" fill="#c0392b"/>
        {/* brinco */}
        <circle cx="20" cy="42" r="2.5" fill="#f1c40f"/>
        <circle cx="60" cy="42" r="2.5" fill="#f1c40f"/>
        {/* blusa */}
        <path d="M22 60 L16 80 L64 80 L58 60 L50 65 L40 62 L30 65Z" fill="#e91e8c"/>
      </svg>
    ),
  },
  {
    id: "f2", label: "Mulher 2",
    bg: "#1f3d5e",
    el: (s) => (
      <svg width={s} height={s} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="80" height="80" fill="#1f3d5e"/>
        <rect x="18" y="58" width="44" height="22" rx="6" fill="#2d5986"/>
        <rect x="33" y="50" width="14" height="12" fill="#d4956a"/>
        <ellipse cx="40" cy="36" rx="17" ry="18" fill="#d4956a"/>
        {/* cabelo preto longo */}
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
        {/* blusa azul */}
        <path d="M22 60 L16 80 L64 80 L58 60 L50 65 L40 62 L30 65Z" fill="#2980b9"/>
      </svg>
    ),
  },
  {
    id: "f3", label: "Mulher 3",
    bg: "#2d4a1e",
    el: (s) => (
      <svg width={s} height={s} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="80" height="80" fill="#2d4a1e"/>
        <rect x="18" y="58" width="44" height="22" rx="6" fill="#3d6628"/>
        <rect x="33" y="50" width="14" height="12" fill="#f0c8a0"/>
        <ellipse cx="40" cy="36" rx="17" ry="18" fill="#f0c8a0"/>
        {/* cabelo cacheado castanho */}
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


export function Avatar({ user, size = 34, onClick }) {
  const initials = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  const selectedAvatar = AVATARS.find(a => a.id === user?.avatarId);

  return (
    <button
      onClick={onClick}
      title="Perfil e configurações"
      style={{
        width: size, height: size, borderRadius: size * 0.3,
        flexShrink: 0, padding: 0,
        border: "2px solid transparent",
        background: selectedAvatar ? "transparent" : "linear-gradient(135deg,#4ade80,#22d3ee)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.35, fontWeight: 800, color: "#080c14",
        cursor: "pointer", overflow: "hidden",
        transition: "box-shadow 0.2s, border-color 0.2s",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(74,222,128,0.35)";
        e.currentTarget.style.borderColor = "rgba(74,222,128,0.6)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.borderColor = "transparent";
      }}
    >
      {selectedAvatar
        ? <div style={{ width:"100%", height:"100%", display:"flex" }}>{selectedAvatar.el(size)}</div>
        : initials}
    </button>
  );
}


function SettingsModal({ user, setUser, onClose, onLogout }) {
  const { theme } = useTheme();
  const { showToast } = useApp();

  const [tab,        setTab]        = useState("perfil");
  const [saving,     setSaving]     = useState(false);
  const [resetItems, setResetItems] = useState({ transacoes: false, categorias: false, metas: false });
  const [confirming, setConfirming] = useState(false);
  const [resetting,  setResetting]  = useState(false);

  const noneSelected = !Object.values(resetItems).some(Boolean);
  const selectedAvatarId = user?.avatarId || null;

  const handleSelectAvatar = async (avatarId) => {
    setSaving(true);
    try {
      await updateProfile(auth.currentUser, { photoURL: `avatar:${avatarId}` });
      setUser?.(prev => ({ ...prev, avatarId, photo: `avatar:${avatarId}` }));
      showToast("Avatar atualizado!", "success");
    } catch {
      showToast("Erro ao salvar avatar.", "error");
    }
    setSaving(false);
  };

  const handleReset = async () => {
    if (noneSelected) return;
    setResetting(true);
    try {
      const uid = user.uid;
      const cols = [
        resetItems.transacoes && "transactions",
        resetItems.categorias && "categories",
        resetItems.metas      && "goals",
      ].filter(Boolean);
      for (const col of cols) {
        const snap = await getDocs(collection(db, "users", uid, col));
        await Promise.all(snap.docs.map(d => deleteDoc(doc(db, "users", uid, col, d.id))));
      }
      showToast("Dados resetados com sucesso.", "success");
      setConfirming(false);
      setResetItems({ transacoes: false, categorias: false, metas: false });
    } catch {
      showToast("Erro ao resetar dados.", "error");
    }
    setResetting(false);
  };

  const tabBtn = (active) => ({
    padding: "0.5rem 1rem", borderRadius: "8px 8px 0 0",
    border: "none", cursor: "pointer",
    fontSize: 13, fontWeight: active ? 700 : 500,
    background: active ? theme.bg : "transparent",
    color: active ? theme.accent : theme.textMuted,
    borderBottom: active ? `2px solid ${theme.accent}` : "2px solid transparent",
    transition: "all 0.15s", fontFamily: "inherit",
  });

  const checkRow = (checked) => ({
    display: "flex", alignItems: "center", gap: 10,
    padding: "0.75rem 1rem", borderRadius: 12, marginBottom: 8, cursor: "pointer",
    background: checked ? "rgba(248,113,113,0.08)" : theme.input,
    border: `1px solid ${checked ? "rgba(248,113,113,0.35)" : theme.border}`,
    transition: "all 0.15s",
  });

  const checkbox = (checked) => ({
    width: 18, height: 18, borderRadius: 5, flexShrink: 0,
    border: `1.5px solid ${checked ? "#f87171" : theme.border}`,
    background: checked ? "rgba(248,113,113,0.2)" : "transparent",
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "all 0.15s",
  });

  const lbl = { fontSize: 11, fontWeight: 700, color: theme.textSubtle, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 6, display: "block" };

  const initials = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  const currentAvatar = AVATARS.find(a => a.id === selectedAvatarId);

  return (
    <div
      style={{ position:"fixed", inset:0, zIndex:999, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(0,0,0,0.6)", backdropFilter:"blur(6px)", padding:"1rem" }}
      onClick={onClose}
    >
      <div
        style={{ width:"100%", maxWidth:440, background:theme.bgCard, border:`1px solid ${theme.border}`, borderRadius:20, boxShadow:"0 32px 80px rgba(0,0,0,0.5)", overflow:"hidden" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"1.25rem 1.5rem", borderBottom:`1px solid ${theme.border}` }}>
          <span style={{ fontSize:15, fontWeight:700, color:theme.text }}>Configurações</span>
          <button onClick={onClose} style={{ background:"none", border:"none", color:theme.textMuted, cursor:"pointer", fontSize:18, lineHeight:1, padding:4, borderRadius:6, fontFamily:"inherit" }}>✕</button>
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", gap:4, padding:"0.75rem 1.5rem 0", borderBottom:`1px solid ${theme.border}` }}>
          {[["perfil","Perfil"],["reset","Resetar dados"]].map(([id,label]) => (
            <button key={id} style={tabBtn(tab===id)} onClick={() => setTab(id)}>{label}</button>
          ))}
        </div>

        {/* Body */}
        <div style={{ padding:"1.5rem" }}>

          {/* ── Perfil ── */}
          {tab === "perfil" && (
            <div>
              {/* Avatar atual + info */}
              <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:20 }}>
                <div style={{ width:72, height:72, borderRadius:18, overflow:"hidden", background:"linear-gradient(135deg,#4ade80,#22d3ee)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, fontWeight:800, color:"#080c14", flexShrink:0 }}>
                  {currentAvatar
                    ? <div style={{ width:"100%", height:"100%" }}>{currentAvatar.el(72)}</div>
                    : initials}
                </div>
                <div>
                  <div style={{ fontSize:15, fontWeight:700, color:theme.text, marginBottom:2 }}>{user?.name}</div>
                  <div style={{ fontSize:12, color:theme.textSubtle }}>{user?.email || user?.phone}</div>
                </div>
              </div>

              {/* Seletor de avatares */}
              <div style={{ marginBottom:20 }}>
                <span style={lbl}>Escolha seu avatar</span>

                {/* Masculinos */}
                <div style={{ fontSize:11, color:theme.textSubtle, marginBottom:8 }}>Masculinos</div>
                <div style={{ display:"flex", gap:10, marginBottom:12 }}>
                  {AVATARS.filter(a => a.id.startsWith("m")).map(av => (
                    <button key={av.id} onClick={() => handleSelectAvatar(av.id)} disabled={saving}
                      style={{ width:52, height:52, borderRadius:14, padding:0, border:`2px solid ${selectedAvatarId===av.id ? theme.accent : theme.border}`, background:"transparent", cursor:"pointer", overflow:"hidden", transition:"all 0.15s", boxShadow:selectedAvatarId===av.id?`0 0 0 3px ${theme.accent}33`:"none" }}
                      title={av.label}>
                      {av.el(52)}
                    </button>
                  ))}
                </div>

                {/* Femininos */}
                <div style={{ fontSize:11, color:theme.textSubtle, marginBottom:8 }}>Femininos</div>
                <div style={{ display:"flex", gap:10 }}>
                  {AVATARS.filter(a => a.id.startsWith("f")).map(av => (
                    <button key={av.id} onClick={() => handleSelectAvatar(av.id)} disabled={saving}
                      style={{ width:52, height:52, borderRadius:14, padding:0, border:`2px solid ${selectedAvatarId===av.id ? theme.accent : theme.border}`, background:"transparent", cursor:"pointer", overflow:"hidden", transition:"all 0.15s", boxShadow:selectedAvatarId===av.id?`0 0 0 3px ${theme.accent}33`:"none" }}
                      title={av.label}>
                      {av.el(52)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Info read-only */}
              {[
                ["Nome",      user?.name],
                ["E-mail",    user?.email],
                ["Login via", user?.method==="google" ? "Google" : user?.method==="email" ? "E-mail" : "Celular"],
              ].filter(([,v]) => v).map(([label, value]) => (
                <div key={label} style={{ marginBottom:12 }}>
                  <span style={lbl}>{label}</span>
                  <div style={{ padding:"0.65rem 1rem", background:theme.input, border:`1px solid ${theme.border}`, borderRadius:10, fontSize:14, color:theme.textMuted }}>{value}</div>
                </div>
              ))}

              {/* Sair */}
              <button onClick={onLogout} style={{ width:"100%", marginTop:8, padding:"0.75rem", background:"rgba(248,113,113,0.08)", border:"1px solid rgba(248,113,113,0.25)", borderRadius:12, color:"#f87171", fontSize:14, fontWeight:600, cursor:"pointer", transition:"background 0.2s", fontFamily:"inherit" }}
                onMouseEnter={e => e.currentTarget.style.background="rgba(248,113,113,0.15)"}
                onMouseLeave={e => e.currentTarget.style.background="rgba(248,113,113,0.08)"}>
                Sair da conta
              </button>
            </div>
          )}

          {/* ── Resetar ── */}
          {tab === "reset" && (
            <div>
              <div style={{ fontSize:13, color:theme.textMuted, marginBottom:18, lineHeight:1.6 }}>
                Selecione o que deseja apagar permanentemente. Esta ação <strong style={{ color:theme.text }}>não pode ser desfeita</strong>.
              </div>

              {[
                ["transacoes","Transações","Todas as receitas e despesas"],
                ["categorias","Categorias personalizadas","Suas categorias criadas manualmente"],
                ["metas","Metas financeiras","Todos os objetivos cadastrados"],
              ].map(([key, title, sub]) => (
                <div key={key} style={checkRow(resetItems[key])} onClick={() => { setConfirming(false); setResetItems(p => ({ ...p, [key]: !p[key] })); }}>
                  <div style={checkbox(resetItems[key])}>
                    {resetItems[key] && (
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                        <polyline points="2 6 5 9 10 3" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, color:resetItems[key] ? "#f87171" : theme.text }}>{title}</div>
                    <div style={{ fontSize:11, color:theme.textSubtle }}>{sub}</div>
                  </div>
                </div>
              ))}

              {!confirming ? (
                <button disabled={noneSelected} onClick={() => setConfirming(true)} style={{ width:"100%", marginTop:8, padding:"0.75rem", background:noneSelected?theme.input:"rgba(248,113,113,0.1)", border:`1px solid ${noneSelected?theme.border:"rgba(248,113,113,0.3)"}`, borderRadius:12, color:noneSelected?theme.textMuted:"#f87171", fontSize:14, fontWeight:600, cursor:noneSelected?"not-allowed":"pointer", transition:"all 0.15s", fontFamily:"inherit" }}>
                  Apagar selecionados
                </button>
              ) : (
                <div style={{ marginTop:8, padding:"1rem", background:"rgba(248,113,113,0.08)", border:"1px solid rgba(248,113,113,0.25)", borderRadius:12 }}>
                  <div style={{ fontSize:13, color:"#f87171", fontWeight:600, marginBottom:12 }}>⚠ Tem certeza? Os dados serão apagados para sempre.</div>
                  <div style={{ display:"flex", gap:8 }}>
                    <button onClick={() => setConfirming(false)} style={{ flex:1, padding:"0.6rem", borderRadius:10, border:`1px solid ${theme.border}`, background:theme.input, color:theme.textMuted, fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>Cancelar</button>
                    <button onClick={handleReset} disabled={resetting} style={{ flex:1, padding:"0.6rem", borderRadius:10, border:"1px solid rgba(248,113,113,0.4)", background:"rgba(248,113,113,0.18)", color:"#f87171", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
                      {resetting ? "Apagando…" : "Sim, apagar"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProfileMenu({ user, setUser, onLogout }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Avatar user={user} size={34} onClick={() => setOpen(true)}/>
      {open && (
        <SettingsModal
          user={user}
          setUser={setUser}
          onClose={() => setOpen(false)}
          onLogout={() => { setOpen(false); onLogout?.(); }}
        />
      )}
    </>
  );
}