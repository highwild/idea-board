---
name: IdeaBoard
description: A private, always-open writing surface where the ideas are the only furniture.
colors:
  bg: "#0b0c0e"
  surface: "#121417"
  surface-hover: "#161a1e"
  line: "#212529"
  line-strong: "#2c3238"
  text: "#edeae0"
  text-body: "#d3d0c8"
  text-2: "#9ba0a6"
  text-3: "#838890"
  accent: "#8aa2ff"
  accent-hover: "#a4b6ff"
  accent-ink: "#0a1030"
  accent-muted: "#2a3145"
  accent-muted-ink: "#a3adc4"
  danger: "#f06a6f"
  danger-hover: "#ff8286"
  danger-ink: "#2a1416"
typography:
  wordmark:
    fontFamily: "GeneralSans-Semibold, system-ui, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  title:
    fontFamily: "GeneralSans-Semibold, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "-0.01em"
  body:
    fontFamily: "GeneralSans-Regular, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "normal"
  label:
    fontFamily: "GeneralSans-Regular, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "normal"
  label-small:
    fontFamily: "GeneralSans-Regular, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "normal"
  meta:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "normal"
  meta-caps:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "0.06em"
rounded:
  xs: "4px"
  sm: "6px"
  md: "10px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  2xl: "32px"
  page-top: "72px"
  page-top-wide: "112px"
components:
  composer:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "4px 0 12px"
    width: "100%"
  input-title:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    typography: "{typography.title}"
    padding: "12px 16px"
    width: "100%"
  input-text:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    typography: "{typography.body}"
    padding: "12px 16px"
    height: "112px"
    width: "100%"
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "8px 14px"
  button-primary-hover:
    backgroundColor: "{colors.accent-hover}"
    textColor: "{colors.accent-ink}"
  button-primary-disabled:
    backgroundColor: "{colors.accent-muted}"
    textColor: "{colors.accent-muted-ink}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.text-2}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "8px 14px"
  button-ghost-hover:
    backgroundColor: "{colors.surface-hover}"
    textColor: "{colors.text}"
  button-danger:
    backgroundColor: "{colors.danger}"
    textColor: "{colors.danger-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "8px 14px"
  button-danger-hover:
    backgroundColor: "{colors.danger-hover}"
    textColor: "{colors.danger-ink}"
  icon-button:
    backgroundColor: "transparent"
    textColor: "{colors.text-3}"
    rounded: "{rounded.sm}"
    padding: "0"
    size: "28px"
  icon-button-hover:
    backgroundColor: "{colors.surface-hover}"
    textColor: "{colors.text}"
  sort:
    backgroundColor: "transparent"
    rounded: "{rounded.sm}"
    padding: "2px"
  sort-option:
    backgroundColor: "transparent"
    textColor: "{colors.text-3}"
    typography: "{typography.label-small}"
    rounded: "{rounded.xs}"
    padding: "6px 10px"
  sort-option-selected:
    backgroundColor: "{colors.surface-hover}"
    textColor: "{colors.text}"
  entry:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    padding: "24px 0"
    width: "100%"
  entry-confirm:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-2}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "12px 14px"
  notice-error:
    backgroundColor: "#1a1214"
    textColor: "#f3c9cb"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "12px 14px"
---

# Design System: IdeaBoard

## Overview

**Creative North Star: "The Open Notebook, Left on the Desk in a Dark Room"**

IdeaBoard is the category standard played straight at a high craft level. It is a near-black
graphite room holding one lit page: the composer. Nothing decorates; the ideas themselves are
the only furniture. There is exactly one raised surface tier above the ground, one accent
reserved for the primary action, and one red that is earned only when something is about to be
destroyed. Everything else is separated by 1px hairlines.

Density is high and the measure is narrow (720px). The page opens with deep top air
(72px, 112px at 768px and up) so the wordmark and the composer land in the upper third rather
than at the very edge of the viewport, then tightens immediately: entries are 24px-padded rows
in one continuous hairline-separated list, not cards in a grid. Type is a grotesk at a tight,
short ramp — five steps between 0.75rem and 1.375rem — with monospace held back for timestamps
and the idea count alone, so numbers are the only place the voice changes.

Motion is nearly absent by design. Interaction transitions run 120–140ms; one authored
420ms arrival animation plays when an idea lands on the board, and everything already on the
board stays still. The interface refuses the uniform card grid, the floating "+" button, and
the modal-to-add: writing happens in place, and an edit commits in place too.

**Key Characteristics:**
- Near-black graphite ground with exactly one raised surface tier
- 1px hairlines do all separation work; no dividers rendered as gaps or rules with color
- One periwinkle accent, primary action only; one red, destructive confirmation only
- Warm off-white ink on cold graphite — the only warmth in the palette
- High density, narrow single measure, list-not-grid
- Motion under 200ms everywhere except the single 420ms arrival

## Colors

A cold graphite ground carrying warm paper-toned ink, with one cool periwinkle accent and one
salmon red, each spent in exactly one place.

### Primary
- **Periwinkle Signal** (`{colors.accent}`): The single accent. It appears on the primary
  action button, on the composer's border when the composer has focus, on the caret in both
  writing fields, and on the focus-visible ring. Nowhere else. Its ink is a near-black navy
  (`{colors.accent-ink}`) so the button reads as a lit chip rather than a colored label.

### Secondary
- **Earned Salmon** (`{colors.danger}`): Destructive only. It appears on the delete-confirm
  button and as the hover color of the trash icon button. It is never used for emphasis,
  never for the error notice's own surface, and never as a second accent.

### Neutral
- **Graphite Ground** (`{colors.bg}`): The page. Set on both `html` and `body` so overscroll
  never flashes a lighter color, and declared alongside `color-scheme: dark`.
- **Raised Slate** (`{colors.surface}`): The one tier above ground. The composer, the inline
  delete-confirm bar, and the skeleton base sit here.
- **Slate Hover** (`{colors.surface-hover}`): The hover/selected wash for ghost buttons, icon
  buttons, and the selected segment of the sort control. It is a state color, not a surface.
- **Hairline** (`{colors.line}`): Every structural division — the list's top rule, the rule
  between entries, the composer's footer rule, the sort control's outer border.
- **Hairline Strong** (`{colors.line-strong}`): The composer's resting border, the confirm
  bar's border, the ghost button's border, and the scrollbar thumb. Reserved for edges that
  belong to an interactive object.
- **Paper Ink** (`{colors.text}`): Warm off-white. Titles, the wordmark, field text, and the
  text a hover reveals.
- **Read Ink** (`{colors.text-body}`): A half-step down from Paper Ink, used for entry
  description bodies so long passages sit back from their titles without going grey.
- **Muted Ink** (`{colors.text-2}`): Ghost button labels and the confirm bar's question.
- **Quiet Ink** (`{colors.text-3}`): Placeholders, timestamps, the idea count, the empty
  state, the composer hint, resting icon buttons, and unselected sort options.

### Named Rules
**The One Accent Rule.** Periwinkle marks the primary action, the focused composer, the caret,
and the focus ring. If a fifth use appears, the accent has stopped meaning "this is the thing
to press."

**The Earned Red Rule.** Red is spent once per interaction, on the confirmation that destroys
something. An error notice is not destruction: it gets its own dimmed maroon skin
(`{components.notice-error}`), not the accent red.

**The Hairline Rule.** All separation is a 1px line in `{colors.line}` or
`{colors.line-strong}`. Never separate with a filled band, a heavier rule, or a color shift in
the ground.

## Typography

**Display / Emphasis Font:** GeneralSans-Semibold (with system-ui, sans-serif)
**Body Font:** GeneralSans-Regular (with system-ui, sans-serif)
**Meta / Numeric Font:** ui-monospace stack (SFMono-Regular, Menlo, Consolas, Liberation Mono)

**Character:** A neutral geometric grotesk with slightly tightened tracking at the larger
sizes, self-hosted in two weights only. The pairing has no editorial flourish: the semibold
carries every structural moment (wordmark, entry title, primary and destructive button labels)
and the regular carries everything that is read rather than scanned.

### Hierarchy
- **Wordmark** (`{typography.wordmark}`): The word IdeaBoard, once, top-left of the header
  line. Balanced wrap; the largest type on the page and only 1.375rem.
- **Title** (`{typography.title}`): Entry titles and the composer's title field. Pretty wrap,
  anywhere-break so a pasted URL cannot widen the measure.
- **Body** (`{typography.body}`): Entry descriptions and the description field, capped at 68ch
  and preserving authored line breaks (`white-space: pre-wrap`). Also the empty state.
- **Label** (`{typography.label}`): All button text, the confirm bar, and notices.
- **Label Small** (`{typography.label-small}`): Sort segments and the composer's
  keyboard hint.
- **Meta** (`{typography.meta}`): Timestamps, tabular figures, quiet ink.
- **Meta Caps** (`{typography.meta-caps}`): The idea count only — uppercase, tracked 0.06em,
  tabular. This is the sole uppercase text in the interface.

### Named Rules
**The Numbers-Only Mono Rule.** The monospace face carries the idea count and the timestamps
and nothing else. Mono on a label, a heading, or body copy breaks the world.

**The Two Weights Rule.** There are two weights: 400 and 600. Emphasis is achieved by
switching family (Regular to Semibold) or by moving ink one step brighter, never by a third
weight, italics, or letter-spaced small caps outside the idea count.

## Layout

A single centered measure of 720px (`--measure`), never a grid. The page pads
72px top / 20px sides / 96px bottom on small screens, widening to 112px / 32px / 128px at
768px and up; that is the only breakpoint in the system.

The header is one baseline-aligned flex line: wordmark left, then a meta cluster pushed right
holding the idea count and the sort control 12px apart. It wraps rather than compresses. The
composer sits directly beneath it (28px below), and the entries list opens 32px lower behind a
hairline top rule.

Spacing rhythm is a 4px base used in a short set of steps: 4 / 8 / 12 / 16 / 24 / 32.
Entries are 24px vertical rows (16px when an entry is in edit mode, because the composer
brings its own padding); inside an entry, the description sits 8px under the title and the
timestamp 14px under the description.

**The Single Measure Rule.** Everything — header, composer, list, notices — shares one 720px
column. No full-bleed bands, no sidebars, no second column at any width.

## Elevation & Depth

The system is essentially flat and builds depth tonally: ground, one raised surface tier, and
hairlines. There is exactly one shadow in the build, and it belongs to the composer alone —
a tight contact shadow plus a wide, soft, downward-lifted ambient shadow. Its job is to make
the always-open writing surface read as the one thing lying on top of the board. Entries,
notices, the sort control, and the confirm bar have no shadow at any state.

### Shadow Vocabulary
- **Composer lift** (`box-shadow: 0 1px 2px rgba(0,0,0,0.4), 0 12px 28px -12px rgba(0,0,0,0.7)`):
  The writing surface, and only the writing surface.

### Named Rules
**The One Shadow Rule.** Nothing below the composer casts a shadow. If a new surface needs
separating, give it `{colors.surface}` and a hairline, not elevation.

## Shapes

Three radii, all small: 10px for the composer (the only large object), 6px for every
interactive control — buttons, icon buttons, the sort container, the confirm bar, notices, and
the focus-visible ring — and 4px for shapes nested inside a 6px parent (the sort segments) and
for skeleton bars. Nothing is fully round; there are no pills, no circles, no capsule buttons.

Borders are always exactly 1px. Interactive objects carry a `1px solid transparent` border at
rest where a hover or focus state will later color it, so nothing shifts by a pixel when a
state arrives. Icon buttons are a strict 28px square with a 16px icon centered in a grid.

**The No-Pill Rule.** Radius never exceeds 10px and never becomes a capsule. Roundness is
softening, not shape.

## Components

### Buttons
- **Shape:** Small softened corners (`{rounded.sm}`, 6px), 1px border, 8px/14px padding,
  0.875rem label on a line-height of 1.
- **Primary:** Periwinkle fill on near-black navy ink, label set in Semibold. One primary per
  context: the composer's save action. Hover lifts the fill one step
  (`{components.button-primary-hover}`); disabled drops to a desaturated slate with dimmed ink
  and `cursor: not-allowed`, and is the resting state until both title and description have
  content.
- **Ghost:** Transparent on a `{colors.line-strong}` border with muted ink. Used for Cancel,
  Discard, Keep it, and Try again. Hover fills with `{colors.surface-hover}` and brightens ink
  to full.
- **Danger:** Salmon fill on deep maroon ink, Semibold. Only the delete confirmation.
- **Icon button:** 28px square, no border or background at rest, quiet ink. Hover adds the
  slate wash, a `{colors.line}` border, and full ink; the delete variant turns its icon salmon.
- **Transitions:** background, color, border-color, opacity at 120ms on
  `cubic-bezier(0.2, 0.8, 0.3, 1)`.

### Inputs / Fields
- **Style:** The two fields are borderless and transparent; the composer shell owns the frame.
  Title is Semibold 1rem, description is 0.9375rem/1.65 with resize disabled and a 112px
  minimum, auto-growing to its content height so a long idea is never read through a five-line
  slot.
- **Focus:** Focus lives on the container, not the field: `:focus-within` turns the composer's
  border periwinkle over 140ms, and the caret is periwinkle in both fields. The fields
  themselves suppress their own focus ring so the frame never doubles.
- **Placeholder:** Quiet ink at full opacity.

### Composer (signature component)
The always-open writing surface, and the first line of the board rather than a modal. Raised
slate on a `{colors.line-strong}` border, 10px radius, carrying the system's only shadow.
Title field, then description, then a footer divided by a `{colors.line}` hairline holding a
keyboard hint on the left ("Cmd + Enter to save" on Apple platforms, "Ctrl" elsewhere) and the
actions right. The cancel/discard button only appears once the form is dirty, so a resting
composer shows one button. The same component is reused verbatim for in-place editing of an
existing entry; there is no separate edit surface anywhere in the product.

### Entries (signature component)
One continuous list, not cards: a hairline top rule, 24px rows, a hairline between each row,
none after the last. Title and action cluster on one flex line, description below at 68ch,
timestamp last in mono. The edit and delete icon buttons are `opacity: 0` at rest and appear on
row hover or on keyboard focus within the cluster; on coarse pointers
(`@media (hover: none)`) they are permanently visible. A newly arrived idea plays the one
authored animation in the system: 420ms fade-in from `translateY(-10px)` with a 3px blur that
clears at 60%. Entries already on the board never animate.

### Sort control
A three-segment inline group (Added / Newest / A-Z) in a 6px hairline-bordered container with
2px inner padding. Segments are 4px-radius, quiet ink, transparent; the selected segment is
marked with `aria-pressed` and gets the slate wash and full ink. It renders only when the
board holds more than two ideas.

### Inline confirmation
Deletion confirms inside the entry, never in a dialog: a slate bar with a
`{colors.line-strong}` border appears 16px under the timestamp, asking in muted ink, with a
ghost "Keep it" and a danger "Delete" pushed right.

### Notices and states
- **Error notice:** A dimmed maroon skin (`{components.notice-error}` with a `#4a2a2c`
  hairline) inside the measure, with an inline ghost retry button when the board is
  unreachable. Never a toast, never an overlay.
- **Empty:** One quiet sentence 32px below a hairline rule, pointing back up at the composer.
- **Loading:** Three skeleton bars, 1rem tall, 4px radius, at 100% / 72% / 45% width, sweeping
  a slate-to-slate-hover gradient over 1.4s.
- **Reduced motion:** A global `prefers-reduced-motion` block collapses every animation and
  transition to 0.01ms.

## Do's and Don'ts

### Do:
- **Do** put every new surface in the single 720px measure and separate it with a 1px hairline.
- **Do** keep the accent to the primary action, the focused composer, the caret, and the focus
  ring; give everything else `{colors.text-3}` or a `{colors.surface-hover}` wash.
- **Do** give interactive objects a `1px solid transparent` border at rest so a hover state
  colors it without shifting layout.
- **Do** reuse the composer component for any writing task, including editing in place.
- **Do** keep transitions at 120–140ms on `cubic-bezier(0.2, 0.8, 0.3, 1)`, and reserve the
  420ms arrival for an idea landing on the board.
- **Do** set numeric text (counts, timestamps) in the mono stack with `tabular-nums`.
- **Do** provide a visible 2px periwinkle `:focus-visible` ring at 2px offset on everything
  focusable, and keep hover-revealed controls reachable by keyboard.
- **Do** cap read text at 68ch and preserve authored line breaks.

### Don't:
- **Don't** introduce a card grid, a floating action button, or a modal — writing and editing
  happen in place, on the board.
- **Don't** add a shadow to anything other than the composer.
- **Don't** add a second accent hue, or reuse the salmon red for anything but destruction.
- **Don't** exceed a 10px radius or build a pill/capsule control.
- **Don't** use uppercase or letter-spaced type anywhere except the idea count.
- **Don't** use mono for anything that is not a number.
- **Don't** introduce a third font weight, italics, or a native `<select>`; the sort control is
  a segmented button group.
- **Don't** ship an icon as a font glyph, an emoji, or an `<img>` — icons are authored inline
  SVG on a 16px box, 1.5 stroke, round caps and joins, drawn to the same grid.
- **Don't** light the interface. The dark ground is a product commitment, not a theme.
