import {
  RatingsRepository,
  Rating,
} from '@/server/repositories/ratings-repository'
import { BooksRepository } from '@/server/repositories/books-repository'
import { UsersRepository } from '@/server/repositories/users-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { RateOutsideOfMimOrMaxError } from './errors/rate-outside-of-mim-or-max-error'
import { UserRatingAlreadyExistsError } from './errors/user-rating-already-exists-error'

interface CreateRatingUseCaseRequest {
  userId: string
  bookId: string
  rate: number
  description: string
}

interface CreateRatingUseCaseResponse {
  rating: Rating
}

export class CreateRatingUseCase {
  constructor(
    private ratingsRepository: RatingsRepository,
    private usersRepository: UsersRepository,
    private booksRepository: BooksRepository,
  ) {}

  async execute({
    userId,
    bookId,
    rate,
    description,
  }: CreateRatingUseCaseRequest): Promise<CreateRatingUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError('User')
    }

    const book = await this.booksRepository.findById(bookId)

    if (!book) {
      throw new ResourceNotFoundError('Book')
    }

    const userRatingAlreadyExisting =
      await this.ratingsRepository.findByUserIdAndBookId(userId, bookId)

    if (userRatingAlreadyExisting) {
      throw new UserRatingAlreadyExistsError()
    }

    if (rate < 1 || rate > 5) {
      throw new RateOutsideOfMimOrMaxError()
    }

    const rating = await this.ratingsRepository.create({
      user_id: userId,
      book_id: bookId,
      rate,
      description,
    })

    return {
      rating,
    }
  }
}
