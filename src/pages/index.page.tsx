import { GetServerSideProps } from 'next'
import { CaretRight, ChartLineUp } from 'phosphor-react'

import { getServerSession } from '@/server/lib/auth/session'

import { DefaultLayout } from '@/layouts/DefaultLayout'

import { api } from '@/lib/axios'

import { Link } from '@/components/Link'
import { BookCard } from '@/components/BookCard'
import { SummaryRating } from '@/components/SummaryRating'
import { UserSummaryRating } from '@/components/UserSummaryRating'

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
  ratings: Rating[]
  popularBooks: PopularBook[]
  userLastRating: UserLastRating | null
}

export default function Home({
  ratings,
  popularBooks,
  userLastRating,
}: HomeProps) {
  return (
    <div>
      <header>
        <div className="flex items-center gap-3">
          <ChartLineUp className="w-8 h-8 text-green-100" />
          <h1 className="font-bold text-2xl leading-short">Início</h1>
        </div>
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
                  name: userLastRating.book.name,
                  author: userLastRating.book.author,
                  cover: {
                    url: userLastRating.book.cover_url,
                    altText: '',
                  },
                }}
                rating={userLastRating.description}
                ratingStarsAmount={userLastRating.rate}
                createdAt={new Date(userLastRating.created_at)}
              />
            </div>
          )}

          <div>
            <div>
              <p className="text-sm leading-base">Avaliações mais recentes</p>
            </div>

            <div className="mt-4 flex flex-col gap-3">
              {ratings.map((rating) => {
                return (
                  <UserSummaryRating
                    key={rating.id}
                    book={{
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
                    createdAt={new Date(rating.created_at)}
                  />
                )
              })}
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
  )
}

Home.layout = DefaultLayout

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(req, res)

  const ratingsRequest = api.get<{ ratings: Rating[] }>('/ratings')

  const popularBooksRequest = api.get<{ books: PopularBook[] }>(
    '/books/populars',
    {
      params: {
        limit: 4,
      },
    },
  )

  const [ratingsResponse, popularBooksResponse] = await Promise.all([
    ratingsRequest,
    popularBooksRequest,
  ])

  const { ratings } = ratingsResponse.data
  const { books: popularBooks } = popularBooksResponse.data

  let userLastRating: UserLastRating | null = null

  if (session) {
    const userLastRatingResponse = await api.get<{ rating: UserLastRating }>(
      '/ratings/users/last',
      {
        headers: req.headers,
      },
    )

    userLastRating = userLastRatingResponse.data.rating
  }

  return {
    props: {
      ratings,
      popularBooks,
      userLastRating,
    },
  }
}
