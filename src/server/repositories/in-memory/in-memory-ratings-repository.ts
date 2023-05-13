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

  async findMany({ orderBy, perPage, page }: RatingFindManyInput) {
    const ratings = this.items
      .sort((a, b) => {
        const dateA = a.created_at.getTime()
        const dateB = b.created_at.getTime()

        return orderBy === 'desc' ? dateB - dateA : dateA - dateB
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
