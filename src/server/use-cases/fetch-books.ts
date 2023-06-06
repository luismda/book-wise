import {
  BookWithAverageGrade,
  BooksRepository,
} from '../repositories/books-repository'

interface FetchBooksUseCaseRequest {
  page: number
  perPage: number
  categoriesId?: string[]
  query?: string
}

interface FetchBooksUseCaseResponse {
  books: BookWithAverageGrade[]
  totalBooks: number
}

export class FetchBooksUseCase {
  constructor(private booksRepository: BooksRepository) {}

  async execute({
    page,
    perPage,
    categoriesId,
    query,
  }: FetchBooksUseCaseRequest): Promise<FetchBooksUseCaseResponse> {
    const books = await this.booksRepository.findMany({
      page,
      perPage,
      categoriesId,
      query,
    })

    const totalBooks = await this.booksRepository.count({
      categoriesId,
      query,
    })

    return {
      books,
      totalBooks,
    }
  }
}
