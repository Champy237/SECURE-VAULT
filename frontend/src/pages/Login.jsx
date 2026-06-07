import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "../components/Icon.jsx";
import { useApp } from "../context/AppContext.jsx";

export default function Login() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login({ identifier, password });
      navigate("/chat");
    } catch (err) {
      setError(err?.response?.data?.message || "Connexion impossible. Vérifiez vos identifiants.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-app flex justify-center py-16">
      <div className="card w-full max-w-md p-8">
        <div className="mb-7 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-accent2 text-ink-900">
            <Icon name="lock" className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-white">Connexion</h1>
            <p className="text-sm text-slate-400">Accédez à votre messagerie sécurisée</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 flex items-start gap-2 rounded-xl border border-rose-400/30 bg-rose-400/10 p-3 text-sm text-rose-300">
            <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={submit}>
          <label className="label">Email ou nom d'utilisateur</label>
          <input
            className="field"
            placeholder="alice@securevault.io"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
          <label className="label mt-4">Mot de passe</label>
          <input
            className="field"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary mt-6 w-full" disabled={loading}>
            {loading ? "Connexion…" : "Se connecter"}
          </button>
        </form>

        <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-slate-500">
          <Icon name="key" className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
          La connexion renvoie un jeton JWT, utilisé pour sécuriser tous les appels à l'API.
        </p>

        <p className="mt-6 text-center text-sm text-slate-400">
          Pas encore de compte ?{" "}
          <Link to="/register" className="font-semibold text-brand-400 hover:underline">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
}
