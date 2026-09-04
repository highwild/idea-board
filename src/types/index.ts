/* eslint-disable prettier/prettier */
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