import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

import { getServerSession } from '@/server/lib/auth/session'
import { getRatingOfUserAndBookService } from '@/server/http/services/get-rating-of-user-and-book'
import { ResourceNotFoundError } from '@/server/use-cases/errors/resource-not-found-error'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const session = await getServerSession(req, res)

  if (!session) {
    return res.status(401).end()
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

  try {
    const rating = await getRatingOfUserAndBookService({
      userId: session.user.id,
      bookId: id,
    })

    res.json({
      rating,
    })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return res.status(404).send({
        message: error.message,
      })
    }

    return res.status(500).send({
      message: 'Internal server error',
    })
  }
}
