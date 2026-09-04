/* eslint-disable prettier/prettier */
export const TAG_MAX = 24
export const TAGS_MAX = 12

// a starting vocabulary only - any tag can be typed, and whatever is already
// on the board is suggested alongside these
export const SUGGESTED_TAGS = [
  'video',
  'short',
  'post',
  'script',
  'thumbnail',
  'series',
  'collab',
  'research',
  'b-roll',
  'sponsor',
]

export const STATUSES = ['planned', 'todo', 'in-progress', 'done'] as const

export type StatusType = (typeof STATUSES)[number]

export const STATUS_LABELS: Record<StatusType, string> = {
  planned: 'Planned',
  todo: 'To do',
  'in-progress': 'In progress',
  done: 'Done',
}

export interface ActionType {
  type: string;
  text?: string;
  title?: string;
  sortType?: string;
  id?: string | null;
  time?:number,
  updated?:boolean,
  status?: StatusType,
  notes?: string,
  tags?: string[],
  ideas?: IdeasType[]
}

export interface IdeasType {
  id: string | null;
  title: string;
  text: string;
  updated: boolean;
  time: number;
  status?: StatusType;
  notes?: string;
  tags?: string[];
}

export interface GlobalStateType{
  dispatch: React.Dispatch<ActionType>;
  ideas: IdeasType[]
  getDate: (date: number) => string
}

export interface SelectedItemType {
  title: string,
  text: string,
  id:  string | null,
}