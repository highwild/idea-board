import React, { useRef, useContext } from 'react'

//

import { v4 as uuid } from 'uuid'
import { IdeasContext } from '../src/App'
import { SelectedItemType } from '../src/types'
//

interface FormPropType {
  isUpdateForm: boolean;
  setIsFormVisible: React.Dispatch<React.SetStateAction<boolean>>;
  selectedItem: SelectedItemType;
}

function Form(formProps: FormPropType) {
  const { setIsFormVisible, isUpdateForm, selectedItem } = formProps
  const ideaContext = useContext(IdeasContext)
  const createTitle = useRef(null)
  const createText = useRef(null)

  //

  const handleSubmit = () => {
    if (isUpdateForm) {
      ideaContext.dispatch({
        type: 'update',
        title: createTitle.current.value,
        text: createText.current.value,
        id: selectedItem.id,
      })
      setIsFormVisible((preVis) => !preVis)
    } else {
      ideaContext.dispatch({
        type: 'submit',
        title: createTitle.current.value,
        text: createText.current.value,
        id: uuid(),
      })
      setIsFormVisible((preVis) => !preVis)
      createTitle.current.value = ''
      createText.current.value = ''
    }
  }

  //

  return (
    <div className='empty'>
      <input
        type='text'
        className='createTitle'
        placeholder='Title'
        defaultValue={isUpdateForm ? selectedItem.title : ''}
        autoComplete='false'
        ref={createTitle}
        required
      />

      <textarea
        className='createText'
        placeholder='Enter the description of your idea'
        autoComplete='false'
        defaultValue={isUpdateForm ? selectedItem.text : ''}
        ref={createText}
        rows={8}
        required
      />

      <div className='button-wrapper mt-1'>
        <button
          className='cancelBtn'
          onClick={() => setIsFormVisible((preVis) => !preVis)}>
          Cancel
        </button>

        <button
          type='submit'
          className='submitBtn'
          onClick={() => {
            handleSubmit()
          }}>
          Save Idea
        </button>
      </div>
    </div>
  )
}

export default Form
