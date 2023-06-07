import dayjs from 'dayjs'

import { BookCover } from './BookCover'
import { RatingStarsView } from './RatingStarsView'
import { BookSideModal } from './BookSideModal'

interface SummaryRatingProps {
  book: {
    id: string
    name: string
    author: string
    cover: {
      url: string
      altText: string
    }
  }
  rating: string
  ratingStarsAmount: number
  createdAt: string
}

export function SummaryRating({
  book,
  rating,
  ratingStarsAmount,
  createdAt,
}: SummaryRatingProps) {
  const distanceOfRatingDateToNow = dayjs(createdAt).fromNow()

  return (
    <article>
      <BookSideModal.Trigger bookId={book.id}>
        <button
          type="button"
          aria-label={`Ver mais detalhes do livro ${book.name}`}
          className="mt-4 flex w-full items-stretch gap-6 rounded-sm border-2 border-transparent bg-gray-600 px-6 py-5 outline-none transition-colors hover:border-gray-500 focus:border-gray-500"
        >
          <BookCover
            bookCoverUrl={book.cover.url}
            altText={book.cover.altText}
          />
          <div className="flex w-full flex-col justify-between text-left">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <time className="text-sm leading-base text-gray-300">
                  {distanceOfRatingDateToNow}
                </time>
                <RatingStarsView
                  ratingStarsAmount={ratingStarsAmount}
                  label={`Você avaliou o livro ${
                    book.name
                  } com ${ratingStarsAmount} ${
                    ratingStarsAmount === 1 ? 'estrela' : 'estrelas'
                  }`}
                />
              </div>

              <strong className="mt-3 line-clamp-2 font-bold leading-short">
                {book.name}
              </strong>
              <span className="text-sm leading-base text-gray-400">
                {book.author}
              </span>
            </div>

            <p className="line-clamp-2 text-sm leading-base text-gray-300">
              {rating}
            </p>
          </div>
        </button>
      </BookSideModal.Trigger>
    </article>
  )
}
