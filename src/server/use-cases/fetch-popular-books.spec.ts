import { describe, it, expect, beforeEach } from 'vitest'
import { BooksRepository } from '../repositories/books-repository'
import { InMemoryBooksRepository } from '../repositories/in-memory/in-memory-books-repository'
import { FetchPopularBooksUseCase } from './fetch-popular-books'
import { RatingsRepository } from '../repositories/ratings-repository'
import { InMemoryRatingsRepository } from '../repositories/in-memory/in-memory-ratings-repository'

let booksRepository: BooksRepository
let ratingsRepository: RatingsRepository
let sut: FetchPopularBooksUseCase

describe('Fetch Popular Books Use Case', () => {
  beforeEach(() => {
    ratingsRepository = new InMemoryRatingsRepository()
    booksRepository = new InMemoryBooksRepository(ratingsRepository)
    sut = new FetchPopularBooksUseCase(booksRepository)
  })

  it('should be able to fetch popular books', async () => {
    const firstBook = await booksRepository.create({
      name: 'Domain-Driven Design',
      author: 'Eric Evans',
      cover_url: 'Some book cover...',
      summary: 'Some description...',
      total_pages: 529,
    })

    const secondBook = await booksRepository.create({
      name: 'Clean Architecture',
      author: 'Robert Martin',
      cover_url: 'Some book cover...',
      summary: 'Some description...',
      total_pages: 432,
    })

    await ratingsRepository.create({
      book_id: firstBook.id,
      user_id: 'user_id_1',
      rate: 4,
      description: 'Very interesting...',
    })

    await ratingsRepository.create({
      book_id: secondBook.id,
      user_id: 'user_id_1',
      rate: 5,
      description: 'Very interesting...',
    })

    await ratingsRepository.create({
      book_id: secondBook.id,
      user_id: 'user_id_2',
      rate: 4,
      description: 'Very interesting...',
    })

    const { books } = await sut.execute({
      limit: 4,
    })

    expect(books).toEqual([
      expect.objectContaining({
        id: secondBook.id,
        average_grade: 4.5,
      }),
      expect.objectContaining({
        id: firstBook.id,
        average_grade: 4,
      }),
    ])
  })
})
