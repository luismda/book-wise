import { describe, it, expect, beforeEach } from 'vitest'
import { RatingsRepository } from '../repositories/ratings-repository'
import { InMemoryRatingsRepository } from '../repositories/in-memory/in-memory-ratings-repository'
import { UsersRepository } from '../repositories/users-repository'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { BooksRepository } from '../repositories/books-repository'
import { InMemoryBooksRepository } from '../repositories/in-memory/in-memory-books-repository'
import { GetRatingOfUserAndBookUseCase } from './get-rating-of-user-and-book'

let ratingsRepository: RatingsRepository
let usersRepository: UsersRepository
let booksRepository: BooksRepository
let sut: GetRatingOfUserAndBookUseCase

describe('Get Rating Of User And Book Use Case', () => {
  beforeEach(() => {
    ratingsRepository = new InMemoryRatingsRepository()
    usersRepository = new InMemoryUsersRepository()
    booksRepository = new InMemoryBooksRepository()
    sut = new GetRatingOfUserAndBookUseCase(
      ratingsRepository,
      usersRepository,
      booksRepository,
    )
  })

  it('should be able to get a rating of user and book', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
    })

    const book = await booksRepository.create({
      name: 'Domain-Driven Design',
      author: 'Eric Evans',
      cover_url: 'Some book cover...',
      summary: 'Some description...',
      total_pages: 529,
    })

    const createdRating = await ratingsRepository.create({
      user_id: user.id,
      book_id: book.id,
      rate: 4,
      description: 'Very interesting...',
    })

    const { rating } = await sut.execute({
      userId: user.id,
      bookId: book.id,
    })

    expect(rating).toEqual(
      expect.objectContaining({
        id: createdRating.id,
        rate: 4,
        description: 'Very interesting...',
        user_id: user.id,
        book_id: book.id,
      }),
    )
  })

  it('should not be able to get rating of non-existent user', async () => {
    const book = await booksRepository.create({
      name: 'Domain-Driven Design',
      author: 'Eric Evans',
      cover_url: 'Some book cover...',
      summary: 'Some description...',
      total_pages: 529,
    })

    await expect(() =>
      sut.execute({
        userId: 'non-existent user id',
        bookId: book.id,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to get rating of user of non-existent book', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
    })

    await expect(() =>
      sut.execute({
        userId: user.id,
        bookId: 'non-existent book id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
