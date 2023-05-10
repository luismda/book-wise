import { Avatar } from './Avatar'
import { BookCover } from './BookCover'
import { RatingStarsView } from './RatingStarsView'

interface UserSummaryRatingProps {
  book: {
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
  createdAt: Date
}

export function UserSummaryRating({
  book,
  user,
  rating,
  ratingStarsAmount,
  createdAt,
}: UserSummaryRatingProps) {
  return (
    <article className="flex flex-col gap-8 bg-gray-700 p-6 rounded-sm">
      <header className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Avatar avatarUrl={user.avatarUrl} />
          <div>
            <span className="block leading-base">{user.name}</span>
            <time className="text-sm leading-base text-gray-400">Hoje</time>
          </div>
        </div>
        <RatingStarsView ratingStarsAmount={ratingStarsAmount} />
      </header>
      <div className="flex items-stretch gap-5">
        <BookCover bookCoverUrl={book.cover.url} altText={book.cover.altText} />
        <div className="flex flex-col justify-between">
          <div>
            <strong className="block font-bold leading-short">
              {book.name}
            </strong>
            <span className="text-sm leading-base text-gray-400">
              {book.author}
            </span>
          </div>

          <p className="text-sm leading-base text-gray-300 line-clamp-4">
            {rating}
          </p>
        </div>
      </div>
    </article>
  )
}
