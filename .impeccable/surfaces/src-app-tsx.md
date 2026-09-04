---
version: 1
slug: "src-app-tsx"
primary_target: "src/App.tsx"
related_targets: ["components/form.tsx","components/ideas.tsx","components/createIdea.tsx","components/editIdea.tsx","components/sortIdeas.tsx","src/App.css"]
---

Scope: the whole single-page board (src/App.tsx and components/*). Visitor mode: Operate.

Audience: one owner, private access-gated board, capturing video and content ideas fast and
returning to browse them. Task: write an idea down without ceremony; find an old one; edit or
bin it. Content: title plus a description that is often several paragraphs. Constraints: dark
interface, no auth, D1-backed CRUD only, states for loading, unreachable, save error, empty.

Chosen direction: the category standard, played straight, at Linear's craft level (the user
took the canon door over the dealt Transmission Log and its alternates). Memorable moment: the
composer is always present as the first line of the list rather than a modal, and an entry
commits in place.

Unresolved: whether Linear's cold precision is the right temperature, or whether the board
should sit warmer and roomier. Confirm after the first render.

## Direction contract

THESIS: a private board where the writing surface is always open and the ideas are the only
furniture. Refuses the uniform card grid, the floating "+" button, and the modal-to-add.

OWN-WORLD: near-black graphite ground with a single raised surface tier, 1px hairlines doing
all separation work, no shadows below the composer, one restrained accent for the primary
action only, destructive red earned once. Grotesk UI type at a tight scale; tabular mono for
timestamps and counts alone. Radii small and consistent; density high; motion under 200ms.

STORY: the owner understands the board holds everything they have written, believes writing
here costs nothing, and types into the open composer or scans the list and edits in place.

FIRST VIEWPORT: a narrow single measure, centred. Wordmark and idea count on one line at the
top left; sort control right-aligned on the same line; the open composer directly beneath it,
title field and description, with the primary action at its bottom right; entries below in one
continuous hairline-separated list, newest first, each showing title, description, timestamp,
and edit/delete actions that appear on hover and stay reachable by keyboard.

FORM: the category standard, played straight; the canon door, taken over grounded candidate 5
(the Transmission Log) and the challenger set; seed key 363ff632.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the
verdict, DESIGN.md, and every shipping raster carrying its provenance
