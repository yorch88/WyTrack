import { useState } from "react";
import { login } from "./api";
import logo from "../../images/logo.svg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();

    try {
      setLoading(true);

      const data = await login(email, password);

      // 🔐 Token
      localStorage.setItem("token", data.access_token);

      // 👤 Usuario
      localStorage.setItem("user_level", JSON.stringify(data.level || []));

      const redirect =
        localStorage.getItem("redirect_after_login") || "/tickets";

      localStorage.removeItem("redirect_after_login");

      window.location.href = redirect;

    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative">

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">

        <div className="flex justify-center mb-1">
          <img src={logo} alt="Logo" className="w-[220px]" />
        </div>

        <div className="text-center mb-1">
          <h1 className="text-2xl font-bold text-slate-100">
            WyTrack
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Sign in to continue
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">

          <input
            type="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-md text-white"
          />

          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-md text-white"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-md"
          >
            {loading ? "Signing in..." : "Login"}
          </button>

        </form>
      </div>
    </div>
  );
}