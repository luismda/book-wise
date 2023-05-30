import { ReactNode } from 'react'
import { Sidebar } from '@/components/Sidebar'

interface DefaultLayoutProps {
  children: ReactNode
}

export function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <div className="mx-auto grid max-w-8xl grid-cols-1 lg:grid-cols-[15.75rem_1fr]">
      <div className="lg:pl-5">
        <Sidebar />
      </div>

      <div className="w-full px-24 pb-10 pt-18">{children}</div>
    </div>
  )
}
