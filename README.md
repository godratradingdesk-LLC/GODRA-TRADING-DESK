# Godra Trading Desk — React + Vite

The GTD site, converted from a single 752 KB `index.html` into a React (JavaScript) app built with Vite.

Built on React 18, Vite 8, and React Router 7. `npm audit` reports zero vulnerabilities.

## Running it

```bash
npm install
```

```bash
npm run dev
```

Then `npm run build` for a production bundle in `dist/`, and `npm run preview` to serve that build locally.

## Configuration

Supabase settings live in `.env` (already created from `.env.example` with the values that were hard-coded in the original page):

| Variable | Purpose |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Publishable key — safe in a browser bundle |
| `VITE_ENTITLEMENTS_URL` | Edge function that emails download links |
| `VITE_REGISTER_URL` | Edge function for register / resend / reset |

`.env` is gitignored. Only `VITE_`-prefixed variables reach the browser; never put a `service_role` key here.

## Layout

```
src/
  main.jsx              React root + BrowserRouter
  App.jsx               Providers, routes, global overlays
  styles/global.css     The original stylesheet, unchanged
  assets/               The four images, extracted from base64
  lib/
    supabase.js         Client + edge-function URLs
    products.js         Product catalogue and promo codes
    validation.js       Email/name/phone/password rules
  context/
    AuthContext.jsx     Session, entitlements, two-step sign-in, idle timeout
    CartContext.jsx     Cart items, promo codes, totals, Stripe hand-off
    AdminContext.jsx    Admin identity (separate from member auth)
    AnnouncementsContext.jsx
  components/           Navs, modals, PIN input, banners, icons
  pages/                One file per screen, admin screens under pages/admin/
```

## Routes

| Path | Screen |
| --- | --- |
| `/` | Main site |
| `/login`, `/register`, `/pin` | Member sign-in flow |
| `/reset-password` | Where the emailed reset link lands |
| `/portal`, `/profile`, `/library`, `/cart` | Members area (sign-in required) |
| `/terms`, `/privacy`, `/book-call` | Public pages |
| `/admin`, `/admin/pin`, `/admin/set-pin`, `/admin/dashboard` | Admin |

## What changed in the conversion

- **Real URLs.** The old `showPage('pg-portal')` system became React Router, so every screen is linkable, bookmarkable, and has working back/forward.
- **Supabase from npm.** The ~200 KB minified client that was pasted inline is now the `@supabase/supabase-js` dependency, so it updates with `npm update` and is code-split by Vite.
- **Images are files.** The four base64 blobs (GTD logo, favicon, NinjaTrader, Kinetick) are real PNGs in `src/assets/`, so the browser caches them instead of re-parsing ~55 KB of base64 on every load.
- **The `esc()` helper is gone.** It existed to escape member-supplied text before `innerHTML`. React escapes everything it renders, so the whole class of bug it guarded against cannot occur.
- **State instead of DOM writes.** Cart totals, the library grid, PIN boxes and admin tables render from state rather than string-built `innerHTML`.
- **Config, not constants.** Supabase URLs and keys moved to `.env`.

The stylesheet, all copy, the auth and PIN flows, entitlement checks, promo handling, and the Stripe hand-off behave as they did before. Every server call (`get_my_profile`, `verify_my_pin`, `set_my_pin`, `am_i_admin`, `verify_admin_pin`, `request_call`, the announcement and admin RPCs, and both edge functions) is unchanged, so no backend work is needed.

## Deploying

The build is a static SPA, so the host must rewrite unknown paths to `index.html` or deep links will 404. Configs for two common hosts are included: `vercel.json` and `public/_redirects` (Netlify).

`vercel.json` also sends `frame-ancestors`/`X-Frame-Options` as real HTTP headers. That directive is ignored in a `<meta>` tag by design, so clickjacking protection only takes effect once it is sent by the host — on other platforms, set the equivalent headers there.
