import {
  Rating,
  RatingsRepository,
} from '@/server/repositories/ratings-repository'
import { UsersRepository } from '../repositories/users-repository'
import { BooksRepository } from '../repositories/books-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface GetRatingOfUserAndBookUseCaseRequest {
  userId: string
  bookId: string
}

interface GetRatingOfUserAndBookUseCaseResponse {
  rating: Rating | null
}

export class GetRatingOfUserAndBookUseCase {
  constructor(
    private ratingsRepository: RatingsRepository,
    private usersRepository: UsersRepository,
    private booksRepository: BooksRepository,
  ) {}

  async execute({
    userId,
    bookId,
  }: GetRatingOfUserAndBookUseCaseRequest): Promise<GetRatingOfUserAndBookUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError('User')
    }

    const book = await this.booksRepository.findById(bookId)

    if (!book) {
      throw new ResourceNotFoundError('Book')
    }

    const rating = await this.ratingsRepository.findByUserIdAndBookId(
      userId,
      bookId,
    )

    return {
      rating,
    }
  }
}
