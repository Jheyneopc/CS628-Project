import { Link, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import List from "./pages/List";
import Create from "./pages/Create";
import Edit from "./pages/Edit";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./ProtectedRoute";
import { auth } from "./auth";

function Topbar() {
  const nav = useNavigate();
  const user = auth.user();
  return (
    <header className="topbar">
      <div className="container">
        <Link to="/" className="brand">Expense Tracker</Link>
        <nav className="menu">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/">List</NavLink>
          <NavLink to="/create">Create</NavLink>
        </nav>
        <div className="user">
          {auth.isLoggedIn() ? (
            <>
              <span className="pill">{user}</span>
              <button className="btn btn-danger btn-small" onClick={() => {auth.logout(); nav("/login");}}>Logout</button>
            </>
          ) : (
            <NavLink to="/login" className="btn btn-primary btn-small">Login</NavLink>
          )}
        </div>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <>
      <Topbar />
      <main className="container">
        <Routes>
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />

          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard/></ProtectedRoute>
          }/>

          <Route path="/" element={
            <ProtectedRoute><List/></ProtectedRoute>
          } />
          <Route path="/create" element={
            <ProtectedRoute><Create/></ProtectedRoute>
          } />
          <Route path="/edit/:id" element={
            <ProtectedRoute><Edit/></ProtectedRoute>
          } />

          <Route path="*" element={<p>Not found</p>} />
        </Routes>
      </main>
    </>
  );
}
