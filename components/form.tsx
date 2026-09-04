import React, { useEffect, useRef, useState } from 'react'

//

interface FormPropType {
  initialTitle?: string;
  initialText?: string;
  submitLabel: string;
  cancelLabel?: string;
  onSubmit: (title: string, text: string) => void;
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
    submitLabel,
    cancelLabel = 'Cancel',
    onSubmit,
    onCancel,
  } = formProps

  const [title, setTitle] = useState(initialTitle)
  const [text, setText] = useState(initialText)
  const textRef = useRef<HTMLTextAreaElement>(null)

  const canSubmit = title.trim().length > 0 && text.trim().length > 0
  const isDirty = title !== initialTitle || text !== initialText

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
    onSubmit(title.trim(), text.trim())
    setTitle('')
    setText('')
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
