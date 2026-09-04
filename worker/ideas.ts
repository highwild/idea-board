export const STATUSES = ['planned', 'todo', 'in-progress', 'done'] as const

export type Status = (typeof STATUSES)[number]

export interface Idea {
  id: string
  title: string
  text: string
  updated: boolean
  time: number
  status: Status
  notes: string
  tags: string[]
}

export interface IdeaRow {
  id: string
  title: string
  text: string
  updated: number
  time: number
  status: string
  notes: string
  tags: string
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const TITLE_MAX = 200
export const TEXT_MAX = 5000
export const NOTES_MAX = 20000
export const TAG_MAX = 24
export const TAGS_MAX = 12

function toStatus(value: unknown): Status {
  return STATUSES.includes(value as Status) ? (value as Status) : 'todo'
}

// tags are stored as a JSON array in one TEXT column; a row written before the
// column existed, or by hand, must never take the board down
function parseTags(value: string | null): string[] {
  if (!value) return []
  try {
    const parsed = JSON.parse(value)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((tag): tag is string => typeof tag === 'string')
  } catch {
    return []
  }
}

// trimmed, lowercased, de-duplicated, order preserved
export function normaliseTags(value: unknown): string[] {
  if (!Array.isArray(value)) {
    throw new ValidationError('tags must be an array of strings')
  }
  if (value.length > TAGS_MAX) {
    throw new ValidationError(`an idea cannot carry more than ${TAGS_MAX} tags`)
  }

  const seen = new Set<string>()
  const tags: string[] = []

  value.forEach((entry) => {
    if (typeof entry !== 'string') {
      throw new ValidationError('tags must be an array of strings')
    }
    const tag = entry.trim().toLowerCase()
    if (tag.length === 0) return
    if (tag.length > TAG_MAX) {
      throw new ValidationError(`a tag cannot be longer than ${TAG_MAX} characters`)
    }
    if (seen.has(tag)) return
    seen.add(tag)
    tags.push(tag)
  })

  return tags
}

function optionalTags(value: unknown): string[] | null {
  if (value === undefined || value === null) return null
  return normaliseTags(value)
}

export function rowToIdea(row: IdeaRow): Idea {
  return {
    id: row.id,
    title: row.title,
    text: row.text,
    updated: row.updated === 1,
    time: row.time,
    status: toStatus(row.status),
    notes: row.notes ?? '',
    tags: parseTags(row.tags),
  }
}

export class ValidationError extends Error {}

function requireString(value: unknown, field: string, max: number): string {
  if (typeof value !== 'string') {
    throw new ValidationError(`${field} is required and must be a string`)
  }
  const trimmed = value.trim()
  if (trimmed.length === 0) {
    throw new ValidationError(`${field} cannot be empty`)
  }
  if (trimmed.length > max) {
    throw new ValidationError(`${field} cannot be longer than ${max} characters`)
  }
  return trimmed
}

function normaliseTime(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.trunc(value)
  }
  return Date.now()
}

// notes are optional and may legitimately be emptied again
function optionalNotes(value: unknown): string | null {
  if (value === undefined || value === null) return null
  if (typeof value !== 'string') {
    throw new ValidationError('notes must be a string')
  }
  if (value.length > NOTES_MAX) {
    throw new ValidationError(`notes cannot be longer than ${NOTES_MAX} characters`)
  }
  return value
}

function optionalStatus(value: unknown): Status | null {
  if (value === undefined || value === null) return null
  if (!STATUSES.includes(value as Status)) {
    throw new ValidationError(`status must be one of ${STATUSES.join(', ')}`)
  }
  return value as Status
}

export interface CreatePayload {
  id: string
  title: string
  text: string
  time: number
  status: Status
  notes: string
  tags: string[]
}

export interface UpdatePayload {
  title: string
  text: string
  time: number
  status: Status | null
  notes: string | null
  tags: string[] | null
}

export interface PatchPayload {
  status: Status | null
  notes: string | null
  tags: string[] | null
}

// Unknown fields are stripped rather than rejected.
export function parseCreate(body: unknown): CreatePayload {
  if (typeof body !== 'object' || body === null) {
    throw new ValidationError('body must be a JSON object')
  }
  const raw = body as Record<string, unknown>
  if (typeof raw.id !== 'string' || !UUID_RE.test(raw.id)) {
    throw new ValidationError('id is required and must be a uuid')
  }
  return {
    id: raw.id,
    title: requireString(raw.title, 'title', TITLE_MAX),
    text: requireString(raw.text, 'text', TEXT_MAX),
    time: normaliseTime(raw.time),
    status: optionalStatus(raw.status) ?? 'todo',
    notes: optionalNotes(raw.notes) ?? '',
    tags: optionalTags(raw.tags) ?? [],
  }
}

export function parseUpdate(body: unknown): UpdatePayload {
  if (typeof body !== 'object' || body === null) {
    throw new ValidationError('body must be a JSON object')
  }
  const raw = body as Record<string, unknown>
  return {
    title: requireString(raw.title, 'title', TITLE_MAX),
    text: requireString(raw.text, 'text', TEXT_MAX),
    time: normaliseTime(raw.time),
    status: optionalStatus(raw.status),
    notes: optionalNotes(raw.notes),
    tags: optionalTags(raw.tags),
  }
}

// A patch changes status or notes without touching what the idea says or when
// it was written, so moving a card to "done" never rewrites its date.
export function parsePatch(body: unknown): PatchPayload {
  if (typeof body !== 'object' || body === null) {
    throw new ValidationError('body must be a JSON object')
  }
  const raw = body as Record<string, unknown>
  const status = optionalStatus(raw.status)
  const notes = optionalNotes(raw.notes)
  const tags = optionalTags(raw.tags)
  if (status === null && notes === null && tags === null) {
    throw new ValidationError('a patch must set status, notes or tags')
  }
  return { status, notes, tags }
}
