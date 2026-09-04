import { expect, test } from '@jest/globals'
import exportMarkdown, { exportFilename } from '../utils/exportMarkdown'
import getDate from '../utils/getDate'

const exportedAt = new Date(2026, 8, 4, 14, 30).getTime()

const ideas = [
  {
    id: 'a',
    title: 'British Rail Guard Challenge',
    text: 'Check tickets as a guard.\nRestart on a mistake.',
    updated: false,
    time: new Date(2025, 8, 4, 16, 33).getTime(),
    status: 'in-progress' as const,
    notes: 'https://imgur.com/a/br-guard-run',
    tags: ['video', 'script'],
  },
  {
    id: 'b',
    title: 'Circle line, one take',
    text: 'One continuous shot.',
    updated: true,
    time: new Date(2025, 7, 29, 21, 40).getTime(),
    status: 'done' as const,
    notes: '',
    tags: [],
  },
]

test('the board exports as readable markdown', () => {
  const markdown = exportMarkdown(ideas, getDate, exportedAt)

  expect(markdown).toBe(
    [
      '# IdeaBoard',
      '',
      'Exported 04/09/2026 14:30 — 2 ideas.',
      '',
      '---',
      '',
      '## British Rail Guard Challenge',
      '',
      '- **Status:** In progress',
      '- **Tags:** video, script',
      '- **Written:** 04/09/2025 16:33',
      '',
      'Check tickets as a guard.\nRestart on a mistake.',
      '',
      '**Notes**',
      '',
      'https://imgur.com/a/br-guard-run',
      '',
      '---',
      '',
      '## Circle line, one take',
      '',
      '- **Status:** Done',
      '- **Updated:** 29/08/2025 21:40',
      '',
      'One continuous shot.',
      '',
    ].join('\n')
  )
})

test('an idea with no tags or notes leaves those lines out', () => {
  const markdown = exportMarkdown([ideas[1]], getDate, exportedAt)
  expect(markdown).not.toContain('**Tags:**')
  expect(markdown).not.toContain('**Notes**')
  expect(markdown).toContain('1 idea.')
})

test('ideas without a title are left out, as they are on the board', () => {
  const markdown = exportMarkdown(
    [...ideas, { id: 'c', title: '', text: 'orphan', updated: false, time: 0 }],
    getDate,
    exportedAt
  )
  expect(markdown).toContain('2 ideas.')
  expect(markdown).not.toContain('orphan')
})

test('the filename carries the export date', () => {
  expect(exportFilename(exportedAt)).toBe('ideaboard-2026-09-04.md')
})
