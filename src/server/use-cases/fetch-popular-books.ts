import {
  BookWithAverageGrade,
  BooksRepository,
} from '../repositories/books-repository'

interface FetchPopularBooksUseCaseRequest {
  limit: number
}

interface FetchPopularBooksUseCaseResponse {
  books: BookWithAverageGrade[]
}

export class FetchPopularBooksUseCase {
  constructor(private booksRepository: BooksRepository) {}

  async execute({
    limit,
  }: FetchPopularBooksUseCaseRequest): Promise<FetchPopularBooksUseCaseResponse> {
    const books = await this.booksRepository.findManyByPopularity(limit)

    return {
      books,
    }
  }
}
