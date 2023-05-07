import Image from 'next/image'
import { ChartLineUp, Binoculars, User } from 'phosphor-react'

import bookWiseLogoImg from '../assets/book-wise-logo.svg'

import { SignInButton } from './SignInButton'
import { NavLink } from './NavLink'

export function Sidebar() {
  const isUserAuthenticated = true

  return (
    <aside className="w-58 fixed top-5 left-5 bottom-4 px-13 pt-10 pb-6 rounded-md flex flex-col justify-between items-center bg-sidebar-gradient bg-no-repeat bg-[length:100%_100%]">
      <div>
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
