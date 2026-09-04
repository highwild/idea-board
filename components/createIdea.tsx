import { useContext } from 'react'

//

import { v4 as uuid } from 'uuid'
import Form from './form'
import { IdeasContext } from '../src/App'

//

// The composer is the first line of the board and is always open: writing an
// idea down costs nothing and never covers what is already there.
function CreateIdea() {
  const { dispatch } = useContext(IdeasContext)

  return (
    <Form
      submitLabel='Save idea'
      onCancel={() => null}
      onSubmit={(title, text, tags) => {
        dispatch({ type: 'submit', title, text, tags, id: uuid() })
      }}
    />
  )
}

export default CreateIdea
