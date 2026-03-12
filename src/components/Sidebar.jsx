
import { useState } from "react";
import { useApp } from "../context/AppContext";
import { useTheme } from "../context/ThemeContext";
import { usePWA } from "../hooks/usePWA";
import Icon from "./Icon";
import ProfileMenu from "./ProfileMenu";
import { TABS } from "../data/constants";

export default function Sidebar({ user, setUser, onLogout }) {
  const { activeTab, sidebarOpen, switchTab } = useApp();
  const { isDark, toggle, theme } = useTheme();
  const { installPrompt, isInstalled, updateReady, install, applyUpdate } = usePWA();

  return (
    <aside
      className={`sidebar-el${sidebarOpen ? " open" : ""}`}
      style={{
        width: 240, minWidth: 240,
        background: theme.sidebar,
        borderRight: `1px solid ${theme.border}`,
        display: "flex", flexDirection: "column",
        padding: "2rem 0",
        position: "fixed", left: 0, top: 0, bottom: 0,
        zIndex: 100, overflowX: "hidden",
      }}
    >
      {/* Logo */}
      <div className="sidebar-logo" style={{ display:"flex", alignItems:"center", padding:"0 1.5rem 2rem", borderBottom:`1px solid ${theme.border}`, marginBottom:"1.5rem" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, minWidth:0 }}>
          <span style={{ flexShrink:0, display:"inline-block", width:10, height:10, borderRadius:"50%", background:"linear-gradient(135deg,#4ade80,#22d3ee)", boxShadow:"0 0 12px rgba(74,222,128,0.6)" }}/>
          <div className="sidebar-logo-text" style={{ minWidth:0 }}>
            <div style={{ fontSize:18, fontWeight:700, color:theme.text, letterSpacing:"-0.5px", whiteSpace:"nowrap" }}>ContabilEasy</div>
            <div style={{ fontSize:11, color:theme.textSubtle, whiteSpace:"nowrap" }}>Controle financeiro pessoal</div>
          </div>
        </div>
      </div>

      {/* Navegação */}
      <nav style={{ flex:1 }}>
        {TABS.map(t => (
          <button
            key={t.id}
            className="sidebar-nav-btn"
            onClick={() => switchTab(t.id)}
            title={t.label}
            style={{
              display:"flex", alignItems:"center", gap:12,
              padding:"0.75rem 1.5rem", margin:"2px 0.75rem",
              borderRadius:10, border:"none",
              background: activeTab===t.id ? theme.accentGlow : "transparent",
              color: activeTab===t.id ? theme.accent : theme.textMuted,
              fontSize:14, fontWeight:activeTab===t.id ? 600 : 400,
              cursor:"pointer", transition:"all 0.2s", textAlign:"left",
              width:"calc(100% - 1.5rem)",
              borderLeft: activeTab===t.id ? `2px solid ${theme.accent}` : "2px solid transparent",
              whiteSpace:"nowrap", overflow:"hidden",
            }}
            onMouseEnter={e=>{ if(activeTab!==t.id) e.currentTarget.style.color=theme.text; }}
            onMouseLeave={e=>{ if(activeTab!==t.id) e.currentTarget.style.color=theme.textMuted; }}
          >
            <span style={{ flexShrink:0 }}><Icon name={t.icon} size={16}/></span>
            <span className="sidebar-label">{t.label}</span>
          </button>
        ))}
      </nav>

      {/* Tema — só ícone sol/lua */}
      <div style={{ padding:"0 0.75rem", marginBottom:8 }}>
        <button
          onClick={toggle}
          title={isDark ? "Modo claro" : "Modo escuro"}
          style={{
            width:"100%", display:"flex", alignItems:"center", justifyContent:"center",
            padding:"0.65rem",
            background:theme.bgCard, border:`1px solid ${theme.border}`,
            borderRadius:10, cursor:"pointer", transition:"all 0.2s",
            fontSize:18,
          }}
          onMouseEnter={e=>{ e.currentTarget.style.borderColor=theme.accent; e.currentTarget.style.background=theme.accentGlow; }}
          onMouseLeave={e=>{ e.currentTarget.style.borderColor=theme.border; e.currentTarget.style.background=theme.bgCard; }}
        >
          <span className="sidebar-toggle-icon">{isDark ? "🌙" : "☀️"}</span>
          <span className="sidebar-label" style={{ fontSize:13, color:theme.textMuted, marginLeft:8 }}>
            {isDark ? "Modo escuro" : "Modo claro"}
          </span>
        </button>
      </div>

      {/* Usuário — avatar clicável abre ProfileMenu */}
      <div className="sidebar-user-card" style={{ margin:"0 0.75rem 0.75rem", padding:"0.875rem 1rem", background:theme.bgCard, border:`1px solid ${theme.border}`, borderRadius:12, display:"flex", alignItems:"center", gap:10, overflow:"hidden" }}>
        <ProfileMenu user={user} setUser={setUser} onLogout={onLogout} />
        <div className="sidebar-user-info" style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:13, fontWeight:600, color:theme.text, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
            {user?.name || "Usuário"}
          </div>
          <div style={{ fontSize:10, color:theme.textSubtle }}>
            via {user?.method==="google" ? "Google" : user?.method==="email" ? "E-mail" : "Celular"}
          </div>
        </div>
      </div>

      {/* Instalar PWA */}
      {!isInstalled && installPrompt && (
        <div style={{ padding: "0 0.75rem", marginBottom: 8 }}>
          <button
            onClick={install}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: 8,
              padding: "0.65rem 1rem", borderRadius: 10, border: `1px solid ${theme.accent}44`,
              background: theme.accentGlow, color: theme.accent,
              cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = theme.accent + "22"; }}
            onMouseLeave={e => { e.currentTarget.style.background = theme.accentGlow; }}
          >
            <span style={{ fontSize: 16 }}>📲</span>
            <span className="sidebar-label">Instalar app</span>
          </button>
        </div>
      )}

      {/* Banner de atualização */}
      {updateReady && (
        <div style={{ padding: "0 0.75rem", marginBottom: 8 }}>
          <button
            onClick={applyUpdate}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: 8,
              padding: "0.65rem 1rem", borderRadius: 10, border: "1px solid #fbbf2444",
              background: "#fbbf2412", color: "#fbbf24",
              cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit",
            }}
          >
            <span style={{ fontSize: 16 }}>🔄</span>
            <span className="sidebar-label">Atualizar app</span>
          </button>
        </div>
      )}

      {/* Rodapé */}
      <div className="sidebar-footer" style={{ padding:"1rem 1.5rem", borderTop:`1px solid ${theme.border}` }}>
        <div style={{ fontSize:11, color:theme.textSubtle, lineHeight:1.6, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span>Desenvolvido por Denilson Faria</span>
          <a href="https://www.linkedin.com/in/denilsonvbfaria/" target="_blank" rel="noopener noreferrer" title="LinkedIn"
            style={{ display:"flex", alignItems:"center", color:theme.textSubtle, transition:"color 0.2s" }}
            onMouseEnter={e=>e.currentTarget.style.color="#0a66c2"}
            onMouseLeave={e=>e.currentTarget.style.color=theme.textSubtle}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
        </div>
      </div>
    </aside>
  );
}