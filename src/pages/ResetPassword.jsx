
import { useState } from "react";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { auth } from "../services/firebase";

const EyeIcon = ({ off }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {off
      ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
      : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>}
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
  </>
);

export default function ResetPassword({ oobCode, onDone }) {
  const [stage,       setStage]    = useState("form"); // form | success | invalid
  const [password,    setPassword] = useState("");
  const [confirm,     setConfirm]  = useState("");
  const [showPass,    setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading,     setLoading]  = useState(false);
  const [err,         setErr]      = useState("");

  const strength = password.length === 0 ? 0
    : password.length < 6  ? 1
    : password.length < 10 ? 2
    : /[A-Z]/.test(password) && /[0-9]/.test(password) ? 4 : 3;

  const strengthLabel = ["", "Fraca", "Razoável", "Boa", "Forte"];
  const strengthColor = ["", "#f87171", "#fbbf24", "#4ade80", "#22d3ee"];

  const inp = {
    width:"100%", background:"rgba(255,255,255,0.04)", border:"1.5px solid rgba(255,255,255,0.08)",
    borderRadius:14, padding:"0.9rem 1.125rem", color:"#f1f5f9", fontSize:15,
    outline:"none", boxSizing:"border-box", transition:"all 0.2s", fontFamily:"'Sora',sans-serif",
  };
  const focusInp = e => Object.assign(e.target.style, { borderColor:"#4ade80", boxShadow:"0 0 0 3px rgba(74,222,128,0.1)", background:"rgba(74,222,128,0.03)" });
  const blurInp  = e => Object.assign(e.target.style, { borderColor:"rgba(255,255,255,0.08)", boxShadow:"none", background:"rgba(255,255,255,0.04)" });
  const lbl = { display:"block", fontSize:11, fontWeight:600, color:"#4a5568", marginBottom:7, textTransform:"uppercase", letterSpacing:".08em" };

  const handleSubmit = async () => {
    if (password.length < 6) { setErr("A senha precisa ter ao menos 6 caracteres"); return; }
    if (password !== confirm) { setErr("As senhas não coincidem"); return; }
    setLoading(true); setErr("");
    try {
      await verifyPasswordResetCode(auth, oobCode);
      await confirmPasswordReset(auth, oobCode, password);
      setStage("success");
  
      setTimeout(() => onDone(), 2500);
    } catch (e) {
      if (e.code === "auth/expired-action-code" || e.code === "auth/invalid-action-code") {
        setStage("invalid");
      } else {
        setErr("Ocorreu um erro. Tente solicitar um novo link.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:"100vh", background:"#07090f", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'DM Sans',sans-serif", position:"relative", overflow:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box}
        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        input:-webkit-autofill{-webkit-box-shadow:0 0 0 100px #0a1220 inset!important;-webkit-text-fill-color:#f1f5f9!important}
        input::placeholder{color:#2d3748}
      `}</style>

      <Background />

      <div style={{
        position:"relative", width:"100%", maxWidth:420, margin:"1.5rem",
        background:"linear-gradient(155deg,rgba(255,255,255,0.05) 0%,rgba(255,255,255,0.018) 100%)",
        border:"1px solid rgba(255,255,255,0.08)", borderRadius:28, padding:"2.75rem",
        boxShadow:"0 40px 100px rgba(0,0,0,0.6),inset 0 1px 0 rgba(255,255,255,0.07)",
        backdropFilter:"blur(32px)", WebkitBackdropFilter:"blur(32px)",
        animation:"slideUp 0.35s ease",
      }}>
        <div style={{ position:"absolute",top:0,left:"15%",right:"15%",height:1,background:"linear-gradient(90deg,transparent,rgba(74,222,128,0.35),transparent)" }}/>

        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:"2rem" }}>
          <span style={{ fontSize:11, fontWeight:700, color:"#4ade80", fontFamily:"'Sora',sans-serif", letterSpacing:".06em", display:"flex", alignItems:"center", gap:6 }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:"#4ade80", boxShadow:"0 0 10px rgba(74,222,128,0.8)", display:"inline-block" }}/>
            CONTABILEASY
          </span>
        </div>

        {/* ── Formulário ── */}
        {stage === "form" && (
          <div style={{ animation:"slideUp 0.3s ease" }}>
            <div style={{ fontSize:24, fontWeight:800, color:"#f8fafc", letterSpacing:"-0.5px", marginBottom:8, fontFamily:"'Sora',sans-serif" }}>
              Criar nova senha
            </div>
            <div style={{ fontSize:13.5, color:"#4a5568", marginBottom:28, lineHeight:1.6 }}>
              Escolha uma senha segura para sua conta.
            </div>

            {/* Nova senha */}
            <div style={{ marginBottom:12 }}>
              <label style={lbl}>Nova senha</label>
              <div style={{ position:"relative" }}>
                <input
                  style={{ ...inp, paddingRight:46 }}
                  type={showPass ? "text" : "password"}
                  placeholder="Mínimo 6 caracteres"
                  value={password} autoFocus
                  onChange={e => { setErr(""); setPassword(e.target.value); }}
                  onFocus={focusInp} onBlur={blurInp}
                  onKeyDown={e => e.key === "Enter" && handleSubmit()}
                />
                <button onClick={() => setShowPass(v => !v)} tabIndex={-1}
                  style={{ position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#4a5568",cursor:"pointer",padding:4,display:"flex" }}>
                  <EyeIcon off={showPass} />
                </button>
              </div>

              {/* Barra de força */}
              {password.length > 0 && (
                <div style={{ marginTop:8 }}>
                  <div style={{ display:"flex", gap:4, marginBottom:4 }}>
                    {[1,2,3,4].map(i => (
                      <div key={i} style={{
                        flex:1, height:3, borderRadius:99,
                        background: i <= strength ? strengthColor[strength] : "rgba(255,255,255,0.08)",
                        transition:"all 0.3s",
                      }}/>
                    ))}
                  </div>
                  <span style={{ fontSize:11, color: strengthColor[strength], fontWeight:600 }}>
                    {strengthLabel[strength]}
                  </span>
                </div>
              )}
            </div>

            {/* Confirmar senha */}
            <div style={{ marginBottom:20 }}>
              <label style={lbl}>Confirmar senha</label>
              <div style={{ position:"relative" }}>
                <input
                  style={{ ...inp, paddingRight:46, borderColor: confirm && confirm !== password ? "rgba(248,113,113,0.5)" : "rgba(255,255,255,0.08)" }}
                  type={showConfirm ? "text" : "password"}
                  placeholder="Repita a senha"
                  value={confirm}
                  onChange={e => { setErr(""); setConfirm(e.target.value); }}
                  onFocus={focusInp} onBlur={blurInp}
                  onKeyDown={e => e.key === "Enter" && handleSubmit()}
                />
                <button onClick={() => setShowConfirm(v => !v)} tabIndex={-1}
                  style={{ position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#4a5568",cursor:"pointer",padding:4,display:"flex" }}>
                  <EyeIcon off={showConfirm} />
                </button>
              </div>
              {confirm && confirm !== password && (
                <div style={{ fontSize:11, color:"#f87171", marginTop:5 }}>As senhas não coincidem</div>
              )}
            </div>

            {err && (
              <div style={{ fontSize:12.5, color:"#f87171", background:"rgba(248,113,113,0.08)", border:"1px solid rgba(248,113,113,0.18)", borderRadius:10, padding:"0.65rem 1rem", marginBottom:14, display:"flex", alignItems:"center", gap:8 }}>
                ⚠ {err}
              </div>
            )}

            <button
              style={{
                width:"100%", padding:"0.9rem",
                background: loading || password !== confirm || password.length < 6
                  ? "rgba(74,222,128,0.3)" : "linear-gradient(135deg,#4ade80,#22d3ee)",
                border:"none", borderRadius:14, color:"#060d0a", fontSize:15, fontWeight:700,
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily:"'Sora',sans-serif", display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                transition:"opacity 0.2s",
              }}
              onClick={handleSubmit}
              disabled={loading || password !== confirm || password.length < 6}
            >
              {loading
                ? <><div style={{ width:16,height:16,border:"2.5px solid rgba(6,13,10,0.25)",borderTopColor:"#060d0a",borderRadius:"50%",animation:"spin 0.7s linear infinite" }}/> Salvando...</>
                : "Salvar nova senha"}
            </button>
          </div>
        )}

        {/* ── Sucesso ── */}
        {stage === "success" && (
          <div style={{ textAlign:"center", padding:"0.5rem 0", animation:"slideUp 0.4s ease" }}>
            <div style={{ width:72,height:72,borderRadius:"50%",background:"rgba(74,222,128,0.1)",border:"1.5px solid rgba(74,222,128,0.3)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",fontSize:28,color:"#4ade80" }}>✓</div>
            <div style={{ fontSize:22, fontWeight:800, color:"#f1f5f9", marginBottom:8, fontFamily:"'Sora',sans-serif" }}>Senha alterada!</div>
            <div style={{ fontSize:13.5, color:"#4a5568", marginBottom:24, lineHeight:1.6 }}>
              Sua senha foi redefinida com sucesso.<br/>Redirecionando para o login…
            </div>
            <div style={{ display:"flex", justifyContent:"center" }}>
              <div style={{ width:20,height:20,border:"2.5px solid rgba(74,222,128,0.2)",borderTopColor:"#4ade80",borderRadius:"50%",animation:"spin 0.7s linear infinite" }}/>
            </div>
          </div>
        )}

        {/* ── Link inválido/expirado ── */}
        {stage === "invalid" && (
          <div style={{ textAlign:"center", padding:"0.5rem 0", animation:"slideUp 0.4s ease" }}>
            <div style={{ fontSize:40, marginBottom:16 }}>⚠️</div>
            <div style={{ fontSize:22, fontWeight:800, color:"#f8fafc", marginBottom:8, fontFamily:"'Sora',sans-serif" }}>Link expirado</div>
            <div style={{ fontSize:13.5, color:"#4a5568", marginBottom:24, lineHeight:1.6 }}>
              Este link de redefinição já foi usado ou expirou.<br/>Solicite um novo link.
            </div>
            <button
              onClick={() => onDone()}
              style={{ width:"100%", padding:"0.9rem", background:"linear-gradient(135deg,#4ade80,#22d3ee)", border:"none", borderRadius:14, color:"#060d0a", fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"'Sora',sans-serif" }}>
              Voltar ao login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}