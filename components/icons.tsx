// One icon family: 16px box, 1.5 stroke, round caps, drawn to the same grid.

interface IconProps {
  className?: string;
}

export function PencilIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox='0 0 16 16'
      width='16'
      height='16'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
      focusable='false'>
      <path d='M11.2 2.3a1.6 1.6 0 0 1 2.3 2.3L5.6 12.4 2.5 13.5l1.1-3.1z' />
      <path d='M10.1 3.4l2.3 2.3' />
    </svg>
  )
}

export function TrashIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox='0 0 16 16'
      width='16'
      height='16'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
      focusable='false'>
      <path d='M2.8 4.3h10.4' />
      <path d='M6.2 4.3V3.1a.8.8 0 0 1 .8-.8h2a.8.8 0 0 1 .8.8v1.2' />
      <path d='M12.1 4.3l-.5 8.3a1 1 0 0 1-1 .9H5.4a1 1 0 0 1-1-.9l-.5-8.3' />
      <path d='M6.7 6.9v4' />
      <path d='M9.3 6.9v4' />
    </svg>
  )
}
