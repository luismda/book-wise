export interface Book {
  id: string
  name: string
  author: string
  summary: string
  cover_url: string
  total_pages: number
  created_at: Date
}

export interface BooksRepository {
  findById(id: string): Promise<Book | null>
}
