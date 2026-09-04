import React, { useEffect, useRef, useState } from 'react'

//

import { ChevronIcon } from './icons'

//

const URL_RE = /(https?:\/\/[^\s<>"']+)/g

// notes are where links live - imgur dumps, references, footage - so they are
// rendered as links rather than as text that has to be copied out by hand
function withLinks(notes: string) {
  return notes.split(URL_RE).map((part, index) => {
    const key = `${index}-${part.slice(0, 24)}`
    if (!URL_RE.test(part)) return <span key={key}>{part}</span>
    URL_RE.lastIndex = 0
    return (
      <a key={key} href={part} target='_blank' rel='noreferrer noopener'>
        {part}
      </a>
    )
  })
}

//

interface NotesPropType {
  notes: string;
  ideaTitle: string;
  onSave: (notes: string) => void;
}

function Notes({ notes, ideaTitle, onSave }: NotesPropType) {
  const [isOpen, setIsOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(notes)
  const fieldRef = useRef<HTMLTextAreaElement>(null)

  const hasNotes = notes.trim().length > 0

  useEffect(() => {
    setDraft(notes)
  }, [notes])

  useEffect(() => {
    const field = fieldRef.current
    if (!field) return
    field.focus()
    field.style.height = 'auto'
    field.style.height = `${field.scrollHeight}px`
  }, [isEditing, draft])

  const save = () => {
    onSave(draft)
    setIsEditing(false)
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape' && draft === notes) {
      setIsEditing(false)
      return
    }
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault()
      save()
    }
  }

  return (
    <div className='notes'>
      <button
        type='button'
        className='notes-toggle'
        aria-expanded={isOpen}
        aria-label={`notes on ${ideaTitle}`}
        onClick={() => setIsOpen((open) => !open)}>
        <ChevronIcon
          className={isOpen ? 'notes-chevron notes-chevron--open' : 'notes-chevron'}
        />
        <span>Notes</span>
        {hasNotes && <span className='notes-marker' aria-hidden='true' />}
      </button>

      {isOpen && (
        <div className='notes-body'>
          {isEditing ? (
            <div onKeyDown={handleKeyDown}>
              <textarea
                className='notes-field'
                placeholder='Links, references, editing notes'
                value={draft}
                ref={fieldRef}
                rows={4}
                onChange={(e) => setDraft(e.target.value)}
              />
              <div className='notes-actions'>
                <button
                  type='button'
                  className='btn btn-ghost'
                  onClick={() => {
                    setDraft(notes)
                    setIsEditing(false)
                  }}>
                  Cancel
                </button>
                <button type='button' className='btn btn-primary' onClick={save}>
                  Save notes
                </button>
              </div>
            </div>
          ) : (
            <div className='notes-content'>
              {hasNotes ? (
                <p className='notes-text'>{withLinks(notes)}</p>
              ) : (
                <p className='notes-placeholder'>Nothing written here yet.</p>
              )}
              <div className='notes-actions'>
                <button
                  type='button'
                  className='btn btn-ghost'
                  onClick={() => setIsEditing(true)}>
                  {hasNotes ? 'Edit notes' : 'Add notes'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Notes
