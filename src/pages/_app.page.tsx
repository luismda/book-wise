import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Nunito_Sans } from 'next/font/google'

const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})

export default function App({ Component, pageProps }: AppProps) {
  return <Component className={nunitoSans.className} {...pageProps} />
}
