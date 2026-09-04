import userEvent from '@testing-library/user-event'
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

  await user.click(screen.getByText('In progress'))

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
