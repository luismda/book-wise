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
    <aside className="fixed flex w-full items-center justify-between rounded-md bg-sidebar-gradient bg-[length:100%_100%] bg-no-repeat px-13 pb-6 pt-10 lg:bottom-4 lg:top-5 lg:w-58 lg:flex-col">
      <div className="flex gap-6 lg:flex-col lg:gap-[0]">
        <Image
          src={bookWiseLogoImg}
          alt="Logo da plataforma BookWise representada pelo desenho de um livro com um marcador de páginas no canto superior esquerdo e um coração pequeno no canto inferior direito do livro, com o texto BookWise escrito ao lado direito desse livro fazendo um gradiente da cor azul claro para um roxo mais claro."
          width={128}
          height={32}
        />

        <nav className="flex gap-4 lg:mt-16 lg:flex-col">
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
