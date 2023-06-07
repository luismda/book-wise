import { useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import colors from 'tailwindcss/colors'

import { api } from '@/lib/axios'

import { Avatar } from '../Avatar'
import { RatingStarsView } from '../RatingStarsView'
import { RatingComment } from './RatingComment'
import { Loader } from '../Loader'

interface Rating {
  id: string
  rate: number
  description: string
  created_at: string
  user: {
    id: string
    name: string
    avatar_url: string
  }
}

interface RatingsListProps {
  bookId: string
}

export function RatingsList({ bookId }: RatingsListProps) {
  const [currentPage, setCurrentPage] = useState(1)

  const loaderRef = useRef(null)

  const queryClient = useQueryClient()

  const session = useSession()

  const perPage = 6

  const {
    data: paginatedRatings,
    isLoading,
    isFetching,
  } = useQuery(['ratings', bookId, currentPage], async () => {
    const response = await api.get<{
      ratings: Rating[]
      totalRatings: number
    }>(`/ratings/books/${bookId}`, {
      params: {
        page: currentPage,
        per_page: perPage,
      },
    })

    const { ratings, totalRatings } = response.data

    const ratingsInCache = queryClient.getQueryData<{
      ratings: Rating[]
      totalRatings: number
    }>(['ratings', bookId, currentPage - 1])

    if (ratingsInCache) {
      return {
        ratings: [...ratingsInCache.ratings, ...ratings],
        totalRatings,
      }
    }

    return {
      ratings,
      totalRatings,
    }
  })

  const totalRatings = paginatedRatings?.totalRatings ?? 0
  const lastPage = Math.ceil(totalRatings / perPage)

  useEffect(() => {
    const options = {
      root: null,
      threshold: 1.0,
    }

    const observer = new IntersectionObserver((entities) => {
      const target = entities[0]

      if (target.isIntersecting) {
        setCurrentPage((oldPage) => {
          if (oldPage < lastPage && totalRatings > perPage) {
            return oldPage + 1
          }

          return oldPage
        })
      }
    }, options)

    if (loaderRef.current) {
      observer.observe(loaderRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [lastPage, totalRatings])

  const userAuthenticated = session.data?.user
  const ratings = paginatedRatings?.ratings ?? []

  if (isLoading) {
    return (
      <SkeletonTheme
        baseColor={colors.gray[800]}
        highlightColor={colors.gray[700]}
      >
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => {
            return (
              <RatingComment.Root key={index}>
                <RatingComment.Header>
                  <RatingComment.UserContainer>
                    <RatingComment.UserAvatar>
                      <div>
                        <Skeleton
                          width="2.5rem"
                          height="2.5rem"
                          borderRadius="50%"
                        />
                      </div>
                    </RatingComment.UserAvatar>

                    <RatingComment.UserInfoContainer>
                      <RatingComment.UserName>
                        <Skeleton />
                      </RatingComment.UserName>
                      <RatingComment.Date>
                        <Skeleton />
                      </RatingComment.Date>
                    </RatingComment.UserInfoContainer>
                  </RatingComment.UserContainer>

                  <RatingComment.Stars>
                    <div>
                      <Skeleton width="6rem" height="1rem" />
                    </div>
                  </RatingComment.Stars>
                </RatingComment.Header>

                <RatingComment.Comment>
                  <Skeleton count={3} />
                </RatingComment.Comment>
              </RatingComment.Root>
            )
          })}
        </div>
      </SkeletonTheme>
    )
  }

  return (
    <div className="space-y-3">
      {ratings?.map((rating) => {
        return (
          <RatingComment.Root
            key={rating.id}
            variant={
              userAuthenticated?.id === rating.user.id
                ? 'highlighted'
                : 'default'
            }
          >
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

      <div ref={loaderRef} className="mt-4 flex justify-center">
        {currentPage <= lastPage && totalRatings > perPage && isFetching && (
          <Loader />
        )}
      </div>
    </div>
  )
}
