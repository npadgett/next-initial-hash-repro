# Fragment from the first page load doubles or comes back on a dynamic route

App Router, production build. When the page you first load has a `#fragment`, later `next/link` navigations back to that route (same path and query) append their own fragment to the stored one (`/s?q=1#a#a`), or restore the stale one (`/s?q=1#a` for a link to `/s?q=1`).

## Steps

1. `npm install && npm run build && npm start` (serves on http://localhost:3123)
2. Load http://localhost:3123/s?q=1#a as a full page load.
3. Click **Page 2**. The URL becomes `/s?q=1&page=2`, as expected.
4. Click **Page 1, section A** (`next/link` to `/s?q=1#a`). Expected `/s?q=1#a`; actual **`/s?q=1#a#a`**.
5. Click **Page 2**, then **Page 1** (`next/link` to `/s?q=1`, no fragment). Expected `/s?q=1`; actual **`/s?q=1#a`**.

Reproduces on 16.4.6 and 16.5.0-canary.61. A static page (`/` with `#a`/`#b` links) does not reproduce it.

## Failing test

`npm install && npx playwright install chromium && npm test` builds and starts the app, then runs these steps in Chromium ([`tests/initial-hash.spec.js`](tests/initial-hash.spec.js)). The two tests that start from `/s?q=1#a` fail with the URLs above; the control, which starts from `/s?q=1`, passes. With the change below patched into `node_modules`, all three pass.

## Cause

`create-initial-router-state.ts` sets `canonicalUrl` from `location` with its hash (`createHrefFromUrl(location)`, `includeHash` defaults to true) and passes it to `discoverKnownRoute`. A later navigation to that known route builds `route.canonicalUrl + url.hash` (`app-router-state`, `navigateUsingPrefetchedRouteTree`). #93132 made routes discovered by navigation store a hashless canonical URL; the initial route still stores its hash.

The change: pass `createHrefFromUrl(location, false)` to `discoverKnownRoute` in place of `canonicalUrl`, leaving `canonicalUrl` itself as is for the initial history entry.
