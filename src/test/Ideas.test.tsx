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
  expect(screen.getByText('Updated on : null')).toBeInTheDocument()
  expect(screen.queryByText('Created on : null')).not.toBeInTheDocument()
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
