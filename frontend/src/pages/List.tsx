// src/pages/List.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, Expense } from "../api";

export default function List() {
  const [rows, setRows] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  async function load() {
    try {
      setErr(""); setLoading(true);
      setRows(await api.list());
    } catch (e:any) {
      setErr(String(e.message || e));
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, []);

  async function del(id: string) {
    if (!confirm("Delete this expense?")) return;
    try {
      await api.remove(id);
      setRows(rs => rs.filter(r => r._id !== id));
    } catch (e:any) {
      setErr(String(e.message || e));
    }
  }

  async function resetDev() {
    try {
      setErr("");
      await api.devReset();  // <=== nova função
      await load();
    } catch (e:any) {
      setErr(String(e.message || e));
    }
  }

  if (loading) return <p>Loading…</p>;
  if (err) return <p className="error">{err}</p>;

  return (
    <>
      <div className="row" style={{justifyContent:"space-between", alignItems:"center", margin:"8px 0 12px"}}>
        <h2>Expenses</h2>
        <div className="row">
          <button className="btn btn-outline" onClick={resetDev}>Reset (dev)</button>
          <Link to="/create" className="btn btn-primary">Create</Link>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Category</th>
              <th className="right">Amount</th>
              <th>Date</th>
              <th>Payment</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r._id}>
                <td>{r.description}</td>
                <td><span className="pill">{r.category}</span></td>
                <td className="right">${r.amount.toFixed(2)}</td>
                <td>{new Date(r.date).toLocaleDateString()}</td>
                <td>{r.payment}</td>
                <td className="actions">
                  <Link className="btn btn-small btn-warning" to={`/edit/${r._id}`}>Edit</Link>
                  <button className="btn btn-small btn-danger" onClick={() => del(r._id)}>Delete</button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={6} style={{textAlign:"center"}}>No data</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
