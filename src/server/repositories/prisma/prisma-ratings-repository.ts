import {
  RatingCountByUserIdParams,
  RatingCountParams,
  RatingCreateInput,
  RatingFindManyByBookIdParams,
  RatingFindManyByUserIdParams,
  RatingFindManyParams,
  RatingsMetricsOfUser,
  RatingsRepository,
} from '../ratings-repository'

import { prisma } from '@/server/lib/prisma'

export class PrismaRatingsRepository implements RatingsRepository {
  async findByUserIdAndBookId(userId: string, bookId: string) {
    const rating = await prisma.rating.findUnique({
      where: {
        user_id_book_id: {
          user_id: userId,
          book_id: bookId,
        },
      },
    })

    return rating
  }

  async findLastByUserId(userId: string) {
    const rating = await prisma.rating.findFirst({
      select: {
        id: true,
        user_id: true,
        rate: true,
        description: true,
        created_at: true,
        book: true,
      },
      where: {
        user_id: userId,
      },
      orderBy: [
        {
          created_at: 'desc',
        },
        {
          book: {
            name: 'asc',
          },
        },
      ],
    })

    return rating
  }

  async findManyByUserId({
    userId,
    query,
    page,
    perPage,
  }: RatingFindManyByUserIdParams) {
    const ratings = await prisma.rating.findMany({
      select: {
        id: true,
        user_id: true,
        rate: true,
        description: true,
        created_at: true,
        book: true,
      },
      where: {
        user_id: userId,
        book: query
          ? {
              OR: [
                {
                  name: {
                    contains: query,
                  },
                },
                {
                  author: {
                    contains: query,
                  },
                },
              ],
            }
          : undefined,
      },
      take: perPage,
      skip: (page - 1) * perPage,
      orderBy: {
        created_at: 'desc',
      },
    })

    return ratings
  }

  async findManyByBookId({
    bookId,
    page,
    perPage,
  }: RatingFindManyByBookIdParams) {
    const ratings = await prisma.rating.findMany({
      where: {
        book_id: bookId,
      },
      include: {
        user: true,
      },
      take: perPage,
      skip: (page - 1) * perPage,
      orderBy: {
        created_at: 'desc',
      },
    })

    return ratings
  }

  async findMany({ page, perPage, excludedUserId }: RatingFindManyParams) {
    const ratings = await prisma.rating.findMany({
      select: {
        id: true,
        rate: true,
        description: true,
        created_at: true,
        book: true,
        user: true,
      },
      where: {
        user_id: {
          not: excludedUserId,
        },
      },
      orderBy: [
        {
          created_at: 'desc',
        },
        {
          book: {
            name: 'asc',
          },
        },
      ],
      take: perPage,
      skip: (page - 1) * perPage,
    })

    return ratings
  }

  async count({ excludedUserId }: RatingCountParams) {
    const totalRatings = await prisma.rating.count({
      where: {
        user_id: {
          not: excludedUserId,
        },
      },
    })

    return totalRatings
  }

  async countByUserId({ userId, query }: RatingCountByUserIdParams) {
    const totalRatingsOfUser = await prisma.rating.count({
      where: {
        user_id: userId,
        book: query
          ? {
              OR: [
                {
                  name: {
                    contains: query,
                  },
                },
                {
                  author: {
                    contains: query,
                  },
                },
              ],
            }
          : undefined,
      },
    })

    return totalRatingsOfUser
  }

  async countByBookId(bookId: string) {
    const totalRatingsOfBook = await prisma.rating.count({
      where: {
        book_id: bookId,
      },
    })

    return totalRatingsOfBook
  }

  async countMetricsByUserId(userId: string) {
    const [ratingsMetricsOfUser] = await prisma.$queryRaw<
      RatingsMetricsOfUser[]
    >`
      SELECT 
        COUNT(R.id) ratings_amount,
        SUM(B.total_pages) amount_of_pages_read,
        COUNT(DISTINCT B.author) amount_of_authors_read,
        (SELECT 
	        C.name
        FROM 
          categories_on_books CB 
        INNER JOIN 
          categories C 
            ON C.id = CB.category_id
        LEFT JOIN 
          ratings R2
            ON R2.book_id = CB.book_id 
        WHERE
          R2.user_id = R.user_id 
        GROUP BY 
          CB.category_id 
        ORDER BY
          COUNT(DISTINCT CB.book_id) DESC
        LIMIT 1) most_read_category
      FROM
        ratings R
      INNER JOIN
        books B
          ON B.id = R.book_id
      WHERE
        R.user_id = ${userId}
      GROUP BY 
        R.user_id
    `

    const ratingsMetricsOfUserWithoutBigInt = {
      ...ratingsMetricsOfUser,
      ratings_amount: Number(ratingsMetricsOfUser.ratings_amount),
      amount_of_authors_read: Number(
        ratingsMetricsOfUser.amount_of_authors_read,
      ),
      amount_of_pages_read: Number(ratingsMetricsOfUser.amount_of_pages_read),
    }

    return ratingsMetricsOfUserWithoutBigInt
  }

  async create(data: RatingCreateInput) {
    const rating = await prisma.rating.create({
      data: {
        user_id: data.user_id,
        book_id: data.book_id,
        rate: data.rate,
        description: data.description,
      },
    })

    return rating
  }

  async list() {
    const ratings = await prisma.rating.findMany()

    return ratings
  }
}
