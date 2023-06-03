import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

import { getBookDetailsService } from '@/server/http/services/get-book-details'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const routeParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const routeParamsValidation = routeParamsSchema.safeParse(req.query)

  if (routeParamsValidation.success === false) {
    return res.status(400).send({
      message: 'Validation error',
      issues: routeParamsValidation.error.format(),
    })
  }

  const { id } = routeParamsValidation.data

  const book = await getBookDetailsService({
    bookId: id,
  })

  res.json({
    book,
  })
}
