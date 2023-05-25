import { randomUUID } from 'node:crypto'
import {
  RatingsRepository,
  Rating,
  RatingCreateInput,
  RatingFindManyInput,
  CompleteRating,
  RatingFindManyByBookIdParams,
  RatingWithUser,
  RatingFindManyByUserIdParams,
  RatingWithBook,
  UserMetricsOfRatings,
} from '../ratings-repository'
import { UsersRepository } from '../users-repository'
import { BooksRepository } from '../books-repository'
import { CategoriesOnBooksRepository } from '../categories-on-books-repository'
import { CategoriesRepository } from '../categories-repository'

export class InMemoryRatingsRepository implements RatingsRepository {
  constructor(
    private usersRepository?: UsersRepository,
    private booksRepository?: BooksRepository,
    private categoriesOnBooksRepository?: CategoriesOnBooksRepository,
    private categoriesRepository?: CategoriesRepository,
  ) {}

  private ratings: Rating[] = []

  async findByUserIdAndBookId(userId: string, bookId: string) {
    const rating = this.ratings.find(
      (rating) => rating.user_id === userId && rating.book_id === bookId,
    )

    if (!rating) {
      return null
    }

    return rating
  }

  async findByUserId(userId: string) {
    const rating = this.ratings
      .sort((a, b) => {
        const dateA = a.created_at.getTime()
        const dateB = b.created_at.getTime()

        return dateB - dateA
      })
      .find((rating) => rating.user_id === userId)

    if (!rating) {
      return null
    }

    const users = (await this.usersRepository?.list()) ?? []
    const books = (await this.booksRepository?.list()) ?? []

    const user = users.find((user) => user.id === rating.user_id)
    const book = books.find((book) => book.id === rating.book_id)

    if (!user || !book) {
      return null
    }

    const { id, rate, description, created_at } = rating

    const completeRating: CompleteRating = {
      id,
      rate,
      description,
      created_at,
      user,
      book,
    }

    return completeRating
  }

  async findManyByUserId({
    userId,
    query,
    page,
    perPage,
  }: RatingFindManyByUserIdParams) {
    const ratings = this.ratings
      .filter((rating) => rating.user_id === userId)
      .slice((page - 1) * perPage, page * perPage)

    const books = (await this.booksRepository?.list()) ?? []

    const ratingsWithBook: RatingWithBook[] = ratings
      .map((rating) => {
        const book = books.find((book) => book.id === rating.book_id)!

        return {
          id: rating.id,
          user_id: rating.user_id,
          rate: rating.rate,
          description: rating.description,
          created_at: rating.created_at,
          book,
        }
      })
      .filter((rating) => {
        if (query) {
          return (
            rating.book.name.includes(query) ||
            rating.book.author.includes(query)
          )
        }

        return true
      })

    return ratingsWithBook
  }

  async findManyByBookId({
    bookId,
    page,
    perPage,
  }: RatingFindManyByBookIdParams) {
    const ratings = this.ratings
      .filter((rating) => rating.book_id === bookId)
      .slice((page - 1) * perPage, page * perPage)

    const users = (await this.usersRepository?.list()) ?? []

    const ratingsWithUser: RatingWithUser[] = ratings.map((rating) => {
      const user = users.find((user) => user.id === rating.user_id)!

      return {
        id: rating.id,
        book_id: rating.book_id,
        rate: rating.rate,
        description: rating.description,
        created_at: rating.created_at,
        user,
      }
    })

    return ratingsWithUser
  }

  async findMany({ perPage, page }: RatingFindManyInput) {
    const ratings = this.ratings
      .sort((a, b) => {
        const dateA = a.created_at.getTime()
        const dateB = b.created_at.getTime()

        return dateB - dateA
      })
      .slice((page - 1) * perPage, page * perPage)

    const users = (await this.usersRepository?.list()) ?? []
    const books = (await this.booksRepository?.list()) ?? []

    const completeRatings: CompleteRating[] = ratings.map((rating) => {
      const user = users.find((user) => user.id === rating.user_id)!
      const book = books.find((book) => book.id === rating.book_id)!

      return {
        id: rating.id,
        rate: rating.rate,
        description: rating.description,
        created_at: rating.created_at,
        user,
        book,
      }
    })

    return completeRatings
  }

  async countMetricsByUserId(userId: string): Promise<UserMetricsOfRatings> {
    const ratingsOfUser = this.ratings.filter(
      (rating) => rating.user_id === userId,
    )

    const books = (await this.booksRepository?.list()) ?? []
    const categories = (await this.categoriesRepository?.list()) ?? []
    const categoriesOnBooks =
      (await this.categoriesOnBooksRepository?.list()) ?? []

    const metricsOfReadBooks = ratingsOfUser.reduce<{
      amountOfPagesRead: number
      authorsRead: string[]
    }>(
      (acc, rating) => {
        const book = books.find((book) => book.id === rating.book_id)!

        acc.amountOfPagesRead += book.total_pages

        if (!acc.authorsRead.includes(book.author)) {
          acc.authorsRead.push(book.author)
        }

        return acc
      },
      {
        amountOfPagesRead: 0,
        authorsRead: [],
      },
    )

    const readCategories = ratingsOfUser.reduce<
      { categoryId: string; amount: number }[]
    >((acc, rating) => {
      const book = books.find((book) => book.id === rating.book_id)!
      const categoriesOnBook = categoriesOnBooks.filter(
        (category) => category.book_id === book.id,
      )

      for (const readCategory of categoriesOnBook) {
        const readCategoryIndex = acc.findIndex(
          (category) => category.categoryId === readCategory.category_id,
        )

        if (readCategoryIndex >= 0) {
          acc[readCategoryIndex].amount += 1
        } else {
          acc.push({
            categoryId: readCategory.category_id,
            amount: 1,
          })
        }
      }

      return acc
    }, [])

    const [moreReadCategory] = readCategories.sort((a, b) => {
      const amountA = a.amount
      const amountB = b.amount

      return amountB - amountA
    })

    const moreReadCategoryName = categories.find(
      (category) => category.id === moreReadCategory.categoryId,
    )!

    return {
      ratings_amount: ratingsOfUser.length,
      amount_of_pages_read: metricsOfReadBooks.amountOfPagesRead,
      amount_of_authors_read: metricsOfReadBooks.authorsRead.length,
      most_read_category: moreReadCategoryName.name,
    }
  }

  async create(data: RatingCreateInput) {
    const rating: Rating = {
      id: randomUUID(),
      user_id: data.user_id,
      book_id: data.book_id,
      rate: data.rate,
      description: data.description,
      created_at: new Date(),
    }

    this.ratings.push(rating)

    return rating
  }

  async list() {
    return this.ratings
  }
}
