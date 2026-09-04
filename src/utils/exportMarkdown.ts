import { IdeasType, STATUS_LABELS, StatusType } from '../types'

// Plain Markdown that reads as a document rather than a dump: one heading per
// idea, its facts as a short list, then what was actually written.
export default function exportMarkdown(
  ideas: IdeasType[],
  getDate: (date: number) => string,
  exportedAt: number = Date.now()
): string {
  const written = ideas.filter((idea) => idea.title)

  const lines: string[] = [
    '# IdeaBoard',
    '',
    `Exported ${getDate(exportedAt)} — ${written.length} ${
      written.length === 1 ? 'idea' : 'ideas'
    }.`,
  ]

  written.forEach((idea) => {
    const status: StatusType = idea.status ?? 'todo'
    const tags = idea.tags ?? []
    const notes = (idea.notes ?? '').trim()

    lines.push('', '---', '', `## ${idea.title}`, '')
    lines.push(`- **Status:** ${STATUS_LABELS[status]}`)
    if (tags.length > 0) lines.push(`- **Tags:** ${tags.join(', ')}`)
    lines.push(
      `- **${idea.updated ? 'Updated' : 'Written'}:** ${getDate(idea.time)}`
    )

    if (idea.text) lines.push('', idea.text.trim())
    if (notes) lines.push('', '**Notes**', '', notes)
  })

  return `${lines.join('\n')}\n`
}

export function exportFilename(exportedAt: number = Date.now()): string {
  const date = new Date(exportedAt)
  const pad = (value: number) => (value < 10 ? `0${value}` : `${value}`)
  const stamp = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}`
  return `ideaboard-${stamp}.md`
}
