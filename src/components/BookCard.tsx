import { clsx } from 'clsx'

import { BookCover } from './BookCover'
import { RatingStarsView } from './RatingStarsView'
import { BookSideModal } from './BookSideModal'

interface BookCardProps {
  id: string
  name: string
  author: string
  ratingStarsAmount: number
  cover: {
    url: string
    altText: string
    size: 'xs' | 'sm' | 'md'
  }
  hasAlreadyBeenRead?: boolean
}

export function BookCard({
  id,
  name,
  author,
  ratingStarsAmount,
  cover,
  hasAlreadyBeenRead = false,
}: BookCardProps) {
  return (
    <article>
      <BookSideModal.Trigger bookId={id}>
        <button
          type="button"
          aria-label={`Ver mais detalhes do livro ${name}`}
          className={clsx(
            'relative flex w-full cursor-pointer items-stretch gap-5 rounded-sm border-2 border-transparent bg-gray-700 px-5 py-4 outline-none transition-colors hover:border-gray-600 focus:border-gray-600',
            {
              'before:absolute before:right-[-1.5px] before:top-[-1.5px] before:rounded-bl-xs before:rounded-tr-xs before:bg-green-300 before:px-3 before:py-1 before:text-xs before:font-bold before:leading-shorter before:text-green-100 before:transition-opacity before:content-["LIDO"] hover:before:opacity-0':
                hasAlreadyBeenRead,
            },
          )}
        >
          <BookCover
            bookCoverUrl={cover.url}
            altText={cover.altText}
            size={cover.size}
          />
          <div className="flex flex-col justify-between">
            <div className="text-left">
              <strong className="line-clamp-2 max-w-40 font-bold leading-short">
                {name}
              </strong>
              <span className="text-sm leading-base text-gray-400">
                {author}
              </span>
            </div>

            <RatingStarsView ratingStarsAmount={ratingStarsAmount} />
          </div>
        </button>
      </BookSideModal.Trigger>
    </article>
  )
}
