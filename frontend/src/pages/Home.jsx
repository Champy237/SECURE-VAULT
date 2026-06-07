import { Link } from "react-router-dom";
import Icon from "../components/Icon.jsx";

const features = [
  {
    icon: "lock",
    title: "Confidentialité",
    text: "Chaque message est chiffré avec AES-256, et la clé AES est protégée par la clé publique RSA du destinataire. En base de données, le contenu reste illisible.",
  },
  {
    icon: "signature",
    title: "Authenticité",
    text: "Chaque message est signé avec la clé privée de l'expéditeur. Impossible de se faire passer pour quelqu'un d'autre.",
  },
  {
    icon: "shield",
    title: "Intégrité",
    text: "Le hachage SHA-256 combiné à la signature détecte toute modification. Un message altéré est immédiatement signalé.",
  },
];

const steps = [
  {
    n: 1,
    title: "Inscription",
    text: "À la création du compte, une paire de clés RSA 2048 est générée. La clé privée est stockée chiffrée, dérivée du mot de passe.",
  },
  {
    n: 2,
    title: "Envoi",
    text: "Le serveur chiffre le message (AES), protège la clé AES avec la clé publique du destinataire, puis signe avec la clé privée de l'expéditeur.",
  },
  {
    n: 3,
    title: "Lecture",
    text: "Le destinataire déchiffre le message et la signature est vérifiée : statut authentique ou corrompu, affiché clairement.",
  },
];

const stack = ["React + Vite", "Spring Boot 3", "MySQL / XAMPP", "JWT + BCrypt", "Chiffrement hybride RSA + AES"];

export default function Home() {
  return (
    <div className="container-app">
      <section className="py-20 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-brand-400/30 bg-brand-400/10 px-4 py-1.5 text-xs font-semibold text-brand-400">
          <Icon name="spark" className="h-4 w-4" />
          RSA 2048 · AES-256 · SHA-256
        </span>
        <h1 className="mx-auto mt-6 max-w-3xl text-5xl font-black leading-[1.05] tracking-tight text-white sm:text-6xl">
          Discutez librement.{" "}
          <span className="bg-gradient-to-r from-brand-400 via-accent2 to-purple-400 bg-clip-text text-transparent">
            Chiffré et signé
          </span>{" "}
          de bout en bout.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400">
          SecureVault est une messagerie où chaque message est automatiquement chiffré (illisible en base de données)
          et signé (expéditeur impossible à usurper). La sécurité, sans y penser.
        </p>
        <div className="mt-9 flex justify-center gap-4">
          <Link to="/chat" className="btn btn-primary">
            Lancer la démonstration
            <Icon name="arrowRight" className="h-4 w-4" />
          </Link>
          <Link to="/test-api" className="btn btn-ghost">
            <Icon name="api" className="h-4 w-4" />
            Voir l'API
          </Link>
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-2.5">
          {stack.map((s) => (
            <span
              key={s}
              className="rounded-lg border border-accent2/30 bg-accent2/10 px-3 py-1.5 font-mono text-xs text-indigo-200"
            >
              {s}
            </span>
          ))}
        </div>
      </section>

      <section className="pt-10">
        <h2 className="text-center text-3xl font-extrabold tracking-tight text-white">Pourquoi SecureVault ?</h2>
        <p className="mt-2 text-center text-slate-400">Trois garanties de sécurité, appliquées à chaque message.</p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="card p-7 transition hover:-translate-y-1 hover:border-white/20">
              <span className="grid h-12 w-12 place-items-center rounded-2xl border border-brand-400/20 bg-brand-400/10 text-brand-400">
                <Icon name={f.icon} className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-lg font-bold text-white">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="pt-20">
        <h2 className="text-center text-3xl font-extrabold tracking-tight text-white">Comment ça marche ?</h2>
        <p className="mt-2 text-center text-slate-400">Du clic « envoyer » jusqu'à la lecture vérifiée.</p>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="relative">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-brand-400 to-accent2 text-lg font-extrabold text-ink-900">
                {s.n}
              </span>
              <h3 className="mt-4 text-base font-bold text-white">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="mt-24 border-t border-white/10 py-10 text-center text-sm text-slate-500">
        SecureVault Messenger — Microservice de messagerie sécurisée, réutilisable via API REST.
      </footer>
    </div>
  );
}
