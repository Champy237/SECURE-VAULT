import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { authApi, usersApi, messagesApi } from "../services/api.js";

// Contexte applicatif branche sur le backend Spring Boot.
// L'authentification (JWT), la liste des contacts et la messagerie passent par l'API REST.
// Toute la cryptographie (RSA + AES + signature) est realisee cote serveur.

const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

function readStoredUser() {
  try {
    const raw = localStorage.getItem("sv_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(readStoredUser);

  const persist = useCallback((auth) => {
    const user = { userId: auth.userId, username: auth.username };
    localStorage.setItem("sv_token", auth.token);
    localStorage.setItem("sv_user", JSON.stringify(user));
    setCurrentUser(user);
    return user;
  }, []);

  const register = useCallback(
    async ({ username, email, password }) => {
      const { data } = await authApi.register({ username, email, password });
      return persist(data);
    },
    [persist]
  );

  const login = useCallback(
    async ({ identifier, password }) => {
      const { data } = await authApi.login({ identifier, password });
      return persist(data);
    },
    [persist]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("sv_token");
    localStorage.removeItem("sv_user");
    setCurrentUser(null);
  }, []);

  const fetchContacts = useCallback(async () => {
    const { data } = await usersApi.list();
    return data;
  }, []);

  const sendMessage = useCallback(async (recipientId, content) => {
    const { data } = await messagesApi.send({ recipientId, content });
    return data;
  }, []);

  const loadConversation = useCallback(async (peerId) => {
    const { data } = await messagesApi.conversation(peerId);
    return data;
  }, []);

  const value = useMemo(
    () => ({
      currentUser,
      isAuthenticated: !!currentUser,
      register,
      login,
      logout,
      fetchContacts,
      sendMessage,
      loadConversation,
    }),
    [currentUser, register, login, logout, fetchContacts, sendMessage, loadConversation]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
