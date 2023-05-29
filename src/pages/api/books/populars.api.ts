import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

import { fetchPopularBooksService } from '@/server/http/services/fetch-popular-books'

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

  const books = await fetchPopularBooksService({ limit })

  return res.json({
    books,
  })
}
