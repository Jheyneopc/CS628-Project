// src/pages/Edit.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { api, ExpenseDraft, Expense } from "../api";

export default function Edit() {
  const { id } = useParams<{id: string}>();
  const nav = useNavigate();

  const [data, setData] = useState<ExpenseDraft>({
    description:"", category:"Food", amount:0, date:new Date().toISOString(), payment:"Cash"
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [err, setErr]         = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setErr(""); setLoading(true);
        if (!id) throw new Error("Invalid id");
        const found: Expense = await api.get(id);
        if (!alive) return;
        setData({
          description: found.description,
          category: found.category,
          amount: found.amount,
          date: new Date(found.date).toISOString().slice(0,10),
          payment: found.payment,
        });
      } catch (e:any) {
        setErr(e?.message || String(e));
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [id]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!id) return;
    try {
      setErr(""); setSaving(true);
      const payload: ExpenseDraft = {
        ...data,
        // garantir formato ISO com dia selecionado
        date: new Date(data.date).toISOString(),
        amount: Number(data.amount)
      };
      await api.update(id, payload);
      nav("/"); // volta pra lista
    } catch (e:any) {
      setErr(e?.message || String(e));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Loading…</p>;

  return (
    <div className="card">
      <h2>Edit expense</h2>
      {err && <p className="error">{err}</p>}

      <form onSubmit={submit} className="col" style={{gap:12}}>
        <label>
          Description
          <input value={data.description} onChange={e=>setData({...data, description:e.target.value})} required />
        </label>

        <label>
          Category
          <select value={data.category} onChange={e=>setData({...data, category:e.target.value})}>
            <option>Food</option><option>Transport</option><option>Shopping</option><option>Bills</option>
          </select>
        </label>

        <label>
          Amount
          <input type="number" step="0.01" value={data.amount}
                 onChange={e=>setData({...data, amount:Number(e.target.value)})} required />
        </label>

        <label>
          Date
          <input type="date" value={String(data.date).slice(0,10)}
                 onChange={e=>setData({...data, date:e.target.value})} />
        </label>

        <label>
          Payment
          <select value={data.payment} onChange={e=>setData({...data, payment:e.target.value})}>
            <option>Cash</option><option>Card</option><option>PIX</option>
          </select>
        </label>

        <div className="row">
          <button className="btn btn-primary" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
          <Link to="/" className="btn btn-outline">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
