import {
  IdeaRow,
  ValidationError,
  parseCreate,
  parseUpdate,
  rowToIdea,
} from './ideas'

export interface Env {
  DB: D1Database
  ASSETS: Fetcher
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function error(message: string, status: number): Response {
  return json({ error: message }, status)
}

async function readBody(request: Request): Promise<unknown> {
  try {
    return await request.json()
  } catch {
    throw new ValidationError('body must be valid JSON')
  }
}

async function listIdeas(env: Env): Promise<Response> {
  const { results } = await env.DB.prepare(
    'SELECT id, title, text, updated, time FROM ideas ORDER BY time DESC'
  ).all<IdeaRow>()
  return json((results ?? []).map(rowToIdea))
}

async function createIdea(request: Request, env: Env): Promise<Response> {
  const idea = parseCreate(await readBody(request))

  const existing = await env.DB.prepare('SELECT id FROM ideas WHERE id = ?')
    .bind(idea.id)
    .first<{ id: string }>()
  if (existing) {
    return error('an idea with that id already exists', 409)
  }

  await env.DB.prepare(
    'INSERT INTO ideas (id, title, text, time, updated) VALUES (?, ?, ?, ?, 0)'
  )
    .bind(idea.id, idea.title, idea.text, idea.time)
    .run()

  return json({ ...idea, updated: false }, 201)
}

async function updateIdea(
  request: Request,
  env: Env,
  id: string
): Promise<Response> {
  const payload = parseUpdate(await readBody(request))

  const row = await env.DB.prepare(
    'UPDATE ideas SET title = ?, text = ?, time = ?, updated = 1 WHERE id = ? RETURNING id, title, text, updated, time'
  )
    .bind(payload.title, payload.text, payload.time, id)
    .first<IdeaRow>()

  if (!row) return error('no idea with that id', 404)
  return json(rowToIdea(row))
}

async function deleteIdea(env: Env, id: string): Promise<Response> {
  const row = await env.DB.prepare(
    'DELETE FROM ideas WHERE id = ? RETURNING id'
  )
    .bind(id)
    .first<{ id: string }>()

  if (!row) return error('no idea with that id', 404)
  return new Response(null, { status: 204 })
}

async function handleApi(
  request: Request,
  env: Env,
  path: string
): Promise<Response> {
  const method = request.method.toUpperCase()

  if (path === '/api/ideas') {
    if (method === 'GET') return listIdeas(env)
    if (method === 'POST') return createIdea(request, env)
    return error('method not allowed', 405)
  }

  const match = path.match(/^\/api\/ideas\/([^/]+)$/)
  if (match) {
    const id = decodeURIComponent(match[1])
    if (method === 'PUT') return updateIdea(request, env, id)
    if (method === 'DELETE') return deleteIdea(env, id)
    return error('method not allowed', 405)
  }

  return error('not found', 404)
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const path = new URL(request.url).pathname

    if (!path.startsWith('/api/')) {
      return env.ASSETS.fetch(request)
    }

    try {
      return await handleApi(request, env, path)
    } catch (cause) {
      if (cause instanceof ValidationError) {
        return error(cause.message, 400)
      }
      console.error('idea-board api failure', cause)
      return error('internal server error', 500)
    }
  },
}
