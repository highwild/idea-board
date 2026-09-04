import { STATUSES, STATUS_LABELS, StatusType } from '../src/types'

//

interface StatusPropType {
  status: StatusType;
  ideaTitle: string;
  onChange: (status: StatusType) => void;
}

function StatusControl({ status, ideaTitle, onChange }: StatusPropType) {
  return (
    <div className='segmented' role='group' aria-label={`status of ${ideaTitle}`}>
      {STATUSES.map((value) => (
        <button
          key={value}
          type='button'
          className={`segmented-option segmented-option--${value}`}
          aria-pressed={status === value}
          onClick={() => onChange(value)}>
          {STATUS_LABELS[value]}
        </button>
      ))}
    </div>
  )
}

export default StatusControl
