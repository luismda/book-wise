import { Prisma } from '@prisma/client'
import {
  Book,
  BookCreateInput,
  BookFindManyParams,
  BookWithAverageGrade,
  BooksRepository,
} from '../books-repository'

import { prisma } from '@/server/lib/prisma'

interface FindByIdWithRelationshipsQueryResult extends Book {
  average_grade: number
  ratings_amount: number
  categories: string
}

export class PrismaBooksRepository implements BooksRepository {
  async findById(id: string) {
    const book = await prisma.book.findUnique({
      where: {
        id,
      },
    })

    return book
  }

  async findByIdWithRelationships(id: string) {
    const book = await prisma.$queryRaw<FindByIdWithRelationshipsQueryResult>`
      SELECT 
	      B.*, 
	      IFNULL((SUM(R.rate)/COUNT(R.id)), 0) average_grade, 
	      COUNT(R.id) ratings_amount,
	      (SELECT 
          GROUP_CONCAT(C.name ORDER BY C.name SEPARATOR ',') 
        FROM 
          categories_on_books CB 
        INNER JOIN 
          categories C 
            ON C.id = CB.category_id 
        GROUP BY 
          CB.book_id) categories
      FROM
        books B
      LEFT JOIN
        ratings R
          ON R.book_id = B.id
      WHERE
        B.id = ${id}
      GROUP BY 
        B.id
    `

    const bookWithSplitCategories = {
      ...book,
      categories: book.categories.split(','),
    }

    return bookWithSplitCategories
  }

  async findMany({ page, perPage, categoriesId, query }: BookFindManyParams) {
    const categoriesIdAsString = Prisma.join(categoriesId ?? [''], ',')
    const queryString = `%${query}%`

    const queryToFilterByCategories = Prisma.sql`AND (SELECT IF(COUNT(CB.category_id) > 0, 1, 0) FROM categories_on_books CB WHERE CB.book_id = B.id AND CB.category_id IN (${categoriesIdAsString}))`
    const queryToFilterBySearchQuery = Prisma.sql`AND (B.name LIKE ${queryString} OR B.author LIKE ${queryString})`

    const books = await prisma.$queryRaw<BookWithAverageGrade[]>`
      SELECT
        B.*,
        IFNULL((SUM(R.rate)/COUNT(R.id)), 0) average_grade
      FROM
        books B
      LEFT JOIN
        ratings R
          ON R.book_id = B.id
      WHERE
        1=1
        ${categoriesId ? queryToFilterByCategories : Prisma.empty}
        ${query ? queryToFilterBySearchQuery : Prisma.empty}
      GROUP BY
        B.id
      LIMIT ${perPage}
      OFFSET ${(page - 1) * perPage}
    `

    return books
  }

  async findManyByPopularity(limit: number): Promise<BookWithAverageGrade[]> {
    const books = await prisma.$queryRaw<BookWithAverageGrade[]>`
      SELECT
        B.*,
        IFNULL((SUM(R.rate)/COUNT(R.id)), 0) average_grade
      FROM
        books B
      LEFT JOIN
        ratings R
          ON R.book_id = B.id
      GROUP BY
        B.id
      ORDER BY 
        COUNT(R.id) DESC, 
        IFNULL((SUM(R.rate)/COUNT(R.id)), 0) DESC
      LIMIT ${limit}
    `

    return books
  }

  async create(data: BookCreateInput) {
    const book = await prisma.book.create({
      data: {
        name: data.name,
        author: data.author,
        summary: data.summary,
        cover_url: data.cover_url,
        total_pages: data.total_pages,
      },
    })

    return book
  }

  async list() {
    const books = await prisma.book.findMany()

    return books
  }
}
