import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

import { fetchRatingsOfBookService } from '@/server/http/services/fetch-ratings-of-book'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const paramsSchema = z.object({
    id: z.string().uuid(),
    page: z.coerce.number().min(1).default(1),
    per_page: z.coerce.number().min(1).default(6),
  })

  const paramsValidation = paramsSchema.safeParse(req.query)

  if (paramsValidation.success === false) {
    return res.status(400).send({
      message: 'Validation error',
      issues: paramsValidation.error.format(),
    })
  }

  const { id, page, per_page } = paramsValidation.data

  const ratings = await fetchRatingsOfBookService({
    bookId: id,
    page,
    perPage: per_page,
  })

  res.json({
    ratings,
  })
}
