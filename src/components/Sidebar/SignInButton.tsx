import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { SignIn, SignOut } from 'phosphor-react'

import { Avatar } from '../Avatar'

export function SignInButton() {
  const session = useSession()

  const isUserAuthenticated =
    session.status === 'authenticated' && !!session.data

  async function handleSignOut() {
    await signOut()
  }

  if (isUserAuthenticated) {
    const { name, avatar_url } = session.data.user

    return (
      <button
        type="button"
        aria-label="Deslogar da plataforma"
        className="flex items-center gap-3 text-gray-200 text-sm leading-base outline-none hover:text-gray-100 focus:text-gray-100 focus:underline"
        onClick={handleSignOut}
      >
        <Avatar avatarUrl={avatar_url} size="sm" />
        <span className="whitespace-nowrap text-ellipsis overflow-hidden max-w-16">
          {name}
        </span>
        <SignOut weight="bold" className="text-red-400 w-5 h-5" />
      </button>
    )
  }

  return (
    <Link
      className="flex items-center gap-3 text-gray-200 font-bold leading-base transition-colors outline-none hover:text-gray-100 focus:text-gray-100 focus:underline"
      href="/sign-in"
    >
      Fazer login
      <SignIn weight="bold" className="text-green-100 w-5 h-5" />
    </Link>
  )
}
