import { Navigate } from "react-router-dom";
import { auth } from "./auth";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  return auth.isLoggedIn() ? children : <Navigate to="/login" replace />;
}
