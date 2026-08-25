# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this app is

Sendly Portal is the web frontend for **Sendly**, a unified email-sending
service that abstracts over multiple providers (Postmark, SendGrid, Resend,
...). This portal lets users manage templates, layouts, providers, broadcasts,
and inspect email activity/delivery status — it's a management UI, not the
email-sending backend itself. It talks to the Sendly API (`API_URL`) and a
separate identities/auth API (`IDENTIES_API_URL`) via `tessera-ui`.

## Commands

Package manager is **bun** (v1.3.x on Node 24.x — see `.tool-versions`).

```bash
bun install          # install deps
bun run dev           # dev server (server.mjs) at http://localhost:3000
bun run build         # production build (build.mjs)
bun run start         # run production build

bun run lint          # eslint over app/ and lib/
bun run lint:fix
bun run typecheck     # react-router typegen && tsc (no emit)
bun run format        # prettier --write
bun run format:check
bun run check          # format + lint + typecheck, in that order

bun run test           # vitest run (single run)
bun run test:watch     # vitest watch mode
bun run test:coverage  # vitest run --coverage
```

Run a single test file: `bun run test -- path/to/file.test.tsx` (or `bunx vitest run path/to/file.test.tsx`).
Test files live alongside code and match `**/*.{test,spec}.{ts,tsx}` or `**/__tests__/**` (see `vite.config.ts`). There are currently no test files in the repo yet, but the vitest/jsdom/testing-library setup is fully wired (`vitest.setup.ts` mocks `lucide-react` icons and runs RTL `cleanup()` after each test).

**Pre-commit**: `lefthook` runs `eslint --fix` and `prettier --write` on staged `.js/.jsx/.ts/.tsx(/.json)` files automatically (see `lefthook.yml`). Run `bun run prepare` once after cloning to install the git hook.

## Architecture

**Framework**: React Router v7 in framework mode (React 19, Vite, SSR via Express — `server.mjs`). Routes are declared explicitly in [app/routes.ts](app/routes.ts) (not filesystem flat-routes), nesting a `layout()` for private/authenticated routes around each top-level section (`activity`, `broadcasts`, `providers`, `layouts`, `templates`). Each resource with a detail page follows the same three-level pattern: `index.tsx` (list) → `detail/layout.tsx` (wraps detail + tabs) → `detail/index.tsx` + `detail/overview.tsx`.

**Route → Content split**: route files under `app/routes/**` are thin — a `loader` pulls `apiUrl`/`nodeEnv` from `process.env` and params from the URL, the component waits on `useApp()` (`isLoadingIdenties`) showing `AppPreloader`, then renders a `*Content` component from `app/components/**` which holds all real logic/markup. Don't put business logic in route files.

**Resource-based data layer** — every domain resource (`template`, `broadcast`, `layout`, `email-activity`, ...) follows this exact layout:

```
app/resources/queries/<resource>/
  <resource>.type.ts      # payload + entity interfaces
  <resource>.queries.ts   # plain async fns (getX/createX/updateX/deleteX) built on fetchApi
  index.ts                # re-exports
app/resources/hooks/<resource>/
  use-<resource>.ts       # TanStack Query useQuery/useMutation wrappers, query key factory, cache invalidation
```

Every query fn takes an `IQueryConfig` (`{ apiUrl, token, nodeEnv }`, defined in `app/resources/queries/index.ts`) as its first argument. New resources should mirror `app/resources/queries/template/` and `app/resources/hooks/template/use-template.ts` exactly (query key factory shape: `all` → `lists()`/`list(params)` → `details()`/`detail(id)`).

**HTTP client**: `fetchApi(endpoint, token, nodeEnv, options)` in [app/libraries/fetch.ts](app/libraries/fetch.ts) is the single fetch wrapper used by every query fn — it sets the `Authorization: Bearer` header, JSON-decodes responses, and throws `TokenExpiredError` (401) / `UnauthorizedError` (403) / generic `Error` on other 4xx+. In development it also logs an equivalent `curl` command for every request (via `curl-generator`) — useful for reproducing API calls outside the browser.

**Auth/identity**: `tessera-ui` (a separate internal git-dependency package, `git+https://github.com/tesserahq/tessera-ui.git`, source at `node_modules/tessera-ui/src`) provides `TesseraProvider`/`useApp()` (`{ token, user, isLoadingIdenties, applications, ... }`), the `AuthGuard`, main `Layout`, and several shared components (`ResourceID`, `DateTime`, `EmptyContent`, `DeleteConfirmation`, `toast`, `AppPreloader`). Prefer reusing a `tessera-ui` component before writing a new one for common needs (delete confirmation, date formatting, empty states, resource-ID display, toasts). There is currently **no per-project/org scoping** anywhere in the frontend — no project selector, no project_id in resource types — auth is single-tenant per deployed portal instance.

**UI components**: shadcn/ui primitives live under `app/modules/shadcn/ui` and are imported via the `@shadcn/*` alias (e.g. `@shadcn/ui/button`), separate from `tessera-ui`'s shared components. Styling is Tailwind CSS v4.

**Dialogs**: built as `forwardRef` components exposing an imperative handle — `open(config)`, `close()`, `updateConfig(partial)` — rather than parent-controlled `open` state. See `app/components/templates/clone-template-dialog.tsx` as the reference pattern; the parent just holds a `ref` and calls `ref.current?.open({...})`.

**Path aliases** (`tsconfig.json` / `vite.config.ts`): `@/*` → `app/*`, `@shadcn/*` → `app/modules/shadcn/*`.

**i18n**: `i18next` + `remix-i18next`, config/locales under `app/modules/i18n/`.

**React Query config**: centralized in `app/modules/react-query/`.

## Notes

- `docs/new-structure.md` and `docs/README.md` describe the intended architecture/conventions in more narrative form (including a `contacts` resource example that no longer exists in this codebase) — useful for rationale, but for current conventions trust the actual `app/resources/queries/template/` and `app/resources/hooks/template/` files over the docs' code samples.
- Env vars (`.env`, see `.env.example`): `API_URL` (Sendly API), `IDENTIES_API_URL`/`IDENTIES_HOST` (identities API), `AUTH0_*` (Auth0 tenant config), `HOST_URL`, `NODE_ENV`, `SESSION_SECRET`.
