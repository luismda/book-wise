import Image from 'next/image'
import Link from 'next/link'
import { signIn } from 'next-auth/react'

import bookWiseLogoImg from '../assets/book-wise-logo.svg'
import googleIconImg from '../assets/google-icon.svg'
import githubIconImg from '../assets/github-icon.svg'
import rocketIconImg from '../assets/rocket-icon.svg'
import { SignInProviderButton } from '@/components/SignInProviderButton'

export default function SignIn() {
  async function handleSignInWithGoogle() {
    await signIn('google')
  }

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
            <SignInProviderButton.Root onClick={handleSignInWithGoogle}>
              <SignInProviderButton.Icon>
                <Image src={googleIconImg} alt="" />
              </SignInProviderButton.Icon>
              Entrar com Google
            </SignInProviderButton.Root>

            <SignInProviderButton.Root>
              <SignInProviderButton.Icon>
                <Image src={githubIconImg} alt="" />
              </SignInProviderButton.Icon>
              Entrar com GitHub
            </SignInProviderButton.Root>

            <SignInProviderButton.Root asChild>
              <Link href="/">
                <SignInProviderButton.Icon>
                  <Image src={rocketIconImg} alt="" />
                </SignInProviderButton.Icon>
                Acessar como visitante
              </Link>
            </SignInProviderButton.Root>
          </div>
        </main>
      </div>
    </div>
  )
}
