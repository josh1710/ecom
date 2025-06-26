# 📱 PhoneDeal – Documentation Technique

## Présentation

**PhoneDeal** est un site e-commerce moderne dédié à la vente de smartphones, d'accessoires et de services associés. Le site propose une expérience utilisateur fluide, un design responsive, un panier dynamique, une gestion des commandes et un espace d'assistance client.

Le projet repose sur :
- Un **frontend** statique (HTML, CSS, JavaScript)
- Un **backend** Node.js/Express pour l'accès aux données et la gestion des commandes
- Une **base de données PostgreSQL** (hébergée sur Neon )

---

## Sommaire
- [Fonctionnalités](#fonctionnalités)
- [Architecture](#architecture)
- [Installation et lancement](#installation-et-lancement)
- [Structure des fichiers](#structure-des-fichiers)
- [Connexion à la base de données](#connexion-à-la-base-de-données)
- [API Backend](#api-backend)
- [Technologies utilisées](#technologies-utilisées)
- [Sécurité et bonnes pratiques](#sécurité-et-bonnes-pratiques)
- [Auteurs](#auteurs)

---

## Fonctionnalités
- Navigation par catégories et sous-catégories (marques, accessoires)
- Recherche dynamique sur tous les articles
- Panier interactif (ajout, suppression, validation)
- Affichage des avantages client
- Formulaire d'assistance avec enregistrement en base
- Pages dédiées par marque et par accessoire
- Responsive design (mobile, tablette, desktop)

---

## Architecture

```mermaid
graph TD;
  Utilisateur[Utilisateur (navigateur)] -->|HTTP| Frontend[Frontend HTML/CSS/JS]
  Frontend -->|API REST| Backend[Node.js/Express]
  Backend -->|SQL| DB[(PostgreSQL/Neon)]
```

- **Frontend** : Affichage, interactions, appels à l'API via `fetch`.
- **Backend** : Fournit les routes `/api/articles`, `/api/orders`, `/api/help`.
- **PostgreSQL** : Stocke les articles, commandes, demandes d'aide.

---

## Installation et lancement

### 1. Cloner le projet
```bash
git clone <url-du-repo>
cd ecom
```

### 2. Installer les dépendances backend
```bash
npm install
```

### 3. Lancer le serveur backend
```bash
node server.js
```

### 4. Ouvrir le site
- Ouvre `src/app/index.html` dans un navigateur
- Ou déploie le dossier `src/app/` sur un serveur web (Vercel, Netlify, etc.)

---

## Structure des fichiers

```
/ecom/
  ├─ src/
  │   └─ app/
  │        ├─ index.html         # Page d'accueil
  │        ├─ cart.html          # Panier
  │        ├─ help.html          # Assistance
  │        ├─ apple.html         # Marque Apple
  │        ├─ samsung.html       # Marque Samsung
  │        ├─ honor.html         # Marque Honor
  │        ├─ xiaomi.html        # Marque Xiaomi
  │        ├─ accessoires.html   # Accessoires smartphones
  │        ├─ style.css          # Styles globaux
  │        └─ script.js          # Logique JS (panier, recherche, etc.)
  ├─ server.js                   # Backend Node.js/Express
  ├─ db.js                       # Connexion PostgreSQL
  ├─ package.json                # Dépendances backend
  └─ ...
```

---

## Connexion à la base de données

Le backend utilise le module `pg` pour se connecter à PostgreSQL (Neon ou autre).

**Exemple de connexion dans `db.js`** :
```js
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL // à définir dans .env
});
module.exports = pool;
```

---

## API Backend

Le serveur Node.js expose les routes suivantes :
- `GET /api/articles` : liste des articles
- `POST /api/orders` : enregistrement d'une commande
- `GET /api/orders` : liste des commandes
- `POST /api/help` : enregistrement d'une demande d'aide
- `GET /api/help` : liste des demandes d'aide

**Exemple de réponse pour /api/articles** :
```json
[
  {
    "id": 1,
    "nom": "iPhone 15",
    "marque": "Apple",
    "prix": 999.99,
    "image_url": "..."
  },
  ...
]
```

---

## Technologies utilisées
- **HTML5/CSS3/JavaScript** (frontend)
- **Node.js/Express** (backend)
- **PostgreSQL** (base de données)
- **Neon** (hébergement PostgreSQL cloud)

---

## Sécurité et bonnes pratiques
- Les accès à la base de données sont sécurisés côté serveur (jamais exposés côté client).
- L'API doit être protégée (authentification recommandée en production).
- Les fichiers sensibles (`.env`, `node_modules/`, etc.) sont exclus du dépôt via `.gitignore`.
- Les entrées utilisateur sont validées côté backend.

---

## Auteurs
- Réalisé par [Votre Nom] – BTS SIO – Épreuve E6
- Encadrant : [Nom du professeur ou tuteur]

---

**Ce projet est un exemple pédagogique pour l'épreuve E6 du BTS SIO.** 