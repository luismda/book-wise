import Link from 'next/link'
import { SignIn, SignOut } from 'phosphor-react'

import { Avatar } from './Avatar'

export function SignInButton() {
  const isUserAuthenticated = true

  return isUserAuthenticated ? (
    <button
      type="button"
      aria-label="Deslogar da plataforma"
      className="flex items-center gap-3 text-gray-200 text-sm leading-base outline-none hover:text-gray-100 focus:text-gray-100 focus:underline"
    >
      <Avatar avatarUrl="https://github.com/luismda.png" size="sm" />
      <span className="whitespace-nowrap text-ellipsis overflow-hidden max-w-16">
        Luis Miguel
      </span>
      <SignOut size={20} weight="bold" className="text-red-400" />
    </button>
  ) : (
    <Link
      className="flex items-center gap-3 text-gray-200 font-bold leading-base transition-colors outline-none hover:text-gray-100 focus:text-gray-100 focus:underline"
      href="/sign-in"
    >
      Fazer login <SignIn size={20} weight="bold" className="text-green-100" />
    </Link>
  )
}
