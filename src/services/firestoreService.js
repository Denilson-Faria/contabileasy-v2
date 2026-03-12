import {
  collection, doc,
  addDoc, setDoc, updateDoc, deleteDoc,
  onSnapshot, query, orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

const txnCol  = (uid) => collection(db, "users", uid, "transactions");
const txnDoc  = (uid, id) => doc(db, "users", uid, "transactions", id);
const goalCol = (uid) => collection(db, "users", uid, "goals");
const goalDoc = (uid, id) => doc(db, "users", uid, "goals", id);
const catCol  = (uid) => collection(db, "users", uid, "categories");

export function subscribeToTransactions(uid, cb) {
  const q = query(txnCol(uid), orderBy("createdAt", "desc"));
  return onSnapshot(q, snap => cb(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
}
export async function addTransaction(uid, data) {
  await addDoc(txnCol(uid), { ...data, createdAt: serverTimestamp() });
}
export async function updateTransaction(uid, id, data) {
  await updateDoc(txnDoc(uid, id), data);
}
export async function deleteTransaction(uid, id) {
  await deleteDoc(txnDoc(uid, id));
}

export function subscribeToGoals(uid, cb) {
  return onSnapshot(goalCol(uid), snap => cb(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
}
export async function addGoal(uid, data) {
  await addDoc(goalCol(uid), { ...data, createdAt: serverTimestamp() });
}
export async function updateGoal(uid, id, data) {
  await updateDoc(goalDoc(uid, id), data);
}
export async function deleteGoal(uid, id) {
  await deleteDoc(goalDoc(uid, id));
}

export function subscribeToCategories(uid, cb) {
  return onSnapshot(catCol(uid), snap => cb(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
}
export async function addCategory(uid, data) {
  await setDoc(doc(db, "users", uid, "categories", data.id), data);
}
export async function deleteCategory(uid, id) {
  await deleteDoc(doc(db, "users", uid, "categories", id));
}