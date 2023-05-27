import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

import { makeFetchRatingsUseCase } from '@/server/use-cases/factories/make-fetch-ratings-use-case'
import { excludeFields } from '@/server/utils/exclude-fields'

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

  const fetchRatingsUseCase = makeFetchRatingsUseCase()

  const { ratings } = await fetchRatingsUseCase.execute({
    page,
    perPage,
  })

  const transformedRatings = ratings.map((rating) => {
    return {
      ...rating,
      book: excludeFields(rating.book, [
        'summary',
        'total_pages',
        'created_at',
      ]),
      user: excludeFields(rating.user, ['id', 'email', 'created_at']),
    }
  })

  return res.json({
    ratings: transformedRatings,
  })
}
