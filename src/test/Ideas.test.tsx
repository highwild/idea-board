import userEvent from '@testing-library/user-event'
import { within } from '@testing-library/react'
import { render, screen } from './test-utils'
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'
import '@jest/globals'

import Ideas from '../../components/ideas'

test('Check idea is rendered from global state', async () => {
  const title = 'Idea One'
  const description = 'Description of Idea One'

  //
  render(<Ideas />, {
    ideas: [{ title, id: null, text: description, updated: false, time: 0 }],
  })

  //

  expect(screen.getByText(title)).toBeInTheDocument()
  expect(screen.getByText(description)).toBeInTheDocument()
})

test('Check updated text is rendered from updated idea', async () => {
  const title = 'Idea xasdasd'
  const description = 'Description of asdasdsadadsd One'

  //
  render(<Ideas />, {
    ideas: [{ title, id: null, text: description, updated: true, time: 0 }],
  })

  //

  expect(screen.getByText(title)).toBeInTheDocument()
  expect(screen.getByText(description)).toBeInTheDocument()
  expect(screen.getByText('Updated null')).toBeInTheDocument()
  expect(screen.queryByText('Written null')).not.toBeInTheDocument()
})

test('Check delete is called with the right id once confirmed', async () => {
  const user = userEvent.setup()
  const description = 'Description of asdasdsadadsd One'
  const mockDispatch = jest.fn()

  const ideas = [
    { title: 'sunday', id: 'sunday', text: description, updated: true, time: 0 },
    { title: 'monday', id: 'monday', text: description, updated: true, time: 0 },
    { title: 'tuesday', id: 'tuesday', text: description, updated: true, time: 0 },
  ]
  //
  render(<Ideas />, {
    ideas,
    dispatch: mockDispatch,
  })

  await user.click(screen.getByLabelText(`delete ${ideas[1].title}`))

  // deleting asks first, so nothing has gone yet
  expect(mockDispatch).not.toHaveBeenCalled()

  await user.click(screen.getByText('Delete'))

  expect(mockDispatch).toHaveBeenCalledWith({ id: 'monday', type: 'delete' })
})

test('Check keeping an idea leaves it alone', async () => {
  const user = userEvent.setup()
  const mockDispatch = jest.fn()

  const ideas = [
    { title: 'sunday', id: 'sunday', text: 'description', updated: true, time: 0 },
  ]
  //
  render(<Ideas />, { ideas, dispatch: mockDispatch })

  await user.click(screen.getByLabelText('delete sunday'))
  await user.click(screen.getByText('Keep it'))

  expect(mockDispatch).not.toHaveBeenCalled()
  expect(screen.getByText('sunday')).toBeInTheDocument()
})

test('Check editing an idea happens in place and dispatches the update', async () => {
  const user = userEvent.setup()
  const mockDispatch = jest.fn()

  const ideas = [
    { title: 'sunday', id: 'sunday', text: 'description', updated: true, time: 0 },
  ]
  //
  render(<Ideas />, { ideas, dispatch: mockDispatch })

  await user.click(screen.getByLabelText('edit sunday'))

  const titleField = screen.getByPlaceholderText('Title')
  await user.clear(titleField)
  await user.type(titleField, 'monday')
  await user.click(screen.getByText('Save changes'))

  expect(mockDispatch).toHaveBeenCalledWith({
    type: 'update',
    title: 'monday',
    text: 'description',
    tags: [],
    id: 'sunday',
  })
})

test('Check changing status patches only the status', async () => {
  const user = userEvent.setup()
  const mockDispatch = jest.fn()

  const ideas = [
    {
      title: 'sunday',
      id: 'sunday',
      text: 'description',
      updated: false,
      time: 0,
      status: 'todo' as const,
      notes: '',
    },
  ]

  render(<Ideas />, { ideas, dispatch: mockDispatch })

  // the filter bar carries the same words, so reach into this idea's own control
  const control = screen.getByLabelText('status of sunday')
  await user.click(within(control).getByText('In progress'))

  expect(mockDispatch).toHaveBeenCalledWith({
    type: 'patch',
    id: 'sunday',
    status: 'in-progress',
  })
})

test('Check notes open, take writing and patch only the notes', async () => {
  const user = userEvent.setup()
  const mockDispatch = jest.fn()

  const ideas = [
    {
      title: 'sunday',
      id: 'sunday',
      text: 'description',
      updated: false,
      time: 0,
      status: 'todo' as const,
      notes: '',
    },
  ]

  render(<Ideas />, { ideas, dispatch: mockDispatch })

  // the notes section is closed until it is pulled out
  expect(screen.queryByText('Nothing written here yet.')).not.toBeInTheDocument()

  await user.click(screen.getByLabelText('notes on sunday'))
  expect(screen.getByText('Nothing written here yet.')).toBeInTheDocument()

  await user.click(screen.getByText('Add notes'))
  await user.type(
    screen.getByPlaceholderText('Links, references, editing notes'),
    'https://imgur.com/a/abc123'
  )
  await user.click(screen.getByText('Save notes'))

  expect(mockDispatch).toHaveBeenCalledWith({
    type: 'patch',
    id: 'sunday',
    notes: 'https://imgur.com/a/abc123',
  })
})

test('Check links in notes are rendered as links', async () => {
  const user = userEvent.setup()

  const ideas = [
    {
      title: 'sunday',
      id: 'sunday',
      text: 'description',
      updated: false,
      time: 0,
      status: 'done' as const,
      notes: 'dump is at https://imgur.com/a/abc123 - grade before cutting',
    },
  ]

  render(<Ideas />, { ideas })

  await user.click(screen.getByLabelText('notes on sunday'))

  const link = screen.getByRole('link', { name: 'https://imgur.com/a/abc123' })
  expect(link).toHaveAttribute('href', 'https://imgur.com/a/abc123')
  expect(link).toHaveAttribute('rel', 'noreferrer noopener')
})

test('Check the filter narrows the board to one status', async () => {
  const user = userEvent.setup()

  const ideas = [
    { title: 'shoot this week', id: 'a', text: 'ready', updated: false, time: 0, status: 'todo' as const, notes: '' },
    { title: 'waiting on the new route', id: 'b', text: 'blocked', updated: false, time: 0, status: 'planned' as const, notes: '' },
  ]

  render(<Ideas />, { ideas })

  expect(screen.getByText('shoot this week')).toBeInTheDocument()
  expect(screen.getByText('waiting on the new route')).toBeInTheDocument()

  const filters = screen.getByLabelText('Show ideas by status')
  await user.click(within(filters).getByText('Planned'))

  expect(screen.queryByText('shoot this week')).not.toBeInTheDocument()
  expect(screen.getByText('waiting on the new route')).toBeInTheDocument()
})

test('Check a filter with nothing in it says so instead of looking broken', async () => {
  const user = userEvent.setup()

  const ideas = [
    { title: 'shoot this week', id: 'a', text: 'ready', updated: false, time: 0, status: 'todo' as const, notes: '' },
  ]

  render(<Ideas />, { ideas })

  const filters = screen.getByLabelText('Show ideas by status')
  await user.click(within(filters).getByText('Done'))

  expect(screen.getByText('Nothing is done right now.')).toBeInTheDocument()
  expect(screen.queryByText('shoot this week')).not.toBeInTheDocument()
})

test('Check tags are shown and clicking one filters the board to it', async () => {
  const user = userEvent.setup()

  const ideas = [
    { title: 'guard run', id: 'a', text: 'ready', updated: false, time: 0, status: 'todo' as const, notes: '', tags: ['video', 'script'] },
    { title: 'thread about signalling', id: 'b', text: 'text only', updated: false, time: 0, status: 'todo' as const, notes: '', tags: ['post'] },
  ]

  render(<Ideas />, { ideas })

  expect(screen.getByText('video')).toBeInTheDocument()
  expect(screen.getByText('post')).toBeInTheDocument()

  await user.click(screen.getByRole('button', { name: 'video' }))

  expect(screen.getByText('guard run')).toBeInTheDocument()
  expect(screen.queryByText('thread about signalling')).not.toBeInTheDocument()

  // clicking the same tag again clears it
  await user.click(screen.getByRole('button', { name: 'video' }))
  expect(screen.getByText('thread about signalling')).toBeInTheDocument()
})

test('Check a tag filter and a status filter narrow together', async () => {
  const user = userEvent.setup()

  const ideas = [
    { title: 'guard run', id: 'a', text: 'ready', updated: false, time: 0, status: 'done' as const, notes: '', tags: ['video'] },
    { title: 'circle line', id: 'b', text: 'ready', updated: false, time: 0, status: 'todo' as const, notes: '', tags: ['video'] },
  ]

  render(<Ideas />, { ideas })

  await user.click(screen.getAllByRole('button', { name: 'video' })[0])
  const filters = screen.getByLabelText('Show ideas by status')
  await user.click(within(filters).getByText('Done'))

  expect(screen.getByText('guard run')).toBeInTheDocument()
  expect(screen.queryByText('circle line')).not.toBeInTheDocument()

  await user.click(within(filters).getByText('In progress'))
  expect(screen.getByText('Nothing tagged video is in progress.')).toBeInTheDocument()
})
