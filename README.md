# Foodies Frontend

> A recipe-sharing web app: discover dishes by category, cuisine and ingredients, save favorites, follow other cooks, publish your own recipes and cook them step by step.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2-764ABC?logo=redux&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-7-CA4245?logo=reactrouter&logoColor=white)
![Sass](https://img.shields.io/badge/Sass-SCSS-CC6699?logo=sass&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-1-5A29E4?logo=axios&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-Workbox-5A0FC8?logo=pwa&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?logo=vercel&logoColor=white)

**Live demo:** https://foodies-frontend-jade.vercel.app

---

## Table of contents

- [About](#-about)
- [Links](#-links)
- [Tech stack](#-tech-stack)
- [Getting started](#-getting-started)
- [Scripts](#-scripts)
- [Routes](#-routes)
- [Project structure](#-project-structure)
- [State management & API](#-state-management--api)
- [Offline & PWA](#-offline--pwa)
- [Team](#-team)

---

## About

**Foodies** is a single-page application built with React and Vite. It talks to the [Foodies REST API](https://github.com/Your-Natka/foodies-backend).

### Features

- 🏠 **Home page**: hero section, recipe categories and a testimonials slider
- 🔎 **Recipe catalog**: browse by category, filter by **ingredient** and **area (cuisine)**, server-side pagination
- 📄 **Recipe details**: ingredients, preparation steps, author info and **popular recipes**
- ❤️ **Favorites**: add and remove recipes from your favorites
- 🔐 **Authentication**: sign up, sign in and logout modals, JWT access token with silent refresh, session restore on page load
- 👤 **User profiles**: own recipes, favorites, followers and following tabs, follow / unfollow, avatar upload
- ➕ **Add & edit recipes**: Formik + Yup form with photo upload and a dynamic ingredients list; owners can also delete recipes
- 📝 **Recipe drafts**: the recipe form autosaves and is restored after a reload
- 🛒 **Shopping list**: add a recipe's ingredients in one click, tick off bought items, copy the list as text; works for guests too
- 👩‍🍳 **Cooking mode**: full-screen step-by-step view with an ingredient checklist, step timers and keep-screen-awake
- 🔗 **Share & print**: native share sheet (falls back to copying the link) and a print-friendly layout
- 📲 **PWA**: installable, works offline for previously opened pages, asks before updating
- 📱 **Responsive layout**: mobile menu, mobile / tablet / desktop breakpoints, retina-ready AVIF images
- 🔔 **Toast notifications** via `react-toastify`

---

## 🔗 Links

| Resource | Link |
| --- | --- |
| 🌐 Live demo | [foodies-frontend-jade.vercel.app](https://foodies-frontend-jade.vercel.app) |
| ⚙️ Backend repository | [Your-Natka/foodies-backend](https://github.com/Your-Natka/foodies-backend) |
| 🎨 Figma design | [Foodies mockup](https://www.figma.com/file/tkl7kdnvwtz62rsuwnnq5e/foodies?type=design&node-id=127-2517&mode=design&t=uejayjajevvrig5e-0) |
| 📋 Task board | [Google Sheets](https://docs.google.com/spreadsheets/d/1RQo9l60o5jiArDLVl9Gl7Gjq2kNolByJQ6-ERVR0Q8w/edit#gid=1850255900) |

---

## Tech stack

| Area | Tools |
| --- | --- |
| UI | [React 19](https://react.dev/) |
| Build tool / dev server | [Vite 8](https://vite.dev/) |
| State management | [Redux Toolkit](https://redux-toolkit.js.org/) + `react-redux` |
| Routing | [React Router 7](https://reactrouter.com/) (lazy-loaded pages) |
| HTTP | [Axios](https://axios-http.com/) with auth interceptors and token refresh |
| Forms & validation | [Formik](https://formik.org/) + [Yup](https://github.com/jquense/yup) |
| Styling | [Sass](https://sass-lang.com/) (global SCSS + CSS Modules), `modern-normalize` |
| PWA / offline | [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) (Workbox) |
| Notifications | [react-toastify](https://fkhadra.github.io/react-toastify/) |
| Linting | [oxlint](https://oxc.rs/docs/guide/usage/linter) |
| Hosting | [Vercel](https://vercel.com/) |

---

## Getting started

### Prerequisites

- **Node.js** 20+ (LTS recommended)
- **npm**
- A running instance of the [Foodies backend](https://github.com/Your-Natka/foodies-backend)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Your-Natka/foodies-frontend.git
cd foodies-frontend

# 2. Install dependencies
npm install

# 3. Create the .env file from the template
cp .env.template .env

# 4. Start the dev server
npm run dev
```

The app runs at **http://localhost:5174**. The port is pinned (`strictPort`) for both `dev` and `preview` so it matches the backend's CORS allow-list. If requests are blocked by CORS, add this origin to `ALLOWED_ORIGINS` on the backend.

### Environment variables

| Variable | Description | Example |
| --- | --- | --- |
| `VITE_API_URL` | Base URL of the Foodies REST API. Also read at build time to set up the service worker's API cache. | `http://localhost:3000` |

---

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server with HMR on port `5174` |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally (port `5174`) |
| `npm run lint` | Lint the project with oxlint |

---

## Routes

Defined in [`src/routes/AppRoutes.jsx`](src/routes/AppRoutes.jsx). All pages are lazy-loaded and rendered inside `SharedLayout` (header + footer).

| Path | Page | Access |
| --- | --- | --- |
| `/` | Home | Public |
| `/recipes` | Recipe catalog | Public |
| `/recipes/:category` | Recipes of a category | Public |
| `/recipe/:id` | Recipe details | Public |
| `/shopping-list` | Shopping list | Public |
| `/user` | Current user profile | 🔒 Private |
| `/user/:userId` | User profile | 🔒 Private |
| `/recipe/add` | Add a new recipe | 🔒 Private |
| `/recipe/:recipeId/edit` | Edit a recipe | 🔒 Private |
| `*` | 404 Not Found | Public |

Private routes are guarded by [`PrivateRoute`](src/routes/PrivateRoute.jsx). It waits until the session check has finished, so reloading a private page doesn't kick a logged-in user back to the home page.

---

## Project structure

```text
foodies-frontend/
├── docs/
│   └── api/seed-data/          # Sample API data for reference
├── public/
│   ├── images/                 # Category, hero and shopping-list images (AVIF, @1x/@2x)
│   └── *.png, *.svg            # Favicons and PWA icons
├── src/
│   ├── components/
│   │   ├── auth/               # Sign in / sign up / logout modals
│   │   ├── common/             # Container, Section
│   │   ├── fallback-img/       # Image with a fallback for broken URLs
│   │   ├── footer/             # Footer, logo, social links
│   │   ├── forms/recipe-form/  # Add / edit recipe form, Yup schema, draft autosave
│   │   ├── header/             # Site header
│   │   ├── home/               # Hero, categories, testimonials
│   │   ├── loader/             # Page-level spinner
│   │   ├── profile/            # User card, tabs, recipes, favorites, followers
│   │   ├── pwa/                # Install button, update / offline status
│   │   ├── recipe-details/     # Recipe info, ingredients, preparation, cooking mode, share & print
│   │   ├── recipes/            # Recipe cards, list, filters, popular recipes
│   │   ├── scroll/             # Scroll-to-top button
│   │   ├── shared/             # Modal, pagination, mobile menu, empty / error states
│   │   └── shared-layout/      # Layout wrapper with <Outlet />
│   ├── constants/              # Shared constants and section headings
│   ├── hooks/                  # useUserProfile, useCurrentUserProfile, useInstallApp
│   ├── pages/                  # Route-level pages
│   ├── pwa/                    # beforeinstallprompt handling
│   ├── redux/
│   │   ├── slices/             # auth, recipes, ingredients, areas, favorites, shoppingList
│   │   ├── sessionActions.js   # resetSession: clears the store on logout
│   │   └── store.js
│   ├── routes/                 # AppRoutes, PrivateRoute
│   ├── services/
│   │   ├── api.js              # Axios instance, interceptors, token refresh
│   │   ├── api/                # Endpoint modules per resource
│   │   └── authStorage.js      # "Has session" flag in localStorage
│   ├── styles/global.scss      # CSS variables & global styles
│   ├── utils/                  # localStorage helpers, instruction parsing
│   ├── App.jsx
│   └── main.jsx                # Entry: Redux Provider, Router, ToastContainer
├── index.html
└── vite.config.js              # Vite, dev server and PWA / Workbox config
```

---

## State management & API

### Redux store

The store ([`src/redux/store.js`](src/redux/store.js)) combines the following slices:

| Slice | Responsibility |
| --- | --- |
| `auth` | Current user, access token, auth and session-check status |
| `recipes` | Recipe lists, details, filters, pagination |
| `ingredients` | Ingredients list for filters & forms |
| `areas` | Cuisines (areas) list |
| `favorites` | User's favorite recipes |
| `shoppingList` | Shopping list items, persisted to `localStorage` |

Async logic lives in `*Operations.js` files (thunks) next to each slice. On logout, a `resetSession` action resets the whole store.

### Authentication flow

The backend returns a short-lived JWT access token in the response body and keeps the refresh token in an HTTP-only cookie. The access token is held in memory only. A `localStorage` flag remembers that a session may exist, so guests don't trigger a refresh request on page load.

The shared Axios instance in [`src/services/api.js`](src/services/api.js):

1. Sends requests with `withCredentials: true` and attaches `Authorization: Bearer <accessToken>`.
2. Refreshes the token **60 s before it expires** (read from the JWT `exp` claim), and checks again when the tab regains focus.
3. On a `401`, calls `POST /auth/refresh` **once** (concurrent requests share the same refresh promise) and retries the original request.
4. Logs the user out only if the refresh itself returns `401`/`403`. Network errors are retried every 30 s, so a flaky connection doesn't end the session.

On app start, `restoreSessionThunk` restores the session and the saved shopping list.

### API endpoints used

| Resource | Endpoints |
| --- | --- |
| Auth | `POST /auth/register`, `POST /auth/login`, `POST /auth/logout`, `POST /auth/refresh` |
| Recipes | `GET /recipes`, `GET /recipes/popular`, `GET /recipes/own`, `GET /recipes/:id`, `POST /recipes`, `PATCH /recipes/:id`, `DELETE /recipes/:id` |
| Favorites | `GET /recipes/favorites`, `PUT /recipes/:id/favorite`, `DELETE /recipes/:id/favorite` |
| Users | `GET /users/current`, `PATCH /users/current/avatar`, `GET /users/:id`, `GET /users/:id/followers`, `GET /users/following`, `PUT /users/:id/follow`, `DELETE /users/:id/follow` |
| Reference data | `GET /categories`, `GET /areas`, `GET /ingredients`, `GET /testimonials` |

Full API documentation (Swagger) lives in the [backend repository](https://github.com/Your-Natka/foodies-backend).

[Swagger](https://foodies-backend-57rm.onrender.com/docs/)

---

## Offline & PWA

Configured in [`vite.config.js`](vite.config.js) with `vite-plugin-pwa`:

| What | Strategy |
| --- | --- |
| App shell (JS, CSS, HTML, icons) | Precached; navigation falls back to `index.html` |
| API `GET` requests (except `/auth/*`) | `NetworkFirst`, 5 s timeout, then the cached response |
| Images | `CacheFirst`, max 60 entries, `purgeOnQuotaError` |
| App updates | `registerType: "prompt"`: the user confirms before a new version loads |

Only `200` responses are cached. Opaque cross-origin images are skipped on purpose: Chrome counts each one as several MB against the storage quota.

---

## Team

Built by the Foodies team as part of a full-stack course project.

---

<p align="center">Made with ❤️ and 🍳 by the Foodies team</p>
