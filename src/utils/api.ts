import { IdeasType } from '../types'

const BASE = '/api/ideas'

const JSON_HEADERS = { 'Content-Type': 'application/json' }

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  if (typeof fetch !== 'function') {
    throw new Error('Network unavailable')
  }

  let response: Response
  try {
    response = await fetch(url, init)
  } catch {
    throw new Error('Could not reach the idea board')
  }

  if (!response.ok) {
    let message = `Request failed (${response.status})`
    try {
      const body = await response.json()
      if (body && typeof body.error === 'string') message = body.error
    } catch {
      // response had no JSON body - keep the generic message
    }
    throw new Error(message)
  }

  if (response.status === 204) return null as T
  return (await response.json()) as T
}

export function listIdeas(): Promise<IdeasType[]> {
  return request<IdeasType[]>(BASE)
}

export function createIdea(idea: {
  id: string;
  title: string;
  text: string;
  time: number;
}): Promise<IdeasType> {
  return request<IdeasType>(BASE, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(idea),
  })
}

export function updateIdea(
  id: string,
  idea: { title: string; text: string; time: number }
): Promise<IdeasType> {
  return request<IdeasType>(`${BASE}/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify(idea),
  })
}

export function deleteIdea(id: string): Promise<void> {
  return request<void>(`${BASE}/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  })
}
