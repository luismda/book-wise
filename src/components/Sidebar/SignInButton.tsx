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
        className="flex items-center gap-3 text-sm leading-base text-gray-200 outline-none hover:text-gray-100 focus:text-gray-100 focus:underline"
        onClick={handleSignOut}
      >
        <Avatar avatarUrl={avatar_url} size="sm" />
        <span className="max-w-16 overflow-hidden text-ellipsis whitespace-nowrap">
          {name}
        </span>
        <SignOut weight="bold" className="h-5 w-5 text-red-400" />
      </button>
    )
  }

  return (
    <Link
      className="flex items-center gap-3 font-bold leading-base text-gray-200 outline-none transition-colors hover:text-gray-100 focus:text-gray-100 focus:underline"
      href="/sign-in"
    >
      Fazer login
      <SignIn weight="bold" className="h-5 w-5 text-green-100" />
    </Link>
  )
}
