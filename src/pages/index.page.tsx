import { Nunito_Sans } from 'next/font/google'

const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})

export default function Home() {
  return (
    <div className={nunitoSans.className}>
      <h1 className="text-2xl font-bold">Hello World!</h1>
    </div>
  )
}
