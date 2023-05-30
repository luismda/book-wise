import { Star } from 'phosphor-react'
import { clsx } from 'clsx'

interface RatingStarsViewProps {
  ratingStarsAmount: number
  size?: 'sm' | 'md' | 'lg'
}

export function RatingStarsView({
  ratingStarsAmount,
  size = 'sm',
}: RatingStarsViewProps) {
  return (
    <div
      className="flex items-center gap-1"
      aria-label={`Avaliação com ${ratingStarsAmount} ${
        ratingStarsAmount === 1 ? 'estrela' : 'estrelas'
      }`}
    >
      {Array.from({ length: 5 }).map((_, i) => {
        return (
          <Star
            key={i}
            weight={i + 1 <= ratingStarsAmount ? 'fill' : 'regular'}
            className={clsx('text-purple-100', {
              'h-4 w-4': size === 'sm',
              'h-5 w-5': size === 'md',
              'h-7 w-7': size === 'lg',
            })}
          />
        )
      })}
    </div>
  )
}
