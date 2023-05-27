import { NextApiRequest, NextApiResponse } from 'next'

import { makeGetUserLastRatingUseCase } from '@/server/use-cases/factories/make-get-user-last-rating-use-case'
import { getServerSession } from '@/server/lib/auth/session'
import { excludeFields } from '@/server/utils/exclude-fields'

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

  const getUserLastRatingUseCase = makeGetUserLastRatingUseCase()

  const { rating } = await getUserLastRatingUseCase.execute({
    userId: session.user.id,
  })

  if (!rating) {
    return res.json({
      rating: null,
    })
  }

  const transformedRating = {
    ...excludeFields(rating, ['user_id']),
    book: excludeFields(rating.book, ['summary', 'created_at', 'total_pages']),
  }

  return res.json({
    rating: transformedRating,
  })
}
