import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { RatingsRepository } from '../repositories/ratings-repository'
import { InMemoryRatingsRepository } from '../repositories/in-memory/in-memory-ratings-repository'
import { UsersRepository } from '../repositories/users-repository'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository'
import { GetUserLastRatingUseCase } from './get-user-last-rating'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { BooksRepository } from '../repositories/books-repository'
import { InMemoryBooksRepository } from '../repositories/in-memory/in-memory-books-repository'

let usersRepository: UsersRepository
let booksRepository: BooksRepository
let ratingsRepository: RatingsRepository
let sut: GetUserLastRatingUseCase

describe('Get User Last Rating Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    booksRepository = new InMemoryBooksRepository()
    ratingsRepository = new InMemoryRatingsRepository(
      usersRepository,
      booksRepository,
    )
    sut = new GetUserLastRatingUseCase(ratingsRepository, usersRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to get user last rating', async () => {
    vi.setSystemTime(new Date(2023, 4, 13, 12, 30, 0))

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

    await ratingsRepository.create({
      user_id: user.id,
      book_id: firstBook.id,
      rate: 5,
      description: 'Very interesting...',
    })

    const tenMinutesInMs = 1000 * 60 * 10

    vi.advanceTimersByTime(tenMinutesInMs)

    const secondBook = await booksRepository.create({
      name: 'Clean Architecture',
      author: 'Robert Martin',
      cover_url: 'Some book cover...',
      summary: 'Some description...',
      total_pages: 432,
    })

    await ratingsRepository.create({
      user_id: user.id,
      book_id: secondBook.id,
      rate: 4,
      description: 'Very interesting...',
    })

    const { rating } = await sut.execute({
      userId: user.id,
    })

    expect(rating).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        rate: 4,
        user_id: user.id,
        book: expect.objectContaining({
          id: secondBook.id,
          name: 'Clean Architecture',
        }),
      }),
    )
  })

  it('should not be able to get last rating of non-existent user', async () => {
    await expect(() =>
      sut.execute({
        userId: 'non-existent user id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
