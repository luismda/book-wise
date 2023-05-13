export interface Rating {
  id: string
  user_id: string
  book_id: string
  rate: number
  description: string
  created_at: Date
}

export interface CompleteRating {
  id: string
  rate: number
  description: string
  created_at: Date
  user: {
    id: string
    name: string
    email: string | null
    avatar_url: string | null
    created_at: Date
  }
  book: {
    id: string
    name: string
    author: string
    summary: string
    cover_url: string
    total_pages: number
    created_at: Date
  }
}

export interface RatingCreateInput {
  user_id: string
  book_id: string
  rate: number
  description: string
}

export interface RatingFindManyInput {
  perPage: number
  page: number
}

export interface RatingsRepository {
  findMany(params: RatingFindManyInput): Promise<CompleteRating[]>
  create(data: RatingCreateInput): Promise<Rating>
}
