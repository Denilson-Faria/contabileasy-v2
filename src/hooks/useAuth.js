import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import {
  loginWithGoogle,
  loginWithEmail,
  registerWithEmail,
  sendPasswordReset,
  sendMagicLink as fsSendMagicLink,
  confirmMagicLink,
  sendSMSCode,
  verifySMSCode,
  setupRecaptcha,
  logout,
  onAuthChange,
} from "../services/authService";

export function useAuth() {
  const [user, setUser] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsub = onAuthChange(async (u) => {
      if (!u?.uid) {
        setUser(u ?? null);
        return;
      }

      try {
        const userRef = doc(db, "users", u.uid);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.exists() ? userSnap.data() : {};

        setUser({
          ...u,
          avatarBase64: userData.avatarBase64 || "",
        });
      } catch (err) {
        console.error("Erro ao carregar avatar do usuário:", err);
        setUser({
          ...u,
          avatarBase64: "",
        });
      }
    });

    confirmMagicLink()
      .then(async (u) => {
        if (!u?.uid) {
          if (u) setUser(u);
          return;
        }

        try {
          const userRef = doc(db, "users", u.uid);
          const userSnap = await getDoc(userRef);
          const userData = userSnap.exists() ? userSnap.data() : {};

          setUser({
            ...u,
            avatarBase64: userData.avatarBase64 || "",
          });
        } catch (err) {
          console.error("Erro ao carregar avatar no magic link:", err);
          setUser({
            ...u,
            avatarBase64: "",
          });
        }
      })
      .catch(() => {});

    return unsub;
  }, []);

  const wrap = async (fn) => {
    try {
      setLoading(true);
      setError("");
      return await fn();
    } catch (err) {
      setError(friendlyError(err.code));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = () => wrap(() => loginWithGoogle());
  const signInWithEmail = (e, p) => wrap(() => loginWithEmail(e, p));
  const signUpWithEmail = (e, p, n, ph) =>
    wrap(() => registerWithEmail(e, p, n, ph));
  const resetPassword = (email) => wrap(() => sendPasswordReset(email));
  const sendCode = (phone) =>
    wrap(async () => {
      setupRecaptcha("recaptcha-container");
      await sendSMSCode(toE164(phone));
      return true;
    });
  const verifyCode = (code) => wrap(() => verifySMSCode(code));
  const signOut = () => logout().then(() => setUser(null));

  const sendMagicLink = (email) => wrap(() => fsSendMagicLink(email));

  return {
    user,
    setUser,
    loading,
    error,
    isLoading: user === undefined,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    resetPassword,
    sendMagicLink,
    sendCode,
    verifyCode,
    signOut,
  };
}

function toE164(phone) {
  const d = phone.replace(/\D/g, "");
  return d.startsWith("55") ? `+${d}` : `+55${d}`;
}

function friendlyError(code) {
  const map = {
    "auth/user-not-found": "Nenhuma conta com este e-mail.",
    "auth/wrong-password": "Senha incorreta.",
    "auth/invalid-credential": "E-mail ou senha incorretos.",
    "auth/email-already-in-use": "Este e-mail já está cadastrado.",
    "auth/weak-password": "A senha precisa ter pelo menos 6 caracteres.",
    "auth/invalid-email": "E-mail inválido.",
    "auth/too-many-requests": "Muitas tentativas. Aguarde um momento.",
    "auth/network-request-failed": "Erro de conexão. Verifique sua internet.",
    "auth/popup-closed-by-user": "",
    "auth/invalid-phone-number": "Número de telefone inválido.",
    "auth/invalid-verification-code": "Código incorreto.",
    "auth/code-expired": "Código expirado. Solicite um novo.",
  };
  return map[code] || "Ocorreu um erro inesperado.";
}