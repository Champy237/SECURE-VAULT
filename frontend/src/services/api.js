import axios from "axios";

// Client HTTP centralisé vers le microservice Spring Boot.
// La base est relative ("/api") : en développement, Vite redirige vers http://localhost:8080
// (voir vite.config.js). Réutilisable tel quel par d'autres projets.
const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

// Ajoute automatiquement le jeton JWT à chaque requête.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("sv_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authApi = {
  register: (payload) => api.post("/auth/register", payload),
  login: (payload) => api.post("/auth/login", payload),
  me: () => api.get("/users/me"),
};

export const usersApi = {
  list: () => api.get("/users"),
  publicKey: (id) => api.get(`/users/${id}/public-key`),
};

export const messagesApi = {
  send: (payload) => api.post("/messages", payload),
  conversation: (userId) => api.get(`/messages/conversation/${userId}`),
};

export default api;
