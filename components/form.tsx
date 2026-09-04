import React, { useEffect, useRef, useState } from 'react'

//

interface FormPropType {
  initialTitle?: string;
  initialText?: string;
  submitLabel: string;
  onSubmit: (title: string, text: string) => void;
  onCancel: () => void;
}

// Shared by the composer at the top of the board and by an entry being edited
// in place. Both are the same act of writing, so they are the same form.
function Form(formProps: FormPropType) {
  const {
    initialTitle = '',
    initialText = '',
    submitLabel,
    onSubmit,
    onCancel,
  } = formProps

  const [title, setTitle] = useState(initialTitle)
  const [text, setText] = useState(initialText)
  const titleRef = useRef<HTMLInputElement>(null)
  const textRef = useRef<HTMLTextAreaElement>(null)

  const canSubmit = title.trim().length > 0 && text.trim().length > 0

  //

  useEffect(() => {
    titleRef.current?.focus()
  }, [])

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
    if (event.key === 'Escape') {
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
        ref={titleRef}
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
        <p className='composer-hint'>Ctrl + Enter to save</p>
        <div className='composer-actions'>
          <button type='button' className='btn btn-ghost' onClick={onCancel}>
            Cancel
          </button>
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
