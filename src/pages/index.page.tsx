import { useRef, useEffect, useState } from 'react'
import { GetServerSideProps } from 'next'
import { NextSeo } from 'next-seo'
import { CaretRight, ChartLineUp } from 'phosphor-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { getServerSession } from '@/server/lib/auth/session'
import { fetchRatingsService } from '@/server/http/services/fetch-ratings'
import { fetchPopularBooksService } from '@/server/http/services/fetch-popular-books'
import { getUserLastRatingService } from '@/server/http/services/get-user-last-rating'

import { api } from '@/lib/axios'

import { DefaultLayout } from '@/layouts/DefaultLayout'
import { Link } from '@/components/Link'
import { BookCard } from '@/components/BookCard'
import { SummaryRating } from '@/components/SummaryRating'
import { UserSummaryRating } from '@/components/UserSummaryRating'
import { Heading } from '@/components/Heading'
import { Loader } from '@/components/Loader'

interface Book {
  id: string
  name: string
  author: string
  cover_url: string
}

interface PopularBook extends Book {
  average_grade: number
}

interface User {
  name: string
  avatar_url: string
}

interface Rating {
  id: string
  rate: number
  description: string
  created_at: string
  book: Book
  user: User
}

interface UserLastRating extends Omit<Rating, 'user'> {}

interface HomeProps {
  initialRatings: {
    ratings: Rating[]
    totalRatings: number
  }
  popularBooks: PopularBook[]
  userLastRating: UserLastRating | null
}

export default function Home({
  initialRatings,
  popularBooks,
  userLastRating,
}: HomeProps) {
  const [currentPage, setCurrentPage] = useState(1)

  const loaderRef = useRef(null)

  const queryClient = useQueryClient()

  const perPage = 6
  const lastPage = Math.ceil(initialRatings.totalRatings / perPage)

  const { data: paginatedRatings, isLoading } = useQuery(
    ['ratings', currentPage],
    async () => {
      const response = await api.get<{
        ratings: Rating[]
        totalRatings: number
      }>('/ratings', {
        params: {
          page: currentPage,
          per_page: perPage,
        },
      })

      const { ratings } = response.data

      const ratingsInCache = queryClient.getQueryData<Rating[]>([
        'ratings',
        currentPage - 1,
      ])

      if (ratingsInCache) {
        return [...ratingsInCache, ...ratings]
      }

      return [...initialRatings.ratings, ...ratings]
    },
    {
      enabled: currentPage > 1,
    },
  )

  useEffect(() => {
    const options = {
      root: null,
      threshold: 1.0,
    }

    const observer = new IntersectionObserver((entities) => {
      const target = entities[0]

      if (target.isIntersecting) {
        setCurrentPage((oldPage) => {
          if (oldPage < lastPage && initialRatings.totalRatings > perPage) {
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
  }, [lastPage, initialRatings.totalRatings])

  const ratings = paginatedRatings ?? initialRatings.ratings

  return (
    <>
      <NextSeo
        title="Encontre avaliações e livros populares | BookWise"
        description="Avalie os livros que você já leu e veja as avaliações de outros leitores."
      />

      <div>
        <header>
          <Heading.Root>
            <Heading.Icon>
              <ChartLineUp />
            </Heading.Icon>

            <Heading.Title>Início</Heading.Title>
          </Heading.Root>
        </header>

        <div className="mt-10 grid grid-cols-[1fr_20.25rem] gap-16">
          <main className="space-y-10">
            {!!userLastRating && (
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-sm leading-base">Sua última leitura</p>
                  <Link.Root href="/profile">
                    Ver todas
                    <Link.Icon>
                      <CaretRight />
                    </Link.Icon>
                  </Link.Root>
                </div>

                <SummaryRating
                  book={{
                    id: userLastRating.book.id,
                    name: userLastRating.book.name,
                    author: userLastRating.book.author,
                    cover: {
                      url: userLastRating.book.cover_url,
                      altText: '',
                    },
                  }}
                  rating={userLastRating.description}
                  ratingStarsAmount={userLastRating.rate}
                  createdAt={userLastRating.created_at}
                />
              </div>
            )}

            <div>
              <div>
                <p className="text-sm leading-base">Avaliações mais recentes</p>
              </div>

              <div
                aria-live={isLoading ? 'polite' : 'off'}
                aria-busy={isLoading}
                className="mt-4 flex flex-col gap-3"
              >
                {ratings.map((rating) => {
                  return (
                    <UserSummaryRating
                      key={rating.id}
                      book={{
                        id: rating.book.id,
                        name: rating.book.name,
                        author: rating.book.author,
                        cover: {
                          url: rating.book.cover_url,
                          altText: '',
                        },
                      }}
                      user={{
                        name: rating.user.name,
                        avatarUrl: rating.user.avatar_url,
                      }}
                      rating={rating.description}
                      ratingStarsAmount={rating.rate}
                      createdAt={rating.created_at}
                    />
                  )
                })}

                <div ref={loaderRef} className="mt-4 flex justify-center">
                  {currentPage <= lastPage &&
                    initialRatings.totalRatings > perPage &&
                    isLoading && <Loader />}
                </div>
              </div>
            </div>
          </main>

          <aside>
            <div className="flex items-center justify-between">
              <p className="text-sm leading-base">Livros populares</p>
              <Link.Root href="/explore">
                Ver todos
                <Link.Icon>
                  <CaretRight />
                </Link.Icon>
              </Link.Root>
            </div>

            <div className="mt-4 flex flex-col gap-3">
              {popularBooks.map((book) => {
                return (
                  <BookCard
                    key={book.id}
                    id={book.id}
                    name={book.name}
                    author={book.author}
                    ratingStarsAmount={book.average_grade}
                    cover={{ url: book.cover_url, altText: '', size: 'xs' }}
                  />
                )
              })}
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}

Home.layout = DefaultLayout

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(req, res)

  const ratingsService = fetchRatingsService({
    page: 1,
    perPage: 6,
    excludedUserId: session ? session.user.id : undefined,
  })
  const popularBooksService = fetchPopularBooksService({ limit: 4 })

  const [initialRatings, popularBooks] = await Promise.all([
    ratingsService,
    popularBooksService,
  ])

  let userLastRating = null

  if (session) {
    userLastRating = await getUserLastRatingService({
      userId: session.user.id,
    })
  }

  return {
    props: {
      initialRatings,
      popularBooks,
      userLastRating,
    },
  }
}
