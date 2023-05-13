import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { RatingsRepository } from '../repositories/ratings-repository'
import { InMemoryRatingsRepository } from '../repositories/in-memory/in-memory-ratings-repository'
import { FetchRatingsUseCase } from './fetch-ratings'

let ratingsRepository: RatingsRepository
let sut: FetchRatingsUseCase

describe('Fetch Ratings Use Case', () => {
  beforeEach(() => {
    ratingsRepository = new InMemoryRatingsRepository()
    sut = new FetchRatingsUseCase(ratingsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to fetch ratings', async () => {
    await ratingsRepository.create({
      user_id: 'user_id',
      book_id: 'book_id',
      rate: 5,
      description: 'Very interesting...',
    })

    const { ratings } = await sut.execute({
      orderBy: 'desc',
      perPage: 6,
      page: 1,
    })

    expect(ratings).toEqual([
      expect.objectContaining({
        id: expect.any(String),
        rate: 5,
        user: expect.objectContaining({
          id: 'user_id',
        }),
        book: expect.objectContaining({
          id: 'book_id',
        }),
      }),
    ])
  })

  it('should be able to fetch ratings ordered by most recent', async () => {
    vi.setSystemTime(new Date(2023, 4, 13, 12, 30, 0))

    await ratingsRepository.create({
      user_id: 'user_id_1',
      book_id: 'book_id_1',
      rate: 5,
      description: 'Very interesting...',
    })

    const tenMinutesInMs = 1000 * 60 * 10

    vi.advanceTimersByTime(tenMinutesInMs)

    await ratingsRepository.create({
      user_id: 'user_id_2',
      book_id: 'book_id_2',
      rate: 4,
      description: 'Very interesting...',
    })

    const { ratings } = await sut.execute({
      orderBy: 'desc',
      perPage: 6,
      page: 1,
    })

    expect(ratings).toEqual([
      expect.objectContaining({
        id: expect.any(String),
        rate: 4,
        user: expect.objectContaining({
          id: 'user_id_2',
        }),
        book: expect.objectContaining({
          id: 'book_id_2',
        }),
      }),
      expect.objectContaining({
        id: expect.any(String),
        rate: 5,
        user: expect.objectContaining({
          id: 'user_id_1',
        }),
        book: expect.objectContaining({
          id: 'book_id_1',
        }),
      }),
    ])
  })

  it('should be able to fetch ratings ordered by most old', async () => {
    vi.setSystemTime(new Date(2023, 4, 13, 12, 30, 0))

    await ratingsRepository.create({
      user_id: 'user_id_1',
      book_id: 'book_id_1',
      rate: 5,
      description: 'Very interesting...',
    })

    const tenMinutesInMs = 1000 * 60 * 10

    vi.advanceTimersByTime(tenMinutesInMs)

    await ratingsRepository.create({
      user_id: 'user_id_2',
      book_id: 'book_id_2',
      rate: 4,
      description: 'Very interesting...',
    })

    const { ratings } = await sut.execute({
      orderBy: 'asc',
      perPage: 6,
      page: 1,
    })

    expect(ratings).toEqual([
      expect.objectContaining({
        id: expect.any(String),
        rate: 5,
        user: expect.objectContaining({
          id: 'user_id_1',
        }),
        book: expect.objectContaining({
          id: 'book_id_1',
        }),
      }),
      expect.objectContaining({
        id: expect.any(String),
        rate: 4,
        user: expect.objectContaining({
          id: 'user_id_2',
        }),
        book: expect.objectContaining({
          id: 'book_id_2',
        }),
      }),
    ])
  })

  it('should be able to fetch paginated ratings', async () => {
    vi.setSystemTime(new Date(2023, 4, 13, 12, 30, 0))

    const tenMinutesInMs = 1000 * 60 * 10

    for (let i = 1; i <= 8; i++) {
      await ratingsRepository.create({
        user_id: `user_id_${i}`,
        book_id: `book_id_${i}`,
        rate: 5,
        description: 'Very interesting...',
      })

      vi.advanceTimersByTime(tenMinutesInMs)
    }

    const { ratings } = await sut.execute({
      orderBy: 'desc',
      perPage: 6,
      page: 2,
    })

    expect(ratings).toHaveLength(2)
    expect(ratings).toEqual([
      expect.objectContaining({
        user: expect.objectContaining({
          id: 'user_id_2',
        }),
        book: expect.objectContaining({
          id: 'book_id_2',
        }),
      }),
      expect.objectContaining({
        user: expect.objectContaining({
          id: 'user_id_1',
        }),
        book: expect.objectContaining({
          id: 'book_id_1',
        }),
      }),
    ])
  })
})
