# idea-board Worker

The Worker in `worker/index.ts` serves the `/api/*` routes backed by a Cloudflare D1
database, and falls through to the static SPA assets in `dist/` for everything else.

## One-time setup

```bash
npm install
npx wrangler login
npx wrangler d1 create idea-board
```

Copy the `database_id` printed by that last command into `wrangler.jsonc`, replacing
`REPLACE_WITH_DATABASE_ID`.

## Migrations

```bash
npm run db:migrate:local   # apply to the local dev database
npm run db:migrate         # apply to the remote (production) database
```

## Local development

```bash
npm run build   # wrangler serves ./dist, so build first
npm run cf:dev
```

## Deploy

```bash
npm run cf:deploy
```

## API

| Method | Path             | Body                        | Response                        |
| ------ | ---------------- | --------------------------- | ------------------------------- |
| GET    | `/api/ideas`     | -                           | `200` ideas, newest first       |
| POST   | `/api/ideas`     | `{ id, title, text, time }` | `201` created idea, `409` if id exists |
| PUT    | `/api/ideas/:id` | `{ title, text, time }`     | `200` updated idea, `404` if missing   |
| DELETE | `/api/ideas/:id` | -                           | `204`, `404` if missing         |

Each idea is `{ id, title, text, updated, time }`, where `updated` is a boolean.
