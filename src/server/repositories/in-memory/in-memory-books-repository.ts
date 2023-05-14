import { randomUUID } from 'node:crypto'
import { Book, BookCreateInput, BooksRepository } from '../books-repository'
import { RatingsRepository } from '../ratings-repository'

export class InMemoryBooksRepository implements BooksRepository {
  constructor(private ratingsRepository?: RatingsRepository) {}

  private books: Book[] = []

  async findById(id: string) {
    const book = this.books.find((book) => book.id === id)

    if (!book) {
      return null
    }

    return book
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

        const sumOfGrades = gradesOfBook.reduce((acc, rate) => acc + rate, 0)
        const gradesAmount = gradesOfBook.length

        const averageGrade = sumOfGrades / gradesAmount

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
