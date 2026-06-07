import { useState } from "react";
import Icon from "../components/Icon.jsx";

const endpoints = [
  {
    method: "POST",
    url: "/api/auth/register",
    desc: "Inscription + génération des clés RSA",
    auth: false,
    sample: `// Requête
{ "username": "alice", "email": "alice@mail.com", "password": "MotDePasse123" }

// Réponse 201
{ "token": "eyJhbGciOiJIUzI1NiJ9...", "userId": 1, "username": "alice" }`,
  },
  {
    method: "POST",
    url: "/api/auth/login",
    desc: "Connexion → jeton JWT",
    auth: false,
    sample: `// Requête
{ "identifier": "alice@mail.com", "password": "MotDePasse123" }

// Réponse 200
{ "token": "eyJhbGciOiJIUzI1NiJ9...", "userId": 1, "username": "alice" }`,
  },
  {
    method: "POST",
    url: "/api/messages",
    desc: "Envoyer un message (chiffré + signé)",
    auth: true,
    sample: `// Requête
{ "recipientId": 2, "content": "Salut Bob, RDV demain 14h." }

// Réponse 201
{ "id": 10, "senderId": 1, "fromUsername": "alice",
  "content": "Salut Bob...", "signatureValid": true, "outgoing": true }`,
  },
  {
    method: "GET",
    url: "/api/messages/conversation/2",
    desc: "Lire une conversation (déchiffré + vérifié)",
    auth: true,
    sample: `// Réponse 200
[
  { "id": 10, "fromUsername": "alice", "content": "Salut Bob...",
    "signatureValid": true, "outgoing": false, "sentAt": "2026-06-07T12:30:00Z" }
]`,
  },
  {
    method: "GET",
    url: "/api/users",
    desc: "Liste des contacts",
    auth: true,
    sample: `// Réponse 200
[ { "id": 2, "username": "bob", "email": "bob@mail.com" } ]`,
  },
  {
    method: "GET",
    url: "/api/users/{id}/public-key",
    desc: "Clé publique d'un utilisateur",
    auth: true,
    sample: `// Réponse 200
{ "userId": 2, "publicKey": "MIIBIjANBgkqhkiG9w0BAQ..." }`,
  },
];

function Endpoint({ ep }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card overflow-hidden">
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center gap-4 p-5 text-left">
        <span
          className={`rounded-lg border px-2.5 py-1 font-mono text-xs font-bold ${
            ep.method === "POST"
              ? "border-emerald-400/30 bg-emerald-400/15 text-emerald-400"
              : "border-brand-400/30 bg-brand-400/15 text-brand-400"
          }`}
        >
          {ep.method}
        </span>
        <span className="font-mono text-sm text-white">{ep.url}</span>
        <span className="ml-auto hidden text-sm text-slate-400 sm:block">{ep.desc}</span>
        <Icon name="arrowRight" className={`h-4 w-4 text-slate-500 transition ${open ? "rotate-90" : ""}`} />
      </button>
      {open && (
        <div className="border-t border-white/10 px-5 pb-5 pt-4">
          {ep.auth && (
            <p className="mb-3 inline-flex items-center gap-1.5 font-mono text-[11px] text-amber-300">
              <Icon name="lock" className="h-3.5 w-3.5" />
              Requiert : Authorization: Bearer &lt;JWT&gt;
            </p>
          )}
          <pre className="overflow-x-auto rounded-lg border border-white/10 bg-ink-800 p-4 font-mono text-xs leading-relaxed text-sky-200">
            {ep.sample}
          </pre>
        </div>
      )}
    </div>
  );
}

export default function TestApi() {
  return (
    <div className="container-app py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Test de l'API REST</h1>
          <p className="mt-2 text-slate-400">
            Le service est réutilisable par d'autres projets. Cliquez sur un endpoint pour voir un exemple.
          </p>
        </div>
        <div className="space-y-4">
          {endpoints.map((ep) => (
            <Endpoint key={ep.url} ep={ep} />
          ))}
        </div>
        <p className="mt-8 flex items-center justify-center gap-2 text-center text-sm text-slate-500">
          <Icon name="api" className="h-4 w-4 text-brand-400" />
          Base de l'API : <span className="font-mono text-slate-400">http://localhost:8080/api</span>
        </p>
      </div>
    </div>
  );
}
