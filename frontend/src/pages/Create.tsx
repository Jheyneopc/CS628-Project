import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, Category, Payment } from "../api";

const CATEGORIES: Category[] = ["Food","Transport","Shopping","Education","Health","Other"];
const PAYMENTS:  Payment[]  = ["Cash","Card","PIX"];

export default function Create() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    description: "",
    category: "Food" as Category,
    amount: "",
    date: new Date().toISOString().slice(0,10), // yyyy-mm-dd para input date
    payment: "Cash" as Payment,
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  function set<K extends keyof typeof form>(k: K, v: any) {
    setForm(s => ({ ...s, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    try {
      setLoading(true);
      await api.create({
        description: form.description,
        category: form.category,
        amount: form.amount,
        date: form.date,
        payment: form.payment,
      });
      nav("/"); // volta para a lista
    } catch (e: any) {
      setErr(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h2>New expense</h2>

      <form className="card" onSubmit={onSubmit}>
        <label>
          Description
          <input value={form.description} onChange={e=>set("description", e.target.value)} required />
        </label>

        <label>
          Category
          <select value={form.category} onChange={e=>set("category", e.target.value as Category)}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>

        <label>
          Amount
          <input type="number" step="0.01" value={form.amount}
                 onChange={e=>set("amount", e.target.value)} required />
        </label>

        <label>
          Date
          <input type="date" value={form.date} onChange={e=>set("date", e.target.value)} required />
        </label>

        <label>
          Payment
          <select value={form.payment} onChange={e=>set("payment", e.target.value as Payment)}>
            {PAYMENTS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </label>

        {err && <p className="error">{err}</p>}

        <div className="row">
          <button className="btn btn-primary" disabled={loading}>
            {loading ? "Saving..." : "Create"}
          </button>
          <Link to="/" className="btn btn-outline">Cancel</Link>
        </div>
      </form>
    </>
  );
}
