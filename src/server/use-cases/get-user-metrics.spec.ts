import { describe, it, expect, beforeEach } from 'vitest'
import { UsersRepository } from '../repositories/users-repository'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { GetUserMetricsUseCase } from './get-user-metrics'
import { RatingsRepository } from '../repositories/ratings-repository'
import { InMemoryRatingsRepository } from '../repositories/in-memory/in-memory-ratings-repository'
import { BooksRepository } from '../repositories/books-repository'
import { InMemoryBooksRepository } from '../repositories/in-memory/in-memory-books-repository'
import { CategoriesRepository } from '../repositories/categories-repository'
import { CategoriesOnBooksRepository } from '../repositories/categories-on-books-repository'
import { InMemoryCategoriesRepository } from '../repositories/in-memory/in-memory-categories-repository'
import { InMemoryCategoriesOnBooksRepository } from '../repositories/in-memory/in-memory-categories-on-books-repository'

let usersRepository: UsersRepository
let ratingsRepository: RatingsRepository
let booksRepository: BooksRepository
let categoriesRepository: CategoriesRepository
let categoriesOnBooksRepository: CategoriesOnBooksRepository
let sut: GetUserMetricsUseCase

describe('Get User Metrics Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    booksRepository = new InMemoryBooksRepository()
    categoriesRepository = new InMemoryCategoriesRepository()
    categoriesOnBooksRepository = new InMemoryCategoriesOnBooksRepository()
    ratingsRepository = new InMemoryRatingsRepository(
      usersRepository,
      booksRepository,
      categoriesOnBooksRepository,
      categoriesRepository,
    )
    sut = new GetUserMetricsUseCase(usersRepository, ratingsRepository)
  })

  it('should be able to get user metrics', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
    })

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

    const thirdBook = await booksRepository.create({
      name: 'Journey to the Centre of the Earth',
      author: 'Jules Verne',
      cover_url: 'Some book cover...',
      summary: 'Some description...',
      total_pages: 240,
    })

    const firstCategory = await categoriesRepository.create({
      name: 'Software Development',
    })

    const secondCategory = await categoriesRepository.create({
      name: 'Adventure',
    })

    await categoriesOnBooksRepository.create({
      book_id: firstBook.id,
      category_id: firstCategory.id,
    })

    await categoriesOnBooksRepository.create({
      book_id: secondBook.id,
      category_id: firstCategory.id,
    })

    await categoriesOnBooksRepository.create({
      book_id: thirdBook.id,
      category_id: secondCategory.id,
    })

    await ratingsRepository.create({
      book_id: firstBook.id,
      user_id: user.id,
      rate: 4,
      description: 'Very interesting...',
    })

    await ratingsRepository.create({
      book_id: secondBook.id,
      user_id: user.id,
      rate: 5,
      description: 'Very interesting...',
    })

    await ratingsRepository.create({
      book_id: thirdBook.id,
      user_id: user.id,
      rate: 4,
      description: 'Very interesting...',
    })

    const { userMetrics } = await sut.execute({
      userId: user.id,
    })

    expect(userMetrics).toEqual({
      amount_of_pages_read: 1201,
      ratings_amount: 3,
      amount_of_authors_read: 3,
      most_read_category: 'Software Development',
    })
  })

  it('should not be able to get metrics of non-existent user', async () => {
    await expect(() =>
      sut.execute({
        userId: 'non-existent user id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
