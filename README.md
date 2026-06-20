# Go Business — Referral Dashboard

A responsive, authenticated referral management dashboard built with React. Users sign in, view their referral overview and earnings, search/sort/paginate through their referrals, share their referral link or code, and drill into individual referral details.

## Live Demo

- **Live URL:** _add your Vercel URL here after deploying_
- **Test credentials:**
  - Email: `admin@example.com`
  - Password: `admin123`

## Tech Stack

- **React** (Create React App)
- **React Router DOM** — client-side routing and route protection
- **js-cookie** — JWT storage in cookies
- **lucide-react** — icon set used in the Overview section
- Plain CSS (custom design system via CSS variables, no external UI framework)

## Features

- **Authentication** — email/password login against a live API, JWT stored in a cookie, protected routes that redirect unauthenticated users to `/login`
- **Dashboard Overview** — key metrics pulled from the API and rendered with icons
- **Service Summary** — at-a-glance service-level stats
- **Share Referral** — copyable referral link and referral code
- **All Referrals table** — server-side search and sort, client-side pagination (10 rows/page)
- **Referral Detail page** — full info for a single referral, with graceful "not found" handling
- **404 page** — reachable with or without authentication
- **Accessible markup** — proper label associations, `aria-label`/`aria-current` usage, `role="alert"` on error states

## Project Structure

```
src/
  api/             # fetch wrappers for auth + referrals endpoints
  context/         # AuthContext (login/logout state)
  components/      # ProtectedRoute, Navbar, Footer
  pages/           # Login, Dashboard, ReferralDetail, NotFound
  utils/           # date/currency formatting helpers
  App.js           # route definitions
  index.js         # app entry point
  index.css        # global stylesheet
```

## Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

```bash
git clone <this-repo-url>
cd <project-folder>
npm install
```

### Running locally

```bash
npm run dev
```

The app runs at `http://localhost:5173`.

### Build for production

```bash
npm run build
```

## API

This app consumes a hosted mock API (no backend included in this repo):

- **Auth:** `POST https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/auth/signin`
- **Referrals:** `GET https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/referrals`
  - Supports `?search=`, `?q=`, `?sort=asc|desc`, and `?id=` query params
  - Requires `Authorization: Bearer <jwt_token>` header (token obtained from the auth endpoint)

## Notes on Implementation Decisions

- **Search debouncing:** the search input updates instantly for responsiveness, but the underlying API call is debounced by 400ms to avoid firing a request on every keystroke.
- **Pagination is entirely client-side**, since the API returns the full filtered/sorted result set rather than paginating itself.
- **Date formatting** converts the API's `YYYY-MM-DD` to `YYYY/MM/DD` via direct string manipulation rather than `Date` parsing, to avoid timezone-related off-by-one-day bugs.
- **Referral detail fetch** handles two possible response shapes from the API — a single row object directly under `data`, or a `referrals` array containing the matching row — since the API can return either depending on the query.

## Deployment

Deployed on Vercel. To deploy your own copy:

```bash
npm install -g vercel
vercel
```

Or connect the GitHub repo directly at [vercel.com](https://vercel.com) for automatic deployments on push.