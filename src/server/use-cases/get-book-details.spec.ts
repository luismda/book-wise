import { describe, it, expect, beforeEach } from 'vitest'
import { BooksRepository } from '../repositories/books-repository'
import { InMemoryBooksRepository } from '../repositories/in-memory/in-memory-books-repository'
import { RatingsRepository } from '../repositories/ratings-repository'
import { InMemoryRatingsRepository } from '../repositories/in-memory/in-memory-ratings-repository'
import { CategoriesRepository } from '../repositories/categories-repository'
import { CategoriesOnBooksRepository } from '../repositories/categories-on-books-repository'
import { InMemoryCategoriesRepository } from '../repositories/in-memory/in-memory-categories-repository'
import { InMemoryCategoriesOnBooksRepository } from '../repositories/in-memory/in-memory-categories-on-books-repository'
import { GetBookDetailsUseCase } from './get-book-details'

let categoriesOnBooksRepository: CategoriesOnBooksRepository
let categoriesRepository: CategoriesRepository
let ratingsRepository: RatingsRepository
let booksRepository: BooksRepository
let sut: GetBookDetailsUseCase

describe('Get Book Details Use Case', () => {
  beforeEach(() => {
    categoriesOnBooksRepository = new InMemoryCategoriesOnBooksRepository()
    categoriesRepository = new InMemoryCategoriesRepository()
    ratingsRepository = new InMemoryRatingsRepository()
    booksRepository = new InMemoryBooksRepository(
      ratingsRepository,
      categoriesOnBooksRepository,
      categoriesRepository,
    )
    sut = new GetBookDetailsUseCase(booksRepository)
  })

  it('should be able to get a book details', async () => {
    const createdBook = await booksRepository.create({
      name: 'Domain-Driven Design',
      author: 'Eric Evans',
      cover_url: 'Some book cover...',
      summary: 'Some description...',
      total_pages: 529,
    })

    const category = await categoriesRepository.create({
      name: 'Software Development',
    })

    await categoriesOnBooksRepository.create({
      book_id: createdBook.id,
      category_id: category.id,
    })

    await ratingsRepository.create({
      book_id: createdBook.id,
      user_id: 'user_id_1',
      rate: 4,
      description: 'Very interesting...',
    })

    await ratingsRepository.create({
      book_id: createdBook.id,
      user_id: 'user_id_2',
      rate: 3,
      description: 'Very interesting...',
    })

    const { book } = await sut.execute({
      bookId: createdBook.id,
    })

    expect(book).toEqual(
      expect.objectContaining({
        id: createdBook.id,
        name: 'Domain-Driven Design',
        author: 'Eric Evans',
        total_pages: 529,
        categories: ['Software Development'],
        average_grade: 3.5,
        ratings_amount: 2,
      }),
    )
  })
})
