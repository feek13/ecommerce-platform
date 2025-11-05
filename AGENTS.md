# Repository Guidelines

## Project Structure & Module Organization
- The Next.js App Router lives in `app/`; route groups like `(auth)`, `(shop)`, `(seller)`, and `(admin)` split role flows, with `app/api/` hosting server actions.
- Shared UI sits in `components/`, stateful hooks in `hooks/`, and typed utilities in `lib/` and `types/`; keep business logic out of pages.
- `public/` stores assets, while Supabase migrations live in `supabase/migrations/`; use `scripts/add-products.js` or the root SQL helpers to seed data instead of editing tables manually.

## Build, Test, and Development Commands
- `npm install` syncs dependencies; rerun after lockfile changes.
- `npm run dev` serves the app locally; `npm run build && npm run start` mirrors production.
- `npm run lint` applies the Next.js ESLint ruleset—resolve issues or justify them inline.

## Coding Style & Naming Conventions
- Use TypeScript with 2-space indentation, single quotes, and trailing commas; rely on ESLint autofix (`next lint --fix`) when possible.
- Components/hooks follow PascalCase or camelCase, and Next.js segments remain kebab-case with dynamic folders named `[param]`.
- Favor Tailwind utilities inline; add shared tokens or colors in `tailwind.config.ts` rather than scattering literals.
- Centralize Supabase access in `lib/supabase.ts` and reuse `types/database.ts` definitions to avoid schema drift.

## Testing Guidelines
- There is no automated suite yet; run `npm run lint` and smoke-test shopper, seller, and admin paths against Supabase data.
- Add React Testing Library specs as `*.test.tsx` near components or Playwright flows under `tests/`; mock Supabase in unit tests.
- Capture manual verification steps or new CLI commands in the pull request so reviewers can replay them.

## Commit & Pull Request Guidelines
- Follow Conventional Commits (`type(scope): summary`, e.g., `feat(app): add seller stats card`) with summaries under 72 characters.
- Isolate schema or SQL tweaks in their own commits and reference the affected migration or script.
- PRs should summarize intent, link issues, flag required migrations/scripts, and include screenshots or GIFs for UI-facing work; confirm `npm run lint` and relevant build steps before requesting review.

## Supabase & Configuration Notes
- Copy `.env.example` to `.env.local` and populate `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`; never commit populated env files.
- Apply migrations sequentially in Supabase; call out any helper SQL usage (e.g., `fix-admin-role.sql`) in your PR.
- Seed demo data with `scripts/add-products.js` after configuring credentials, and prefer env variables or RLS over hardcoded secrets.
