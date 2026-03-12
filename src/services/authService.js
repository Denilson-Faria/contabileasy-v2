import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { auth } from "./firebase";

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export async function loginWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  return formatUser(result.user);
}

export async function loginWithEmail(email, password) {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return formatUser(result.user);
}

export async function registerWithEmail(email, password, name, phone) {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  if (name) await updateProfile(result.user, { displayName: name });
 
  return formatUser({ ...result.user, displayName: name, _signUpPhone: phone });
}


export async function sendMagicLink(email) {
  const actionCodeSettings = {
    url: window.location.origin + "/",
    handleCodeInApp: true,
  };

  await sendSignInLinkToEmail(auth, email, actionCodeSettings);
  localStorage.setItem("emailForSignIn", email);

  return true;
}


export async function confirmMagicLink() {
  if (!isSignInWithEmailLink(auth, window.location.href)) return null;


  let email = localStorage.getItem("emailForSignIn");


  if (!email) {
    email = window.prompt("Confirme seu e-mail para entrar:");
    if (!email) return null;
  }

  const result = await signInWithEmailLink(auth, email, window.location.href);
  localStorage.removeItem("emailForSignIn");

 
  window.history.replaceState(null, "", window.location.pathname);

  return formatUser(result.user);
}


let recaptchaVerifier  = null;
let confirmationResult = null;

export function setupRecaptcha(containerId = "recaptcha-container") {
  if (recaptchaVerifier) return;
  recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
    size: "invisible",
    callback: () => {},
  });
}

export async function sendSMSCode(phoneNumber) {
 
  confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
}

export async function verifySMSCode(code) {
  if (!confirmationResult) throw new Error("Nenhum código enviado");
  const result = await confirmationResult.confirm(code);
  return formatUser(result.user);
}


export async function sendPasswordReset(email) {
  await sendPasswordResetEmail(auth, email);
}


export async function logout() {
  if (recaptchaVerifier) { recaptchaVerifier.clear(); recaptchaVerifier = null; }
  confirmationResult = null;
  await signOut(auth);
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, user => callback(user ? formatUser(user) : null));
}


function formatUser(u) {
  const provider = u.providerData?.[0]?.providerId;
  const photoURL = u.photoURL || null;
  const avatarId = photoURL?.startsWith("avatar:") ? photoURL.replace("avatar:", "") : null;
  return {
    uid:      u.uid,
    name:     u.displayName || u.email?.split("@")[0] || u.phoneNumber || "Usuário",
    email:    u.email  || null,
    phone:    u.phoneNumber || u._signUpPhone || null,
    photo:    avatarId ? null : photoURL,
    avatarId: avatarId,
    method:   provider === "google.com" ? "google" : provider === "password" ? "email" : "phone",
  };
}