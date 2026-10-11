---
'@astrojs/vercel': patch
---

Fix an issue where build-time dependencies (`rolldown` and `@vercel/routing-utils`) were leaked into the serverless function runtime entrypoint via shared constants in `index.ts`.
