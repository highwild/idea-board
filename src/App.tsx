import {
  createContext,
  useReducer,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from 'react'

//

import './App.css'
import CreateIdea from '../components/createIdea'
import Ideas from '../components/ideas'
import getDate from './utils/getDate'
import reducer from './utils/reducer'
import * as api from './utils/api'
import { ActionType, GlobalStateType, IdeasType } from './types'

export const IdeasContext = createContext<GlobalStateType>(null)

const initialIdeas: IdeasType[] = []

type StatusType = 'loading' | 'ready' | 'error'

//

function App() {
  const [ideas, dispatch] = useReducer(reducer, initialIdeas)
  const [modalVisibility, setModalVisibility] = useState(false)
  const [status, setStatus] = useState<StatusType>('loading')
  const [saveError, setSaveError] = useState<string>(null)

  // pull the board from the API - also used to resync after a failed write
  const refresh = useCallback(async () => {
    try {
      const serverIdeas = await api.listIdeas()
      dispatch({ type: 'load', ideas: serverIdeas })
      setStatus('ready')
    } catch {
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  //

  // writes are optimistic: the reducer updates straight away, then we persist.
  // if the write fails we surface it and pull the server's version back down.
  const persist = useCallback(
    async (action: ActionType) => {
      try {
        if (action.type === 'submit') {
          await api.createIdea({
            id: action.id,
            title: action.title,
            text: action.text,
            time: action.time,
          })
        } else if (action.type === 'update') {
          await api.updateIdea(action.id, {
            title: action.title,
            text: action.text,
            time: action.time,
          })
        } else if (action.type === 'delete') {
          await api.deleteIdea(action.id)
        }
        setSaveError(null)
      } catch (cause) {
        setSaveError(
          cause instanceof Error ? cause.message : 'Could not save that idea'
        )
        refresh()
      }
    },
    [refresh]
  )

  const dispatchAndPersist = useCallback(
    (action: ActionType) => {
      if (action.type === 'sort' || action.type === 'load') {
        dispatch(action)
        return
      }
      const stamped = { ...action, time: action.time ?? Date.now() }
      dispatch(stamped)
      persist(stamped)
    },
    [persist]
  )

  //

  const globalState: GlobalStateType = useMemo(
    () => ({
      dispatch: dispatchAndPersist,
      ideas,
      getDate,
    }),
    [dispatchAndPersist, ideas]
  )

  //

  return (
    <IdeasContext.Provider value={globalState}>
      <div className='create-idea-wrapper'>
        <CreateIdea />

        {status === 'loading' && (
          <p className='board-status' role='status'>
            Loading ideas...
          </p>
        )}

        {status === 'error' && (
          <div className='board-status board-status--error' role='alert'>
            <span>Could not reach the idea board.</span>
            <button
              type='button'
              className='retry-btn'
              onClick={() => {
                setStatus('loading')
                refresh()
              }}>
              Try again
            </button>
          </div>
        )}

        {saveError && status !== 'error' && (
          <p className='board-status board-status--error' role='alert'>
            {saveError}
          </p>
        )}

        <Ideas
          modalVisibility={modalVisibility}
          setModalVisibility={setModalVisibility}
        />
      </div>
    </IdeasContext.Provider>
  )
}

export default App
