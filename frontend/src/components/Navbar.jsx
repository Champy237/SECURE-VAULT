import { Link, NavLink, useNavigate } from "react-router-dom";
import Icon from "./Icon.jsx";
import { useApp } from "../context/AppContext.jsx";

const linkBase = "rounded-lg px-3.5 py-2 text-sm font-medium transition";
const linkClass = ({ isActive }) =>
  `${linkBase} ${isActive ? "bg-brand-400/15 text-white" : "text-slate-400 hover:bg-white/5 hover:text-slate-100"}`;

export default function Navbar() {
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-ink-900/70 backdrop-blur-xl">
      <div className="container-app flex h-16 items-center gap-7">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-accent2 text-ink-900 shadow-glow">
            <Icon name="shield" className="h-5 w-5" strokeWidth={2} />
          </span>
          <span className="leading-tight">
            <span className="block text-[15px] font-extrabold tracking-tight text-white">SecureVault</span>
            <span className="block text-[10.5px] font-medium text-slate-400">Messagerie chiffrée &amp; signée</span>
          </span>
        </Link>

        <nav className="ml-2 hidden items-center gap-1 md:flex">
          <NavLink to="/" end className={linkClass}>
            Accueil
          </NavLink>
          <NavLink to="/chat" className={linkClass}>
            Messagerie
          </NavLink>
          <NavLink to="/test-api" className={linkClass}>
            Test API
          </NavLink>
        </nav>

        <div className="ml-auto flex items-center gap-3">
          {currentUser ? (
            <>
              <span className="hidden items-center gap-2 rounded-full border border-white/10 bg-ink-700 px-3 py-1.5 text-sm sm:flex">
                <Icon name="user" className="h-4 w-4 text-brand-400" />
                <span className="font-medium capitalize">{currentUser.username}</span>
              </span>
              <button
                className="btn btn-ghost px-3.5 py-2 text-sm"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                <Icon name="logout" className="h-4 w-4" />
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost px-3.5 py-2 text-sm">
                Connexion
              </Link>
              <Link to="/chat" className="btn btn-primary px-3.5 py-2 text-sm">
                Ouvrir l'application
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
