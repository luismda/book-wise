import { randomUUID } from 'node:crypto'
import {
  RatingsRepository,
  Rating,
  RatingCreateInput,
  RatingFindManyInput,
  CompleteRating,
} from '../ratings-repository'

export class InMemoryRatingsRepository implements RatingsRepository {
  public items: Rating[] = []

  async findByUserIdAndBookId(userId: string, bookId: string) {
    const rating = this.items.find(
      (item) => item.user_id === userId && item.book_id === bookId,
    )

    if (!rating) {
      return null
    }

    return rating
  }

  async findByUserId(userId: string) {
    const rating = this.items
      .sort((a, b) => {
        const dateA = a.created_at.getTime()
        const dateB = b.created_at.getTime()

        return dateB - dateA
      })
      .find((item) => item.user_id === userId)

    if (!rating) {
      return null
    }

    const { id, rate, description, created_at, user_id, book_id } = rating

    const completeRating: CompleteRating = {
      id,
      rate,
      description,
      created_at,
      user: {
        id: user_id,
        name: '',
        email: null,
        avatar_url: null,
        created_at,
      },
      book: {
        id: book_id,
        name: '',
        author: '',
        summary: '',
        cover_url: '',
        total_pages: 0,
        created_at,
      },
    }

    return completeRating
  }

  async findMany({ perPage, page }: RatingFindManyInput) {
    const ratings = this.items
      .sort((a, b) => {
        const dateA = a.created_at.getTime()
        const dateB = b.created_at.getTime()

        return dateB - dateA
      })
      .slice((page - 1) * perPage, page * perPage)

    const completeRatings: CompleteRating[] = ratings.map((rating) => {
      return {
        id: rating.id,
        rate: rating.rate,
        description: rating.description,
        created_at: rating.created_at,
        user: {
          id: rating.user_id,
          name: '',
          email: null,
          avatar_url: null,
          created_at: rating.created_at,
        },
        book: {
          id: rating.book_id,
          name: '',
          author: '',
          summary: '',
          cover_url: '',
          total_pages: 0,
          created_at: rating.created_at,
        },
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

    this.items.push(rating)

    return rating
  }
}
