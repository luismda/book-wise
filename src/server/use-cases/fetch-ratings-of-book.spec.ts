import { describe, it, expect, beforeEach } from 'vitest'
import { RatingsRepository } from '../repositories/ratings-repository'
import { InMemoryRatingsRepository } from '../repositories/in-memory/in-memory-ratings-repository'
import { UsersRepository } from '../repositories/users-repository'
import { BooksRepository } from '../repositories/books-repository'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository'
import { InMemoryBooksRepository } from '../repositories/in-memory/in-memory-books-repository'
import { FetchRatingsOfBookUseCase } from './fetch-ratings-of-book'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let usersRepository: UsersRepository
let booksRepository: BooksRepository
let ratingsRepository: RatingsRepository
let sut: FetchRatingsOfBookUseCase

describe('Fetch Ratings of Book Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    booksRepository = new InMemoryBooksRepository()
    ratingsRepository = new InMemoryRatingsRepository(usersRepository)
    sut = new FetchRatingsOfBookUseCase(ratingsRepository, booksRepository)
  })

  it('should be able to fetch ratings of book', async () => {
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

    await ratingsRepository.create({
      user_id: secondUser.id,
      book_id: book.id,
      rate: 4,
      description: 'Very interesting...',
    })

    const { ratings } = await sut.execute({
      bookId: book.id,
      perPage: 6,
      page: 1,
    })

    expect(ratings).toEqual([
      expect.objectContaining({
        id: expect.any(String),
        rate: 5,
        book_id: book.id,
        user: expect.objectContaining({
          id: firstUser.id,
          name: 'John Doe',
        }),
      }),
      expect.objectContaining({
        id: expect.any(String),
        rate: 4,
        book_id: book.id,
        user: expect.objectContaining({
          id: secondUser.id,
          name: 'Evans Doe',
        }),
      }),
    ])
  })

  it('should be able to fetch paginated ratings of book', async () => {
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
    }

    const { ratings } = await sut.execute({
      bookId: book.id,
      perPage: 6,
      page: 2,
    })

    expect(ratings).toHaveLength(2)
    expect(ratings).toEqual([
      expect.objectContaining({
        id: expect.any(String),
        book_id: book.id,
        rate: 5,
        user: expect.objectContaining({
          name: 'User 7',
        }),
      }),
      expect.objectContaining({
        id: expect.any(String),
        book_id: book.id,
        rate: 5,
        user: expect.objectContaining({
          name: 'User 8',
        }),
      }),
    ])
  })

  it('should not be able to fetch ratings of non-existent book', async () => {
    await expect(() =>
      sut.execute({
        bookId: 'non-existent book id',
        perPage: 6,
        page: 1,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
