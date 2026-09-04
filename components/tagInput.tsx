import React, { useState } from 'react'

//

import { TAGS_MAX, TAG_MAX } from '../src/types'

//

interface TagInputPropType {
  tags: string[];
  suggestions: string[];
  onChange: (tags: string[]) => void;
}

const listId = 'tag-suggestions'

function TagInput({ tags, suggestions, onChange }: TagInputPropType) {
  const [draft, setDraft] = useState('')

  const isFull = tags.length >= TAGS_MAX

  const add = (value: string) => {
    const tag = value.trim().toLowerCase().slice(0, TAG_MAX)
    if (tag.length === 0 || tags.includes(tag) || isFull) return
    onChange([...tags, tag])
    setDraft('')
  }

  const remove = (tag: string) => onChange(tags.filter((entry) => entry !== tag))

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',') {
      // enter belongs to the tag field while there is a tag being written,
      // never to the form underneath it
      event.preventDefault()
      event.stopPropagation()
      add(draft)
      return
    }
    if (event.key === 'Backspace' && draft.length === 0 && tags.length > 0) {
      remove(tags[tags.length - 1])
    }
  }

  const unused = suggestions.filter((tag) => !tags.includes(tag))

  return (
    <div className='tag-input'>
      <div className='tag-input-row'>
        {tags.map((tag) => (
          <span key={tag} className='tag tag--editable'>
            {tag}
            <button
              type='button'
              className='tag-remove'
              aria-label={`remove tag ${tag}`}
              onClick={() => remove(tag)}>
              &times;
            </button>
          </span>
        ))}

        <input
          type='text'
          className='tag-field'
          list={listId}
          placeholder={tags.length === 0 ? 'Tags' : ''}
          aria-label='Add a tag'
          autoComplete='off'
          disabled={isFull}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => add(draft)}
        />

        <datalist id={listId}>
          {unused.map((tag) => (
            <option key={tag} value={tag} />
          ))}
        </datalist>
      </div>
    </div>
  )
}

export default TagInput
