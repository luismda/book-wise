export interface Rating {
  id: string
  user_id: string
  book_id: string
  rate: number
  description: string
  created_at: Date
}

export interface RatingWithUser {
  id: string
  book_id: string
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
}

export interface RatingWithBook {
  id: string
  user_id: string
  rate: number
  description: string
  created_at: Date
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

export interface RatingWithUserAndBook {
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

export interface RatingsMetricsOfUser {
  ratings_amount: number
  amount_of_pages_read: number
  amount_of_authors_read: number
  most_read_category: string | null
}

export interface RatingCreateInput {
  user_id: string
  book_id: string
  rate: number
  description: string
}

export interface RatingFindManyParams {
  perPage: number
  page: number
}

export interface RatingFindManyByUserIdParams {
  userId: string
  query?: string
  perPage: number
  page: number
}

export interface RatingFindManyByBookIdParams {
  bookId: string
  perPage: number
  page: number
}

export interface RatingsRepository {
  findByUserIdAndBookId(userId: string, bookId: string): Promise<Rating | null>

  findByUserId(userId: string): Promise<RatingWithBook | null>

  findManyByUserId(
    params: RatingFindManyByUserIdParams,
  ): Promise<RatingWithBook[]>

  findManyByBookId(
    params: RatingFindManyByBookIdParams,
  ): Promise<RatingWithUser[]>

  findMany(params: RatingFindManyParams): Promise<RatingWithUserAndBook[]>

  countMetricsByUserId(userId: string): Promise<RatingsMetricsOfUser>

  create(data: RatingCreateInput): Promise<Rating>

  list(): Promise<Rating[]>
}
