# Query Management (v0)

Minimal Next.js + TypeScript app for query management.

## Quick overview
- Next.js app using the App Router.
- Key entry: [`RootLayout`](app/layout.tsx) and exported [`metadata`](app/layout.tsx).  
  - Open: [app/layout.tsx](app/layout.tsx)
- Project config: [next.config.mjs](next.config.mjs)  
  - Open: [next.config.mjs](next.config.mjs)
- Type helpers: [next-env.d.ts](next-env.d.ts)  
  - Open: [next-env.d.ts](next-env.d.ts)

## Project structure (selected)
- [app/](app/) — Next App Router pages and globals
- [components/](components/) — UI components
- [lib/](lib/) — utilities, mock data, DB helpers
- [public/](public/) — static assets
- [styles/](styles/) — CSS files
- [package.json](package.json) — dependencies and scripts
- [pnpm-lock.yaml](pnpm-lock.yaml) — lockfile (pnpm preferred)

## Prerequisites
- Node.js (latest LTS recommended)
- pnpm (recommended because this repo contains [pnpm-lock.yaml](pnpm-lock.yaml)). Install pnpm if missing:
```sh
npm i -g pnpm
```

## Setup (recommended)
1. From the repo root:
```sh
# remove any broken installs first (optional)
rm -rf node_modules package-lock.json
# install with pnpm (preferred)
pnpm install
```
2. Run the dev server:
```sh
pnpm dev
# or fallback:
npm run dev
```

## Common install error and fix
If you see an ERESOLVE peer dependency error (e.g. `vaul` requires React ^16.8 || ^17 || ^18 but React 19 is installed), fix by using a React version compatible with `vaul` (recommended: 18.2.0). Edit [package.json](package.json) to set:
- `react`: `^18.2.0`
- `react-dom`: `^18.2.0`

Then reinstall:
```sh
pnpm install
```

If you cannot change React, as a last resort use:
```sh
npm install --legacy-peer-deps
```
(accepts potentially broken dependency resolutions).

## Useful files
- Root layout and metadata: [`RootLayout`](app/layout.tsx) — [app/layout.tsx](app/layout.tsx)  
- Next config: [next.config.mjs](next.config.mjs)  
- Type helpers: [next-env.d.ts](next-env.d.ts)  
- Package manifest: [package.json](package.json)  
- Lockfile: [pnpm-lock.yaml](pnpm-lock.yaml)

## Notes
- The app uses Next's app router; global styles live in [app/globals.css](app/globals.css).
- The project currently ignores TypeScript build errors via [next.config.mjs](next.config.mjs).
