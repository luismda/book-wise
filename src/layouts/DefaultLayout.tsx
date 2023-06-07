import { ReactNode } from 'react'
import { List } from 'phosphor-react'

import { Sidebar } from '@/components/Sidebar'

interface DefaultLayoutProps {
  children: ReactNode
}

export function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <div className="mx-auto grid max-w-8xl grid-cols-1 xl:grid-cols-[15.75rem_1fr]">
      <div className="group xl:pl-5">
        <button
          type="button"
          aria-label="Abrir menu lateral"
          className="absolute left-8 top-4 rounded-xs bg-gray-700 p-1 outline-none transition-colors hover:bg-gray-600 focus:ring focus:ring-gray-500 lg:left-18 lg:top-10 xl:hidden"
        >
          <List className="h-8 w-8 text-green-100" />
        </button>

        <Sidebar />
      </div>

      <div className="w-full px-8 pb-10 pt-18 lg:px-18 xl:px-24">
        {children}
      </div>
    </div>
  )
}
