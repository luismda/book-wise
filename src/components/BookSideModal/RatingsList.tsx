import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'

import { api } from '@/lib/axios'

import { Avatar } from '../Avatar'
import { RatingStarsView } from '../RatingStarsView'
import { RatingComment } from './RatingComment'

interface Rating {
  id: string
  rate: number
  description: string
  created_at: string
  user: {
    name: string
    avatar_url: string
  }
}

interface RatingsListProps {
  bookId: string
}

export function RatingsList({ bookId }: RatingsListProps) {
  const { data: ratings } = useQuery(['ratings', bookId], async () => {
    const response = await api.get<{ ratings: Rating[] }>(
      `/ratings/books/${bookId}`,
    )

    const { ratings } = response.data

    return ratings
  })

  if (!ratings) {
    return null
  }

  return (
    <div className="mt-4 space-y-3">
      {ratings.map((rating) => {
        return (
          <RatingComment.Root key={rating.id}>
            <RatingComment.Header>
              <RatingComment.UserContainer>
                <RatingComment.UserAvatar>
                  <Avatar avatarUrl={rating.user.avatar_url} />
                </RatingComment.UserAvatar>

                <RatingComment.UserInfoContainer>
                  <RatingComment.UserName>
                    {rating.user.name}
                  </RatingComment.UserName>
                  <RatingComment.Date>
                    {dayjs(rating.created_at).fromNow()}
                  </RatingComment.Date>
                </RatingComment.UserInfoContainer>
              </RatingComment.UserContainer>

              <RatingComment.Stars>
                <RatingStarsView ratingStarsAmount={rating.rate} />
              </RatingComment.Stars>
            </RatingComment.Header>

            <RatingComment.Comment>{rating.description}</RatingComment.Comment>
          </RatingComment.Root>
        )
      })}
    </div>
  )
}
