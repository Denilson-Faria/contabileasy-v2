import { useState, useEffect } from "react";
import { useAuth } from "./hooks/useAuth";
import { AppProvider, useApp } from "./context/AppContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import Sidebar      from "./components/Sidebar";
import MobileBottomNav from "./components/MobileBottomNav";
import Header       from "./components/Header";
import AlertsBanner from "./components/AlertsBanner";
import DeleteModal  from "./components/DeleteModal";
import EditModal    from "./components/EditModal";
import Toast        from "./components/Toast";
import Dashboard    from "./pages/Dashboard";
import Lancamentos  from "./pages/Lancamentos";
import Extrato      from "./pages/Extrato";
import Relatorios   from "./pages/Relatorios";
import Metas        from "./pages/Metas";
import Categorias   from "./pages/Categorias";
import ImportExport  from "./pages/ImportExport";
import Login        from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import globalStyles from "./styles/globalStyles";

function Spinner({ bg = "#080c14" }) {
  return (
    <div style={{ minHeight: "100vh", background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 32, height: 32, border: "2px solid rgba(74,222,128,0.2)", borderTopColor: "#4ade80", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function PWAInstallBanner() {
  const { theme, isDark } = useTheme();
  const [prompt, setPrompt] = useState(null);
  const [dismissed, setDismissed] = useState(() => localStorage.getItem("pwa_dismissed") === "1");
  const [installed, setInstalled] = useState(() => window.matchMedia("(display-mode: standalone)").matches);

  useEffect(() => {
    const handler = (e) => { e.preventDefault(); setPrompt(e); };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!prompt) return;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted") setInstalled(true);
    setPrompt(null);
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem("pwa_dismissed", "1");
  };

  if (installed || dismissed || !prompt) return null;

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "0.6rem 0.875rem", marginBottom: 14,
      borderRadius: 14,
      background: isDark ? "rgba(74,222,128,0.06)" : "rgba(74,222,128,0.08)",
      border: `1px solid ${theme.accent}28`,
      animation: "fadeIn 0.4s ease",
    }}>
      <span style={{ fontSize: 18, flexShrink: 0 }}>📲</span>
      <span style={{ flex: 1, fontSize: 12.5, color: theme.textMuted, lineHeight: 1.4 }}>
        Instale o app para acesso rápido, sem navegador
      </span>
      <button onClick={handleInstall} style={{
        padding: "0.35rem 0.875rem", borderRadius: 20, flexShrink: 0,
        background: theme.accent, border: "none",
        color: "#060d0a", fontSize: 12, fontWeight: 700,
        cursor: "pointer", fontFamily: "inherit",
        transition: "opacity 0.2s",
      }}>
        Instalar
      </button>
      <button onClick={handleDismiss} style={{
        background: "none", border: "none", color: theme.textMuted,
        cursor: "pointer", fontSize: 16, lineHeight: 1, padding: "0 2px", flexShrink: 0,
      }}>✕</button>
    </div>
  );
}

function AppShell({ user, setUser, onLogout }) {
  const { activeTab, sidebarOpen, setSidebarOpen, loadingData } = useApp();
  const { theme, isDark } = useTheme();

  if (loadingData) return <Spinner bg={theme.bg} />;

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: theme.bg, color: theme.text, minHeight: "100vh", display: "flex", overflow: "hidden", position: "relative" }}>
      <style>{globalStyles}</style>

      <button
        className="mobile-btn"
        style={{ display: "none", position: "fixed", top: 16, left: 16, zIndex: 150, background: isDark ? "rgba(13,20,36,0.95)" : "#fff", border: `1px solid ${theme.border}`, borderRadius: 10, padding: "0.6rem", color: theme.accent, cursor: "pointer", width: 38, height: 38 }}
        onClick={() => setSidebarOpen(o => !o)}
      >
        {sidebarOpen ? "✕" : "☰"}
      </button>

      <Sidebar user={user} setUser={setUser} onLogout={onLogout} />

      {sidebarOpen && (
        <div style={{ position: "fixed", inset: 0, background: theme.overlay, zIndex: 99 }} onClick={() => setSidebarOpen(false)} />
      )}

      <main
        className="main-el"
        style={{ flex: 1, marginLeft: 240, display: "flex", flexDirection: "column", minHeight: "100vh", overflowX: "hidden", overflowY: "auto", minWidth: 0, maxWidth: "100%" }}
      >
        <Header />
        <div
          className="content-el"
          style={{ flex: 1, maxWidth: 1200, width: "100%", margin: "0 auto", boxSizing: "border-box", minWidth: 0 }}
        >
          <AlertsBanner />
          <div className="pwa-banner-wrapper"><PWAInstallBanner /></div>
          {activeTab === "dashboard"   && <Dashboard />}
          {activeTab === "lancamentos" && <Lancamentos />}
          {activeTab === "extrato"     && <Extrato />}
          {activeTab === "relatorios"  && <Relatorios />}
          {activeTab === "metas"       && <Metas />}
          {activeTab === "categorias"  && <Categorias />}
          {activeTab === "importexport" && <ImportExport />}
        </div>
      </main>

      <DeleteModal />
      <EditModal />
      <Toast />
      <MobileBottomNav onLogout={onLogout} user={user} setUser={setUser} />
    </div>
  );
}

function AuthGate() {
  const { user: authUser, isLoading, signOut } = useAuth();
  const { theme } = useTheme();
  const [localUser, setLocalUser] = useState(null);

  useEffect(() => { if (authUser) setLocalUser(authUser); }, [authUser]);

  // Detecta link de redefinição de senha na URL
  const params  = new URLSearchParams(window.location.search);
  const mode    = params.get("mode");
  const oobCode = params.get("oobCode");
  if (mode === "resetPassword" && oobCode) {
    return (
      <ResetPassword
        oobCode={oobCode}
        onDone={() => {
          // Limpa os params da URL e volta pro login
          window.history.replaceState({}, "", "/");
          window.location.reload();
        }}
      />
    );
  }

  if (isLoading) return <Spinner bg={theme.bg} />;
  if (!authUser) return <Login onLogin={() => {}} />;

  const user = localUser || authUser;
  return (
    <AppProvider user={user}>
      <AppShell user={user} setUser={setLocalUser} onLogout={signOut} />
    </AppProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthGate />
    </ThemeProvider>
  );
}