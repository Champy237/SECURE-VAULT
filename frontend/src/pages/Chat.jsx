import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../components/Icon.jsx";
import { useApp } from "../context/AppContext.jsx";

const palette = [
  "from-pink-400 to-rose-500",
  "from-brand-400 to-accent2",
  "from-emerald-400 to-teal-500",
  "from-amber-400 to-orange-500",
  "from-violet-400 to-fuchsia-500",
];
const colorFor = (name = "?") =>
  palette[[...name].reduce((a, c) => a + c.charCodeAt(0), 0) % palette.length];

export default function Chat() {
  const { currentUser, isAuthenticated, fetchContacts, sendMessage, loadConversation } = useApp();
  const navigate = useNavigate();

  const [contacts, setContacts] = useState([]);
  const [peer, setPeer] = useState(null);
  const [thread, setThread] = useState([]);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const [loadingContacts, setLoadingContacts] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, [isAuthenticated, navigate]);

  // Charge la liste des contacts.
  useEffect(() => {
    let active = true;
    if (!isAuthenticated) return;
    fetchContacts()
      .then((list) => {
        if (!active) return;
        setContacts(list);
        setPeer((p) => p || list[0] || null);
      })
      .catch((err) => setError(err?.response?.data?.message || "Impossible de charger les contacts."))
      .finally(() => active && setLoadingContacts(false));
    return () => {
      active = false;
    };
  }, [isAuthenticated, fetchContacts]);

  const refreshThread = useCallback(
    async (silent = false) => {
      if (!peer) return;
      try {
        const data = await loadConversation(peer.id);
        setThread(data);
      } catch (err) {
        if (!silent) setError(err?.response?.data?.message || "Impossible de charger la conversation.");
      }
    },
    [peer, loadConversation]
  );

  // Recharge la conversation a la selection du contact, puis toutes les 4 secondes.
  useEffect(() => {
    if (!peer) return;
    refreshThread();
    const interval = setInterval(() => refreshThread(true), 4000);
    return () => clearInterval(interval);
  }, [peer, refreshThread]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [thread]);

  async function handleSend(e) {
    e.preventDefault();
    const text = draft.trim();
    if (!text || !peer) return;
    setDraft("");
    try {
      await sendMessage(peer.id, text);
      await refreshThread(true);
    } catch (err) {
      setError(err?.response?.data?.message || "Envoi impossible.");
    }
  }

  if (!isAuthenticated) return null;

  return (
    <div className="mx-auto grid h-[calc(100vh-4rem)] w-full max-w-6xl grid-cols-1 gap-4 p-4 md:grid-cols-[260px_1fr]">
      {/* Sidebar contacts */}
      <aside className="card flex flex-col p-4">
        <div className="mb-4 flex items-center gap-3 rounded-xl border border-white/10 bg-ink-800 p-3">
          <span
            className={`grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br ${colorFor(
              currentUser?.username
            )} text-sm font-bold uppercase text-ink-900`}
          >
            {currentUser?.username?.[0]}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold capitalize text-white">{currentUser?.username}</p>
            <p className="text-[11px] text-emerald-400">connecté</p>
          </div>
        </div>

        <p className="px-2 pb-2 text-[10.5px] font-semibold uppercase tracking-widest text-slate-500">Contacts</p>
        <div className="flex-1 space-y-1 overflow-y-auto">
          {loadingContacts && <p className="px-2 text-sm text-slate-500">Chargement…</p>}
          {!loadingContacts && contacts.length === 0 && (
            <p className="px-2 text-sm leading-relaxed text-slate-500">
              Aucun autre utilisateur. Crée un second compte (ex. « bob ») pour discuter.
            </p>
          )}
          {contacts.map((u) => (
            <button
              key={u.id}
              onClick={() => setPeer(u)}
              className={`flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition ${
                peer?.id === u.id ? "border border-brand-400/30 bg-brand-400/10" : "hover:bg-white/5"
              }`}
            >
              <span
                className={`grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br ${colorFor(
                  u.username
                )} text-sm font-bold uppercase text-ink-900`}
              >
                {u.username[0]}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium capitalize text-white">{u.username}</span>
                <span className="block truncate text-[11.5px] text-slate-500">{u.email}</span>
              </span>
            </button>
          ))}
        </div>
      </aside>

      {/* Conversation */}
      <section className="card flex min-h-0 flex-col overflow-hidden">
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-3.5">
          {peer ? (
            <>
              <span
                className={`grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br ${colorFor(
                  peer.username
                )} text-sm font-bold uppercase text-ink-900`}
              >
                {peer.username[0]}
              </span>
              <div>
                <p className="text-sm font-semibold capitalize text-white">{peer.username}</p>
                <p className="text-[11.5px] text-emerald-400">conversation chiffrée</p>
              </div>
            </>
          ) : (
            <p className="text-sm text-slate-400">Sélectionnez un contact</p>
          )}
        </div>

        {error && <div className="mx-5 mt-3 rounded-lg border border-rose-400/30 bg-rose-400/10 p-2.5 text-xs text-rose-300">{error}</div>}

        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-5">
          {peer && thread.length === 0 && (
            <p className="mt-10 text-center text-sm text-slate-500">Aucun message. Démarrez la conversation.</p>
          )}
          {thread.map((m) => (
            <div key={m.id} className={`flex flex-col gap-1.5 ${m.outgoing ? "items-end" : "items-start"}`}>
              <div
                className={`max-w-[72%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.outgoing
                    ? "rounded-br-md bg-gradient-to-br from-brand-400 to-accent2 font-medium text-ink-900"
                    : "rounded-bl-md border border-white/10 bg-ink-500 text-slate-100"
                }`}
              >
                {m.content}
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <span>
                  {new Date(m.sentAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                </span>
                {m.signatureValid ? (
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-400">
                    <Icon name="check" className="h-3.5 w-3.5" strokeWidth={2.5} />
                    signature vérifiée
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 font-semibold text-rose-400">
                    <Icon name="alert" className="h-3.5 w-3.5" strokeWidth={2.5} />
                    signature invalide
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10">
          <p className="flex items-center justify-center gap-2 py-2.5 text-[11.5px] text-slate-500">
            <Icon name="lock" className="h-3.5 w-3.5" />
            Les messages sont chiffrés (AES) puis signés (RSA) côté serveur
          </p>
          <form onSubmit={handleSend} className="flex gap-3 px-5 pb-4">
            <input
              className="field flex-1"
              placeholder="Écrivez un message sécurisé…"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              disabled={!peer}
            />
            <button type="submit" className="btn btn-primary" disabled={!peer}>
              <Icon name="send" className="h-4 w-4" />
              Envoyer
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
