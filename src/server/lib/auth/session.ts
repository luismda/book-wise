import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next'
import * as NextAuth from 'next-auth'

import { authOptions } from './auth-options'

type Request = NextApiRequest | GetServerSidePropsContext['req']
type Response = NextApiResponse | GetServerSidePropsContext['res']

export async function getServerSession(req: Request, res: Response) {
  const session = await NextAuth.getServerSession(req, res, authOptions)

  return session
}
