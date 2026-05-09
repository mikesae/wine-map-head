# AGENTS.md

## Project overview

This repository is a React 19 + TypeScript application built with Vite and the React SWC plugin.

Primary technologies in this repo:

- Azure Maps Web SDK via `azure-maps-control`
- Zustand for application and map state
- Tailwind CSS for styling
- Lucide React for icons
- `react-search-autocomplete` for search UI
- `eventemitter3` for event-driven communication where already established
- Vite PWA support via `vite-plugin-pwa`

Primary goal: make small, correct, repo-consistent changes without introducing broad refactors, unnecessary dependencies, or the wrong mapping SDK.

---

## Stack

### Runtime dependencies
- `react`
- `react-dom`
- `azure-maps-control`
- `zustand`
- `lucide-react`
- `react-search-autocomplete`
- `eventemitter3`

### Dev/build dependencies
- `vite`
- `@vitejs/plugin-react-swc`
- `typescript`
- `tailwindcss`
- `@tailwindcss/vite`
- `postcss`
- `autoprefixer`
- `vite-plugin-pwa`
- `eslint`
- `typescript-eslint`
- `eslint-plugin-react-hooks`
- `eslint-plugin-react-refresh`
- `eslint-plugin-zustand`

---

## Important project locations

Inspect these files first before proposing changes:

- `src/components/AzureMap.tsx` — main Azure Maps composition/orchestration
- `src/components/events.ts` — map event registration and interaction behavior
- `src/data-processing/add-functions.ts` — map sources, layers, labels, and sprite/image setup
- `src/hooks/useMapStore.ts` — Zustand state
- `src/components/SearchBar.tsx` — search/autocomplete UI
- `src/components/MapLegend.tsx` — legend UI
- `src/components/MapSettings.tsx` — settings UI
- `src/types/mapping.ts` — shared map/domain types
- `src/types/legendColors.ts` — legend/color definitions
- `public/icons/*` — map sprite/icon assets
- `public/service-worker.js` and `manifest.json` — PWA-related assets
- `vite.config.ts` — Vite config
- `tailwind.config.js` — Tailwind config
- `eslint.config.js` — lint rules

---

## Core working rules

- Prefer the smallest possible change that solves the task.
- Match existing repository patterns before introducing new abstractions.
- Preserve current architecture unless explicitly asked to refactor.
- Do not add new dependencies unless clearly necessary.
- Keep TypeScript types strong and specific.
- Do not use `any` to suppress errors unless unavoidable and justified.
- Respect existing lint and build constraints.
- After code changes, run or recommend the smallest relevant validation step.

---

## Map-specific rules

This repo uses **Azure Maps Web SDK** only.

For anything involving maps, layers, shapes, sources, labels, sprites, bounds, markers, events, patterns, or viewport behavior:

- Use `azure-maps-control`
- Reuse existing patterns from:
  - `src/components/AzureMap.tsx`
  - `src/components/events.ts`
  - `src/data-processing/add-functions.ts`
- Preserve Azure Maps terminology and APIs
- Prefer local helpers/utilities over introducing new map abstractions

### Never do these things

- Do not use Mapbox examples
- Do not use Leaflet examples
- Do not use Google Maps examples
- Do not rewrite Azure Maps code into another mapping abstraction unless explicitly requested
- Do not replace Azure Maps expressions with generic JS styling logic unless there is a strong reason

### Azure Maps guidance for this repo

When working on layers, sources, or labels:

- Check `src/data-processing/add-functions.ts` first
- Preserve existing use of:
  - `atlas.Map`
  - `atlas.source.DataSource`
  - `atlas.data.Feature`
  - `atlas.data.Point`
  - `atlas.data.MultiPolygon`
  - `atlas.layer.SymbolLayer`
  - `atlas.layer.PolygonLayer`
  - `atlas.layer.LineLayer`
  - `map.imageSprite.createFromTemplate`
  - `map.imageSprite.add`

When working on interaction behavior:

- Check `src/components/events.ts` first
- Reuse existing click, hover, popup, and selection patterns
- Avoid duplicate event listeners
- Clean up listeners correctly

When working on map composition:

- Check `src/components/AzureMap.tsx` first
- Avoid reinitializing the map unnecessarily
- Be careful with effect dependencies that may recreate map state or rebind events

### Data and geometry rules

- Preserve existing feature property names such as:
  - `varietal`
  - `main_varietal`
  - `aoc_level`
  - `mixed_varietal`
  - `label`
  - `sortKey`
  - `latitude`
  - `longitude`
  - `name`
- Preserve coordinate ordering
- Be careful with Polygon vs MultiPolygon handling
- Preserve expression-based styling and current color mappings
- Preserve sprite/image names and `public/icons/*` asset paths
- Do not simplify map behavior unless explicitly requested

---

## React and TypeScript rules

- Use functional React patterns consistent with the repo
- Preserve public component props unless the task requires changing them
- Avoid unnecessary rerenders
- Be careful with `useEffect` dependencies, especially around map lifecycle and event wiring
- Prefer explicit typings and narrowing over weak shortcuts
- Do not weaken types merely to make compilation pass
- Prefer patterns compatible with React 19 and the current SWC/Vite setup

---

## Zustand rules

This repo uses Zustand and includes `eslint-plugin-zustand`.

- Reuse the existing store in `src/hooks/useMapStore.ts`
- Follow existing store shape, action, and selector patterns
- Do not introduce Redux, MobX, or alternate state systems
- Prefer selectors where appropriate to reduce rerenders
- Avoid duplicating store state in component state unless there is a clear local-only reason
- Keep map state and UI state aligned with the existing architecture
- Respect lint-friendly Zustand patterns

Before adding local component state, check whether that state already belongs in the store.

---

## Event emitter rules

This repo includes `eventemitter3`.

- Reuse existing event-driven patterns only where they are already established
- Do not introduce ad hoc event buses if the same problem is already handled by props, Zustand, or existing utilities
- If modifying emitter-driven flows, preserve event names, payload shapes, and subscription/cleanup symmetry

---

## Tailwind rules

Tailwind CSS is a primary styling approach in this repo.

- Prefer Tailwind utilities over adding new custom CSS when the same result can be expressed cleanly with Tailwind
- Match nearby class usage and layout patterns
- Reuse existing spacing, breakpoint, and state conventions
- Keep class lists readable
- Avoid introducing a different styling system unless explicitly requested

If a file is already using CSS instead of Tailwind, match the local pattern rather than forcing a rewrite.

---

## Icons and search

### Lucide React
- Prefer `lucide-react` for icons
- Match existing icon sizing and usage patterns
- Do not add another icon library unless explicitly requested

### Search/autocomplete
- Reuse existing `react-search-autocomplete` patterns if present
- Preserve current item shape, filtering behavior, and selection flow unless the task is specifically about changing search UX
- Do not replace the search library unless explicitly requested

---

## PWA and service worker rules

This repo includes `vite-plugin-pwa` and also has PWA-related public assets.

When working on app shell, caching, manifest, or offline behavior:

- Inspect:
  - `vite.config.ts`
  - `public/service-worker.js`
  - `manifest.json`
  - `public/staticwebapp.config.json`
- Preserve the current PWA strategy unless explicitly asked to change it
- Do not introduce conflicting service worker behavior
- Be careful with caching changes that may break deployment/update expectations

---

## Vite/build rules

- Keep changes compatible with the existing Vite setup
- Respect `@vitejs/plugin-react-swc`
- Prefer ESM-friendly imports and patterns
- Do not introduce unnecessary build complexity
- Respect the current project structure
- Do not move files or rename symbols broadly unless necessary

---

## Linting and quality rules

This repo uses ESLint plus TypeScript/React/Zustand plugins.

- Follow existing lint rules from `eslint.config.js`
- Do not silence lint rules unless there is a good reason
- Do not add ignore comments when a straightforward fix is available
- Prefer changes that satisfy lint, type, and build checks cleanly

---

## Validation expectations

After making changes, run or recommend the smallest relevant validation step.

Typical validation targets for this repo:

- `yarn build`
- `yarn lint`

Use `yarn dev` only when interactive/manual verification is needed.

If you could not validate, say so clearly.

---

## How to approach tasks in this repo

1. Inspect the nearest existing implementation first.
2. Reuse local helpers, hooks, stores, types, and components where possible.
3. Make the smallest safe edit.
4. Preserve Azure Maps-specific behavior, Zustand patterns, and Tailwind conventions.
5. Explain assumptions briefly if something is ambiguous.

---

## Bad defaults to avoid

- Do not hallucinate Azure Maps APIs
- Do not import patterns from the wrong mapping SDK
- Do not broadly refactor working code for style reasons alone
- Do not replace data-driven map styling with simplistic hardcoded branches without reason
- Do not introduce new dependencies casually
- Do not replace Zustand or Tailwind with something else
- Do not break PWA/service-worker behavior accidentally
- Do not introduce event-emitter patterns where a simpler existing pattern already exists