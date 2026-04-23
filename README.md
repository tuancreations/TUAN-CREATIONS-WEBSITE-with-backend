# TUAN Creations Frontend (Netlify Ready)

This repository snapshot is frontend-only and can run on Netlify without the backend folder.

## Stack

- React 18 + TypeScript + Vite
- React Router
- Tailwind CSS + custom CSS

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Build production bundle:

```bash
npm run build
```

## Netlify Deployment

- Build command: `npm run build`
- Publish directory: `dist`
- SPA routing: already configured via `netlify.toml` and `public/_redirects`

## Frontend-Only Behavior

- `src/services/api.ts` includes fallback logic.
- If backend APIs are unavailable, the app uses local/mock data for browsing flows.
- Auth and action flows gracefully fall back to local session behavior, so the UI remains usable on Netlify without backend services.

## Main App Areas

- Public site: Home, About, Divisions, Blog/News, Contact
- Platform modules: Dashboard, Academy, Live Session, Marketplace, Media, Collaboration, Innovations
- Auth pages: Member login and Admin login

## Notes

- Optional backend integration can be added later by setting `VITE_API_BASE_URL`.
- This README intentionally excludes backend credentials and server setup.