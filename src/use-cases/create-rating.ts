import { RatingsRepository, Rating } from '@/repositories/ratings-repository'
import { BooksRepository } from '@/repositories/books-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { RateOutsideOfMimAndMaxError } from './errors/rate-outside-of-mim-and-max-error'

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

    if (rate < 1 || rate > 5) {
      throw new RateOutsideOfMimAndMaxError()
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
