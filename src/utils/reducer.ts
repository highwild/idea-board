import sort from './sort'
import { ActionType, IdeasType } from '../types'

export default function reducer(ideas: IdeasType[], action: ActionType) {
  switch (action.type) {
    //

    // replaces the whole board with what the server returned
    case 'load':
      return action.ideas ?? []

    //

    // new ideas join at the top, matching the newest-first order the API loads in
    case 'submit':
      return [
        {
          title: action.title,
          text: action.text,
          id: action.id,
          time: action.time ?? Date.now(),
          updated: false,
          status: action.status ?? 'todo',
          notes: action.notes ?? '',
          tags: action.tags ?? [],
        },
        ...ideas,
      ]

    //

    case 'update':
      return ideas.map((idea) => {
        if (action.id === idea.id) {
          return {
            ...idea,
            title: action.title,
            text: action.text,
            updated: true,
            time: action.time ?? Date.now(),
            tags: action.tags ?? idea.tags,
          }
        }
        return idea
      })

    //

    // status and notes only: the idea's own words and date are left alone
    case 'patch':
      return ideas.map((idea) => {
        if (action.id === idea.id) {
          return {
            ...idea,
            status: action.status ?? idea.status,
            notes: action.notes ?? idea.notes,
            tags: action.tags ?? idea.tags,
          }
        }
        return idea
      })

    //

    case 'sort':
      return sort(action.sortType, ideas)

    //

    case 'delete':
      return ideas.filter((idea) => idea.id !== action.id)

    //
    case 'setIdeas':
      return [
        ...ideas,
        {
          title: action.title,
          text: action.text,
          id: action.id,
          time: action.time,
          updated: action.updated,
        },
      ]
    default:
      return ideas
  }
}
