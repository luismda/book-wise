import dayjs from 'dayjs'

import { Avatar } from './Avatar'
import { BookCover } from './BookCover'
import { RatingStarsView } from './RatingStarsView'
import { BookSideModal } from './BookSideModal'

interface UserSummaryRatingProps {
  book: {
    id: string
    name: string
    author: string
    cover: {
      url: string
      altText: string
    }
  }
  user: {
    name: string
    avatarUrl: string
  }
  rating: string
  ratingStarsAmount: number
  createdAt: string
}

export function UserSummaryRating({
  book,
  user,
  rating,
  ratingStarsAmount,
  createdAt,
}: UserSummaryRatingProps) {
  const distanceOfRatingDateToNow = dayjs(createdAt).fromNow()

  return (
    <article className="flex flex-col gap-8 rounded-sm bg-gray-700 p-6">
      <header className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Avatar avatarUrl={user.avatarUrl} />
          <div>
            <span className="block leading-base">{user.name}</span>
            <time className="text-sm leading-base text-gray-400">
              {distanceOfRatingDateToNow}
            </time>
          </div>
        </div>
        <RatingStarsView ratingStarsAmount={ratingStarsAmount} />
      </header>
      <div className="flex items-stretch gap-5">
        <BookSideModal.Trigger bookId={book.id}>
          <button
            type="button"
            aria-label={`Ver mais detalhes do livro ${book.name}`}
            className="min-w-max rounded-xs outline-none transition-all focus:ring focus:ring-gray-500"
          >
            <BookCover
              bookCoverUrl={book.cover.url}
              altText={book.cover.altText}
            />
          </button>
        </BookSideModal.Trigger>
        <div className="flex flex-col justify-between">
          <div>
            <strong className="line-clamp-2 font-bold leading-short">
              {book.name}
            </strong>
            <span className="text-sm leading-base text-gray-400">
              {book.author}
            </span>
          </div>

          <p className="line-clamp-4 text-sm leading-base text-gray-300">
            {rating}
          </p>
        </div>
      </div>
    </article>
  )
}
