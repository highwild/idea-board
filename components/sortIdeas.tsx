import { useContext, useState } from 'react'

//

import { IdeasContext } from '../src/App'

const OPTIONS = [
  { value: 'default', label: 'Added' },
  { value: 'mostRecent', label: 'Newest' },
  { value: 'alphabetical', label: 'A-Z' },
]

function SortIdeas(sortProps: { isVisible: boolean }) {
  const { isVisible } = sortProps
  const ideaContext = useContext(IdeasContext)
  const [active, setActive] = useState('default')

  if (!isVisible) return null

  return (
    <div className='sort' role='group' aria-label='Sort ideas'>
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type='button'
          className='sort-option'
          aria-pressed={active === option.value}
          onClick={() => {
            setActive(option.value)
            ideaContext.dispatch({ type: 'sort', sortType: option.value })
          }}>
          {option.label}
        </button>
      ))}
    </div>
  )
}

export default SortIdeas
