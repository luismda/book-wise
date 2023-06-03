import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

import { fetchBooksService } from '@/server/http/services/fetch-books'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const queryParamsSchema = z.object({
    page: z.coerce.number().min(1).default(1),
    per_page: z.coerce.number().min(1).default(12),
    categories: z
      .array(z.string().uuid())
      .or(z.string().uuid())
      .optional()
      .transform((categories) =>
        typeof categories === 'string' ? [categories] : categories,
      ),
    query: z.string().optional(),
  })

  const queryParamsValidation = queryParamsSchema.safeParse(req.query)

  if (queryParamsValidation.success === false) {
    return res.status(400).send({
      message: 'Validation error',
      issues: queryParamsValidation.error.format(),
    })
  }

  const { page, per_page, categories, query } = queryParamsValidation.data

  const books = await fetchBooksService({
    page,
    perPage: per_page,
    categoriesId: categories,
    query,
  })

  res.json({
    books,
  })
}
