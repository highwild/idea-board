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
| PATCH  | `/api/ideas/:id` | `{ status?, notes?, tags? }` | `200` updated idea, `404` if missing  |
| DELETE | `/api/ideas/:id` | -                           | `204`, `404` if missing         |

Each idea is `{ id, title, text, updated, time, status, notes }`, where `updated` is a
boolean, `status` is one of `planned`, `todo`, `in-progress` or `done`, `notes` is free text
(20000 characters max, may be empty), and `tags` is an array of up to 12 lowercase strings of
24 characters each, stored as JSON in one column. Tags are trimmed, lowercased and
de-duplicated on write, and empty strings are dropped.

`PUT` is a full edit: it rewrites the title, text and date, and sets `updated`. `PATCH`
changes only status and/or notes and deliberately leaves the date and `updated` flag alone,
so moving an idea to `done` never rewrites when it was written. Omitted fields on either
route keep whatever is already stored.
