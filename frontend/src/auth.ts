export const auth = {
  isLoggedIn() {
    return localStorage.getItem("auth") === "1";
  },
  login(email: string, password: string) {
    if (!email || !password) throw new Error("Email and password are required");
    localStorage.setItem("auth", "1");
    localStorage.setItem("user", email);
  },
  logout() {
    localStorage.removeItem("auth");
    localStorage.removeItem("user");
  },
  user() {
    return localStorage.getItem("user") || "";
  },
};
