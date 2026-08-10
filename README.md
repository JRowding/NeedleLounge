# The Needle Lounge

A bespoke multi-page website concept for The Needle Lounge and Fletcher Tattoos in Shrewsbury. Built with React, TypeScript and Vinext.

## Local development

Requires Node.js 22.13 or newer.

```bash
npm ci
npm run dev
```

The development site is available at `http://localhost:3000`.

## Production

```bash
npm ci
npm run build
npm start
```

The production server binds to `0.0.0.0` and uses the `PORT` environment variable automatically.

## Render deployment

The included `render.yaml` defines a Render Web Service. In Render:

1. Choose **New → Blueprint**.
2. Connect this GitHub repository.
3. Confirm the `needle-lounge` service.
4. Deploy.

Render will install dependencies, build the site and run the production server. `RENDER_EXTERNAL_URL` is used automatically for social-sharing metadata.

The current site is suitable for a Web Service and leaves room for future server-side booking integrations. If the finished site remains entirely static, it could later be converted to a Static Site, but a Web Service avoids another migration when dynamic features are introduced.

## Fletcher Tattoos feature boundary

The Fletcher Tattoos experience is mounted at `/tattoo` and kept behind a dedicated route component:

- `app/tattoo/page.tsx` owns route metadata and the route entry point.
- `app/tattoo/TattooExperience.tsx` contains the complete Fletcher page and first-visit loader.
- Fletcher-specific selectors are prefixed with `fx-` in `app/globals.css`, which keeps them isolated from the Needle Lounge landing page.
- `public/fletcher/` contains the Fletcher-only gallery and loader media. The shared official logo remains at `public/fletcher-tattoos-logo.png` because the Needle Lounge landing page also uses it.
- `app/landing/LandingExperience.tsx` contains the single `/tattoo` entry link from the main landing page.

To extract Fletcher Tattoos into a standalone site later, move the `app/tattoo/` route, the `fx-` stylesheet blocks, `public/fletcher/`, and the shared logo asset. Replace the route-level links back to `/` with the standalone site’s desired home URL.
