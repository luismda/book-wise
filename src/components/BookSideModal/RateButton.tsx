import { ButtonHTMLAttributes } from 'react'
import { useSession } from 'next-auth/react'
import { useQuery } from '@tanstack/react-query'
import { clsx } from 'clsx'

import { api } from '@/lib/axios'

interface Rating {
  id: string
  user_id: string
  book_id: string
}

interface RateButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  bookId: string
  isShouldBeHidden?: boolean
}

export function RateButton({
  bookId,
  isShouldBeHidden = false,
  className,
  ...props
}: RateButtonProps) {
  const session = useSession()
  const userId = session.data?.user.id

  const { data: ratingOfUserAndBook } = useQuery(
    ['ratings', userId, bookId],
    async () => {
      const response = await api.get<{ rating: Rating | null }>(
        `/ratings/users/books/${bookId}`,
      )

      const { rating } = response.data

      return rating
    },
    {
      enabled: !!userId && !isShouldBeHidden,
    },
  )

  const isUserAlreadyRatedBook = !!ratingOfUserAndBook

  return (
    <button
      aria-hidden={isShouldBeHidden || isUserAlreadyRatedBook}
      className={clsx(
        'font-bold leading-base text-purple-100 outline-none focus:underline',
        {
          hidden: isShouldBeHidden || isUserAlreadyRatedBook,
        },
        className,
      )}
      {...props}
    />
  )
}
