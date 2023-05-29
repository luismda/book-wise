import { NextApiRequest, NextApiResponse } from 'next'

import { getServerSession } from '@/server/lib/auth/session'
import { getUserLastRatingService } from '@/server/http/services/get-user-last-rating'

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

  const rating = await getUserLastRatingService({ userId: session.user.id })

  return res.json({
    rating,
  })
}
