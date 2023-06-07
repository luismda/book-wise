import { PaginationItem } from './PaginationItem'

interface PaginationProps {
  totalCountOfRegisters: number
  registersPerPage?: number
  currentPage?: number
  onPageChange: (page: number) => void
}

const siblingsCount = 1

function generatePagesArray(from: number, to: number) {
  return [...new Array(to - from)]
    .map((_, index) => from + index + 1)
    .filter((page) => page > 0)
}

export function Pagination({
  totalCountOfRegisters,
  registersPerPage = 12,
  currentPage = 1,
  onPageChange,
}: PaginationProps) {
  const lastPage = Math.ceil(totalCountOfRegisters / registersPerPage)

  const previousPages =
    currentPage > 1
      ? generatePagesArray(currentPage - 1 - siblingsCount, currentPage - 1)
      : []

  const nextPages =
    currentPage < lastPage
      ? generatePagesArray(
          currentPage,
          Math.min(currentPage + siblingsCount, lastPage),
        )
      : []

  return (
    <div className="mt-4 flex items-center justify-end gap-2">
      {currentPage > 1 + siblingsCount && (
        <>
          <PaginationItem number={1} onPageChange={onPageChange} />
          {currentPage > 2 + siblingsCount && (
            <span className="w-8 text-center text-gray-300">...</span>
          )}
        </>
      )}

      {previousPages.length > 0 &&
        previousPages.map((page) => {
          return (
            <PaginationItem
              key={page}
              number={page}
              onPageChange={onPageChange}
            />
          )
        })}

      <PaginationItem
        number={currentPage}
        isCurrent
        onPageChange={onPageChange}
      />

      {nextPages.length > 0 &&
        nextPages.map((page) => {
          return (
            <PaginationItem
              key={page}
              number={page}
              onPageChange={onPageChange}
            />
          )
        })}

      {currentPage + siblingsCount < lastPage && (
        <>
          {currentPage + 1 + siblingsCount < lastPage && (
            <span className="w-8 text-center text-gray-300">...</span>
          )}
          <PaginationItem number={lastPage} onPageChange={onPageChange} />
        </>
      )}
    </div>
  )
}
