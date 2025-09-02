import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../auth";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [pass, setPass]   = useState("");
  const [err, setErr]     = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      auth.login(email, pass);
      nav("/dashboard");
    } catch (e: any) {
      setErr(String(e.message || e));
    }
  }

  return (
    <div className="card" style={{maxWidth: 520, margin: "40px auto"}}>
      <h2 style={{textAlign:"center"}}>Login</h2>
      {err && <p className="error">{err}</p>}
      <form onSubmit={submit} className="col">
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={pass} onChange={e=>setPass(e.target.value)} />
        <button className="btn btn-primary" type="submit">Login</button>
        <Link to="/register" className="btn btn-light" style={{textAlign:"center"}}>Register</Link>
      </form>
    </div>
  );
}
