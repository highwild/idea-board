import React, { useContext, useEffect, useRef, useState } from 'react'

//

import TagInput from './tagInput'
import { IdeasContext } from '../src/App'
import { SUGGESTED_TAGS } from '../src/types'

interface FormPropType {
  initialTitle?: string;
  initialText?: string;
  initialTags?: string[];
  submitLabel: string;
  cancelLabel?: string;
  onSubmit: (title: string, text: string, tags: string[]) => void;
  onCancel: () => void;
}

const isApplePlatform =
  typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)

// Shared by the composer at the top of the board and by an entry being edited
// in place. Both are the same act of writing, so they are the same form.
function Form(formProps: FormPropType) {
  const {
    initialTitle = '',
    initialText = '',
    initialTags = [],
    submitLabel,
    cancelLabel = 'Cancel',
    onSubmit,
    onCancel,
  } = formProps

  const [title, setTitle] = useState(initialTitle)
  const [text, setText] = useState(initialText)
  const [tags, setTags] = useState<string[]>(initialTags)
  const textRef = useRef<HTMLTextAreaElement>(null)
  const { ideas } = useContext(IdeasContext)

  // whatever is already on the board is worth suggesting before the defaults
  const suggestions = Array.from(
    new Set([
      ...ideas.flatMap((idea) => idea.tags ?? []),
      ...SUGGESTED_TAGS,
    ])
  )

  const canSubmit = title.trim().length > 0 && text.trim().length > 0
  const isDirty =
    title !== initialTitle ||
    text !== initialText ||
    tags.join() !== initialTags.join()

  //

  // the description grows with what is written in it, so a long idea is never
  // read through a five-line slot
  useEffect(() => {
    const field = textRef.current
    if (!field) return
    field.style.height = 'auto'
    field.style.height = `${field.scrollHeight}px`
  }, [text])

  //

  const handleSubmit = () => {
    if (!canSubmit) return
    onSubmit(title.trim(), text.trim(), tags)
    setTitle('')
    setText('')
    setTags([])
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    // escape closes the form, but never throws away writing that is still
    // unsaved - long drafts are the normal case here
    if (event.key === 'Escape' && !isDirty) {
      onCancel()
      return
    }
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault()
      handleSubmit()
    }
  }

  //

  return (
    <div className='composer' onKeyDown={handleKeyDown}>
      <input
        type='text'
        className='composer-title'
        placeholder='Title'
        autoComplete='off'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className='composer-text'
        placeholder='Enter the description of your idea'
        autoComplete='off'
        value={text}
        ref={textRef}
        rows={4}
        onChange={(e) => setText(e.target.value)}
      />

      <div className='composer-tags'>
        <TagInput tags={tags} suggestions={suggestions} onChange={setTags} />
      </div>

      <div className='composer-footer'>
        <p className='composer-hint'>
          {isApplePlatform ? 'Cmd' : 'Ctrl'} + Enter to save
        </p>
        <div className='composer-actions'>
          {(isDirty || cancelLabel !== 'Cancel') && (
            <button type='button' className='btn btn-ghost' onClick={onCancel}>
              {isDirty ? 'Discard' : cancelLabel}
            </button>
          )}
          <button
            type='button'
            className='btn btn-primary'
            disabled={!canSubmit}
            onClick={handleSubmit}>
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Form
