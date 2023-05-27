import { GetServerSideProps } from 'next'
import { CaretRight, ChartLineUp } from 'phosphor-react'

import { getServerSession } from '@/server/lib/auth/session'

import { DefaultLayout } from '@/layouts/DefaultLayout'

import bookImg from '../assets/domain-driven-design.png'
import { Link } from '@/components/Link'
import { BookCard } from '@/components/BookCard'
import { SummaryRating } from '@/components/SummaryRating'
import { UserSummaryRating } from '@/components/UserSummaryRating'

export default function Home() {
  return (
    <div>
      <header>
        <div className="flex items-center gap-3">
          <ChartLineUp className="w-8 h-8 text-green-100" />
          <h1 className="font-bold text-2xl leading-short">Início</h1>
        </div>
      </header>

      <div className="mt-10 grid grid-cols-[1fr_20.25rem] gap-16">
        <main>
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
                name: 'Entendendo Algoritmos',
                author: 'Aditya Bhargava',
                cover: {
                  url: bookImg.src,
                  altText: '',
                },
              }}
              rating="Nec tempor nunc in egestas. Euismod nisi eleifend at et in sagittis. Penatibus id vestibulum imperdiet a at imperdiet lectu"
              ratingStarsAmount={4}
              createdAt={new Date()}
            />
          </div>

          <div className="mt-10">
            <div>
              <p className="text-sm leading-base">Avaliações mais recentes</p>
            </div>

            <div className="mt-4 flex flex-col gap-3">
              <UserSummaryRating
                book={{
                  name: 'O guia do mochileiro das galáxias',
                  author: 'Douglas Adams',
                  cover: {
                    url: bookImg.src,
                    altText: '',
                  },
                }}
                user={{
                  name: 'Luis',
                  avatarUrl: 'https://github.com/luismda.png',
                }}
                rating="Semper et sapien proin vitae nisi. Feugiat neque integer donec et aenean posuere amet ultrices. Cras fermentum id pulvinar varius leo a in. Amet libero pharetra nunc elementum fringilla velit ipsum. Sed vulputate massa velit nibh."
                ratingStarsAmount={5}
                createdAt={new Date()}
              />
              <UserSummaryRating
                book={{
                  name: 'O guia do mochileiro das galáxias',
                  author: 'Douglas Adams',
                  cover: {
                    url: bookImg.src,
                    altText: '',
                  },
                }}
                user={{
                  name: 'Luis',
                  avatarUrl: 'https://github.com/luismda.png',
                }}
                rating="Semper et sapien proin vitae nisi. Feugiat neque integer donec et aenean posuere amet ultrices. Cras fermentum id pulvinar varius leo a in. Amet libero pharetra nunc elementum fringilla velit ipsum. Sed vulputate massa velit nibh."
                ratingStarsAmount={5}
                createdAt={new Date()}
              />
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
            <BookCard
              name="Entendendo Algoritmos"
              author="Aditya Y. Bhargava"
              ratingStarsAmount={4}
              cover={{ url: bookImg.src, altText: '', size: 'xs' }}
              hasAlreadyBeenRead
            />
            <BookCard
              name="14 Habitos de Desenvolvedor..."
              author="Aditya Y. Bhargava"
              ratingStarsAmount={5}
              cover={{ url: bookImg.src, altText: '', size: 'xs' }}
            />
          </div>
        </aside>
      </div>
    </div>
  )
}

Home.layout = DefaultLayout

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(req, res)

  return {
    props: {
      session,
    },
  }
}
