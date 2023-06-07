import { useState } from 'react'
import { GetStaticProps } from 'next'
import { NextSeo } from 'next-seo'
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
import { Pagination } from '@/components/Pagination'

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
  initialBooks: {
    books: Book[]
    totalBooks: number
  }
}

const perPage = 12

export default function Explore({ categories, initialBooks }: ExploreProps) {
  const [search, setSearch] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)

  const { data, isLoading } = useQuery(
    ['books', search, selectedCategories.join(','), currentPage],
    async () => {
      const response = await api.get<{ books: Book[]; totalBooks: number }>(
        '/books',
        {
          params: {
            page: currentPage,
            per_page: perPage,
            query: search,
            categories: selectedCategories,
          },
          paramsSerializer(params) {
            return qs.stringify(params, { arrayFormat: 'repeat' })
          },
        },
      )

      const { books, totalBooks } = response.data

      return {
        books,
        totalBooks,
      }
    },
    {
      enabled: !!search || !!selectedCategories.length || currentPage > 1,
    },
  )

  function handleSubmitBooksSearchForm({ search }: BooksSearchFormData) {
    setCurrentPage(1)
    setSearch(search)
  }

  function handleToggleCheckedCategory(categoryId: string) {
    setCurrentPage(1)

    setSelectedCategories((categories) => {
      if (categories.includes(categoryId)) {
        return categories.filter((category) => category !== categoryId)
      }

      return [...categories, categoryId]
    })
  }

  function handleClearAllSelectedCategories() {
    setCurrentPage(1)
    setSelectedCategories([])
  }

  const books = data?.books ?? initialBooks.books

  return (
    <>
      <NextSeo
        title="Explore e busque o seu livro favorito | BookWise"
        description="Encontre livros buscando por nome ou autor e filtrando por categorias."
      />

      <div>
        <header className="flex flex-wrap items-start justify-between gap-4">
          <Heading.Root>
            <Heading.Icon>
              <Binoculars />
            </Heading.Icon>

            <Heading.Title>Explorar</Heading.Title>
          </Heading.Root>

          <div className="w-full md:max-w-[420px]">
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

        <main
          aria-live={isLoading ? 'polite' : 'off'}
          aria-busy={isLoading}
          className="mt-13 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
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

        <Pagination
          totalCountOfRegisters={data?.totalBooks ?? initialBooks.totalBooks}
          registersPerPage={perPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </>
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
