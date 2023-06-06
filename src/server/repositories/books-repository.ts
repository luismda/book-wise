export interface Book {
  id: string
  name: string
  author: string
  summary: string
  cover_url: string
  total_pages: number
  created_at: Date
}

export interface BookWithAverageGrade extends Book {
  average_grade: number
}

export interface BookWithRelationships extends Book {
  average_grade: number
  ratings_amount: number
  categories: string[]
}

export interface BookCreateInput {
  name: string
  author: string
  summary: string
  cover_url: string
  total_pages: number
}

export interface BookFindManyParams {
  page: number
  perPage: number
  categoriesId?: string[]
  query?: string
}

export interface BookCountParams {
  categoriesId?: string[]
  query?: string
}

export interface BooksRepository {
  findById(id: string): Promise<Book | null>
  findByIdWithRelationships(id: string): Promise<BookWithRelationships | null>
  findMany(params: BookFindManyParams): Promise<BookWithAverageGrade[]>
  findManyByPopularity(limit: number): Promise<BookWithAverageGrade[]>
  count(params: BookCountParams): Promise<number>
  create(data: BookCreateInput): Promise<Book>
  list(): Promise<Book[]>
}
