import { useEffect, useRef, useState } from 'react'
import { GetServerSideProps } from 'next'
import { NextSeo } from 'next-seo'
import Link from 'next/link'
import { BookOpen, BookmarkSimple, Books, User, UserList } from 'phosphor-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'

import { getServerSession } from '@/server/lib/auth/session'
import { getUserProfileService } from '@/server/http/services/get-user-profile'
import { getUserMetricsService } from '@/server/http/services/get-user-metrics'
import { fetchRatingsOfUserService } from '@/server/http/services/fetch-ratings-of-user'

import { api } from '@/lib/axios'

import { DefaultLayout } from '@/layouts/DefaultLayout'
import {
  RatingsSearchForm,
  RatingsSearchFormData,
} from '@/components/RatingsSearchForm'
import { Heading } from '@/components/Heading'
import { Avatar } from '@/components/Avatar'
import { Metric } from '@/components/Metric'
import { Rating } from '@/components/Rating'
import { BookCover } from '@/components/BookCover'
import { RatingStarsView } from '@/components/RatingStarsView'
import { BookSideModal } from '@/components/BookSideModal'
import { Loader } from '@/components/Loader'

interface UserProfile {
  id: string
  name: string
  avatar_url: string
  created_at: string
}

interface UserMetrics {
  ratings_amount: number
  amount_of_pages_read: number
  amount_of_authors_read: number
  most_read_category: string
}

interface Book {
  id: string
  name: string
  author: string
  cover_url: string
}

interface RatingOfUser {
  id: string
  rate: number
  description: string
  created_at: string
  book: Book
}

interface ProfileProps {
  user: UserProfile
  userMetrics: UserMetrics
  initialRatingsOfUser: {
    ratings: RatingOfUser[]
    totalRatings: number
  }
}

export default function Profile({
  user,
  userMetrics,
  initialRatingsOfUser,
}: ProfileProps) {
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const loaderRef = useRef(null)

  const queryClient = useQueryClient()

  const perPage = 6

  const { data: filteredRatingsOfUser, isLoading } = useQuery(
    ['ratings', user.id, search, currentPage],
    async () => {
      const response = await api.get<{
        ratings: RatingOfUser[]
        totalRatings: number
      }>(`/ratings/users/${user.id}`, {
        params: {
          page: currentPage,
          per_page: perPage,
          query: search,
        },
      })

      const { ratings, totalRatings } = response.data

      if (search && currentPage === 1) {
        return {
          ratings,
          totalRatings,
        }
      }

      const ratingsInCache = queryClient.getQueryData<{
        ratings: RatingOfUser[]
        totalRatings: number
      }>(['ratings', user.id, search, currentPage - 1])

      if (ratingsInCache) {
        return {
          ratings: [...ratingsInCache.ratings, ...ratings],
          totalRatings,
        }
      }

      return {
        ratings: [...initialRatingsOfUser.ratings, ...ratings],
        totalRatings,
      }
    },
    {
      enabled: !!search || currentPage > 1,
    },
  )

  const totalRatings =
    filteredRatingsOfUser?.totalRatings ?? initialRatingsOfUser.totalRatings
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

  function handleSubmitRatingsSearchForm({ search }: RatingsSearchFormData) {
    setCurrentPage(1)
    setSearch(search)
  }

  const ratingsOfUser =
    filteredRatingsOfUser?.ratings ?? initialRatingsOfUser.ratings

  return (
    <>
      <NextSeo title={`Perfil de ${user.name} | BookWise`} noindex />

      <div>
        <header>
          <Heading.Root>
            <Heading.Icon>
              <User />
            </Heading.Icon>

            <Heading.Title>Perfil</Heading.Title>
          </Heading.Root>
        </header>

        <div className="mt-10 grid grid-cols-1 items-start gap-16 md:grid-cols-[1fr_19.15rem]">
          <div>
            <RatingsSearchForm onSubmit={handleSubmitRatingsSearchForm} />

            <main
              aria-live={isLoading ? 'polite' : 'off'}
              aria-busy={isLoading}
              className="mt-8 flex flex-col gap-6"
            >
              {ratingsOfUser.length < 0 ? (
                ratingsOfUser.map((rating) => {
                  return (
                    <Rating.Root key={rating.id}>
                      <Rating.Date>
                        {dayjs(rating.created_at).fromNow()}
                      </Rating.Date>

                      <Rating.Box>
                        <Rating.BookContainer>
                          <Rating.BookCover>
                            <BookSideModal.Trigger bookId={rating.book.id}>
                              <button
                                type="button"
                                aria-label={`Ver mais detalhes do livro ${rating.book.name}`}
                                className="min-w-max rounded-xs outline-none transition-all focus:ring focus:ring-gray-500"
                              >
                                <BookCover
                                  bookCoverUrl={rating.book.cover_url}
                                  altText=""
                                  size="sm"
                                />
                              </button>
                            </BookSideModal.Trigger>
                          </Rating.BookCover>

                          <Rating.BookInfoContainer>
                            <Rating.BookInfo>
                              <Rating.BookName>
                                {rating.book.name}
                              </Rating.BookName>
                              <Rating.BookAuthor>
                                {rating.book.author}
                              </Rating.BookAuthor>
                            </Rating.BookInfo>

                            <Rating.Stars>
                              <RatingStarsView
                                ratingStarsAmount={rating.rate}
                                label={`Você avaliou o livro ${
                                  rating.book.name
                                } com ${rating.rate} ${
                                  rating.rate === 1 ? 'estrela' : 'estrelas'
                                }`}
                              />
                            </Rating.Stars>
                          </Rating.BookInfoContainer>
                        </Rating.BookContainer>

                        <Rating.Description>
                          {rating.description}
                        </Rating.Description>
                      </Rating.Box>
                    </Rating.Root>
                  )
                })
              ) : (
                <p className="mx-auto max-w-[340px] text-center text-sm leading-base text-gray-300">
                  Você ainda não tem nenhuma avaliação.{' '}
                  <Link
                    href="/explore"
                    className="underline outline-none transition-colors hover:text-gray-100 focus:text-gray-100"
                  >
                    Explore
                  </Link>{' '}
                  os livros disponíveis e avalie algum que você já leu.
                </p>
              )}

              <div ref={loaderRef} className="mt-4 flex justify-center">
                {currentPage <= lastPage &&
                  totalRatings > perPage &&
                  isLoading && <Loader />}
              </div>
            </main>
          </div>

          <aside className="order-first md:order-last md:border-l md:border-gray-700">
            <div className="flex flex-col items-center">
              <Avatar avatarUrl={user.avatar_url} size="lg" />

              <strong className="mt-5 text-xl leading-short">
                {user.name}
              </strong>
              <span className="text-sm leading-base text-gray-400">
                membro desde {new Date(user.created_at).getFullYear()}
              </span>
            </div>

            <div className="mx-auto my-8 h-1 w-8 rounded-full bg-gradient-horizontal" />

            <div className="flex flex-col gap-10 px-13 py-5">
              <Metric.Root>
                <Metric.Icon>
                  <BookOpen />
                </Metric.Icon>

                <Metric.Content>
                  <Metric.Value>
                    {userMetrics.amount_of_pages_read}
                  </Metric.Value>
                  <Metric.Name>Páginas lidas</Metric.Name>
                </Metric.Content>
              </Metric.Root>

              <Metric.Root>
                <Metric.Icon>
                  <Books />
                </Metric.Icon>

                <Metric.Content>
                  <Metric.Value>{userMetrics.ratings_amount}</Metric.Value>
                  <Metric.Name>
                    {userMetrics.ratings_amount === 1
                      ? 'Livro avaliado'
                      : 'Livros avaliados'}
                  </Metric.Name>
                </Metric.Content>
              </Metric.Root>

              <Metric.Root>
                <Metric.Icon>
                  <UserList />
                </Metric.Icon>

                <Metric.Content>
                  <Metric.Value>
                    {userMetrics.amount_of_authors_read}
                  </Metric.Value>
                  <Metric.Name>
                    {userMetrics.amount_of_authors_read === 1
                      ? 'Autor lido'
                      : 'Autores lidos'}
                  </Metric.Name>
                </Metric.Content>
              </Metric.Root>

              <Metric.Root>
                <Metric.Icon>
                  <BookmarkSimple />
                </Metric.Icon>

                <Metric.Content>
                  <Metric.Value>{userMetrics.most_read_category}</Metric.Value>
                  <Metric.Name>Categoria mais lida</Metric.Name>
                </Metric.Content>
              </Metric.Root>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}

Profile.layout = DefaultLayout

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(req, res)

  if (!session) {
    return {
      redirect: {
        destination: '/sign-in',
        permanent: false,
      },
    }
  }

  const userId = session.user.id

  const user = await getUserProfileService({ userId })
  const userMetrics = await getUserMetricsService({ userId })

  const initialRatingsOfUser = await fetchRatingsOfUserService({
    page: 1,
    perPage: 6,
    userId,
  })

  return {
    props: {
      user,
      userMetrics,
      initialRatingsOfUser,
    },
  }
}
