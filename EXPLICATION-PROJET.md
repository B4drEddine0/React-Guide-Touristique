# Guide Touristique Nador — Explication complète du projet

Ce document explique **chaque concept, technologie et choix** utilisé dans ce projet.
Il est fait pour quelqu'un qui voit React pour la première fois et qui doit pouvoir répondre à toutes les questions sur ce qu'il a fait et comment.

---

## Table des matières

1. [C'est quoi ce projet ?](#1-cest-quoi-ce-projet-)
2. [Les technologies (Stack technique)](#2-les-technologies-stack-technique)
3. [Comment le projet est organisé (Architecture)](#3-comment-le-projet-est-organisé-architecture)
4. [Les concepts JavaScript de base utilisés](#4-les-concepts-javascript-de-base-utilisés)
5. [TypeScript — c'est quoi et pourquoi ?](#5-typescript--cest-quoi-et-pourquoi-)
6. [React — les fondamentaux](#6-react--les-fondamentaux)
7. [React Router — la navigation](#7-react-router--la-navigation)
8. [Redux Toolkit — la gestion d'état globale](#8-redux-toolkit--la-gestion-détat-globale)
9. [Axios — les requêtes HTTP](#9-axios--les-requêtes-http)
10. [React Hook Form + Yup — les formulaires](#10-react-hook-form--yup--les-formulaires)
11. [React Toastify — les notifications](#11-react-toastify--les-notifications)
12. [Tailwind CSS — le style](#12-tailwind-css--le-style)
13. [JSON Server — le backend simulé](#13-json-server--le-backend-simulé)
14. [DummyJSON — l'authentification](#14-dummyjson--lauthentification)
15. [Vite — l'outil de build](#15-vite--loutil-de-build)
16. [Parcours complet : que se passe-t-il quand...](#16-parcours-complet--que-se-passe-t-il-quand)
17. [Questions fréquentes d'oral](#17-questions-fréquentes-doral)

---

## 1. C'est quoi ce projet ?

C'est une **application web de guide touristique** pour la ville de **Nador** (Maroc). Elle a deux parties :

### Espace visiteur (public)
- **Page d'accueil** : présentation de Nador, catégories de lieux, destinations populaires, formulaire newsletter
- **Page liste des lieux** : tous les lieux actifs avec filtrage par catégorie, recherche par nom, pagination
- **Page détail d'un lieu** : galerie photos, description, horaires, tarifs, adresse, transport

### Espace administrateur (protégé)
- **Login** : connexion par identifiant/mot de passe
- **Dashboard** : statistiques (nombre de lieux, actifs/inactifs, abonnés newsletter)
- **Gestion des lieux** : ajouter, modifier, activer/désactiver, supprimer des lieux touristiques

### Newsletter
- Formulaire d'inscription (prénom + email)
- Stockage des abonnés dans json-server
- Vérification des doublons avant inscription

---

## 2. Les technologies (Stack technique)

| Technologie | Rôle | Fichier clé |
|-------------|------|-------------|
| **TypeScript** | Langage (JavaScript avec des types) | `tsconfig.json` |
| **React** | Framework front-end (construction de l'interface) | Tous les `.tsx` |
| **Redux Toolkit** | Gestion de l'état global de l'app | `src/app/store.ts`, `src/features/` |
| **React Router** | Navigation entre les pages (SPA) | `src/App.tsx` |
| **Axios** | Requêtes HTTP vers le backend | `src/api/http.ts` |
| **React Hook Form** | Gestion des formulaires | `NewsletterForm.tsx`, `LoginPage.tsx`, `PlaceEditorPage.tsx` |
| **Yup** | Validation des formulaires | Utilisé avec React Hook Form |
| **React Toastify** | Notifications (petits messages de succès/erreur) | `src/main.tsx` |
| **Tailwind CSS** | Framework CSS utilitaire (style) | `tailwind.config.js`, `src/styles.css` |
| **JSON Server** | Backend simulé (REST API locale) | `db.json` |
| **DummyJSON** | API externe pour l'authentification | `src/api/http.ts` |
| **Vite** | Outil de build et serveur de développement | `vite.config.ts` |
| **Framer Motion** | Animations | Composants comme `FadeIn.tsx` |

---

## 3. Comment le projet est organisé (Architecture)

```
src/
├── api/              → Configuration des requêtes HTTP (Axios)
│   └── http.ts       → Instances Axios (localApi, authApi) + intercepteur token
│
├── app/              → Configuration globale Redux
│   ├── store.ts      → Le store Redux (le "magasin central" de données)
│   └── hooks.ts      → Hooks typés (useAppDispatch, useAppSelector)
│
├── components/       → Composants réutilisables (pas des pages)
│   ├── auth/         → PrivateRoute (protection des routes admin)
│   ├── common/       → Loader, Pagination, ConfirmModal, SkeletonCard, etc.
│   ├── forms/        → NewsletterForm
│   ├── layout/       → PublicLayout (header+footer visiteur), AdminLayout
│   └── places/       → PlaceCard (carte d'un lieu)
│
├── constants/        → Valeurs constantes
│   ├── categories.ts → Les 9 catégories de lieux
│   └── days.ts       → Les jours de la semaine
│
├── features/         → La logique métier (Redux slices)
│   ├── auth/         → authSlice : login, logout, état authentification
│   ├── newsletter/   → newsletterSlice : inscription, comptage abonnés
│   └── places/       → placesSlice : CRUD complet des lieux
│
├── pages/            → Les pages (une par route/URL)
│   ├── HomePage.tsx
│   ├── PlacesPage.tsx
│   ├── PlaceDetailsPage.tsx
│   ├── NotFoundPage.tsx
│   └── admin/
│       ├── LoginPage.tsx
│       ├── DashboardPage.tsx
│       ├── AdminPlacesPage.tsx
│       └── PlaceEditorPage.tsx
│
├── types/            → Les types TypeScript
│   ├── models.ts     → Interface Place, Subscriber, AdminUser
│   └── form.ts       → Types pour les formulaires
│
├── utils/            → Fonctions utilitaires
│   ├── errors.ts     → Extraction des messages d'erreur Axios
│   └── date.ts       → Formatage de dates
│
├── App.tsx           → Définition de toutes les routes
├── main.tsx          → Point d'entrée : Provider Redux + BrowserRouter + App
└── styles.css        → Styles globaux + Tailwind
```

---

## 4. Les concepts JavaScript de base utilisés

### 4.1 Les fonctions fléchées (Arrow Functions)

```javascript
// Ancienne syntaxe
function add(a, b) {
  return a + b;
}

// Fonction fléchée (arrow function) — ce qu'on utilise dans le projet
const add = (a, b) => a + b;
```

On les utilise partout dans le projet, surtout dans les composants React et les callbacks.

### 4.2 Le destructuring (décomposition)

```javascript
// Au lieu de :
const name = props.name;
const age = props.age;

// On écrit :
const { name, age } = props;
```

Très utilisé pour récupérer les props des composants et les données du state Redux.

### 4.3 Le spread operator (...)

```javascript
// Copier un objet en ajoutant/modifiant des propriétés
const newPlace = { ...place, isActive: true, updatedAt: new Date().toISOString() };
```

Utilisé dans les reducers Redux pour mettre à jour l'état de manière **immutable** (sans modifier l'original).

### 4.4 Les template literals

```javascript
const greeting = `Bonjour ${user.firstName}, vous avez ${count} lieux.`;
```

Utilisé pour construire des classes CSS dynamiques dans Tailwind et des messages.

### 4.5 Les Promises et async/await

```javascript
// Une Promise = une opération qui prend du temps (requête HTTP, etc.)
// async/await = syntaxe pour attendre le résultat d'une Promise

const fetchData = async () => {
  try {
    const response = await axios.get('/places');  // attend la réponse
    return response.data;                         // retourne les données
  } catch (error) {
    console.error('Erreur:', error);              // gère l'erreur
  }
};
```

Tous les appels API dans le projet (les thunks Redux) utilisent async/await.

### 4.6 Les méthodes de tableau

```javascript
// filter : garder seulement certains éléments
const activePlaces = places.filter(place => place.isActive);

// map : transformer chaque élément
const placeNames = places.map(place => place.name);

// find : trouver un seul élément
const place = places.find(p => p.id === '3');

// findIndex : trouver la position d'un élément
const index = places.findIndex(p => p.id === '3');
```

`filter` est utilisé pour filtrer les lieux actifs / par catégorie.
`map` est utilisé pour afficher une liste de composants (PlaceCard).
`find/findIndex` est utilisé dans les reducers Redux pour trouver un lieu à mettre à jour.

### 4.7 Les modules ES (import/export)

```javascript
// Exporter quelque chose
export const PLACE_CATEGORIES = [...];        // Export nommé
export default placesSlice.reducer;           // Export par défaut

// Importer
import { PLACE_CATEGORIES } from '../constants/categories';  // Import nommé
import placesReducer from '../features/places/placesSlice';   // Import par défaut
```

Chaque fichier du projet exporte ses fonctions/composants et les importe là où il en a besoin.

### 4.8 L'opérateur ternaire

```javascript
// Au lieu de if/else pour du rendu conditionnel :
const status = place.isActive ? 'Actif' : 'Inactif';
```

Très utilisé dans JSX pour afficher un composant ou un autre selon une condition.

### 4.9 L'optional chaining (?.)

```javascript
// Au lieu de : if (error && error.response && error.response.data)
const message = error?.response?.data?.message;
```

Permet d'accéder à des propriétés imbriquées sans risquer un crash si un niveau est `undefined`.

### 4.10 Le nullish coalescing (??)

```javascript
// Valeur par défaut si null ou undefined
const url = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';
```

---

## 5. TypeScript — c'est quoi et pourquoi ?

TypeScript = **JavaScript + les types**. Ça permet de détecter les erreurs AVANT d'exécuter le code.

### Exemple concret dans le projet :

```typescript
// On définit la forme d'un objet "Place"
export interface Place {
  id: number | string;
  name: string;
  category: PlaceCategory;    // type spécifique (union de strings)
  description: string;
  coverImage: string;
  gallery: string[];           // tableau de strings
  isActive: boolean;
  openingHours?: OpeningHours; // le "?" = optionnel
  prices?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Pourquoi c'est utile ?

```typescript
// Si tu écris ça, TypeScript te dit "Erreur ! 'naem' n'existe pas sur Place"
console.log(place.naem);  // ❌ Erreur de compilation

// Quand tu passes le mauvais type, TypeScript t'avertit
const x: number = "hello"; // ❌ Type 'string' is not assignable to type 'number'
```

### Les types utilisés dans ce projet :

| Type/Concept | Où | Explication |
|---|---|---|
| `interface` | `models.ts` | Définit la structure d'un objet (Place, Subscriber, AdminUser) |
| `type` | `form.ts`, `categories.ts` | Alias pour un type (PlaceCategory = une des 9 catégories) |
| `as const` | `categories.ts` | Rend un tableau "readonly" et permet d'extraire les types littéraux |
| Generics `<T>` | `placesSlice.ts` | Types paramétrés (ex: `createAsyncThunk<Place[], void>`) |
| `TypedUseSelectorHook` | `hooks.ts` | Hook Redux typé avec le type du state complet |

---

## 6. React — les fondamentaux

### 6.1 C'est quoi React ?

React est une **bibliothèque JavaScript** pour construire des interfaces utilisateur.
L'idée centrale : on découpe l'interface en **composants** réutilisables.

### 6.2 Un composant React

Un composant = **une fonction qui retourne du JSX** (HTML dans JavaScript).

```tsx
// Composant simple
function PlaceCard({ place }) {
  return (
    <div className="card">
      <img src={place.coverImage} alt={place.name} />
      <h3>{place.name}</h3>
      <p>{place.shortDescription}</p>
    </div>
  );
}
```

### 6.3 JSX — c'est quoi ?

JSX = **du HTML écrit à l'intérieur de JavaScript**. Ce n'est pas du vrai HTML, c'est une syntaxe que React transforme en JavaScript.

Différences avec le HTML :
- `class` → `className`
- `for` → `htmlFor`
- Les expressions JavaScript sont dans `{}`
- Les attributs sont en camelCase (`onClick`, `onChange`)

### 6.4 Les Props (propriétés)

Les props = **les paramètres passés à un composant** (comme les arguments d'une fonction).

```tsx
// Parent passe des props
<PlaceCard place={monLieu} />

// Enfant reçoit les props
function PlaceCard({ place }: { place: Place }) {
  return <h3>{place.name}</h3>;
}
```

### 6.5 Le State (état local)

Le state = **des données qui peuvent changer** dans un composant. Quand le state change, React re-render le composant automatiquement.

```tsx
function PlacesPage() {
  const [searchTerm, setSearchTerm] = useState('');     // state pour la recherche
  const [selectedCategory, setSelectedCategory] = useState(''); // state pour le filtre

  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}   // mise à jour du state
    />
  );
}
```

`useState` retourne un tableau de 2 éléments :
1. La valeur actuelle
2. La fonction pour la modifier

### 6.6 useEffect — les effets de bord

`useEffect` permet d'**exécuter du code après le rendu** du composant. C'est comme dire "quand le composant apparaît, fais ça".

```tsx
function PlacesPage() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchPlaces());    // charge les lieux quand la page s'affiche
  }, [dispatch]);               // le [] = "exécute une seule fois"
}
```

**Le tableau de dépendances `[]` est crucial :**
- `[]` vide = exécute une seule fois (au montage)
- `[searchTerm]` = ré-exécute quand `searchTerm` change
- Pas de `[]` = ré-exécute à chaque rendu (à éviter)

### 6.7 Le rendu conditionnel

```tsx
// Avec &&
{loading && <Loader />}

// Avec ternaire
{isActive ? <span>Actif</span> : <span>Inactif</span>}

// Avec return anticipé
if (!place) return <NotFoundPage />;
```

### 6.8 Le rendu de listes

```tsx
{places.map((place) => (
  <PlaceCard key={place.id} place={place} />
))}
```

Le `key` est **obligatoire** : React l'utilise pour savoir quel élément a changé, a été ajouté ou supprimé.

---

## 7. React Router — la navigation

### 7.1 C'est quoi ?

React Router transforme l'application en **SPA (Single Page Application)** : quand tu cliques sur un lien, la page ne se recharge PAS — seul le contenu change.

### 7.2 Configuration (dans `App.tsx`)

```tsx
<Routes>
  {/* Routes publiques dans le layout visiteur */}
  <Route element={<PublicLayout />}>
    <Route index element={<HomePage />} />             {/* / */}
    <Route path="/lieux" element={<PlacesPage />} />    {/* /lieux */}
    <Route path="/lieux/:id" element={<PlaceDetailsPage />} /> {/* /lieux/3 */}
  </Route>

  {/* Login (pas de layout admin) */}
  <Route path="/admin/login" element={<LoginPage />} />

  {/* Routes admin protégées */}
  <Route element={<PrivateRoute />}>
    <Route path="/admin" element={<AdminLayout />}>
      <Route index element={<DashboardPage />} />
      <Route path="lieux" element={<AdminPlacesPage />} />
      <Route path="lieux/nouveau" element={<PlaceEditorPage />} />
      <Route path="lieux/:id/modifier" element={<PlaceEditorPage />} />
    </Route>
  </Route>

  <Route path="*" element={<NotFoundPage />} />  {/* 404 */}
</Routes>
```

### 7.3 Concepts clés

| Concept | Fichier | Explication |
|---------|---------|-------------|
| `<Route>` | `App.tsx` | Associe une URL à un composant |
| `<Link>` | Partout | Lien qui ne recharge pas la page (remplace `<a>`) |
| `<NavLink>` | `PublicLayout.tsx` | Comme Link mais avec classe "active" automatique |
| `<Outlet>` | Layouts | "Trou" où le contenu de la route enfant s'affiche |
| `useParams()` | `PlaceDetailsPage.tsx` | Récupérer les paramètres d'URL (`:id`) |
| `useNavigate()` | Admin pages | Naviguer programmatiquement (après une création) |
| `useLocation()` | `PrivateRoute.tsx` | Obtenir l'URL actuelle |
| `<Navigate>` | `PrivateRoute.tsx` | Redirection automatique |

### 7.4 Routes protégées (PrivateRoute)

```tsx
function PrivateRoute() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirige vers login, en sauvegardant d'où l'user venait
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return <Outlet />;  // Si authentifié, affiche la page demandée
}
```

**Comment ça marche :**
1. L'utilisateur essaie d'accéder à `/admin`
2. `PrivateRoute` vérifie si `isAuthenticated` est `true` dans le state Redux
3. Si NON → redirige vers `/admin/login`
4. Si OUI → affiche le contenu admin (via `<Outlet />`)
5. Après login, l'utilisateur est redirigé vers `/admin` (la page qu'il voulait)

### 7.5 Layouts et Outlet

Le layout est un composant **qui enveloppe** les pages. Il contient le header, le footer, et un `<Outlet />` pour le contenu.

```
PublicLayout
├── Header (navigation)
├── <Outlet /> ← ici React Router injecte HomePage, PlacesPage, etc.
└── Footer (newsletter, liens, réseaux sociaux)
```

---

## 8. Redux Toolkit — la gestion d'état globale

### 8.1 Le problème que Redux résout

Sans Redux, si une donnée est utilisée par plusieurs composants (ex: la liste des lieux est utilisée par HomePage, PlacesPage, AdminPlacesPage, DashboardPage), il faudrait la passer de parent en enfant en enfant ("prop drilling"). C'est ingérable.

**Redux = un magasin central (store)** où toutes les données globales sont stockées. N'importe quel composant peut y accéder.

### 8.2 Les 3 concepts fondamentaux

```
╔══════════════════════════════════════════════════════════════╗
║                        REDUX STORE                          ║
║                                                              ║
║  ┌─────────────┐  ┌─────────────┐  ┌──────────────────┐    ║
║  │ auth state  │  │places state │  │ newsletter state │    ║
║  │             │  │             │  │                  │    ║
║  │ token       │  │ items: []   │  │ subscriberCount  │    ║
║  │ user        │  │ loading     │  │ subscribing      │    ║
║  │ isAuth      │  │ submitting  │  │ error            │    ║
║  │ loading     │  │ error       │  │                  │    ║
║  └─────────────┘  └─────────────┘  └──────────────────┘    ║
╚══════════════════════════════════════════════════════════════╝
        ▲                    ▲                    ▲
        │   useAppSelector   │                    │
        ▼                    ▼                    ▼
   ┌─────────┐        ┌──────────┐        ┌──────────────┐
   │LoginPage│        │PlacesPage│        │NewsletterForm│
   └─────────┘        └──────────┘        └──────────────┘
```

**1. Le Store** (`src/app/store.ts`)
```typescript
export const store = configureStore({
  reducer: {
    auth: authReducer,         // gère l'authentification
    places: placesReducer,     // gère les lieux touristiques
    newsletter: newsletterReducer, // gère la newsletter
  },
});
```
C'est le "magasin central". Il combine les 3 slices.

**2. Les Slices** (= morceaux du state)
Un slice = une tranche de l'état global avec ses reducers et ses actions.

**3. Les Actions** = des événements qui modifient le state
- Actions synchrones : `logout`, `clearAuthError`
- Actions asynchrones (thunks) : `fetchPlaces`, `loginAdmin`, etc.

### 8.3 createSlice — comment on crée un slice

```typescript
const authSlice = createSlice({
  name: 'auth',           // nom du slice
  initialState,           // état initial
  reducers: {             // actions synchrones
    logout(state) {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('auth_token');
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {  // actions asynchrones (thunks)
    builder
      .addCase(loginAdmin.pending, (state) => { ... })
      .addCase(loginAdmin.fulfilled, (state, action) => { ... })
      .addCase(loginAdmin.rejected, (state, action) => { ... });
  },
});
```

### 8.4 createAsyncThunk — les opérations asynchrones

**C'est quoi un thunk ?** Un thunk est une **action asynchrone** qui fait quelque chose (ex: appel API) et retourne un résultat. Redux gère automatiquement 3 états :

1. **`pending`** — l'opération a commencé (on affiche un loader)
2. **`fulfilled`** — l'opération a réussi (on met à jour les données)
3. **`rejected`** — l'opération a échoué (on affiche une erreur)

```typescript
// Déclaration du thunk
export const fetchPlaces = createAsyncThunk<
  Place[],              // type du résultat en cas de succès
  void,                 // type du paramètre (void = pas de paramètre)
  { rejectValue: string } // type de l'erreur
>('places/fetchPlaces', async (_, { rejectWithValue }) => {
  try {
    const { data } = await localApi.get<Place[]>('/places');
    return data;         // → déclenche "fulfilled"
  } catch (error) {
    return rejectWithValue(  // → déclenche "rejected"
      toErrorMessage(error, 'Impossible de récupérer les lieux.')
    );
  }
});
```

```typescript
// Gestion des 3 états dans extraReducers
.addCase(fetchPlaces.pending, (state) => {
  state.loading = true;     // ← on commence à charger
  state.error = null;
})
.addCase(fetchPlaces.fulfilled, (state, action) => {
  state.loading = false;    // ← c'est fini
  state.items = action.payload; // ← on stocke les données reçues
})
.addCase(fetchPlaces.rejected, (state, action) => {
  state.loading = false;    // ← c'est fini
  state.error = action.payload ?? 'Erreur'; // ← on stocke l'erreur
})
```

### 8.5 Comment on utilise Redux dans un composant

```tsx
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchPlaces } from '../features/places/placesSlice';

function PlacesPage() {
  const dispatch = useAppDispatch();

  // Lire des données du store
  const { items: places, loading, error } = useAppSelector((state) => state.places);

  // Déclencher une action
  useEffect(() => {
    dispatch(fetchPlaces());
  }, [dispatch]);

  if (loading) return <Loader />;
  if (error) return <p>Erreur: {error}</p>;

  return (
    <div>
      {places.map(place => <PlaceCard key={place.id} place={place} />)}
    </div>
  );
}
```

**`useAppSelector`** = lire des données du store
**`useAppDispatch`** + `dispatch(action)` = envoyer une action au store

### 8.6 Les hooks typés (`hooks.ts`)

```typescript
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

Ce sont des versions **typées** des hooks Redux standard. Au lieu de `useSelector` et `useDispatch`, on utilise `useAppSelector` et `useAppDispatch` pour que TypeScript connaisse automatiquement la structure du state.

### 8.7 Le flux complet Redux (exemple : charger les lieux)

```
1. Le composant se monte (useEffect)
         │
         ▼
2. dispatch(fetchPlaces())  ← envoie l'action
         │
         ▼
3. Redux appelle le thunk fetchPlaces
         │
         ▼
4. Le thunk fait GET /places via Axios ← requête HTTP
         │
         ▼
5. L'API répond avec les données
         │
         ▼
6. fetchPlaces.fulfilled est dispatché avec les données
         │
         ▼
7. Le reducer met à jour state.places.items
         │
         ▼
8. Tous les composants qui lisent state.places se re-render
         │
         ▼
9. L'utilisateur voit la liste des lieux
```

### 8.8 Les 3 slices du projet expliqués

#### authSlice (`src/features/auth/authSlice.ts`)
- **State** : `token`, `user`, `isAuthenticated`, `loading`, `error`
- **Thunk** : `loginAdmin` → POST vers DummyJSON `/auth/login`
- **Reducers** : `logout` (efface tout + localStorage), `clearAuthError`
- **Particularité** : Le token et l'user sont lus du `localStorage` à l'initialisation (persistance)

#### placesSlice (`src/features/places/placesSlice.ts`)
- **State** : `items` (tableau de lieux), `loading`, `submitting`, `error`
- **Thunks** :
  - `fetchPlaces` → GET /places
  - `createPlace` → POST /places
  - `updatePlace` → PATCH /places/:id
  - `deletePlace` → DELETE /places/:id
  - `togglePlaceStatus` → PATCH /places/:id (isActive toggle)
- **Particularité** : `loading` pour le chargement initial, `submitting` pour les mutations (création, édition, suppression)

#### newsletterSlice (`src/features/newsletter/newsletterSlice.ts`)
- **State** : `subscriberCount`, `subscribing`, `loading`, `error`
- **Thunks** :
  - `subscribeNewsletter` → vérifie doublon + POST /subscribers
  - `fetchSubscriberCount` → GET /subscribers (compte les actifs)

---

## 9. Axios — les requêtes HTTP

### 9.1 C'est quoi ?

Axios est une bibliothèque pour faire des **requêtes HTTP** (GET, POST, PATCH, DELETE) vers un serveur.

### 9.2 Configuration (`src/api/http.ts`)

```typescript
// Instance pour l'API locale (json-server)
export const localApi = axios.create({
  baseURL: 'http://localhost:3001',
});

// Instance pour l'authentification (DummyJSON)
export const authApi = axios.create({
  baseURL: 'https://dummyjson.com',
});
```

### 9.3 Les intercepteurs

Un intercepteur = **du code qui s'exécute automatiquement avant chaque requête**.

```typescript
localApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**Ce que ça fait :** Avant chaque requête vers json-server, si un token existe dans localStorage, il est ajouté automatiquement dans le header HTTP `Authorization`. Ainsi, on n'a pas besoin de le passer manuellement à chaque appel.

### 9.4 Les méthodes HTTP utilisées

| Méthode | Usage | Exemple |
|---------|-------|---------|
| `GET` | Lire des données | `localApi.get('/places')` |
| `POST` | Créer une donnée | `localApi.post('/places', newPlace)` |
| `PATCH` | Modifier partiellement | `localApi.patch('/places/3', { isActive: false })` |
| `DELETE` | Supprimer | `localApi.delete('/places/3')` |

---

## 10. React Hook Form + Yup — les formulaires

### 10.1 Le problème

Gérer un formulaire en React "à la main" (avec `useState` pour chaque champ, validation manuelle) est très verbeux. React Hook Form simplifie tout ça.

### 10.2 Comment ça marche

```tsx
// 1. Schéma de validation Yup
const schema = yup.object({
  firstName: yup.string().trim().required('Le prénom est obligatoire.'),
  email: yup.string().email('Format invalide.').required("L'email est obligatoire."),
});

// 2. Type inféré automatiquement depuis le schéma
type FormValues = yup.InferType<typeof schema>;

// 3. Utilisation dans le composant
function NewsletterForm() {
  const {
    register,          // lie un input au formulaire
    handleSubmit,      // gère la soumission
    reset,             // remet les champs à zéro
    formState: { errors },  // erreurs de validation
  } = useForm<FormValues>({
    resolver: yupResolver(schema),   // connecte Yup
    defaultValues: { firstName: '', email: '' },
  });

  const onSubmit = async (values: FormValues) => {
    // values.firstName et values.email sont validés et typés
    await dispatch(subscribeNewsletter(values)).unwrap();
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('firstName')} />
      {errors.firstName && <p>{errors.firstName.message}</p>}

      <input {...register('email')} />
      {errors.email && <p>{errors.email.message}</p>}

      <button type="submit">S'inscrire</button>
    </form>
  );
}
```

### 10.3 `register` — c'est quoi ?

`register('firstName')` retourne `{ name, onChange, onBlur, ref }`. Quand on fait `{...register('firstName')}`, ça "connecte" l'input au système de React Hook Form sans état local (`useState`).

### 10.4 `resolver: yupResolver(schema)`

Ça connecte la validation Yup au formulaire. Quand l'utilisateur soumet, Yup valide **tous les champs** et renvoie les erreurs.

### 10.5 `.unwrap()` sur dispatch

```tsx
await dispatch(subscribeNewsletter(values)).unwrap();
```

`.unwrap()` transforme le résultat du thunk Redux en Promise normale :
- Si `fulfilled` → la Promise est résolue
- Si `rejected` → la Promise lance une erreur (qu'on peut catch)

---

## 11. React Toastify — les notifications

### 11.1 Configuration (`main.tsx`)

```tsx
<ToastContainer position="top-right" autoClose={2800} />
```

### 11.2 Utilisation

```tsx
import { toast } from 'react-toastify';

// Succès
toast.success('Lieu créé avec succès ! 🎉');

// Erreur
toast.error('Impossible de supprimer ce lieu.');
```

Ce sont les petites notifications qui apparaissent en haut à droite et disparaissent après 2.8 secondes.

---

## 12. Tailwind CSS — le style

### 12.1 C'est quoi ?

Tailwind CSS est un framework CSS **utilitaire**. Au lieu d'écrire du CSS dans un fichier séparé, on met les classes directement dans le HTML/JSX.

### 12.2 Exemple

```tsx
// Avec CSS classique
<div className="card">...</div>
// .card { padding: 16px; background: white; border-radius: 12px; box-shadow: ... }

// Avec Tailwind (pas besoin de fichier CSS séparé)
<div className="p-4 bg-white rounded-xl shadow-md">...</div>
```

### 12.3 Classes fréquentes dans le projet

| Classe | CSS équivalent |
|--------|---------------|
| `flex` | `display: flex` |
| `grid grid-cols-3` | Grille de 3 colonnes |
| `p-4` | `padding: 1rem` |
| `mt-8` | `margin-top: 2rem` |
| `text-sm` | `font-size: 0.875rem` |
| `font-bold` | `font-weight: 700` |
| `text-slate-600` | Couleur de texte grise |
| `bg-ocean-600` | Couleur de fond (personnalisée) |
| `rounded-xl` | `border-radius: 0.75rem` |
| `shadow-md` | box-shadow moyen |
| `hover:bg-ocean-700` | Couleur au survol |
| `transition-all duration-300` | Animation CSS |
| `sm:grid-cols-2 lg:grid-cols-3` | Responsive (2 colonnes sur tablette, 3 sur desktop) |

### 12.4 Le responsive avec Tailwind

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
```

- Par défaut (mobile) : 1 colonne
- `sm:` (≥640px, tablette) : 2 colonnes
- `lg:` (≥1024px, desktop) : 3 colonnes

---

## 13. JSON Server — le backend simulé

### 13.1 C'est quoi ?

JSON Server transforme un fichier `db.json` en une **API REST complète** en 30 secondes. C'est un "faux backend" pour le développement.

### 13.2 Le fichier `db.json`

```json
{
  "places": [...],       // Lieux touristiques
  "subscribers": [...],  // Abonnés newsletter
  "events": [...]        // Événements
}
```

### 13.3 Endpoints auto-générés

JSON Server crée automatiquement ces endpoints :

| HTTP | URL | Action | Slice qui l'utilise |
|------|-----|--------|---------------------|
| GET | `/places` | Lire tous les lieux | `fetchPlaces` |
| GET | `/places/3` | Lire le lieu id=3 | (utilisé via filtre côté client) |
| POST | `/places` | Créer un lieu | `createPlace` |
| PATCH | `/places/3` | Modifier partiellement | `updatePlace`, `togglePlaceStatus` |
| DELETE | `/places/3` | Supprimer | `deletePlace` |
| GET | `/subscribers` | Lire les abonnés | `fetchSubscriberCount` |
| GET | `/subscribers?email=x@x.com` | Chercher par email | `subscribeNewsletter` (doublon) |
| POST | `/subscribers` | Ajouter un abonné | `subscribeNewsletter` |

### 13.4 Lancement

```bash
npm run server   # = json-server --watch db.json --port 3001
```

---

## 14. DummyJSON — l'authentification

### 14.1 C'est quoi ?

DummyJSON (`https://dummyjson.com`) est une API publique qui simule un système d'auth avec de vrais tokens JWT.

### 14.2 Comment l'auth fonctionne

```
1. L'utilisateur saisit username + password
         │
         ▼
2. dispatch(loginAdmin({ username, password }))
         │
         ▼
3. POST https://dummyjson.com/auth/login
   Body: { username, password, expiresInMins: 60 }
         │
         ▼
4. DummyJSON vérifie et retourne :
   { accessToken: "eyJhbG...", id, username, firstName, lastName, email }
         │
         ▼
5. Le thunk stocke le token et l'user dans :
   - Redux state (auth.token, auth.user)
   - localStorage (pour persister la session)
         │
         ▼
6. isAuthenticated = true → PrivateRoute laisse passer → Dashboard s'affiche
```

### 14.3 Les identifiants de test

- **Username** : `emilys`
- **Password** : `emilyspass`

### 14.4 Le JWT (JSON Web Token)

Le JWT est un **jeton d'authentification** stocké dans `localStorage`. Il est envoyé automatiquement avec chaque requête via l'intercepteur Axios. Le serveur peut ainsi vérifier que l'utilisateur est authentifié.

### 14.5 La persistance de session

Au lancement de l'app, le `authSlice` vérifie si un token existe dans `localStorage` :

```typescript
const tokenFromStorage = localStorage.getItem('auth_token');
const initialState: AuthState = {
  token: tokenFromStorage,
  isAuthenticated: Boolean(tokenFromStorage),
  // ...
};
```

Si un token existe → l'utilisateur est automatiquement "connecté" sans refaire le login.

---

## 15. Vite — l'outil de build

### 15.1 C'est quoi ?

Vite est un **bundler/serveur de développement** ultra-rapide pour les projets front-end. Il remplace Webpack (plus ancien et plus lent).

### 15.2 Ce qu'il fait

- `npm run dev` — lance un serveur de dev avec hot reload (les changements s'affichent instantanément)
- `npm run build` — compile tout le projet en fichiers optimisés pour la production
- Gère les `.tsx`, `.ts`, `.css`, les imports, etc.

### 15.3 Variables d'environnement

```
VITE_API_URL=http://localhost:3001
```

Dans le code, on y accède via `import.meta.env.VITE_API_URL`. Le préfixe `VITE_` est obligatoire pour que Vite expose la variable au code client.

---

## 16. Parcours complet : que se passe-t-il quand...

### 16.1 L'utilisateur ouvre l'application

```
1. Le navigateur charge index.html
2. Vite injecte main.tsx
3. main.tsx crée le Provider Redux (avec le store), le BrowserRouter, et monte <App />
4. App.tsx regarde l'URL → "/" → affiche PublicLayout > HomePage
5. HomePage dispatche fetchPlaces() → GET /places → affiche les lieux populaires
```

### 16.2 L'utilisateur filtre les lieux par catégorie

```
1. L'utilisateur clique sur "Plages" dans PlacesPage
2. setSelectedCategory('Plages') met à jour le state local
3. React re-render PlacesPage
4. Le filtrage JS : places.filter(p => p.category === 'Plages')
5. Seules les PlaceCards de la catégorie "Plages" s'affichent
```

**Note :** Le filtrage est côté CLIENT (JavaScript), pas côté serveur. Toutes les places sont chargées une fois et filtrées en mémoire.

### 16.3 L'admin crée un nouveau lieu

```
1. Admin va sur /admin/lieux/nouveau
2. PlaceEditorPage affiche le formulaire vide (React Hook Form)
3. Il remplit tous les champs et clique "Créer"
4. handleSubmit validate via Yup
5. dispatch(createPlace(data)).unwrap()
6. Thunk → POST /places avec les données
7. json-server ajoute le lieu dans db.json et retourne le lieu avec un ID
8. createPlace.fulfilled → le reducer ajoute le lieu dans state.places.items
9. toast.success('Lieu créé avec succès !')
10. navigate('/admin/lieux') → retour à la liste
```

### 16.4 L'admin désactive un lieu

```
1. Admin clique sur "Désactiver" dans AdminPlacesPage
2. ConfirmModal s'affiche : "Êtes-vous sûr ?"
3. Admin confirme
4. dispatch(togglePlaceStatus(place))
5. Thunk → PATCH /places/:id { isActive: false }
6. togglePlaceStatus.fulfilled → le reducer met à jour le lieu dans state.items
7. Le lieu passe en "Inactif" dans l'admin
8. Côté visiteur, le lieu n'apparaît plus (filtré par isActive === true)
```

### 16.5 Un visiteur s'inscrit à la newsletter

```
1. Le visiteur remplit prénom + email dans NewsletterForm
2. Yup valide le format
3. dispatch(subscribeNewsletter({ firstName, email })).unwrap()
4. Le thunk vérifie si l'email existe : GET /subscribers?email=xxx
5. Si doublon → rejectWithValue('Cet email est déjà inscrit.')
6. Sinon → POST /subscribers { firstName, email, status: 'active', createdAt }
7. subscribeNewsletter.fulfilled → state.subscriberCount += 1
8. toast.success('Inscription réussie !')
9. reset() → vide le formulaire
```

---

## 17. Questions fréquentes d'oral

### "C'est quoi un composant React ?"
> Une fonction JavaScript qui retourne du JSX (du HTML enrichi). React compose l'interface en assemblant des composants comme des briques.

### "C'est quoi le Virtual DOM ?"
> React maintient une copie du DOM en mémoire (Virtual DOM). Quand le state change, il compare l'ancien et le nouveau Virtual DOM, et ne met à jour que les éléments qui ont changé dans le vrai DOM. C'est ce qui rend React rapide.

### "Pourquoi Redux et pas juste useState ?"
> `useState` est local à un composant. Si la liste des lieux est nécessaire dans 5 composants différents (HomePage, PlacesPage, AdminPlacesPage, DashboardPage, PlaceDetailsPage), il faudrait la passer de parent en enfant sans arrêt. Redux centralise ces données dans un store global accessible partout.

### "C'est quoi un thunk ?"
> Un thunk est une action asynchrone (qui prend du temps) dans Redux. Par exemple, `fetchPlaces` fait une requête HTTP → attend la réponse → met à jour le state. Redux Toolkit gère automatiquement les 3 états : pending (en cours), fulfilled (succès), rejected (erreur).

### "C'est quoi un reducer ?"
> Un reducer est une fonction pure qui reçoit l'état actuel et une action, et retourne le nouvel état. Exemple : quand `fetchPlaces.fulfilled` est dispatché, le reducer place les données dans `state.items`.

### "C'est quoi une SPA ?"
> Single Page Application : l'application ne recharge jamais la page complète. Quand on navigue, seul le contenu change (React Router remplace le composant dans le `<Outlet />`). L'expérience est plus fluide.

### "Comment les routes sont protégées ?"
> Le composant `PrivateRoute` vérifie `state.auth.isAuthenticated` dans le store Redux. S'il est `false`, il redirige vers `/admin/login`. C'est un "garde" placé devant les routes admin.

### "Comment on persiste la session ?"
> Le token JWT et les infos utilisateur sont stockés dans `localStorage` au login. Au rechargement, `authSlice` lit `localStorage` et restaure l'état. Quand l'admin se déconnecte, `logout` efface `localStorage`.

### "Pourquoi deux instances Axios (localApi et authApi) ?"
> `localApi` pointe vers json-server (localhost:3001) pour les données (lieux, abonnés). `authApi` pointe vers DummyJSON (dummyjson.com) pour l'authentification. L'intercepteur n'est que sur `localApi` (le token n'est pas nécessaire pour DummyJSON après login).

### "C'est quoi la validation Yup ?"
> Yup est une bibliothèque qui définit des règles de validation sous forme de schéma. Par exemple : `yup.string().email('Format invalide').required('Obligatoire')`. On le connecte à React Hook Form via `yupResolver` pour que la validation se fasse automatiquement à la soumission.

### "Comment le filtrage fonctionne ?"
> Toutes les données sont chargées une fois depuis json-server et stockées dans Redux. Le filtrage (par catégorie, par recherche, actif/inactif) se fait en **JavaScript côté client** avec `.filter()`. Ce n'est pas le serveur qui filtre.

### "C'est quoi Tailwind ?"
> Un framework CSS utilitaire. Au lieu d'écrire du CSS dans un fichier séparé, on met des classes comme `p-4` (padding), `text-red-500` (couleur rouge), `flex` (flexbox) directement dans le JSX. Ça accélère le développement.

### "Comment le responsive est géré ?"
> Avec les préfixes Tailwind : `sm:` (≥640px), `md:` (≥768px), `lg:` (≥1024px). Exemple : `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3` affiche 1 colonne sur mobile, 2 sur tablette, 3 sur desktop.

### "C'est quoi `as const` dans TypeScript ?"
> Ça rend un tableau ou objet en **lecture seule** et transforme les valeurs en types littéraux. `['Plages', 'Restaurants'] as const` → le type est `readonly ['Plages', 'Restaurants']`, pas juste `string[]`. Ça permet d'extraire `'Plages' | 'Restaurants'` comme type.

### "C'est quoi `<Outlet />` ?"
> C'est un composant de React Router qui marque l'endroit où le contenu de la route enfant sera affiché. Le layout (header + footer) reste fixe, et React Router injecte la page qui correspond à l'URL dans le `<Outlet />`.

### "C'est quoi le Provider Redux ?"
> `<Provider store={store}>` est un composant qui rend le store Redux accessible à tous les composants enfants. Sans lui, `useAppSelector` et `useAppDispatch` ne fonctionneraient pas.

### "C'est quoi `.unwrap()` ?"
> Quand on fait `dispatch(thunk()).unwrap()`, ça transforme le résultat Redux en Promise classique. Si le thunk réussit → résolu. Si le thunk est `rejected` → lance une erreur qu'on peut `catch`. C'est plus simple pour gérer succès/erreur dans le composant.
