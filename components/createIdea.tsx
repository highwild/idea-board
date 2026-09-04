import { useContext, useState } from 'react'

//

import { v4 as uuid } from 'uuid'
import Form from './form'
import { IdeasContext } from '../src/App'

//

// The composer is the first line of the board, never a modal: writing an idea
// down costs one click and never covers what is already there.
function CreateIdea() {
  const { dispatch } = useContext(IdeasContext)
  const [isOpen, setIsOpen] = useState(false)

  if (!isOpen) {
    return (
      <button
        type='button'
        className='composer-trigger'
        onClick={() => setIsOpen(true)}>
        Write an idea
      </button>
    )
  }

  return (
    <Form
      submitLabel='Save idea'
      onCancel={() => setIsOpen(false)}
      onSubmit={(title, text) => {
        dispatch({ type: 'submit', title, text, id: uuid() })
        setIsOpen(false)
      }}
    />
  )
}

export default CreateIdea
