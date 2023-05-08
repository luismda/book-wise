import { ReactNode } from 'react'
import { Sidebar } from '@/components/Sidebar'

interface DefaultLayoutProps {
  children: ReactNode
}

export function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <>
      <Sidebar />

      <div className="w-full max-w-6xl px-24 pt-18 pb-10 ml-63">{children}</div>
    </>
  )
}
