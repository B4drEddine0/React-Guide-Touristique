# Guide Touristique Nador (React + TypeScript)

Application web de guide touristique pour la ville de Nador avec:

- Espace visiteur (accueil, liste, filtres, recherche, pagination, detail)
- Espace administrateur (auth, dashboard, CRUD lieux, activation/desactivation)
- Inscription newsletter (json-server)

## Stack

- React + TypeScript + Vite
- Redux Toolkit + React Redux
- React Router
- Axios + intercepteurs
- React Hook Form + Yup
- React Toastify
- json-server
- Auth API: DummyJSON

## Lancement local

1. Installer les dependances:

```bash
npm install
```

2. Creer le fichier d environnement:

```bash
cp .env.example .env
```

3. Lancer l API locale:

```bash
npm run server
```

4. Lancer le front:

```bash
npm run dev
```

## Identifiants admin de test (DummyJSON)

- Username: `emilys`
- Password: `emilyspass`

## Donnees locales

- `db.json` contient:
  - `places`
  - `subscribers`
  - `events`
