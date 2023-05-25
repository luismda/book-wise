import { randomUUID } from 'node:crypto'
import {
  RatingsRepository,
  Rating,
  RatingCreateInput,
  RatingFindManyInput,
  CompleteRating,
  RatingFindManyByBookIdParams,
  RatingWithUser,
} from '../ratings-repository'
import { UsersRepository } from '../users-repository'
import { BooksRepository } from '../books-repository'

export class InMemoryRatingsRepository implements RatingsRepository {
  constructor(
    private usersRepository?: UsersRepository,
    private booksRepository?: BooksRepository,
  ) {}

  private ratings: Rating[] = []

  async findByUserIdAndBookId(userId: string, bookId: string) {
    const rating = this.ratings.find(
      (rating) => rating.user_id === userId && rating.book_id === bookId,
    )

    if (!rating) {
      return null
    }

    return rating
  }

  async findByUserId(userId: string) {
    const rating = this.ratings
      .sort((a, b) => {
        const dateA = a.created_at.getTime()
        const dateB = b.created_at.getTime()

        return dateB - dateA
      })
      .find((rating) => rating.user_id === userId)

    if (!rating) {
      return null
    }

    const users = (await this.usersRepository?.list()) ?? []
    const books = (await this.booksRepository?.list()) ?? []

    const user = users.find((user) => user.id === rating.user_id)
    const book = books.find((book) => book.id === rating.book_id)

    if (!user || !book) {
      return null
    }

    const { id, rate, description, created_at } = rating

    const completeRating: CompleteRating = {
      id,
      rate,
      description,
      created_at,
      user,
      book,
    }

    return completeRating
  }

  async findManyByBookId({
    bookId,
    page,
    perPage,
  }: RatingFindManyByBookIdParams) {
    const ratings = this.ratings
      .filter((rating) => rating.book_id === bookId)
      .slice((page - 1) * perPage, page * perPage)

    const users = (await this.usersRepository?.list()) ?? []

    const ratingsWithUser: RatingWithUser[] = ratings.map((rating) => {
      const user = users.find((user) => user.id === rating.user_id)!

      return {
        id: rating.id,
        book_id: rating.book_id,
        rate: rating.rate,
        description: rating.description,
        created_at: rating.created_at,
        user,
      }
    })

    return ratingsWithUser
  }

  async findMany({ perPage, page }: RatingFindManyInput) {
    const ratings = this.ratings
      .sort((a, b) => {
        const dateA = a.created_at.getTime()
        const dateB = b.created_at.getTime()

        return dateB - dateA
      })
      .slice((page - 1) * perPage, page * perPage)

    const users = (await this.usersRepository?.list()) ?? []
    const books = (await this.booksRepository?.list()) ?? []

    const completeRatings: CompleteRating[] = ratings.map((rating) => {
      const user = users.find((user) => user.id === rating.user_id)!
      const book = books.find((book) => book.id === rating.book_id)!

      return {
        id: rating.id,
        rate: rating.rate,
        description: rating.description,
        created_at: rating.created_at,
        user,
        book,
      }
    })

    return completeRatings
  }

  async create(data: RatingCreateInput) {
    const rating: Rating = {
      id: randomUUID(),
      user_id: data.user_id,
      book_id: data.book_id,
      rate: data.rate,
      description: data.description,
      created_at: new Date(),
    }

    this.ratings.push(rating)

    return rating
  }

  async list() {
    return this.ratings
  }
}
