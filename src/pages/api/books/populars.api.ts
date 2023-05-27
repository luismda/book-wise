import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

import { makeFetchPopularBooksUseCase } from '@/server/use-cases/factories/make-fetch-popular-books-use-case'
import { excludeFields } from '@/server/utils/exclude-fields'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const queryParamsSchema = z.object({
    limit: z.coerce.number().default(4),
  })

  const queryParamsValidation = queryParamsSchema.safeParse(req.query)

  if (queryParamsValidation.success === false) {
    return res.status(400).send({
      message: 'Validation error',
      issues: queryParamsValidation.error.format(),
    })
  }

  const { limit } = queryParamsValidation.data

  const fetchPopularBooksUseCase = makeFetchPopularBooksUseCase()

  const { books } = await fetchPopularBooksUseCase.execute({
    limit,
  })

  const transformedBooks = books.map((book) => {
    return excludeFields(book, ['created_at', 'summary', 'total_pages'])
  })

  return res.json({
    books: transformedBooks,
  })
}
