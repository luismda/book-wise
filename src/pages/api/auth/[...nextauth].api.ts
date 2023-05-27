import NextAuth from 'next-auth'

import { authOptions } from '@/server/lib/auth/auth-options'

export default NextAuth(authOptions)
