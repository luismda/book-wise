import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

import { getServerSession } from '@/server/lib/auth/session'
import { createRatingService } from '@/server/http/services/create-rating'
import { ResourceNotFoundError } from '@/server/use-cases/errors/resource-not-found-error'
import { UserRatingAlreadyExistsError } from '@/server/use-cases/errors/user-rating-already-exists-error'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
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

  const requestBodySchema = z.object({
    rate: z.coerce.number().min(1).max(5),
    description: z.string().trim().min(10).max(450),
  })

  const requestBodyValidation = requestBodySchema.safeParse(req.body)

  if (requestBodyValidation.success === false) {
    return res.status(400).send({
      message: 'Validation error',
      issues: requestBodyValidation.error.format(),
    })
  }

  const { id } = routeParamsValidation.data
  const { rate, description } = requestBodyValidation.data

  try {
    await createRatingService({
      userId: session.user.id,
      bookId: id,
      rate,
      description,
    })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return res.status(404).send({
        message: error.message,
      })
    }

    if (error instanceof UserRatingAlreadyExistsError) {
      return res.status(409).send({
        message: error.message,
      })
    }

    return res.status(500).send({
      message: 'Internal server error',
    })
  }

  res.status(201).end()
}
