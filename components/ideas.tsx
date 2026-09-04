import { useContext, useEffect, useRef, useState } from 'react'

//

import Form from './form'
import { PencilIcon, TrashIcon } from './icons'
import { IdeasContext } from '../src/App'

//

function Ideas({ isReachable = true }: { isReachable?: boolean }) {
  const { ideas, dispatch, getDate } = useContext(IdeasContext)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [confirmingId, setConfirmingId] = useState<string | null>(null)

  // the one authored moment on this surface: an idea arriving on the board.
  // everything already there stays still.
  const [arrivedId, setArrivedId] = useState<string | null>(null)
  const seenIds = useRef<string[] | null>(null)

  const written = ideas.filter((idea) => idea.title)

  useEffect(() => {
    const ids = written.map((idea) => idea.id)
    if (seenIds.current === null) {
      seenIds.current = ids
      return
    }
    const fresh = ids.find((id) => id !== null && !seenIds.current.includes(id))
    seenIds.current = ids
    if (fresh) setArrivedId(fresh)
  }, [written.map((idea) => idea.id).join()])

  // with nothing loaded and no way to load it, saying "0 ideas" would be a
  // claim we cannot make
  if (!isReachable && written.length === 0) return null

  if (written.length === 0) {
    return (
      <p className='board-empty'>
        Nothing written down yet. The first idea goes above.
      </p>
    )
  }

  return (
    <ul className='entries'>
      {written.map((idea) => {
        const { title, text, updated, id, time } = idea
        const isEditing = id !== null && editingId === id
        const isConfirming = id !== null && confirmingId === id

        if (isEditing) {
          return (
            <li key={id} className='entry entry--editing'>
              <Form
                initialTitle={title}
                initialText={text}
                submitLabel='Save changes'
                onCancel={() => setEditingId(null)}
                onSubmit={(newTitle, newText) => {
                  dispatch({
                    type: 'update',
                    title: newTitle,
                    text: newText,
                    id,
                  })
                  setEditingId(null)
                }}
              />
            </li>
          )
        }

        return (
          <li
            key={id}
            className={
              id !== null && id === arrivedId ? 'entry entry--arrived' : 'entry'
            }>
            <div className='entry-head'>
              <p data-testid='card-title' className='entry-title'>
                {title}
              </p>

              <div className='entry-actions'>
                <button
                  type='button'
                  className='icon-btn'
                  aria-label={`edit ${title}`}
                  onClick={() => {
                    setConfirmingId(null)
                    setEditingId(id)
                  }}>
                  <PencilIcon />
                </button>
                <button
                  type='button'
                  className='icon-btn icon-btn--danger'
                  aria-label={`delete ${title}`}
                  onClick={() => setConfirmingId(id)}>
                  <TrashIcon />
                </button>
              </div>
            </div>

            {text && (
              <p data-testid='card-text' className='entry-text'>
                {text}
              </p>
            )}

            <p className='entry-time'>
              {updated ? `Updated ${getDate(time)}` : `Written ${getDate(time)}`}
            </p>

            {isConfirming && (
              <div className='entry-confirm' role='alert'>
                <p>Delete this idea?</p>
                <div className='entry-confirm-actions'>
                  <button
                    type='button'
                    className='btn btn-ghost'
                    onClick={() => setConfirmingId(null)}>
                    Keep it
                  </button>
                  <button
                    type='button'
                    className='btn btn-danger'
                    onClick={() => {
                      setConfirmingId(null)
                      dispatch({ type: 'delete', id })
                    }}>
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}

export default Ideas
