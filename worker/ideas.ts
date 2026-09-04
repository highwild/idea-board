export interface Idea {
  id: string
  title: string
  text: string
  updated: boolean
  time: number
}

export interface IdeaRow {
  id: string
  title: string
  text: string
  updated: number
  time: number
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const TITLE_MAX = 200
export const TEXT_MAX = 5000

export function rowToIdea(row: IdeaRow): Idea {
  return {
    id: row.id,
    title: row.title,
    text: row.text,
    updated: row.updated === 1,
    time: row.time,
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

export interface CreatePayload {
  id: string
  title: string
  text: string
  time: number
}

export interface UpdatePayload {
  title: string
  text: string
  time: number
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
  }
}
