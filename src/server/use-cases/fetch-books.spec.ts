import { describe, it, expect, beforeEach } from 'vitest'
import { BooksRepository } from '../repositories/books-repository'
import { RatingsRepository } from '../repositories/ratings-repository'
import { FetchBooksUseCase } from './fetch-books'
import { InMemoryBooksRepository } from '../repositories/in-memory/in-memory-books-repository'
import { InMemoryRatingsRepository } from '../repositories/in-memory/in-memory-ratings-repository'
import { CategoriesOnBooksRepository } from '../repositories/categories-on-books-repository'
import { InMemoryCategoriesOnBooksRepository } from '../repositories/in-memory/in-memory-categories-on-books-repository'

let categoriesOnBooksRepository: CategoriesOnBooksRepository
let ratingsRepository: RatingsRepository
let booksRepository: BooksRepository
let sut: FetchBooksUseCase

describe('Fetch Books Use Case', () => {
  beforeEach(() => {
    categoriesOnBooksRepository = new InMemoryCategoriesOnBooksRepository()
    ratingsRepository = new InMemoryRatingsRepository()
    booksRepository = new InMemoryBooksRepository(
      ratingsRepository,
      categoriesOnBooksRepository,
    )
    sut = new FetchBooksUseCase(booksRepository)
  })

  it('should be able to fetch books', async () => {
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
      book_id: firstBook.id,
      user_id: 'user_id_2',
      rate: 4,
      description: 'Very interesting...',
    })

    await ratingsRepository.create({
      book_id: secondBook.id,
      user_id: 'user_id_2',
      rate: 3,
      description: 'Very interesting...',
    })

    const { books } = await sut.execute({
      page: 1,
      perPage: 12,
    })

    expect(books).toEqual([
      expect.objectContaining({
        id: firstBook.id,
        name: 'Domain-Driven Design',
        author: 'Eric Evans',
        average_grade: 4,
      }),
      expect.objectContaining({
        id: secondBook.id,
        name: 'Clean Architecture',
        author: 'Robert Martin',
        average_grade: 4,
      }),
    ])
  })

  it('should be able to fetch books filtered by categories', async () => {
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

    await categoriesOnBooksRepository.create({
      book_id: firstBook.id,
      category_id: 'category_id_1',
    })

    await categoriesOnBooksRepository.create({
      book_id: secondBook.id,
      category_id: 'category_id_2',
    })

    const { books } = await sut.execute({
      page: 1,
      perPage: 12,
      categoriesId: ['category_id_1'],
    })

    expect(books).toEqual([
      expect.objectContaining({
        id: firstBook.id,
        name: 'Domain-Driven Design',
        author: 'Eric Evans',
      }),
    ])
  })

  it('should be able to fetch books searching by book name', async () => {
    await booksRepository.create({
      name: 'Domain-Driven Design',
      author: 'Eric Evans',
      cover_url: 'Some book cover...',
      summary: 'Some description...',
      total_pages: 529,
    })

    const createdBook = await booksRepository.create({
      name: 'Clean Architecture',
      author: 'Robert Martin',
      cover_url: 'Some book cover...',
      summary: 'Some description...',
      total_pages: 432,
    })

    const { books } = await sut.execute({
      page: 1,
      perPage: 12,
      query: 'Clean',
    })

    expect(books).toEqual([
      expect.objectContaining({
        id: createdBook.id,
        name: 'Clean Architecture',
        author: 'Robert Martin',
      }),
    ])
  })

  it('should be able to fetch books searching by book author', async () => {
    const createdBook = await booksRepository.create({
      name: 'Domain-Driven Design',
      author: 'Eric Evans',
      cover_url: 'Some book cover...',
      summary: 'Some description...',
      total_pages: 529,
    })

    await booksRepository.create({
      name: 'Clean Architecture',
      author: 'Robert Martin',
      cover_url: 'Some book cover...',
      summary: 'Some description...',
      total_pages: 432,
    })

    const { books } = await sut.execute({
      page: 1,
      perPage: 12,
      query: 'Evans',
    })

    expect(books).toEqual([
      expect.objectContaining({
        id: createdBook.id,
        name: 'Domain-Driven Design',
        author: 'Eric Evans',
      }),
    ])
  })

  it('should be able to fetch paginated books', async () => {
    for (let i = 1; i <= 14; i++) {
      await booksRepository.create({
        name: `Book ${i}`,
        author: `Author ${i}`,
        cover_url: 'Some book cover...',
        summary: 'Some description...',
        total_pages: 529,
      })
    }

    const { books } = await sut.execute({
      page: 2,
      perPage: 12,
    })

    expect(books).toHaveLength(2)
    expect(books).toEqual([
      expect.objectContaining({
        id: expect.any(String),
        name: 'Book 13',
        author: 'Author 13',
      }),
      expect.objectContaining({
        id: expect.any(String),
        name: 'Book 14',
        author: 'Author 14',
      }),
    ])
  })
})
