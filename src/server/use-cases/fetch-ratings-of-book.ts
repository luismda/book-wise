import {
  RatingsRepository,
  RatingWithUser,
} from '@/server/repositories/ratings-repository'
import { BooksRepository } from '../repositories/books-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface FetchRatingsOfBookUseCaseRequest {
  bookId: string
  perPage: number
  page: number
}

interface FetchRatingsOfBookUseCaseResponse {
  ratings: RatingWithUser[]
  totalRatings: number
}

export class FetchRatingsOfBookUseCase {
  constructor(
    private ratingsRepository: RatingsRepository,
    private booksRepository: BooksRepository,
  ) {}

  async execute({
    bookId,
    perPage,
    page,
  }: FetchRatingsOfBookUseCaseRequest): Promise<FetchRatingsOfBookUseCaseResponse> {
    const book = await this.booksRepository.findById(bookId)

    if (!book) {
      throw new ResourceNotFoundError('Book')
    }

    const ratings = await this.ratingsRepository.findManyByBookId({
      bookId,
      page,
      perPage,
    })

    const totalRatings = await this.ratingsRepository.countByBookId(bookId)

    return {
      ratings,
      totalRatings,
    }
  }
}
