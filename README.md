# Foodies Frontend

Client application for **Foodies**, a recipe-sharing platform. Users can browse recipes by category, cuisine and ingredient, save favorites, follow other cooks, publish and edit their own recipes, and build a shopping list from any recipe.

**Live:** https://foodies-frontend-jade.vercel.app
**API:** [foodies-backend](https://github.com/Your-Natka/foodies-backend)

## Tech stack

- React 19, Vite 8
- Redux Toolkit, React Router 7 (route-level code splitting)
- Axios
- Formik + Yup
- Sass (global styles + CSS Modules), modern-normalize
- vite-plugin-pwa (Workbox)
- oxlint
- Deployed on Vercel

## Features

- Recipe catalog with category, ingredient and area filters and server-side pagination
- Recipe details with ingredients, instructions, author and popular recipes
- Favorites, user profiles, followers / following
- Create, edit and delete recipes, with photo upload
- Form drafts autosave to `localStorage` and survive a reload
- Shopping list built from recipe ingredients, available to guests, with copy-to-clipboard
- Cooking mode: step-by-step view, ingredient checklist, step timers, Screen Wake Lock
- Native share (with clipboard fallback) and a print stylesheet
- Installable PWA with offline support for previously visited pages and an update prompt

## Getting started

Requirements: Node.js 20+ and a running instance of the [backend](https://github.com/Your-Natka/foodies-backend).

```bash
git clone https://github.com/Your-Natka/foodies-frontend.git
cd foodies-frontend
npm install
cp .env.template .env
npm run dev
```

The dev server runs on `http://localhost:5174`. The port is pinned (`strictPort`) for both `dev` and `preview` so it matches the backend's CORS allow-list. Add this origin to `ALLOWED_ORIGINS` on the backend if it isn't there already.

### Environment variables

| Variable       | Description                  | Example                 |
| -------------- | ---------------------------- | ----------------------- |
| `VITE_API_URL` | Base URL of the Foodies API  | `http://localhost:3000` |

`VITE_API_URL` is also read at build time to configure the service worker's API cache. If it is missing, API responses are not cached offline.

### Scripts

| Command           | Description                         |
| ----------------- | ----------------------------------- |
| `npm run dev`     | Start the dev server with HMR       |
| `npm run build`   | Production build to `dist/`         |
| `npm run preview` | Serve the production build locally  |
| `npm run lint`    | Run oxlint                          |

## Routes

All pages are lazy-loaded and rendered inside `SharedLayout`. See [`src/routes/AppRoutes.jsx`](src/routes/AppRoutes.jsx).

| Path                     | Page                  | Access  |
| ------------------------ | --------------------- | ------- |
| `/`                      | Home                  | Public  |
| `/recipes`               | Recipe catalog        | Public  |
| `/recipes/:category`     | Catalog by category   | Public  |
| `/recipe/:id`            | Recipe details        | Public  |
| `/shopping-list`         | Shopping list         | Public  |
| `/user`                  | Current user profile  | Private |
| `/user/:userId`          | User profile          | Private |
| `/recipe/add`            | Add recipe            | Private |
| `/recipe/:recipeId/edit` | Edit recipe           | Private |

Private routes go through [`PrivateRoute`](src/routes/PrivateRoute.jsx). It waits for the session check to finish before deciding, so a page reload on a private route doesn't redirect a logged-in user.

## Architecture

### State

Redux store ([`src/redux/store.js`](src/redux/store.js)) with the slices `auth`, `recipes`, `ingredients`, `areas`, `favorites` and `shoppingList`. Async logic lives in `*Operations.js` thunks next to each slice. A `resetSession` action clears the whole store on logout.

A single store subscription handles side effects that don't belong in reducers: it persists the shopping list to `localStorage` and schedules access-token refreshes when the token changes.

### Authentication

The backend issues a short-lived JWT access token in the response body and a refresh token in an HTTP-only cookie. The access token is kept in memory only. A `localStorage` flag records that a session might exist, so guests don't make a refresh call on page load.

[`src/services/api.js`](src/services/api.js) handles the token lifecycle:

- Attaches the `Authorization` header to every request.
- Refreshes proactively 60 s before the token expires (read from the JWT `exp` claim), and again when the tab regains focus or becomes visible.
- On a `401`, refreshes once and replays the original request. Concurrent requests share one in-flight refresh promise.
- A `401`/`403` from the refresh endpoint logs the user out. Network errors are retried every 30 s instead, so a flaky connection doesn't end the session.

### Offline / PWA

Configured in [`vite.config.js`](vite.config.js):

- The app shell is precached. Navigation falls back to `index.html`.
- API `GET` requests (except `/auth/*`) use `NetworkFirst` with a 5 s timeout, then fall back to cache.
- Images use `CacheFirst`, limited to 60 entries, with `purgeOnQuotaError`. Only `200` responses are cached. Opaque cross-origin responses are excluded because Chrome counts each one as several MB against the storage quota.
- `registerType: "prompt"`: users are asked before a new version replaces the running one.

## Project structure

```text
src/
├── components/     # UI, grouped by feature (auth, home, recipes, recipe-details, profile, forms, shared, pwa)
├── pages/          # Route-level components
├── routes/         # AppRoutes, PrivateRoute
├── redux/          # Store, slices and thunks
├── services/
│   ├── api.js      # Axios instance, interceptors, token refresh
│   └── api/        # One module per API resource
├── hooks/          # Profile data, PWA install
├── utils/          # localStorage helpers, instruction parsing
├── constants/
└── styles/         # Global SCSS and design tokens
```

Each component lives in its own folder with its stylesheet (`*.module.scss`).

## Contributing

1. Branch off `main` (`feature/...` or `fix/...`).
2. Run `npm run lint` and `npm run build` before pushing.
3. Open a pull request into `main` and get a review from a teammate.

## Links

- [Figma design](https://www.figma.com/file/tkl7kdnvwtz62rsuwnnq5e/foodies?type=design&node-id=127-2517&mode=design&t=uejayjajevvrig5e-0)
- [Task board](https://docs.google.com/spreadsheets/d/1RQo9l60o5jiArDLVl9Gl7Gjq2kNolByJQ6-ERVR0Q8w/edit#gid=1850255900)
- [Contributors](https://github.com/Your-Natka/foodies-frontend/graphs/contributors)
