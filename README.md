# Elsewhere

**Explore the life you didn’t choose.**

Elsewhere is a cinematic, interactive alternate-life simulator: a dark personal observatory where choices become constellations and memories become artifacts. Every story is explicitly fictional, not a prediction or psychological assessment.

## Screenshots

Screenshot placeholders: entry observatory, desktop constellation, mobile vertical timeline, and recovered-memory dialog. Run locally and capture these views after adding any final brand assets. No private stories are included in the repository.

## Features

- Interactive decision input and selectable starting prompts.
- Four-step questionnaire: present life, decision, emotional tone, and divergence.
- Five-year Tokyo photography demo, available without application sign-in.
- Five interactive yearly nodes with desktop zoom/pan, keyboard controls, and a vertical mobile timeline.
- Boarding-pass, message, journal, calendar, and note artifacts with accessible dialogs.
- A turning point with two choices; one persistent additional branch per saved universe. Selecting the other choice replaces that branch. Demo branches are temporary.
- Guest generation with a 24-hour HttpOnly capability cookie. A guest can create one temporary universe per cookie lifetime. Saved records live in D1, not browser storage.
- ChatGPT identity via Sites dispatch-owned sign-in; owner checks on all private operations.
- Saved universes, revocable read-only sharing links, and confirmed deletion.
- Server-side OpenAI provider, validation, moderation, request timeouts, and a clearly labelled local-story fallback when no API key is configured.
- Reduced-motion support, visible focus states, responsive forms, loading/error/empty states.

## User flow and routes

`/` → `/create` → `/universe/[id]` → save → `/profile`.

`/demo` explores the prepared Tokyo universe. Select year three for branching and any recovered memory to open its artifact. Year five reveals the closing reflection.

`/share/[token]` is a read-only route. Sharing is opt-in, and disabling it invalidates the old token. The public URL parameter is a random share capability, never the internal universe ID.

**Private deployment:** Sites owner-only access applies to every route, including the demo and share links. Application-level guest/public behavior is ready for a future public site, but publishing this build privately does not make links accessible to outsiders. Change the site audience separately only when intended.

## Technology

React 19, TypeScript, Vinext, Vite, Cloudflare Workers, Sites D1, Drizzle schema/migrations, Zod, Tailwind and custom CSS, Radix/Shadcn primitives, and Lucide icons. The constellation uses SVG paths and positioned semantic buttons rather than a heavyweight graph library. No raster artwork or stock photography is required.

## Local development

Use Node 24 or newer (the integration tests use built-in `node:sqlite`).

```sh
npm ci
npm run dev
```

The Sites checkout uses its managed execution profile. In Sites, use the provided dependency/build scripts and supervised preview; do not replace the starter configuration. Standalone local work may require configuring the logical D1 binding and applying the generated migrations to your local runtime. The production runtime obtains real resource bindings from Sites.

```sh
npx tsc --noEmit
node scripts/test.mjs
npm run build
npm run db:generate
```

The test script bundles real API handlers with a test-only platform adapter backed by in-memory SQLite. It does **not** add a production auth bypass. It validates 43 checks across schemas, guest access, ownership, saving, branches, sharing/revocation, safety, and deletion. It does not simulate the hosted ChatGPT sign-in redirect itself or make billable OpenAI requests.

## Runtime environment

See `.env.example`. Never commit `.env` or API keys.

| Variable | Purpose |
| --- | --- |
| `OPENAI_API_KEY` | Optional server-side OpenAI secret. Add it through Sites runtime environment settings, never to frontend code. |
| `OPENAI_MODEL` | Optional model override; default `gpt-4.1-mini`. Choose a model supporting JSON-object output. |
| `DB` | Logical Sites D1 resource binding declared in `.openai/hosting.json`; not an API credential. |

Without a key, the provider uses personalized, deterministic templates and labels the universe **LOCAL STORY MODE**. This is a functional simulation, not AI generation. The local provider reflects all questionnaire fields and tone/divergence, but is less open-ended than the OpenAI provider. With a configured key, input and output pass OpenAI moderation. Provider failures are shown as recoverable errors rather than silently switching to templates. The browser keeps only the temporary questionnaire draft in session storage until successful generation.

## Architecture

- `app/page.tsx`, `app/create/page.tsx`: portal and focused creation flow.
- `app/explorer.tsx`: constellation, chapter navigation, memory dialogs, branching, saving/sharing.
- `app/profile/page.tsx`: saved records and deletion confirmation.
- `app/api/**`: request validation, authentication, ownership and state changes.
- `lib/story.ts`: Zod contracts, prepared demo, local generator, branch generator.
- `lib/provider.ts`: server-only generation interface, safety checks and OpenAI requests.
- `lib/server.ts`: prepared D1 queries, capability hashing, response shaping and origin checks.
- `app/chatgpt-auth.ts`: supplied dispatch-owned ChatGPT authentication helpers.
- `db/schema.ts`, `drizzle/**`: production schema and versioned migrations.
- `tests/**`: test-only D1 and identity adapter; never routed or included in client bundles.

## Data model

| Table | Stored data |
| --- | --- |
| `users` | Site-scoped platform user ID, display name, creation time. |
| `universes` | UUID, owner or guest capability hash, private questionnaire JSON, validated story aggregate JSON, provider, saved state, random sharing token, timestamps and temporary expiry. |
| `branches` | Branch ID, parent universe and node, selected choice, validated chapter/artifact JSON, timestamp. Unique universe constraint implements the one-branch MVP. |
| `generation_limits` | Per-identity hourly generation counter. |

Timeline nodes and artifacts are stored within the validated story aggregate, keeping a five-year universe atomic. Branch relationships are separate records. `parentNodeId` and branch records permit later expansion; remove the per-universe uniqueness constraint through a new migration when supporting multiple branches. Queries use prepared statements and an owner/saved index.

Unsaved universes are inaccessible after 24 hours; expiry is enforced on reads. Expired rows and old rate-limit buckets are not automatically physically purged in this MVP; add a scheduled retention job before a broad public launch. Saved deletion removes the universe, its questionnaire/story, branches, and sharing capability. User profile records remain.

## AI contract

`StoryProvider.generate(answers)` returns `{ story, source }`.

The model returns a JSON object with title, introduction, startingDecision, location, role, lifestyle, people, exactly five ordered/distinct nodes, positive and difficult consequences, butterfly effect, unresolved mystery, reflection, question, turningPoint, and two branchOptions. Each node has id, year, title, location, age, mood, narrative, event, gain, sacrifice, and an artifact (`type`, `title`, `content`, `from`).

JSON is parsed and validated by Zod before any storage or rendering. Generated strings are rendered as React text, never uncontrolled HTML. Branch continuations are deterministic in this MVP, including for OpenAI-generated universes; they follow the selected option but are not a second model request.

## Security and privacy

- Trust Sites identity headers only behind the Sites dispatcher. Do not expose the Worker directly without an equivalent trusted header-stripping gateway.
- All owner operations enforce identity server-side. Guest capability cookies are random, HttpOnly, SameSite=Lax, Secure on HTTPS, and stored only as SHA-256 hashes in the database.
- Saving a guest universe transfers it to the account and revokes guest access.
- Cross-origin mutations are rejected; API responses use `Cache-Control: no-store`.
- Share tokens use two random UUIDs, are opt-in and revocable, and only expose the story/branches. The questionnaire and owner identifiers are never returned from sharing endpoints or public metadata.
- Narrative text can incorporate personal answers. The sharing dialog explicitly warns about this.
- Sign-in starts with a top-level Sites `/signin-with-chatgpt` link. No passwords or custom auth stack.
- Guest limits are per cookie, not robust anti-abuse enforcement across devices. Signed-in generation is capped at 10 requests per hour. Add stronger abuse controls and billing quotas before a public launch.
- Local safety keyword screening is intentionally conservative and not comprehensive across languages. OpenAI mode additionally moderates both input and output. Distress references receive a supportive diversion instead of entertainment.
- No user-provided secrets, questionnaire data, or generated private stories are committed.

## Deployment and source control

Canonical GitHub repository: `Anoosy99/elsewhere`, branch `main`. Source is additionally mirrored to the Sites-managed Git remote for version packaging. Meaningful milestones are committed; the final GitHub commit and Sites source commit must match.

Preserve `.openai/hosting.json` and its project identity. Build with the Sites build helper, push the exact final revision to both repositories, package that revision, save a version and privately deploy it. Sites applies committed Drizzle migrations before the Worker is uploaded. Keep applied migration files immutable and append future migrations.

## Roadmap

- OpenAI-generated multi-level branches and longer timelines.
- Export a digital story and dedicated social preview cards.
- Automated retention and stronger guest abuse limits.
- Richer local genre templates and translated safety handling.
- Free/Plus entitlements, usage meters, then payment processing.
- **Where We Met:** a future opt-in experience imagining the universe in which two users met. Not implemented in the MVP.
