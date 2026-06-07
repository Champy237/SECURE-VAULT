import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "../components/Icon.jsx";
import { useApp } from "../context/AppContext.jsx";

export default function Register() {
  const { register } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      navigate("/chat");
    } catch (err) {
      setError(err?.response?.data?.message || "Inscription impossible. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-app flex justify-center py-16">
      <div className="card w-full max-w-md p-8">
        <div className="mb-7 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-accent2 text-ink-900">
            <Icon name="user" className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-white">Créer un compte</h1>
            <p className="text-sm text-slate-400">Votre paire de clés RSA sera générée automatiquement</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 flex items-start gap-2 rounded-xl border border-rose-400/30 bg-rose-400/10 p-3 text-sm text-rose-300">
            <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={submit}>
          <label className="label">Nom d'utilisateur</label>
          <input className="field" placeholder="alice" value={form.username} onChange={update("username")} required />
          <label className="label mt-4">Email</label>
          <input
            className="field"
            type="email"
            placeholder="alice@securevault.io"
            value={form.email}
            onChange={update("email")}
            required
          />
          <label className="label mt-4">Mot de passe</label>
          <input
            className="field"
            type="password"
            placeholder="•••••••• (6 caractères min.)"
            value={form.password}
            onChange={update("password")}
            required
          />

          <p className="mt-4 flex items-start gap-2 rounded-xl border border-brand-400/20 bg-brand-400/5 p-3 text-xs leading-relaxed text-slate-300">
            <Icon name="key" className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
            À l'inscription, une paire de clés RSA 2048 est générée côté serveur. La clé privée est chiffrée avant
            d'être stockée en base.
          </p>

          <button type="submit" className="btn btn-primary mt-6 w-full" disabled={loading}>
            {loading ? "Création…" : "Créer mon compte sécurisé"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Déjà un compte ?{" "}
          <Link to="/login" className="font-semibold text-brand-400 hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
