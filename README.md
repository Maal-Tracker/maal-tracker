# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Quick test checklist (auth & currency)

1. Install and run the dev server:

```bash
npm install
npm run dev
```

2. Authentication
- Open the app and click `Sign in`.
- Use a Supabase user email/password to sign in (Auth uses `supabase.auth.signInWithPassword`).
- On successful sign-in you are redirected to `/today`. The session persists across navigation and refresh (App uses `supabase.auth.getSession()` and `onAuthStateChange`).

3. Currency
- Change the currency from the selector at the top-right of the app.
- All displayed amounts (Today, Challenge, Plan, landing preview) will update formatting and symbol without changing stored numeric values.
- The selection is persisted in `localStorage`.

If anything behaves unexpectedly, please share the browser console errors and I will fix them.
