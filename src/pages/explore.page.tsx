import { useState } from 'react'
import { GetStaticProps } from 'next'
import { Binoculars } from 'phosphor-react'
import { useQuery } from '@tanstack/react-query'
import qs from 'qs'

import { fetchCategoriesService } from '@/server/http/services/fetch-categories'
import { fetchBooksService } from '@/server/http/services/fetch-books'

import { api } from '@/lib/axios'

import { DefaultLayout } from '@/layouts/DefaultLayout'
import { BookCard } from '@/components/BookCard'
import { CategoryTag } from '@/components/CategoryTag'
import { Heading } from '@/components/Heading'
import {
  BooksSearchForm,
  BooksSearchFormData,
} from '@/components/BooksSearchForm'

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
  initialBooks: Book[]
}

export default function Explore({ categories, initialBooks }: ExploreProps) {
  const [search, setSearch] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const { data: filteredBooks } = useQuery(
    ['books', search, selectedCategories.join(',')],
    async () => {
      const response = await api.get<{ books: Book[] }>('/books', {
        params: {
          query: search,
          categories: selectedCategories,
        },
        paramsSerializer(params) {
          return qs.stringify(params, { arrayFormat: 'repeat' })
        },
      })

      const { books } = response.data

      return books
    },
    {
      enabled: !!search || !!selectedCategories.length,
    },
  )

  function handleSubmitBooksSearchForm({ search }: BooksSearchFormData) {
    setSearch(search)
  }

  function handleToggleCheckedCategory(categoryId: string) {
    setSelectedCategories((categories) => {
      if (categories.includes(categoryId)) {
        return categories.filter((category) => category !== categoryId)
      }

      return [...categories, categoryId]
    })
  }

  function handleClearAllSelectedCategories() {
    setSelectedCategories([])
  }

  const books = filteredBooks ?? initialBooks

  return (
    <div>
      <header className="flex items-start justify-between">
        <Heading.Root>
          <Heading.Icon>
            <Binoculars />
          </Heading.Icon>

          <Heading.Title>Explorar</Heading.Title>
        </Heading.Root>

        <div className="w-full max-w-[420px]">
          <BooksSearchForm onSubmit={handleSubmitBooksSearchForm} />
        </div>
      </header>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <CategoryTag
          aria-label="Livros de todas as categorias"
          checked={selectedCategories.length === 0}
          onCheckedChange={handleClearAllSelectedCategories}
        >
          Tudo
        </CategoryTag>

        {categories.map(({ id, name }) => {
          return (
            <CategoryTag
              key={id}
              aria-label={`Livros da categoria de ${name}`}
              checked={selectedCategories.includes(id)}
              onCheckedChange={() => handleToggleCheckedCategory(id)}
            >
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
              id={book.id}
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
      initialBooks: books,
    },
    revalidate: 60 * 10, // 10 minutes
  }
}
