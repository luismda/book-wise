import { randomUUID } from 'node:crypto'
import { Book, BookCreateInput, BooksRepository } from '../books-repository'

export class InMemoryBooksRepository implements BooksRepository {
  public items: Book[] = []

  async findById(id: string) {
    const book = this.items.find((item) => item.id === id)

    if (!book) {
      return null
    }

    return book
  }

  async create(data: BookCreateInput) {
    const book: Book = {
      id: randomUUID(),
      name: data.name,
      author: data.author,
      summary: data.summary,
      cover_url: data.cover_url,
      total_pages: data.total_pages,
      created_at: new Date(),
    }

    this.items.push(book)

    return book
  }
}
