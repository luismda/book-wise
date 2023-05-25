import { describe, it, expect, beforeEach } from 'vitest'
import { RatingsRepository } from '../repositories/ratings-repository'
import { InMemoryRatingsRepository } from '../repositories/in-memory/in-memory-ratings-repository'
import { UsersRepository } from '../repositories/users-repository'
import { BooksRepository } from '../repositories/books-repository'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository'
import { InMemoryBooksRepository } from '../repositories/in-memory/in-memory-books-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { FetchRatingsOfUserUseCase } from './fetch-ratings-of-user'

let usersRepository: UsersRepository
let booksRepository: BooksRepository
let ratingsRepository: RatingsRepository
let sut: FetchRatingsOfUserUseCase

describe('Fetch Ratings of User Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    booksRepository = new InMemoryBooksRepository()
    ratingsRepository = new InMemoryRatingsRepository(
      usersRepository,
      booksRepository,
    )
    sut = new FetchRatingsOfUserUseCase(ratingsRepository, usersRepository)
  })

  it('should be able to fetch ratings of user', async () => {
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

    await ratingsRepository.create({
      user_id: user.id,
      book_id: firstBook.id,
      rate: 5,
      description: 'Very interesting...',
    })

    await ratingsRepository.create({
      user_id: user.id,
      book_id: secondBook.id,
      rate: 4,
      description: 'Very interesting...',
    })

    const { ratings } = await sut.execute({
      userId: user.id,
      perPage: 6,
      page: 1,
    })

    expect(ratings).toEqual([
      expect.objectContaining({
        id: expect.any(String),
        user_id: user.id,
        rate: 5,
        description: 'Very interesting...',
        book: expect.objectContaining({
          id: firstBook.id,
          name: 'Domain-Driven Design',
          author: 'Eric Evans',
        }),
      }),
      expect.objectContaining({
        id: expect.any(String),
        user_id: user.id,
        rate: 4,
        description: 'Very interesting...',
        book: expect.objectContaining({
          id: secondBook.id,
          name: 'Clean Architecture',
          author: 'Robert Martin',
        }),
      }),
    ])
  })

  it('should be able to fetch paginated ratings of user', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
    })

    for (let i = 1; i <= 8; i++) {
      const book = await booksRepository.create({
        name: `Book ${i}`,
        author: `Author ${i}`,
        cover_url: 'Some book cover...',
        summary: 'Some description...',
        total_pages: 529,
      })

      await ratingsRepository.create({
        user_id: user.id,
        book_id: book.id,
        rate: 5,
        description: 'Very interesting...',
      })
    }

    const { ratings } = await sut.execute({
      userId: user.id,
      perPage: 6,
      page: 2,
    })

    expect(ratings).toHaveLength(2)
    expect(ratings).toEqual([
      expect.objectContaining({
        id: expect.any(String),
        user_id: user.id,
        rate: 5,
        description: 'Very interesting...',
        book: expect.objectContaining({
          name: 'Book 7',
          author: 'Author 7',
        }),
      }),
      expect.objectContaining({
        id: expect.any(String),
        user_id: user.id,
        rate: 5,
        description: 'Very interesting...',
        book: expect.objectContaining({
          name: 'Book 8',
          author: 'Author 8',
        }),
      }),
    ])
  })

  it('it should be able to fetch ratings of user with search by book', async () => {
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

    await ratingsRepository.create({
      user_id: user.id,
      book_id: firstBook.id,
      rate: 5,
      description: 'Very interesting...',
    })

    await ratingsRepository.create({
      user_id: user.id,
      book_id: secondBook.id,
      rate: 4,
      description: 'Very interesting...',
    })

    const { ratings } = await sut.execute({
      userId: user.id,
      query: 'Architecture',
      perPage: 6,
      page: 1,
    })

    expect(ratings).toEqual([
      expect.objectContaining({
        id: expect.any(String),
        user_id: user.id,
        rate: 4,
        description: 'Very interesting...',
        book: expect.objectContaining({
          id: secondBook.id,
          name: 'Clean Architecture',
          author: 'Robert Martin',
        }),
      }),
    ])
  })

  it('should not be able to fetch ratings of non-existent user', async () => {
    await expect(() =>
      sut.execute({
        userId: 'non-existent user id',
        perPage: 6,
        page: 1,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
