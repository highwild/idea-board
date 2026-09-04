# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

A single person — the owner — using the board as a private scratchpad. Cloudflare
Access sits in front of the whole site, so there is no app-level login, no accounts,
and no per-user attribution anywhere in the product. There is exactly one board.

The situation is capture-then-return: an idea arrives away from the desk or mid-task,
gets written down fast and half-formed, and is revisited later when there is time to
develop it. Both moments matter — capture must be immediate, and the accumulated
board must be pleasant to browse.

## Product Purpose

Hold video and content ideas so they are not lost: content concepts, scripts, shoot
notes, one-line premises. Success is that the owner keeps coming back to write in it
and can find an old idea when they want it.

## Positioning

A single-owner, access-gated board with no accounts, no sharing, no collaboration
features and no organisational overhead — the whole surface is the ideas themselves.

## Operating Context

- Ideas skew toward video: premises, shoot notes, scripts, references to people and
  places involved in a shoot.
- Description length varies widely, from one line to several paragraphs. Long text is
  normal, not an edge case.
- Sorting is by default order, alphabetical, or most recent; the control only appears
  once there are more than two ideas.
- Data lives in a Cloudflare D1 database behind a Worker at `/api/ideas`; the board is
  shared across every device the owner opens it on.

## Capabilities and Constraints

- Create, read, update and delete ideas. An idea is `{ id, title, text, updated, time }`
  and nothing more — no tags, status, categories, attachments or ordering field.
- `updated` flips to true once an idea is edited; the card shows "Created on" or
  "Updated on" accordingly.
- Writes are optimistic: local state updates immediately, then persists. A failed write
  surfaces an error and resyncs from the server.
- Board states that must be designed: loading, unreachable-server with retry, save
  error, and empty.
- Stack: Vite, React 18, TypeScript, plain CSS in `src/App.css`, Jest + React Testing
  Library. Deployed to Cloudflare Workers with static assets.
- Never add auth, login, accounts, sessions or user identity. Cloudflare Access owns that.

## Brand Commitments

The interface must stay dark. Everything else — the name treatment, typeface, colour,
layout — is open.

## Evidence on Hand

Real ideas already in the database, written by the owner. No testimonials, metrics,
customers, press or marketing claims exist, and none may be invented.

## Product Principles

1. Capture beats organisation. Getting an idea down must never wait on a decision.
2. The ideas are the interface. Chrome earns its place or goes.
3. One owner, no ceremony. Never add anything that implies other people.
4. Long text is the normal case; never design for the one-line idea alone.
5. The board should be worth opening when there is nothing to add.

## Accessibility & Inclusion

No product-specific requirement was established beyond ordinary standards: keyboard
operability, visible focus, adequate contrast on the dark ground, and respect for
reduced-motion preferences.
