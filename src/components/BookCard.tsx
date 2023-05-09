import { clsx } from 'clsx'

import { BookCover } from './BookCover'
import { RatingStarsView } from './RatingStarsView'

interface BookCardProps {
  title: string
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
  title,
  author,
  ratingStarsAmount,
  cover,
  hasAlreadyBeenRead = false,
}: BookCardProps) {
  return (
    <article>
      <button
        type="button"
        className={clsx(
          'w-full relative flex items-stretch gap-5 bg-gray-700 px-5 py-4 rounded-sm cursor-pointer outline-none border-2 border-transparent transition-colors hover:border-gray-600 focus:border-gray-600',
          {
            'before:transition-opacity hover:before:opacity-0 before:content-["LIDO"] before:absolute before:right-[-1.5px] before:top-[-1.5px] before:rounded-tr-xs before:rounded-bl-xs before:px-3 before:py-1 before:bg-green-300 before:text-green-100 before:text-xs before:font-bold before:leading-shorter':
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
            <strong className="block max-w-40 font-bold leading-short">
              {title}
            </strong>
            <span className="text-sm leading-base text-gray-400">{author}</span>
          </div>

          <RatingStarsView ratingStarsAmount={ratingStarsAmount} />
        </div>
      </button>
    </article>
  )
}
