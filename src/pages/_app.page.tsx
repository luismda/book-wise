import '../lib/dayjs'
import '@/styles/globals.css'

import type { AppProps } from 'next/app'
import { ElementType, Fragment, ReactNode } from 'react'
import { Nunito_Sans } from 'next/font/google'
import { SessionProvider } from 'next-auth/react'

const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})

interface CustomAppProps extends Omit<AppProps, 'Component'> {
  Component: AppProps['Component'] & {
    layout: ElementType<{ children: ReactNode }>
  }
}

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: CustomAppProps) {
  const Layout = Component.layout ?? Fragment

  return (
    <SessionProvider session={session}>
      <div className={nunitoSans.className}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </div>
    </SessionProvider>
  )
}
