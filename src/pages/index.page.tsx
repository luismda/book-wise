import { CaretRight, ChartLineUp } from 'phosphor-react'

import { DefaultLayout } from '@/layouts/DefaultLayout'

import bookImg from '../assets/domain-driven-design.png'
import { RatingStarsView } from '@/components/RatingStarsView'
import { BookCover } from '@/components/BookCover'
import { Avatar } from '@/components/Avatar'
import { Link } from '@/components/Link'
import { BookCard } from '@/components/BookCard'
import { SummaryRating } from '@/components/SummaryRating'

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
              name="Entendendo Algoritmos"
              author="Aditya Bhargava"
              cover={{ url: bookImg.src, altText: '' }}
              rating="Nec tempor nunc in egestas. Euismod nisi eleifend at et in sagittis. Penatibus id vestibulum imperdiet a at imperdiet lectu"
              ratingStarsAmount={4}
              createdAt={new Date()}
            />
          </div>

          <div className="mt-10">
            <div>
              <p className="text-sm leading-base">Avaliações mais recentes</p>
            </div>

            <div className="mt-4">
              <article className="flex flex-col gap-8 bg-gray-700 p-6 rounded-sm">
                <header className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <Avatar avatarUrl="https://github.com/luismda.png" />
                    <div>
                      <span className="block leading-base">Jaxson Dias</span>
                      <time className="text-sm leading-base text-gray-400">
                        Hoje
                      </time>
                    </div>
                  </div>
                  <RatingStarsView ratingStarsAmount={3} />
                </header>
                <div className="flex items-stretch gap-5">
                  <BookCover bookCoverUrl={bookImg.src} altText="" />
                  <div className="flex flex-col justify-between">
                    <div>
                      <strong className="block font-bold leading-short">
                        Entendendo Algoritmos
                      </strong>
                      <span className="text-sm leading-base text-gray-400">
                        Aditya Bhargava
                      </span>
                    </div>

                    <p className="text-sm leading-base text-gray-300">
                      Nec tempor nunc in egestas. Euismod nisi eleifend at et in
                      sagittis. Penatibus id vestibulum imperdiet a at imperdiet
                      lectu...
                    </p>
                  </div>
                </div>
              </article>
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
