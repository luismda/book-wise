import Image from 'next/image'
import Link from 'next/link'

import bookWiseLogoImg from '../assets/book-wise-logo.svg'
import googleIconImg from '../assets/google-icon.svg'
import githubIconImg from '../assets/github-icon.svg'
import rocketIconImg from '../assets/rocket-icon.svg'

export default function SignIn() {
  return (
    <div className="w-full h-screen max-w-8xl mx-auto px-4 grid grid-cols-1 md:grid-cols-[42%_1fr]">
      <div className="py-5">
        <div className="h-full flex items-center justify-center bg-sign-in-cover bg-cover bg-center rounded-sm">
          <Image
            src={bookWiseLogoImg}
            alt="Logo da plataforma BookWise representada pelo desenho de um livro com um marcador de páginas no canto superior esquerdo e um coração pequeno no canto inferior direito do livro, com o texto BookWise escrito ao lado direito desse livro fazendo um gradiente da cor azul claro para um roxo mais claro."
            width={232}
            height={58}
          />
        </div>
      </div>
      <div className="flex items-center justify-center">
        <main className="w-93">
          <h1 className="text-2xl font-bold leading-short">Boas vindas!</h1>
          <p className="mt-[2px] leading-base text-gray-200">
            Faça seu login ou acesse como visitante.
          </p>

          <div className="mt-10 flex flex-col gap-4">
            <button className="flex items-center gap-5 px-6 py-5 rounded-sm bg-gray-600 text-lg font-bold leading-base text-gray-200 outline-none transition-colors border-2 border-transparent hover:border-gray-500 focus:border-gray-500">
              <Image src={googleIconImg} alt="" />
              Entrar com Google
            </button>
            <button className="flex items-center gap-5 px-6 py-5 rounded-sm bg-gray-600 text-lg font-bold leading-base text-gray-200 outline-none transition-colors border-2 border-transparent hover:border-gray-500 focus:border-gray-500">
              <Image src={githubIconImg} alt="" />
              Entrar com GitHub
            </button>
            <Link
              href="/"
              className="flex items-center gap-5 px-6 py-5 rounded-sm bg-gray-600 text-lg font-bold leading-base text-gray-200 outline-none transition-colors border-2 border-transparent hover:border-gray-500 focus:border-gray-500"
            >
              <Image src={rocketIconImg} alt="" />
              Acessar como visitante
            </Link>
          </div>
        </main>
      </div>
    </div>
  )
}
