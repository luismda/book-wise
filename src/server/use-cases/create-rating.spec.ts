import { describe, it, expect, beforeEach } from 'vitest'
import { RatingsRepository } from '../repositories/ratings-repository'
import { CreateRatingUseCase } from './create-rating'
import { InMemoryRatingsRepository } from '../repositories/in-memory/in-memory-ratings-repository'
import { UsersRepository } from '../repositories/users-repository'
import { BooksRepository } from '../repositories/books-repository'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository'
import { InMemoryBooksRepository } from '../repositories/in-memory/in-memory-books-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { RateOutsideOfMimOrMaxError } from './errors/rate-outside-of-mim-or-max-error'

let ratingsRepository: RatingsRepository
let usersRepository: UsersRepository
let booksRepository: BooksRepository
let sut: CreateRatingUseCase

describe('Create Rating Use Case', () => {
  beforeEach(() => {
    ratingsRepository = new InMemoryRatingsRepository()
    usersRepository = new InMemoryUsersRepository()
    booksRepository = new InMemoryBooksRepository()
    sut = new CreateRatingUseCase(
      ratingsRepository,
      usersRepository,
      booksRepository,
    )
  })

  it('should be able to create a rating', async () => {
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

    const { rating } = await sut.execute({
      userId: user.id,
      bookId: book.id,
      rate: 5,
      description: 'Very interesting...',
    })

    expect(rating).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        user_id: user.id,
        book_id: book.id,
        rate: 5,
        description: 'Very interesting...',
        created_at: expect.any(Date),
      }),
    )
  })

  it('should not be able to create a rating with non-existing user', async () => {
    const book = await booksRepository.create({
      name: 'Domain-Driven Design',
      author: 'Eric Evans',
      cover_url: 'Some book cover...',
      summary: 'Some description...',
      total_pages: 529,
    })

    await expect(() =>
      sut.execute({
        userId: 'non-existent userid',
        bookId: book.id,
        rate: 5,
        description: 'Very interesting...',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to create a rating with non-existing book', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
    })

    await expect(() =>
      sut.execute({
        userId: user.id,
        bookId: 'non-existent book',
        rate: 5,
        description: 'Very interesting...',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to create a rating with rate lower than 1', async () => {
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

    await expect(() =>
      sut.execute({
        userId: user.id,
        bookId: book.id,
        rate: 0,
        description: 'Very interesting...',
      }),
    ).rejects.toBeInstanceOf(RateOutsideOfMimOrMaxError)
  })

  it('should not be able to create a rating with rate greater than 5', async () => {
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

    await expect(() =>
      sut.execute({
        userId: user.id,
        bookId: book.id,
        rate: 6,
        description: 'Very interesting...',
      }),
    ).rejects.toBeInstanceOf(RateOutsideOfMimOrMaxError)
  })
})
