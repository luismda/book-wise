export interface Rating {
  id: string
  user_id: string
  book_id: string
  rate: number
  description: string
  created_at: Date
}

interface RatingCreateInput {
  user_id: string
  book_id: string
  rate: number
  description: string
}

export interface RatingsRepository {
  create(data: RatingCreateInput): Promise<Rating>
}
