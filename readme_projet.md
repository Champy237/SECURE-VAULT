# 🔒 CryptoSign-Service — Cahier des Charges (Fullstack React / Spring Boot)

Ce document définit les spécifications fonctionnelles et techniques de **CryptoSign-Service**, un microservice d'infrastructure dédié à la gestion et à la démonstration visuelle des signatures électroniques basées sur l'algorithme asymétrique **RSA** et le hachage **SHA-256**.

---

## 1. Présentation du Projet
L'objectif de ce projet est de concevoir un **Service Partagé (Microservice)** centralisé, capable de fournir des fonctionnalités de sécurité (Authenticité et Intégrité des données) à n'importe quelle autre application via une API REST.

Le projet se sépare en deux applications distinctes :
1. **Le Backend (Microservice Spring Boot) :** Le moteur cryptographique qui gère la génération des clés RSA 2048 bits, le hachage des documents et la vérification mathématique.
2. **Le Frontend (Application React) :** Une interface utilisateur moderne et dynamique (Dashboard/SaaS) permettant de simuler l'interaction entre un Émetteur (Alice) et un Récepteur (Bob).

---

## 2. Spécifications Fonctionnelles

L'application valide le flux complet d'une signature électronique à travers trois étapes clés :

### A. Initialisation des clés (RSA)
* Le backend génère une paire de clés asymétriques RSA de **2048 bits**.
* La **clé privée** reste la propriété exclusive du serveur (secrète).
* La **clé publique** est distribuée librement pour permettre la vérification.

### B. Espace Émetteur : Signature du document (Alice)
* Alice saisit ou dépose un document texte sur l'interface React.
* L'application React envoie le contenu au serveur Spring Boot.
* Le backend calcule l'empreinte unique du document (**SHA-256**) et la chiffre avec la **clé privée**.
* La **Signature Électronique** (encodée en Base64) est renvoyée à l'écran de React.

### C. Espace Récepteur : Vérification d'Intégrité (Bob)
* Bob reçoit le document et la signature.
* L'application React transmet ces deux éléments au backend.
* Le backend utilise la **clé publique** pour déchiffrer la signature et la comparer au hash du document actuel.
* **Le Verdict :** React affiche dynamiquement un statut **VERT** (Document intègre et valide) ou un statut **ROUGE** (Alerte : Document modifié ou corrompu).

---

## 3. Architecture Technique & Stack Technologique



### 🖥️ Frontend (Application Client)
* **Framework :** React (Version 18+)
* **Tooling :** Vite (pour un build rapide et moderne)
* **Gestion des États :** Hooks natifs (`useState`, `useEffect`) pour la réactivité des formulaires et des onglets.
* **Client HTTP :** Axios / Fetch API (pour consommer l'API Spring Boot de manière asynchrone).
* **Design :** Interface moderne de type Dashboard (style Tailwind CSS), responsive et interactive.

### ⚙️ Backend (Microservice API)
* **Framework :** Spring Boot 3.x
* **Langage :** Java 21 (LTS)
* **Gestionnaire de projet :** Maven
* **Sécurité :** Architecture JCA (`java.security`), aucun plugin crypto tiers requis (utilisation des standards natifs du JDK).
* **Dépendances majeures :**
  * `spring-boot-starter-web` (Exposition de l'API REST)
  * `spring-boot-devtools` (Rechargement automatique à chaud)
  * `lombok` (Optimisation du code et suppression du boilerplate)

---

## 4. Spécifications des Endpoints (API REST)

Le backend Spring Boot expose les points d'accès (endpoints) suivants, configurés pour accepter les requêtes cross-origin (`@CrossOrigin`) venant de l'application React :

| Méthode HTTP | URL | Description | Paramètres (Body / Form) | Réponse (JSON / Text) |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/crypto/sign` | Reçoit le texte, calcule le SHA-256 et applique la clé privée RSA. | `file` ou `text` | `String` (La signature en Base64) |
| `POST` | `/api/crypto/verify`| Compare le hash du document reçu avec le contenu décodé de la signature. | `text`, `signature` | `Boolean` ou message textuel (Succès/Erreur) |

---

## 5. Perspectives d'Évolution

* **Mode Fichier Réel :** Permettre le dépôt de vrais fichiers PDF/Images au lieu de simples zones de texte.
* **Coffre-fort Numérique :** Sauvegarder et sécuriser la paire de clés RSA dans un fichier *Java KeyStore (JKS)* plutôt que de les générer à la volée.
* **Persistance :** Ajouter une base de données (H2 ou PostgreSQL) pour enregistrer l'historique des documents vérifiés et l'identité des signataires.

---
*Projet Fullstack d'ingénierie logicielle réalisé pour démontrer la mise en place d'un microservice de sécurité réutilisable.*