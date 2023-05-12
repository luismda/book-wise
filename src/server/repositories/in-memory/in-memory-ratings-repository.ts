import { randomUUID } from 'node:crypto'
import {
  RatingsRepository,
  Rating,
  RatingCreateInput,
} from '../ratings-repository'

export class InMemoryRatingsRepository implements RatingsRepository {
  public items: Rating[] = []

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
