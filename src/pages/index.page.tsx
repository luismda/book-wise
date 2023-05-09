import Link from 'next/link'
import { CaretRight, ChartLineUp } from 'phosphor-react'

import { DefaultLayout } from '@/layouts/DefaultLayout'
import { Avatar } from '@/components/Avatar'

import bookImg from '../assets/domain-driven-design.png'
import { RatingStarsView } from '@/components/RatingStarsView'
import { BookCover } from '@/components/BookCover'

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
              <Link
                href="/profile"
                className="flex items-center gap-2 text-sm font-bold leading-base text-purple-100 px-2 py-1 rounded-xs outline-none transition-colors hover:bg-purple-100/5 focus:bg-purple-100/5 focus:underline"
              >
                Ver todas
                <CaretRight className="text-md" />
              </Link>
            </div>

            <article className="mt-4 flex gap-6 items-stretch bg-gray-600 px-6 py-5 rounded-sm">
              <BookCover bookCoverUrl={bookImg.src} altText="" />
              <div className="flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <time className="text-sm leading-base text-gray-300">
                      Há 2 dias
                    </time>
                    <RatingStarsView ratingStars={4} />
                  </div>

                  <strong className="block mt-3 font-bold leading-short">
                    Entendendo Algoritmos
                  </strong>
                  <span className="text-sm leading-base text-gray-400">
                    Aditya Bhargava
                  </span>
                </div>

                <p className="text-sm leading-base text-gray-300">
                  Nec tempor nunc in egestas. Euismod nisi eleifend at et in
                  sagittis. Penatibus id vestibulum...
                </p>
              </div>
            </article>
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
                  <RatingStarsView ratingStars={3} />
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
            <Link
              href="/explore"
              className="flex items-center gap-2 text-sm font-bold leading-base text-purple-100 px-2 py-1 rounded-xs outline-none transition-colors hover:bg-purple-100/5 focus:bg-purple-100/5 focus:underline"
            >
              Ver todos
              <CaretRight className="text-md" />
            </Link>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            <article className="flex items-stretch gap-5 bg-gray-700 px-5 py-4 rounded-sm">
              <BookCover bookCoverUrl={bookImg.src} altText="" size="xs" />
              <div className="flex flex-col justify-between">
                <div>
                  <strong className="block font-bold leading-short">
                    A revolução dos bichos
                  </strong>
                  <span className="text-sm leading-base text-gray-400">
                    George Orwell
                  </span>
                </div>

                <RatingStarsView ratingStars={5} />
              </div>
            </article>
          </div>
        </aside>
      </div>
    </div>
  )
}

Home.layout = DefaultLayout
