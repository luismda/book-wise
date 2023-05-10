import { BookCover } from './BookCover'
import { RatingStarsView } from './RatingStarsView'

interface SummaryRatingProps {
  name: string
  author: string
  cover: {
    url: string
    altText: string
  }
  rating: string
  ratingStarsAmount: number
  createdAt: Date
}

export function SummaryRating({
  name,
  author,
  cover,
  rating,
  ratingStarsAmount,
  createdAt,
}: SummaryRatingProps) {
  return (
    <article>
      <button
        type="button"
        className="mt-4 flex gap-6 items-stretch bg-gray-600 px-6 py-5 rounded-sm transition-colors outline-none border-2 border-transparent hover:border-gray-500 focus:border-gray-500"
      >
        <BookCover bookCoverUrl={cover.url} altText={cover.altText} />
        <div className="flex flex-col justify-between text-left">
          <div>
            <div className="flex items-center justify-between">
              <time className="text-sm leading-base text-gray-300">
                Há 2 dias
              </time>
              <RatingStarsView ratingStarsAmount={ratingStarsAmount} />
            </div>

            <strong className="block mt-3 font-bold leading-short">
              {name}
            </strong>
            <span className="text-sm leading-base text-gray-400">{author}</span>
          </div>

          <p className="text-sm leading-base text-gray-300 line-clamp-2">
            {rating}
          </p>
        </div>
      </button>
    </article>
  )
}
