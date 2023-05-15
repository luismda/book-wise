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

export interface BooksRepository {
  findById(id: string): Promise<Book | null>
  findMany(params: BookFindManyParams): Promise<BookWithAverageGrade[]>
  findManyByPopularity(limit: number): Promise<BookWithAverageGrade[]>
  create(data: BookCreateInput): Promise<Book>
  list(): Promise<Book[]>
}
