// src/api.ts

// ---- Types ----
export type Category =
  | "Food"
  | "Transport"
  | "Shopping"
  | "Education"
  | "Health"
  | "Other";

export type Payment = "Cash" | "Card" | "PIX";

export interface Expense {
  _id: string;
  description: string;
  category: Category;
  amount: number;
  date: string; // ISO
  payment: Payment;
  createdAt?: string;
  updatedAt?: string;
}

export type ExpenseInput = {
  description: string;
  category: Category;
  amount: number | string;
  date: string | Date;
  payment: Payment;
};

// ---- Base URL ----
const BASE = (import.meta.env.VITE_API_URL ?? "http://localhost:5050/api").replace(/\/$/, "");

// ---- HTTP helper ----
async function http<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(init.headers || {}) },
    ...init,
  });

  if (!res.ok) {
    let message = `${res.status} ${res.statusText}`;
    try {
      const data = await res.json();
      if (data?.error) message = data.error;
    } catch {}
    throw new Error(message);
  }

  if (res.status === 204) return null as unknown as T;
  return res.json() as Promise<T>;
}

// ---- Normalizer ----
function normalize(input: ExpenseInput): ExpenseInput {
  const amount =
    typeof input.amount === "string"
      ? Number(String(input.amount).replace(",", "."))
      : Number(input.amount);

  const date =
    input.date instanceof Date ? input.date.toISOString() : new Date(input.date).toISOString();

  return {
    description: input.description.trim(),
    category: input.category,
    amount: isNaN(amount) ? 0 : amount,
    date,
    payment: input.payment,
  };
}

// ---- REST endpoints ----
export function list() {
  return http<Expense[]>("/expenses");
}
export function get(id: string) {
  return http<Expense>(`/expenses/${id}`);
}
export function create(payload: ExpenseInput) {
  return http<Expense>("/expenses", { method: "POST", body: JSON.stringify(normalize(payload)) });
}
export function update(id: string, payload: ExpenseInput) {
  return http<Expense>(`/expenses/${id}`, { method: "PUT", body: JSON.stringify(normalize(payload)) });
}
export function remove(id: string) {
  return http<{ ok: true }>(`/expenses/${id}`, { method: "DELETE" });
}

// ---- Dev helpers (opcionais) ----
export function devReset() {
  return http("/dev/reset", { method: "POST" });
}
export function devSeed() {
  return http("/dev/seed", { method: "POST" });
}
export function devClear() {
  return http("/dev/clear", { method: "POST" });
}

// ---- Objeto compatível com seu import { api } ----
export const api = {
  // aliases “antigos”
  list,
  get,
  // nomes “novos” se quiser usar:
  getAll: list,
  getOne: get,
  create,
  update,
  remove,
  devReset,
  devSeed,
  devClear,
};

// também exporto default para quem usar `import api from "../api"`
export default api;
