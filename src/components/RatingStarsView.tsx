import { ForwardedRef, forwardRef } from 'react'
import { Star } from 'phosphor-react'
import { clsx } from 'clsx'

interface RatingStarsViewProps {
  ratingStarsAmount: number
  label: string
  size?: 'sm' | 'md' | 'lg'
}

export const RatingStarsView = forwardRef(
  (
    { ratingStarsAmount, label, size = 'sm' }: RatingStarsViewProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    return (
      <div ref={ref} className="flex items-center gap-1" aria-label={label}>
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
  },
)

RatingStarsView.displayName = 'RatingStarsView'
