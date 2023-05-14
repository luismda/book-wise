import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { RatingsRepository } from '../repositories/ratings-repository'
import { InMemoryRatingsRepository } from '../repositories/in-memory/in-memory-ratings-repository'
import { FetchRatingsUseCase } from './fetch-ratings'
import { UsersRepository } from '../repositories/users-repository'
import { BooksRepository } from '../repositories/books-repository'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository'
import { InMemoryBooksRepository } from '../repositories/in-memory/in-memory-books-repository'

let usersRepository: UsersRepository
let booksRepository: BooksRepository
let ratingsRepository: RatingsRepository
let sut: FetchRatingsUseCase

describe('Fetch Ratings Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    booksRepository = new InMemoryBooksRepository()
    ratingsRepository = new InMemoryRatingsRepository(
      usersRepository,
      booksRepository,
    )
    sut = new FetchRatingsUseCase(ratingsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to fetch ratings', async () => {
    vi.setSystemTime(new Date(2023, 4, 13, 12, 30, 0))

    const firstUser = await usersRepository.create({
      name: 'John Doe',
    })

    const secondUser = await usersRepository.create({
      name: 'Evans Doe',
    })

    const book = await booksRepository.create({
      name: 'Domain-Driven Design',
      author: 'Eric Evans',
      cover_url: 'Some book cover...',
      summary: 'Some description...',
      total_pages: 529,
    })

    await ratingsRepository.create({
      user_id: firstUser.id,
      book_id: book.id,
      rate: 5,
      description: 'Very interesting...',
    })

    const tenMinutesInMs = 1000 * 60 * 10

    vi.advanceTimersByTime(tenMinutesInMs)

    await ratingsRepository.create({
      user_id: secondUser.id,
      book_id: book.id,
      rate: 4,
      description: 'Very interesting...',
    })

    const { ratings } = await sut.execute({
      perPage: 6,
      page: 1,
    })

    expect(ratings).toEqual([
      expect.objectContaining({
        id: expect.any(String),
        rate: 4,
        user: expect.objectContaining({
          id: secondUser.id,
        }),
        book: expect.objectContaining({
          id: book.id,
        }),
      }),
      expect.objectContaining({
        id: expect.any(String),
        rate: 5,
        user: expect.objectContaining({
          id: firstUser.id,
        }),
        book: expect.objectContaining({
          id: book.id,
        }),
      }),
    ])
  })

  it('should be able to fetch paginated ratings', async () => {
    vi.setSystemTime(new Date(2023, 4, 13, 12, 30, 0))

    const tenMinutesInMs = 1000 * 60 * 10

    const book = await booksRepository.create({
      name: 'Domain-Driven Design',
      author: 'Eric Evans',
      cover_url: 'Some book cover...',
      summary: 'Some description...',
      total_pages: 529,
    })

    for (let i = 1; i <= 8; i++) {
      const user = await usersRepository.create({
        name: `User ${i}`,
      })

      await ratingsRepository.create({
        user_id: user.id,
        book_id: book.id,
        rate: 5,
        description: 'Very interesting...',
      })

      vi.advanceTimersByTime(tenMinutesInMs)
    }

    const { ratings } = await sut.execute({
      perPage: 6,
      page: 2,
    })

    expect(ratings).toHaveLength(2)
    expect(ratings).toEqual([
      expect.objectContaining({
        user: expect.objectContaining({
          name: 'User 2',
        }),
        book: expect.objectContaining({
          id: book.id,
        }),
      }),
      expect.objectContaining({
        user: expect.objectContaining({
          name: 'User 1',
        }),
        book: expect.objectContaining({
          id: book.id,
        }),
      }),
    ])
  })
})
