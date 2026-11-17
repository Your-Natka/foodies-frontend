# 🍲 Foodies — Frontend

> A recipe-sharing web app: discover dishes by category, cuisine and ingredients, save favorites, follow other cooks and publish your own recipes.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2-764ABC?logo=redux&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-7-CA4245?logo=reactrouter&logoColor=white)
![Sass](https://img.shields.io/badge/Sass-SCSS-CC6699?logo=sass&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-1-5A29E4?logo=axios&logoColor=white)

---

## 📑 Table of contents

- [About](#-about)
- [Links](#-links)
- [Tech stack](#-tech-stack)
- [Getting started](#-getting-started)
- [Scripts](#-scripts)
- [Routes](#-routes)
- [Project structure](#-project-structure)
- [State management & API](#-state-management--api)
- [Contributing](#-contributing)
- [Team](#-team)

---

## 📖 About

**Foodies** is a single-page application built with React and Vite that talks to the Foodies REST API.

### Features

- 🏠 **Home page** — hero section, recipe categories and user testimonials slider
- 🔎 **Recipe catalog** — browse recipes by category with filters by **ingredient** and **area (cuisine)**, plus pagination
- 📄 **Recipe details** — ingredients, preparation steps, author info and **popular recipes**
- ❤️ **Favorites** — add / remove recipes from your favorites
- 🔐 **Authentication** — sign up, sign in and logout modals, JWT access token + refresh flow, session restore on page load
- 👤 **User profiles** — own recipes, favorites, followers & following tabs, follow / unfollow, avatar upload
- ➕ **Add recipe** — Formik + Yup form with dynamic ingredients list (private route)
- 📱 **Responsive layout** — mobile menu, mobile / tablet / desktop breakpoints, retina-ready AVIF images
- 🛒 **Shopping list** — add a recipe's ingredients in one click, tick off bought items, copy the list as text (stored on the device)
- 👩‍🍳 **Cooking mode** — full-screen step-by-step view with ingredient checklist, keep-screen-awake and step timers
- 🔗 **Share & print** — native share sheet (or copy link) and print-friendly recipe layout
- 📝 **Recipe drafts** — the add-recipe form autosaves and restores after reload
- 📲 **PWA** — installable app, works offline for previously opened pages, update prompt
- 🔔 **Toast notifications** via `react-toastify`

---

## 🔗 Links

| Resource | Link |
| --- | --- |
| 🎨 Figma design | [Foodies mockup](https://www.figma.com/file/tkl7kdnvwtz62rsuwnnq5e/foodies?type=design&node-id=127-2517&mode=design&t=uejayjajevvrig5e-0) |
| 📋 Task board | [Google Sheets](https://docs.google.com/spreadsheets/d/1RQo9l60o5jiArDLVl9Gl7Gjq2kNolByJQ6-ERVR0Q8w/edit#gid=1850255900) |
| ⚙️ Backend API | configured via the `VITE_API_URL` environment variable |

---

## 🛠 Tech stack

| Area | Tools |
| --- | --- |
| UI | [React 19](https://react.dev/) |
| Build tool / dev server | [Vite 8](https://vite.dev/) |
| State management | [Redux Toolkit](https://redux-toolkit.js.org/) + `react-redux` |
| Routing | [React Router 7](https://reactrouter.com/) (lazy-loaded pages) |
| HTTP | [Axios](https://axios-http.com/) with auth interceptors |
| Forms & validation | [Formik](https://formik.org/) + [Yup](https://github.com/jquense/yup) |
| Styling | [Sass](https://sass-lang.com/) (global SCSS + CSS Modules), `modern-normalize` |
| Notifications | [react-toastify](https://fkhadra.github.io/react-toastify/) |
| Linting | [oxlint](https://oxc.rs/docs/guide/usage/linter) |

---

## 🚀 Getting started

### Prerequisites

- **Node.js** 20+ (LTS recommended)
- **npm**
- A running instance of the Foodies backend API

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Your-Natka/foodies-frontend.git
cd foodies-frontend

# 2. Install dependencies
npm install

# 3. Create an .env file in the project root
echo "VITE_API_URL=http://localhost:3000/api" > .env

# 4. Start the dev server
npm run dev
```

The app will be available at **http://localhost:5174** (the port is fixed with `strictPort` in `vite.config.js`).

### Environment variables

| Variable | Description | Example |
| --- | --- | --- |
| `VITE_API_URL` | Base URL of the Foodies REST API | `http://localhost:3000/api` |

> ⚠️ Never commit real `.env` values — `.env` is listed in `.gitignore`.

---

## 📜 Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server with HMR on port `5174` |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Lint the project with oxlint |

---

## 🗺 Routes

Defined in [`src/routes/AppRoutes.jsx`](src/routes/AppRoutes.jsx). All pages are lazy-loaded and rendered inside `SharedLayout` (header + footer).

| Path | Page | Access |
| --- | --- | --- |
| `/` | Home | Public |
| `/recipes` | Recipe catalog | Public |
| `/recipes/:category` | Recipes of a category | Public |
| `/recipe/:id` | Recipe details | Public |
| `/user/:userId` | Public user profile | Public |
| `/user` | Current user profile | 🔒 Private |
| `/recipe/add` | Add a new recipe | 🔒 Private |
| `*` | 404 Not Found | Public |

Private routes are guarded by [`PrivateRoute`](src/routes/PrivateRoute.jsx).

---

## 📁 Project structure

```text
foodies-frontend/
├── docs/
│   └── api/seed-data/        # Sample API data for reference
├── public/
│   └── images/               # Category & hero images (AVIF, @1x/@2x)
├── src/
│   ├── components/
│   │   ├── auth/             # Sign in / sign up / logout modals
│   │   ├── common/           # Container, Section
│   │   ├── footer/           # Footer, logo, social links
│   │   ├── forms/            # Add-recipe form (Formik + Yup)
│   │   ├── header/           # Site header
│   │   ├── home/             # Hero, categories, testimonials
│   │   ├── profile/          # User bar, tabs, recipes, favorites, followers
│   │   ├── recipe-details/   # Recipe info, ingredients, preparation, favorite button
│   │   ├── recipes/          # Recipe cards, list, filters, popular recipes
│   │   ├── shared/           # Modal, pagination, mobile menu, empty state
│   │   └── shared-layout/    # Layout wrapper with <Outlet />
│   ├── hooks/                # useUserProfile, useCurrentUserProfile
│   ├── pages/                # Route-level pages
│   ├── redux/
│   │   ├── slices/           # auth, recipes, ingredients, areas, favorites
│   │   └── store.js
│   ├── routes/               # AppRoutes, PrivateRoute
│   ├── services/
│   │   ├── api.js            # Axios instance + auth interceptors
│   │   └── api/              # Endpoint modules per resource
│   ├── styles/global.scss    # CSS variables & global styles
│   ├── App.jsx
│   └── main.jsx              # Entry: Redux Provider, Router, ToastContainer
├── index.html
└── vite.config.js
```

---

## 🧠 State management & API

### Redux store

The store ([`src/redux/store.js`](src/redux/store.js)) combines the following slices:

| Slice | Responsibility |
| --- | --- |
| `auth` | Current user, access token, auth status |
| `recipes` | Recipe lists, details, filters |
| `ingredients` | Ingredients list for filters & forms |
| `areas` | Cuisines (areas) list |
| `favorites` | User's favorite recipes |

Async logic lives in `*Operations.js` files (thunks) next to each slice.

### Authentication flow

The shared Axios instance in [`src/services/api.js`](src/services/api.js):

1. Sends requests with `withCredentials: true` (refresh token in an HTTP-only cookie).
2. Attaches `Authorization: Bearer <accessToken>` taken from the Redux store.
3. On a `401`, calls `POST /auth/refresh` **once** (concurrent requests share the same refresh promise), saves the new token and retries the original request.
4. If refreshing fails, the credentials are cleared and the user is logged out.

On app start, `restoreSessionThunk` tries to restore the session automatically.

### API endpoints used

| Resource | Endpoints |
| --- | --- |
| Auth | `POST /auth/register`, `POST /auth/login`, `POST /auth/logout`, `POST /auth/refresh` |
| Recipes | `GET /recipes`, `GET /recipes/popular`, `GET /recipes/own`, `GET /recipes/:id`, `POST /recipes`, `DELETE /recipes/:id` |
| Favorites | `GET /recipes/favorites`, `PUT /recipes/:id/favorite`, `DELETE /recipes/:id/favorite` |
| Users | `GET /users/current`, `PATCH /users/current/avatar`, `GET /users/:id`, `GET /users/:id/followers`, `GET /users/following`, `PUT /users/:id/follow`, `DELETE /users/:id/follow` |
| Reference data | `GET /categories`, `GET /areas`, `GET /ingredients`, `GET /testimonials` |

---

## 🤝 Contributing

1. Create a feature branch from `main`: `git checkout -b feature/<short-description>`
2. Keep components grouped by feature, one folder per component with its own `.jsx` + `.scss` / `.module.scss`.
3. Run `npm run lint` and `npm run build` before pushing.
4. Open a Pull Request into `main` and request a review from a teammate.

---

## 👥 Team

Built by the Foodies team as part of a full-stack course project.

See all contributors on the [GitHub contributors page](https://github.com/Your-Natka/foodies-frontend/graphs/contributors).

---

<p align="center">Made with ❤️ and 🍳 by the Foodies team</p>
