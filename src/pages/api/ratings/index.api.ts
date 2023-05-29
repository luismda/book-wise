import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

import { fetchRatingsService } from '@/server/http/services/fetch-ratings'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const queryParamsSchema = z.object({
    page: z.coerce.number().default(1),
    per_page: z.coerce.number().default(6),
  })

  const queryParamsValidation = queryParamsSchema.safeParse(req.query)

  if (queryParamsValidation.success === false) {
    return res.status(400).send({
      message: 'Validation error',
      issues: queryParamsValidation.error.format(),
    })
  }

  const { page, per_page: perPage } = queryParamsValidation.data

  const ratings = await fetchRatingsService({ page, perPage })

  return res.json({
    ratings,
  })
}
