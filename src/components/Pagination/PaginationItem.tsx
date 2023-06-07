import { clsx } from 'clsx'

interface PaginationItemProps {
  number: number
  isCurrent?: boolean
  onPageChange: (page: number) => void
}

export function PaginationItem({
  number,
  isCurrent = false,
  onPageChange,
}: PaginationItemProps) {
  return (
    <button
      type="button"
      aria-label={`Página ${number}`}
      aria-disabled={isCurrent}
      disabled={isCurrent}
      className={clsx(
        'h-8 w-8 rounded-sm text-sm font-bold outline-none transition-colors focus:ring',
        {
          'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-gray-200 focus:ring-gray-500':
            !isCurrent,
          'bg-purple-200 text-gray-100 focus:ring-purple-100': isCurrent,
        },
      )}
      onClick={() => onPageChange(number)}
    >
      {number}
    </button>
  )
}
