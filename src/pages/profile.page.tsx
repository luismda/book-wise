import { GetServerSideProps } from 'next'
import { BookOpen, BookmarkSimple, Books, User, UserList } from 'phosphor-react'
import dayjs from 'dayjs'

import { getServerSession } from '@/server/lib/auth/session'
import { getUserProfileService } from '@/server/http/services/get-user-profile'
import { getUserMetricsService } from '@/server/http/services/get-user-metrics'
import { fetchRatingsOfUserService } from '@/server/http/services/fetch-ratings-of-user'

import { DefaultLayout } from '@/layouts/DefaultLayout'
import { RatingsSearchForm } from '@/components/RatingsSearchForm'
import { Heading } from '@/components/Heading'
import { Avatar } from '@/components/Avatar'
import { Metric } from '@/components/Metric'
import { Rating } from '@/components/Rating'
import { BookCover } from '@/components/BookCover'
import { RatingStarsView } from '@/components/RatingStarsView'

interface UserProfile {
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
  ratingsOfUser: RatingOfUser[]
}

export default function Profile({
  user,
  userMetrics,
  ratingsOfUser,
}: ProfileProps) {
  return (
    <div>
      <header>
        <Heading.Root>
          <Heading.Icon>
            <User />
          </Heading.Icon>

          <Heading.Title>Perfil</Heading.Title>
        </Heading.Root>
      </header>

      <div className="mt-10 grid grid-cols-[1fr_19.15rem] items-start gap-16">
        <div>
          <RatingsSearchForm onSubmit={() => {}} />

          <main className="mt-8 flex flex-col gap-6">
            {ratingsOfUser.map((rating) => {
              return (
                <Rating.Root key={rating.id}>
                  <Rating.Date>
                    {dayjs(rating.created_at).fromNow()}
                  </Rating.Date>

                  <Rating.Box>
                    <Rating.BookContainer>
                      <Rating.BookCover>
                        <BookCover
                          bookCoverUrl={rating.book.cover_url}
                          altText=""
                          size="sm"
                        />
                      </Rating.BookCover>

                      <Rating.BookInfoContainer>
                        <Rating.BookInfo>
                          <Rating.BookName>{rating.book.name}</Rating.BookName>
                          <Rating.BookAuthor>
                            {rating.book.author}
                          </Rating.BookAuthor>
                        </Rating.BookInfo>

                        <Rating.Stars>
                          <RatingStarsView ratingStarsAmount={rating.rate} />
                        </Rating.Stars>
                      </Rating.BookInfoContainer>
                    </Rating.BookContainer>

                    <Rating.Description>
                      {rating.description}
                    </Rating.Description>
                  </Rating.Box>
                </Rating.Root>
              )
            })}
          </main>
        </div>

        <aside className="border-l border-gray-700">
          <div className="flex flex-col items-center">
            <Avatar avatarUrl={user.avatar_url} size="lg" />

            <strong className="mt-5 text-xl leading-short">{user.name}</strong>
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
                <Metric.Value>{userMetrics.amount_of_pages_read}</Metric.Value>
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

  const ratingsOfUser = await fetchRatingsOfUserService({
    page: 1,
    perPage: 6,
    userId,
  })

  return {
    props: {
      user,
      userMetrics,
      ratingsOfUser,
    },
  }
}
