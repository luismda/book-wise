import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="shortcut icon" href="/favicon.svg" type="image/x-icon" />
      </Head>
      <body className="bg-gray-800 font-sans text-gray-100 antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
