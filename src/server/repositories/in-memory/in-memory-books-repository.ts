import { randomUUID } from 'node:crypto'
import {
  Book,
  BookCreateInput,
  BookFindManyParams,
  BooksRepository,
} from '../books-repository'
import { RatingsRepository } from '../ratings-repository'
import { calculateAverageGrade } from '@/server/utils/calculate-average-grade'
import { CategoriesOnBooksRepository } from '../categories-on-books-repository'
import { CategoriesRepository } from '../categories-repository'

export class InMemoryBooksRepository implements BooksRepository {
  constructor(
    private ratingsRepository?: RatingsRepository,
    private categoriesOnBooksRepository?: CategoriesOnBooksRepository,
    private categoriesRepository?: CategoriesRepository,
  ) {}

  private books: Book[] = []

  async findById(id: string) {
    const book = this.books.find((book) => book.id === id)

    if (!book) {
      return null
    }

    return book
  }

  async findByIdWithRelationships(id: string) {
    const book = this.books.find((book) => book.id === id)

    if (!book) {
      return null
    }

    const ratings = (await this.ratingsRepository?.list()) ?? []
    const categories = (await this.categoriesRepository?.list()) ?? []
    const categoriesOnBooks =
      (await this.categoriesOnBooksRepository?.list()) ?? []

    const ratingsOfBook = ratings.filter((rating) => rating.book_id === book.id)
    const gradesOfBook = ratingsOfBook.map((rating) => rating.rate)

    const averageGrade = calculateAverageGrade(gradesOfBook)

    const ratingsAmount = ratingsOfBook.length

    const categoriesOfBook = categoriesOnBooks.filter(
      (category) => category.book_id === book.id,
    )
    const categoryNamesOfBook = categoriesOfBook.reduce<string[]>(
      (acc, categoryOfBook) => {
        const categoryName = categories.find(
          (category) => category.id === categoryOfBook.category_id,
        )

        if (categoryName) {
          acc.push(categoryName.name)
        }

        return acc
      },
      [],
    )

    return {
      ...book,
      average_grade: averageGrade,
      ratings_amount: ratingsAmount,
      categories: categoryNamesOfBook,
    }
  }

  async findMany({ page, perPage, categoriesId, query }: BookFindManyParams) {
    const ratings = (await this.ratingsRepository?.list()) ?? []
    const categoriesOnBooks =
      (await this.categoriesOnBooksRepository?.list()) ?? []

    const books = this.books
      .slice((page - 1) * perPage, page * perPage)
      .map((book) => {
        const gradesOfBook = ratings
          .filter((rating) => rating.book_id === book.id)
          .map((rating) => rating.rate)

        const averageGrade = calculateAverageGrade(gradesOfBook)

        return {
          ...book,
          average_grade: averageGrade,
        }
      })
      .filter((book) => {
        if (categoriesId) {
          const categoriesOfBook = categoriesOnBooks.filter(
            (categoryOnBook) => categoryOnBook.book_id === book.id,
          )

          return categoriesOfBook.some((categoryOfBook) =>
            categoriesId.includes(categoryOfBook.category_id),
          )
        }

        return true
      })
      .filter((book) => {
        if (query) {
          return book.name.includes(query) || book.author.includes(query)
        }

        return true
      })

    return books
  }

  async findManyByPopularity(limit: number) {
    const ratings = (await this.ratingsRepository?.list()) ?? []

    const books = this.books
      .sort((bookA, bookB) => {
        const [ratingsAmountOfBookA, ratingsAmountOfBookB] = ratings.reduce(
          (acc, rating) => {
            if (rating.book_id === bookA.id) {
              acc[0] += 1
            }

            if (rating.book_id === bookB.id) {
              acc[1] += 1
            }

            return acc
          },
          [0, 0],
        )

        return ratingsAmountOfBookB - ratingsAmountOfBookA
      })
      .map((book) => {
        const gradesOfBook = ratings
          .filter((rating) => rating.book_id === book.id)
          .map((rating) => rating.rate)

        const averageGrade = calculateAverageGrade(gradesOfBook)

        return {
          ...book,
          average_grade: averageGrade,
        }
      })
      .slice(0, limit)

    return books
  }

  async create(data: BookCreateInput) {
    const book: Book = {
      id: randomUUID(),
      name: data.name,
      author: data.author,
      summary: data.summary,
      cover_url: data.cover_url,
      total_pages: data.total_pages,
      created_at: new Date(),
    }

    this.books.push(book)

    return book
  }

  async list() {
    return this.books
  }
}
