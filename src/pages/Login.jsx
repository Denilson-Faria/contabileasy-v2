
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);
const EyeIcon = ({ off }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {off ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
        : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>}
  </svg>
);
const BackIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);

const Background = () => (
  <>
    <svg style={{ position:"absolute",inset:0,width:"100%",height:"100%",opacity:0.022 }} xmlns="http://www.w3.org/2000/svg">
      <defs><pattern id="g" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M 48 0 L 0 0 0 48" fill="none" stroke="#4ade80" strokeWidth="0.5"/></pattern></defs>
      <rect width="100%" height="100%" fill="url(#g)"/>
    </svg>
    <div style={{ position:"absolute",top:"-10%",left:"-5%",width:600,height:600,borderRadius:"50%",background:"radial-gradient(circle,rgba(74,222,128,0.08) 0%,transparent 65%)",pointerEvents:"none" }}/>
    <div style={{ position:"absolute",bottom:"-15%",right:"-5%",width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(34,211,238,0.06) 0%,transparent 65%)",pointerEvents:"none" }}/>
    {[...Array(14)].map((_,i) => (
      <div key={i} style={{
        position:"absolute", borderRadius:"50%",
        width:(i%3===0?3:i%3===1?2:1.5), height:(i%3===0?3:i%3===1?2:1.5),
        background:["#4ade80","#22d3ee","#a78bfa","#f472b6"][i%4],
        left:`${(i*17+11)%97}%`, top:`${(i*23+7)%93}%`,
        opacity:0.1+(i%5)*0.03,
        animation:`float ${6+i%5}s ease-in-out ${i*0.4}s infinite`,
      }}/>
    ))}
  </>
);

const TERMS_CONTENT = {
  termos: {
    title: "Termos de Uso",
    content: `
**1. Aceitação dos Termos**
Ao acessar ou utilizar o ContabilEasy, você concorda com estes Termos de Uso. Se não concordar com qualquer parte, não utilize o aplicativo.

**2. Descrição do Serviço**
O ContabilEasy é um aplicativo de gestão financeira pessoal que permite registrar receitas, despesas, metas financeiras e visualizar relatórios do seu orçamento pessoal.

**3. Uso Permitido**
Você pode usar o ContabilEasy para registrar e organizar suas transações financeiras pessoais, criar e acompanhar metas de economia, exportar seus dados para uso próprio e importar extratos de outros aplicativos.

**4. Uso Proibido**
É proibido utilizar o ContabilEasy para qualquer finalidade ilegal ou não autorizada, tentar acessar dados de outros usuários, realizar engenharia reversa ou copiar o aplicativo, ou inserir dados falsos ou enganosos.

**5. Conta do Usuário**
Você é responsável por manter a confidencialidade da sua conta e senha. Notifique-nos imediatamente sobre qualquer uso não autorizado da sua conta.

**6. Dados Financeiros**
Os dados financeiros inseridos no ContabilEasy são de sua exclusiva responsabilidade. O ContabilEasy não oferece consultoria financeira, contábil ou de investimentos.

**7. Disponibilidade do Serviço**
Não garantimos disponibilidade ininterrupta do serviço. Podemos suspender ou encerrar o acesso por manutenção, segurança ou outros motivos, com ou sem aviso prévio.

**8. Limitação de Responsabilidade**
O ContabilEasy não se responsabiliza por perdas financeiras decorrentes do uso ou incapacidade de uso do aplicativo, nem pela precisão das análises geradas.

**9. Alterações nos Termos**
Podemos atualizar estes termos a qualquer momento. O uso continuado do aplicativo após alterações constitui aceitação dos novos termos.
    `
  },
  privacidade: {
    title: "Política de Privacidade",
    content: `
**1. Informações que Coletamos**
Dados de conta: nome, e-mail e foto de perfil (via login Google ou e-mail). Dados financeiros: transações, categorias, metas e valores que você registra. Dados importados: extratos e planilhas que você optar por importar. Dados técnicos: tipo de navegador e sistema operacional.

**2. Como Usamos suas Informações**
Utilizamos seus dados para fornecer e melhorar o serviço, autenticar seu acesso, sincronizar dados entre dispositivos e enviar notificações relacionadas ao serviço. Não vendemos, alugamos ou compartilhamos seus dados financeiros com terceiros para fins publicitários.

**3. Armazenamento e Segurança**
Seus dados são armazenados com segurança no Firebase (Google Cloud), com criptografia em trânsito (TLS) e em repouso. Cada usuário acessa exclusivamente seus próprios dados.

**4. Compartilhamento de Dados**
Seus dados podem ser compartilhados apenas com provedores de infraestrutura necessários para o funcionamento do app, quando exigido por lei ou ordem judicial, ou com seu consentimento explícito.

**5. Seus Direitos (LGPD)**
De acordo com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você tem direito a acessar, corrigir, excluir e exportar seus dados, além de revogar o consentimento a qualquer momento.

**6. Retenção de Dados**
Mantemos seus dados enquanto sua conta estiver ativa. Após a exclusão da conta, os dados são removidos em até 30 dias, exceto quando houver obrigação legal de retenção.

**7. Cookies**
Utilizamos cookies essenciais apenas para autenticação e funcionamento do aplicativo. Não utilizamos cookies de rastreamento ou publicidade.

**8. Menores de Idade**
O ContabilEasy não é destinado a menores de 18 anos. Não coletamos intencionalmente dados de menores.

**9. Alterações nesta Política**
Notificaremos sobre alterações significativas por e-mail ou notificação no aplicativo com antecedência mínima de 15 dias.
    `
  }
};

function TermsModal({ type, onClose }) {
  const { title, content } = TERMS_CONTENT[type];

  const renderContent = (text) =>
    text.trim().split("\n\n").map((block, i) => {
      if (block.startsWith("**") && block.includes("**\n") === false) {
        const parts = block.split(/\*\*(.*?)\*\*/g);
        return (
          <p key={i} style={{ marginBottom: 14, fontSize: 13, color: "#94a3b8", lineHeight: 1.7 }}>
            {parts.map((p, j) => j % 2 === 1
              ? <strong key={j} style={{ color: "#f1f5f9", fontWeight: 700 }}>{p}</strong>
              : p
            )}
          </p>
        );
      }
      return <p key={i} style={{ marginBottom: 14, fontSize: 13, color: "#94a3b8", lineHeight: 1.7 }}>{block}</p>;
    });

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)",
      padding: "1rem",
      animation: "fadeIn 0.2s ease",
    }} onClick={onClose}>
      <div style={{
        width: "100%", maxWidth: 520, maxHeight: "80vh",
        background: "linear-gradient(155deg,rgba(15,23,42,0.98) 0%,rgba(8,12,22,0.98) 100%)",
        border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24,
        display: "flex", flexDirection: "column",
        boxShadow: "0 40px 100px rgba(0,0,0,0.8)",
        animation: "slideUp 0.25s ease",
      }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "1.25rem 1.5rem",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#f1f5f9", fontFamily: "'Sora',sans-serif" }}>
            {title}
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: 8,
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
            color: "#64748b", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, fontFamily: "inherit",
          }}>✕</button>
        </div>
        {/* Body */}
        <div style={{ overflowY: "auto", padding: "1.5rem", flex: 1 }}>
          {renderContent(content)}
        </div>
        {/* Footer */}
        <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <button onClick={onClose} style={{
            width: "100%", padding: "0.75rem",
            background: "linear-gradient(135deg,#4ade80,#22d3ee)",
            border: "none", borderRadius: 12,
            color: "#060d0a", fontWeight: 700, fontSize: 14,
            cursor: "pointer", fontFamily: "'Sora',sans-serif",
          }}>Entendi</button>
        </div>
      </div>
    </div>
  );
}

function TermsCheckbox({ accepted, onChange }) {
  const [modal, setModal] = useState(null);

  return (
    <>
      {modal && <TermsModal type={modal} onClose={() => setModal(null)} />}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 20 }}>
        <button
          onClick={() => onChange(!accepted)}
          style={{
            width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 1,
            border: `1.5px solid ${accepted ? "#4ade80" : "rgba(255,255,255,0.15)"}`,
            background: accepted ? "rgba(74,222,128,0.15)" : "rgba(255,255,255,0.04)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", transition: "all 0.2s",
            boxShadow: accepted ? "0 0 0 3px rgba(74,222,128,0.1)" : "none",
          }}
        >
          {accepted && (
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <polyline points="2 6 5 9 10 3" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
        <span style={{ fontSize: 12, color: "#4a5568", lineHeight: 1.6 }}>
          Li e concordo com os{" "}
          <button onClick={() => setModal("termos")} style={{
            background: "none", border: "none", color: "#4ade80",
            fontSize: 12, fontWeight: 600, cursor: "pointer",
            fontFamily: "inherit", padding: 0, textDecoration: "underline", textDecorationStyle: "dotted",
          }}>Termos de Uso</button>
          {" "}e a{" "}
          <button onClick={() => setModal("privacidade")} style={{
            background: "none", border: "none", color: "#4ade80",
            fontSize: 12, fontWeight: 600, cursor: "pointer",
            fontFamily: "inherit", padding: 0, textDecoration: "underline", textDecorationStyle: "dotted",
          }}>Política de Privacidade</button>
        </span>
      </div>
    </>
  );
}

export default function LoginScreen({ onLogin }) {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, sendMagicLink, resetPassword, loading, error } = useAuth();

  const [step,          setStep]          = useState("email");
  const [email,         setEmail]         = useState("");
  const [password,      setPassword]      = useState("");
  const [name,          setName]          = useState("");
  const [signUpPhone,   setSignUpPhone]   = useState("");
  const [showPass,      setShowPass]      = useState(false);
  const [localErr,      setLocalErr]      = useState("");
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const err = localErr || error;
  const go  = (s) => { setStep(s); setLocalErr(""); };

  const formatPhone = (v) => {
    const d = v.replace(/\D/g,"").slice(0,11);
    if (d.length<=2) return d;
    if (d.length<=7) return `(${d.slice(0,2)}) ${d.slice(2)}`;
    return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
  };

  const handleEmailContinue = async () => {
    if (!email || !email.includes("@")) { setLocalErr("Informe um e-mail válido"); return; }
    if (!termsAccepted) { setLocalErr("Aceite os Termos de Uso para continuar"); return; }
    setCheckingEmail(true); setLocalErr("");
    try {
      const { signInWithEmailAndPassword } = await import("firebase/auth");
      const { auth } = await import("../services/firebase");

      await signInWithEmailAndPassword(auth, email, "\x00__probe__\x00");
    
      go("login");
    } catch (err) {
      const code = err.code;
      if (code === "auth/user-not-found") {
        go("signup");
      } else {
        go("login");
      }
    } finally {
      setCheckingEmail(false);
    }
  };

  const handleGoogle = async () => {
    if (!termsAccepted) { setLocalErr("Aceite os Termos de Uso para continuar"); return; }
    const user = await signInWithGoogle();
    if (user) { go("success"); setTimeout(() => onLogin?.(user), 1400); }
  };

  const handleLogin = async () => {
    if (!password) { setLocalErr("Informe sua senha"); return; }
    const user = await signInWithEmail(email, password);
    if (user) { go("success"); setTimeout(() => onLogin?.(user), 1400); }
  };

  const handleSignup = async () => {
    if (!name)                                     { setLocalErr("Informe seu nome"); return; }
    if (password.length < 6)                       { setLocalErr("Senha precisa ter ao menos 6 caracteres"); return; }
    if (signUpPhone.replace(/\D/g,"").length < 10) { setLocalErr("Informe um celular válido"); return; }
    const user = await signUpWithEmail(email, password, name, signUpPhone);
    if (user) { go("success"); setTimeout(() => onLogin?.(user), 1400); }
  };

  const handleForgot = async () => {
    if (!email || !email.includes("@")) { setLocalErr("Informe um e-mail válido"); return; }
    const ok = await resetPassword(email);
    if (ok !== null) go("forgot-sent");
  };

  const inp = {
    width:"100%", background:"rgba(255,255,255,0.04)", border:"1.5px solid rgba(255,255,255,0.08)",
    borderRadius:14, padding:"0.9rem 1.125rem", color:"#f1f5f9", fontSize:15,
    outline:"none", boxSizing:"border-box", transition:"all 0.2s", fontFamily:"'Sora',sans-serif",
  };
  const focusInp = e => Object.assign(e.target.style, { borderColor:"#4ade80", boxShadow:"0 0 0 3px rgba(74,222,128,0.1)", background:"rgba(74,222,128,0.03)" });
  const blurInp  = e => Object.assign(e.target.style, { borderColor:"rgba(255,255,255,0.08)", boxShadow:"none", background:"rgba(255,255,255,0.04)" });

  const btnPrimary = {
    width:"100%", padding:"0.9rem", background:"linear-gradient(135deg,#4ade80,#22d3ee)",
    border:"none", borderRadius:14, color:"#060d0a", fontSize:15, fontWeight:700,
    cursor:"pointer", fontFamily:"'Sora',sans-serif", display:"flex", alignItems:"center",
    justifyContent:"center", gap:8, boxShadow:"0 4px 24px rgba(74,222,128,0.2)",
    transition:"opacity 0.2s",
  };
  const btnAlt = {
    width:"100%", padding:"0.75rem 1rem", background:"transparent",
    border:"1px solid rgba(255,255,255,0.07)", borderRadius:12, color:"#64748b",
    fontSize:13, fontWeight:500, cursor:"pointer", fontFamily:"'Sora',sans-serif",
    display:"flex", alignItems:"center", gap:10, transition:"all 0.2s",
  };
  const lbl = { display:"block", fontSize:11, fontWeight:600, color:"#4a5568", marginBottom:7, textTransform:"uppercase", letterSpacing:".08em" };
  const errBox = err ? (
    <div style={{ fontSize:12.5, color:"#f87171", background:"rgba(248,113,113,0.08)", border:"1px solid rgba(248,113,113,0.18)", borderRadius:10, padding:"0.65rem 1rem", marginBottom:14, display:"flex", alignItems:"center", gap:8 }}>
      ⚠ {err}
    </div>
  ) : null;
  const spinner = <div style={{ width:16, height:16, border:"2.5px solid rgba(6,13,10,0.25)", borderTopColor:"#060d0a", borderRadius:"50%", animation:"spin 0.7s linear infinite" }}/>;
  const spinnerGreen = <div style={{ width:20, height:20, border:"2.5px solid rgba(74,222,128,0.2)", borderTopColor:"#4ade80", borderRadius:"50%", animation:"spin 0.7s linear infinite" }}/>;
  const backBtn = (onClick) => (
    <button onClick={onClick} style={{ display:"flex", alignItems:"center", gap:6, background:"none", border:"none", color:"#4a5568", fontSize:12, cursor:"pointer", marginBottom:"1.75rem", fontFamily:"'Sora',sans-serif", padding:0, transition:"color 0.2s", fontWeight:500 }}
      onMouseEnter={e=>e.currentTarget.style.color="#94a3b8"} onMouseLeave={e=>e.currentTarget.style.color="#4a5568"}>
      <BackIcon/> Voltar
    </button>
  );

  const renderEmail = () => (
    <div style={{ animation:"slideUp 0.35s ease" }}>
      <div style={{ fontSize:30, fontWeight:800, color:"#f8fafc", letterSpacing:"-1px", lineHeight:1.1, marginBottom:10, fontFamily:"'Sora',sans-serif" }}>
        Bem-vindo ao<br/><span style={{ color:"#4ade80" }}>ContabilEasy</span>
      </div>
      <div style={{ fontSize:14, color:"#94a3b8", marginBottom:10, lineHeight:1.6, fontWeight:500 }}>
        Organize suas finanças com mais clareza.
      </div>
      <div style={{ fontSize:13.5, color:"#64748b", marginBottom:28, lineHeight:1.6 }}>
        Digite seu e-mail para entrar ou criar sua conta.
      </div>

      <div style={{ marginBottom:12 }}>
        <input style={inp} type="email" placeholder="seuemail@exemplo.com"
          value={email} autoFocus
          onChange={e => { setLocalErr(""); setEmail(e.target.value); }}
          onFocus={focusInp} onBlur={blurInp}
          onKeyDown={e => e.key === "Enter" && handleEmailContinue()}/>
      </div>

      <TermsCheckbox accepted={termsAccepted} onChange={setTermsAccepted} />

      {errBox}

      <button style={{ ...btnPrimary, opacity:(loading||checkingEmail||!termsAccepted)?0.5:1, marginBottom:24 }}
        onClick={handleEmailContinue} disabled={loading||checkingEmail||!termsAccepted}
        onMouseEnter={e=>!(loading||checkingEmail||!termsAccepted)&&(e.currentTarget.style.opacity="0.85")}
        onMouseLeave={e=>e.currentTarget.style.opacity=(loading||checkingEmail||!termsAccepted)?"0.5":"1"}>
        {(loading||checkingEmail) ? <>{spinnerGreen}Verificando...</> : "Continuar"}
      </button>

      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
        <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.06)" }}/>
        <span style={{ fontSize:11, color:"#2d3748", fontWeight:500, letterSpacing:".05em" }}>ou entre de outra forma</span>
        <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.06)" }}/>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        <button style={{ ...btnAlt, opacity:!termsAccepted?0.4:1 }} onClick={handleGoogle} disabled={loading||!termsAccepted}
          onMouseEnter={e=>{ if(termsAccepted){e.currentTarget.style.borderColor="rgba(255,255,255,0.15)";e.currentTarget.style.color="#e2e8f0";} }}
          onMouseLeave={e=>{ e.currentTarget.style.borderColor="rgba(255,255,255,0.07)";e.currentTarget.style.color="#64748b"; }}>
          <GoogleIcon/> Google
        </button>
        <button style={{ ...btnAlt, opacity:!termsAccepted?0.4:1 }} onClick={() => termsAccepted && go("magic")} disabled={loading||!termsAccepted}
          onMouseEnter={e=>{ if(termsAccepted){e.currentTarget.style.borderColor="rgba(167,139,250,0.25)";e.currentTarget.style.color="#c4b5fd";} }}
          onMouseLeave={e=>{ e.currentTarget.style.borderColor="rgba(255,255,255,0.07)";e.currentTarget.style.color="#64748b"; }}>
          ✨ Entrar com link no e-mail
        </button>
      </div>
    </div>
  );

  const renderLogin = () => (
    <div style={{ animation:"slideUp 0.3s ease" }}>
      {backBtn(() => go("email"))}
      <div style={{ fontSize:24, fontWeight:800, color:"#f8fafc", letterSpacing:"-0.5px", marginBottom:6, fontFamily:"'Sora',sans-serif" }}>Que bom ver você novamente</div>
      <div style={{ fontSize:13.5, color:"#4a5568", marginBottom:24, lineHeight:1.6 }}>
        Entre com sua senha para continuar. <span style={{ color:"#94a3b8", fontWeight:600 }}>{email}</span>
      </div>
      <div style={{ marginBottom:6 }}>
        <label style={lbl}>Senha</label>
        <div style={{ position:"relative" }}>
          <input style={{ ...inp, paddingRight:46 }} type={showPass?"text":"password"}
            placeholder="Digite sua senha" value={password} autoFocus
            onChange={e=>{ setLocalErr(""); setPassword(e.target.value); }}
            onFocus={focusInp} onBlur={blurInp}
            onKeyDown={e=>e.key==="Enter"&&handleLogin()}/>
          <button onClick={()=>setShowPass(v=>!v)} tabIndex={-1}
            style={{ position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#4a5568",cursor:"pointer",padding:4,display:"flex" }}>
            <EyeIcon off={showPass}/>
          </button>
        </div>
      </div>
      {errBox}
      <button style={{ ...btnPrimary, opacity:loading?0.7:1, marginBottom:12 }} onClick={handleLogin} disabled={loading}
        onMouseEnter={e=>!loading&&(e.currentTarget.style.opacity="0.85")}
        onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
        {loading ? <>{spinner}Entrando...</> : "Entrar →"}
      </button>
      <div style={{ textAlign:"center" }}>
        <button style={{ background:"none", border:"none", color:"#4a5568", fontSize:12.5, cursor:"pointer", fontFamily:"'Sora',sans-serif", fontWeight:500, transition:"color 0.2s" }}
          onMouseEnter={e=>e.currentTarget.style.color="#4ade80"} onMouseLeave={e=>e.currentTarget.style.color="#4a5568"}
          onClick={()=>go("forgot")}>Esqueci minha senha</button>
      </div>
    </div>
  );

  const renderSignup = () => (
    <div style={{ animation:"slideUp 0.3s ease" }}>
      {backBtn(() => go("email"))}
      <div style={{ fontSize:24, fontWeight:800, color:"#f8fafc", letterSpacing:"-0.5px", marginBottom:6, fontFamily:"'Sora',sans-serif" }}>Vamos criar sua conta</div>
      <div style={{ fontSize:13.5, color:"#4a5568", marginBottom:22, lineHeight:1.6 }}>
        Só precisamos de algumas informações rápidas. <span style={{ color:"#94a3b8", fontWeight:600 }}>{email}</span>
      </div>
      <div style={{ marginBottom:12 }}>
        <label style={lbl}>Nome completo</label>
        <input style={inp} placeholder="Como devemos te chamar?" value={name} autoFocus
          onChange={e=>setName(e.target.value)} onFocus={focusInp} onBlur={blurInp}/>
      </div>
      <div style={{ marginBottom:12 }}>
        <label style={lbl}>Senha <span style={{ fontWeight:400, textTransform:"none", fontSize:10, letterSpacing:0 }}>— mínimo 6 caracteres</span></label>
        <div style={{ position:"relative" }}>
          <input style={{ ...inp, paddingRight:46 }} type={showPass?"text":"password"}
            placeholder="Crie uma senha" value={password}
            onChange={e=>{ setLocalErr(""); setPassword(e.target.value); }}
            onFocus={focusInp} onBlur={blurInp}
            onKeyDown={e=>e.key==="Enter"&&handleSignup()}/>
          <button onClick={()=>setShowPass(v=>!v)} tabIndex={-1}
            style={{ position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#4a5568",cursor:"pointer",padding:4,display:"flex" }}>
            <EyeIcon off={showPass}/>
          </button>
        </div>
      </div>
      <div style={{ marginBottom:18 }}>
        <label style={lbl}>Celular <span style={{ fontWeight:400, textTransform:"none", fontSize:10, letterSpacing:0 }}>— para recuperar sua conta</span></label>
        <input style={inp} placeholder="(11) 99999-9999" value={signUpPhone} inputMode="tel"
          onChange={e=>{ setLocalErr(""); setSignUpPhone(formatPhone(e.target.value)); }}
          onFocus={focusInp} onBlur={blurInp}/>
      </div>
      {errBox}
      <button style={{ ...btnPrimary, opacity:loading?0.7:1 }} onClick={handleSignup} disabled={loading}
        onMouseEnter={e=>!loading&&(e.currentTarget.style.opacity="0.85")}
        onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
        {loading ? <>{spinner}Criando conta...</> : "Criar minha conta"}
      </button>
    </div>
  );

  const renderMagic = () => (
    <div style={{ animation:"slideUp 0.3s ease" }}>
      {backBtn(() => go("email"))}
      <div style={{ fontSize:24, fontWeight:800, color:"#f8fafc", letterSpacing:"-0.5px", marginBottom:8, fontFamily:"'Sora',sans-serif" }}>Entrar sem senha</div>
      <div style={{ fontSize:13.5, color:"#4a5568", marginBottom:24, lineHeight:1.6 }}>
        Digite seu e-mail e enviaremos um link seguro para você acessar sua conta.
      </div>
      <div style={{ marginBottom:16 }}>
        <label style={lbl}>E-mail</label>
        <input style={inp} type="email" placeholder="voce@email.com" value={email} autoFocus
          onChange={e=>{ setLocalErr(""); setEmail(e.target.value); }}
          onFocus={focusInp} onBlur={blurInp}
          onKeyDown={e=>e.key==="Enter"&&handleMagicLink()}/>
      </div>
      {errBox}
      <button style={{ ...btnPrimary, background:"linear-gradient(135deg,#a78bfa,#818cf8)", boxShadow:"0 4px 20px rgba(167,139,250,0.2)", opacity:loading?0.7:1 }}
        onClick={handleMagicLink} disabled={loading}
        onMouseEnter={e=>!loading&&(e.currentTarget.style.opacity="0.85")}
        onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
        {loading ? <>{spinner}Enviando...</> : "✨ Enviar link de acesso"}
      </button>
    </div>
  );

  const renderMagicSent = () => (
    <div style={{ animation:"slideUp 0.35s ease", textAlign:"center", padding:"0.5rem 0" }}>
      <div style={{ fontSize:48, marginBottom:16 }}>📬</div>
      <div style={{ fontSize:22, fontWeight:800, color:"#f1f5f9", marginBottom:8, fontFamily:"'Sora',sans-serif" }}>Enviamos um link para você</div>
      <div style={{ fontSize:13.5, color:"#4a5568", lineHeight:1.7, marginBottom:"2rem" }}>
        Enviamos um link para <span style={{ color:"#a78bfa", fontWeight:600 }}>{email}</span>.<br/>
        Basta clicar no link para entrar. Ele expira em alguns minutos.
      </div>
      <div style={{ background:"rgba(167,139,250,0.07)", border:"1px solid rgba(167,139,250,0.18)", borderRadius:14, padding:"1rem 1.25rem", fontSize:12.5, color:"#94a3b8", lineHeight:1.7 }}>
        Não encontrou? Verifique o spam ou{" "}
        <button style={{ background:"none", border:"none", color:"#a78bfa", cursor:"pointer", fontFamily:"inherit", fontSize:12.5, fontWeight:600 }} onClick={()=>go("magic")}>tente novamente</button>
      </div>
    </div>
  );

  const renderForgot = () => (
    <div style={{ animation:"slideUp 0.3s ease" }}>
      {backBtn(() => go("login"))}
      <div style={{ fontSize:24, fontWeight:800, color:"#f8fafc", letterSpacing:"-0.5px", marginBottom:8, fontFamily:"'Sora',sans-serif" }}>Recuperar senha</div>
      <div style={{ fontSize:13.5, color:"#4a5568", marginBottom:24, lineHeight:1.6 }}>
        Informe seu e-mail e enviaremos um link para você criar uma nova senha.
      </div>
      <div style={{ marginBottom:16 }}>
        <label style={lbl}>E-mail</label>
        <input style={inp} type="email" placeholder="voce@email.com" value={email} autoFocus
          onChange={e=>{ setLocalErr(""); setEmail(e.target.value); }}
          onFocus={focusInp} onBlur={blurInp}
          onKeyDown={e=>e.key==="Enter"&&handleForgot()}/>
      </div>
      {errBox}
      <button style={{ ...btnPrimary, opacity:loading?0.7:1 }} onClick={handleForgot} disabled={loading}
        onMouseEnter={e=>!loading&&(e.currentTarget.style.opacity="0.85")}
        onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
        {loading ? <>{spinner}Enviando...</> : "Enviar link de recuperação →"}
      </button>
    </div>
  );

  const renderForgotSent = () => (
    <div style={{ animation:"slideUp 0.35s ease", textAlign:"center", padding:"0.5rem 0" }}>
      <div style={{ fontSize:48, marginBottom:16 }}>📩</div>
      <div style={{ fontSize:22, fontWeight:800, color:"#f1f5f9", marginBottom:8, fontFamily:"'Sora',sans-serif" }}>Link enviado!</div>
      <div style={{ fontSize:13.5, color:"#4a5568", lineHeight:1.7, marginBottom:"1.5rem" }}>
        Enviamos um link para <span style={{ color:"#4ade80", fontWeight:600 }}>{email}</span>.<br/>
        Clique no link para criar uma nova senha.
      </div>
      <div style={{ background:"rgba(74,222,128,0.06)", border:"1px solid rgba(74,222,128,0.15)", borderRadius:14, padding:"1rem 1.25rem", fontSize:12.5, color:"#94a3b8", lineHeight:1.7, marginBottom:"1.5rem" }}>
        Não encontrou? Verifique o spam ou{" "}
        <button style={{ background:"none", border:"none", color:"#4ade80", cursor:"pointer", fontFamily:"inherit", fontSize:12.5, fontWeight:600 }}
          onClick={()=>go("forgot")}>tente novamente</button>
      </div>
      <button style={{ ...btnAlt, justifyContent:"center" }} onClick={()=>go("login")}>
        Voltar ao login
      </button>
    </div>
  );

  const renderSuccess = () => (
    <div style={{ textAlign:"center", padding:"0.5rem 0", animation:"slideUp 0.4s ease" }}>
      <div style={{ width:72, height:72, borderRadius:"50%", background:"rgba(74,222,128,0.1)", border:"1.5px solid rgba(74,222,128,0.3)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px", fontSize:28, color:"#4ade80", fontWeight:700 }}>✓</div>
      <div style={{ fontSize:22, fontWeight:800, color:"#f1f5f9", marginBottom:8, fontFamily:"'Sora',sans-serif", letterSpacing:"-0.5px" }}>Tudo certo!</div>
      <div style={{ fontSize:13.5, color:"#4a5568", marginBottom:24 }}>Estamos preparando sua conta…</div>
      <div style={{ display:"flex", justifyContent:"center" }}>{spinnerGreen}</div>
    </div>
  );

  const screens = { email:renderEmail, login:renderLogin, signup:renderSignup, magic:renderMagic, "magic-sent":renderMagicSent, forgot:renderForgot, "forgot-sent":renderForgotSent, success:renderSuccess };

  return (
    <div style={{ minHeight:"100vh", background:"#07090f", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'DM Sans',sans-serif", position:"relative", overflow:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-16px)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        input:-webkit-autofill{-webkit-box-shadow:0 0 0 100px #0a1220 inset!important;-webkit-text-fill-color:#f1f5f9!important}
        input::placeholder{color:#2d3748}
        button:focus-visible{outline:2px solid #4ade80;outline-offset:2px}
      `}</style>
      <Background/>
      <div style={{
        position:"relative", width:"100%", maxWidth:420, margin:"1.5rem",
        background:"linear-gradient(155deg,rgba(255,255,255,0.05) 0%,rgba(255,255,255,0.018) 100%)",
        border:"1px solid rgba(255,255,255,0.08)", borderRadius:28, padding:"2.75rem",
        boxShadow:"0 40px 100px rgba(0,0,0,0.6),inset 0 1px 0 rgba(255,255,255,0.07)",
        backdropFilter:"blur(32px)", WebkitBackdropFilter:"blur(32px)",
        maxHeight:"calc(100vh - 3rem)", overflowY:"auto",
      }}>
        <div style={{ position:"absolute",top:0,left:"15%",right:"15%",height:1,background:"linear-gradient(90deg,transparent,rgba(74,222,128,0.35),transparent)" }}/>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:"2.25rem" }}>
          <span style={{ fontSize:11, fontWeight:700, color:"#4ade80", fontFamily:"'Sora',sans-serif", letterSpacing:".06em", display:"flex", alignItems:"center", gap:6 }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:"#4ade80", boxShadow:"0 0 10px rgba(74,222,128,0.8)", display:"inline-block" }}/>
            CONTABILEASY
          </span>
        </div>
        {(screens[step] || screens.email)()}
      </div>
    </div>
  );
}