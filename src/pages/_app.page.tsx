import '@/styles/globals.css'

import { ElementType, Fragment, ReactNode } from 'react'
import type { AppProps } from 'next/app'
import { Nunito_Sans } from 'next/font/google'

const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})

interface CustomAppProps extends Omit<AppProps, 'Component'> {
  Component: AppProps['Component'] & {
    layout: ElementType<{ children: ReactNode }>
  }
}

export default function App({ Component, pageProps }: CustomAppProps) {
  const Layout = Component.layout ?? Fragment

  return (
    <div className={nunitoSans.className}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </div>
  )
}
