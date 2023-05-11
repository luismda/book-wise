import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface User {
    id: string
    name: string
    email: string | null
    avatar_url: string
  }

  interface Session {
    user: User
  }
}
