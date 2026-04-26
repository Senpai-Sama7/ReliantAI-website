# Reliant AI Website

Marketing SPA for Reliant AI — built with React 19, TypeScript, Vite, Tailwind CSS, GSAP animations, and Three.js 3D.

## Quick Start

```bash
npm install
cp .env.example .env.local   # add your Web3Forms key
npm run dev
```

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_WEB3FORMS_KEY` | Yes | Web3Forms API key for contact/audit forms. Get one at [web3forms.com](https://web3forms.com). |

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Type-check + production build |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build locally |

## Stack

- **Framework**: React 19 + TypeScript (strict mode)
- **Build**: Vite 7 with manual chunk splitting (react, three, gsap, ui vendors)
- **Styling**: Tailwind CSS + Shadcn/ui components
- **Animations**: GSAP + ScrollTrigger, Three.js via React Three Fiber
- **Forms**: React Hook Form + Zod validation → Web3Forms
- **Deployment**: Vercel (SPA rewrites + security headers configured)

## Project Structure

```
src/
├── components/   # Reusable UI components (Navigation, popups, 3D, etc.)
├── sections/     # Page sections composed in App.tsx
├── hooks/        # Custom hooks (useTheme, useScrollReveal, usePopupTrigger)
├── lib/          # Shared utilities (web3forms.ts)
├── data/         # Static data (case study chapters)
└── pages/        # Route pages (Privacy, ToS, 404)
```

## Deployment

The site deploys automatically to Vercel on push to `main`. All security headers (HSTS, CSP, X-Frame-Options, etc.) are configured in `vercel.json`. Add `VITE_WEB3FORMS_KEY` as a Vercel environment variable before deploying.
