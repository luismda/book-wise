import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { ChartLineUp, Binoculars, User } from 'phosphor-react'

import bookWiseLogoImg from '@/assets/book-wise-logo.svg'

import { SignInButton } from './SignInButton'
import { NavLink } from './NavLink'

export function Sidebar() {
  const session = useSession()

  const isUserAuthenticated = session.status === 'authenticated'

  return (
    <aside className="fixed bottom-0 top-0 z-10 flex w-58 -translate-x-58 flex-col items-center justify-between bg-sidebar-gradient bg-[length:100%_100%] bg-no-repeat px-13 pb-6 pt-10 transition-transform group-focus-within:translate-x-0 group-focus-within:shadow-xl group-focus-within:shadow-black/50 xl:bottom-4 xl:top-5 xl:translate-x-0 xl:rounded-md">
      <div className="flex flex-col">
        <Image
          src={bookWiseLogoImg}
          alt="Logo da plataforma BookWise representada pelo desenho de um livro com um marcador de páginas no canto superior esquerdo e um coração pequeno no canto inferior direito do livro, com o texto BookWise escrito ao lado direito desse livro fazendo um gradiente da cor azul claro para um roxo mais claro."
          width={128}
          height={32}
        />

        <nav className="mt-16 flex flex-col gap-4">
          <NavLink href="/" icon={ChartLineUp}>
            Início
          </NavLink>
          <NavLink href="/explore" icon={Binoculars}>
            Explorar
          </NavLink>

          {isUserAuthenticated && (
            <NavLink href="/profile" icon={User}>
              Perfil
            </NavLink>
          )}
        </nav>
      </div>

      <SignInButton />
    </aside>
  )
}
