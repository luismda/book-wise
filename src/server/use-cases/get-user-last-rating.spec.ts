import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { RatingsRepository } from '../repositories/ratings-repository'
import { InMemoryRatingsRepository } from '../repositories/in-memory/in-memory-ratings-repository'
import { UsersRepository } from '../repositories/users-repository'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository'
import { GetUserLastRatingUseCase } from './get-user-last-rating'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let ratingsRepository: RatingsRepository
let usersRepository: UsersRepository
let sut: GetUserLastRatingUseCase

describe('Get User Last Rating Use Case', () => {
  beforeEach(() => {
    ratingsRepository = new InMemoryRatingsRepository()
    usersRepository = new InMemoryUsersRepository()
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

    await ratingsRepository.create({
      user_id: user.id,
      book_id: 'book_id_1',
      rate: 5,
      description: 'Very interesting...',
    })

    const tenMinutesInMs = 1000 * 60 * 10

    vi.advanceTimersByTime(tenMinutesInMs)

    await ratingsRepository.create({
      user_id: user.id,
      book_id: 'book_id_2',
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
        user: expect.objectContaining({
          id: user.id,
        }),
        book: expect.objectContaining({
          id: 'book_id_2',
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
