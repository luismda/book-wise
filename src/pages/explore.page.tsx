import { GetStaticProps } from 'next'
import { Binoculars, MagnifyingGlass } from 'phosphor-react'

import { fetchCategoriesService } from '@/server/http/services/fetch-categories'
import { fetchBooksService } from '@/server/http/services/fetch-books'

import { DefaultLayout } from '@/layouts/DefaultLayout'
import { BookCard } from '@/components/BookCard'
import { CategoryTag } from '@/components/CategoryTag'
import { TextInput } from '@/components/TextInput'
import { Heading } from '@/components/Heading'

interface Category {
  id: string
  name: string
}

interface Book {
  id: string
  name: string
  author: string
  cover_url: string
  average_grade: number
}

interface ExploreProps {
  categories: Category[]
  books: Book[]
}

export default function Explore({ categories, books }: ExploreProps) {
  return (
    <div>
      <header className="flex items-center justify-between">
        <Heading.Root>
          <Heading.Icon>
            <Binoculars />
          </Heading.Icon>

          <Heading.Title>Explorar</Heading.Title>
        </Heading.Root>

        <form className="w-full max-w-[420px]">
          <TextInput.Root iconPosition="right">
            <TextInput.Input
              type="text"
              placeholder="Buscar livro ou autor"
              aria-label="Digite o nome de um livro ou de um autor para buscar"
            />

            <TextInput.Icon>
              <MagnifyingGlass />
            </TextInput.Icon>
          </TextInput.Root>
        </form>
      </header>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <CategoryTag isChecked onCheckedChange={() => {}}>
          Tudo
        </CategoryTag>

        {categories.map(({ id, name }) => {
          return (
            <CategoryTag key={id} isChecked={false} onCheckedChange={() => {}}>
              {name}
            </CategoryTag>
          )
        })}
      </div>

      <main className="mt-13 grid grid-cols-3 gap-5">
        {books.map((book) => {
          return (
            <BookCard
              key={book.id}
              name={book.name}
              author={book.author}
              ratingStarsAmount={book.average_grade}
              cover={{
                url: book.cover_url,
                altText: '',
                size: 'md',
              }}
            />
          )
        })}
      </main>
    </div>
  )
}

Explore.layout = DefaultLayout

export const getStaticProps: GetStaticProps = async () => {
  const categoriesService = fetchCategoriesService()
  const booksService = fetchBooksService({ page: 1, perPage: 12 })

  const [categories, books] = await Promise.all([
    categoriesService,
    booksService,
  ])

  return {
    props: {
      categories,
      books,
    },
    revalidate: 60 * 10, // 10 minutes
  }
}
