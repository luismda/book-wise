import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ComponentProps } from 'react'

interface NavLinkProps extends ComponentProps<typeof Link> {}

export function NavLink(props: NavLinkProps) {
  const hrefPathname = usePathname()

  return (
    <Link
      data-active={hrefPathname === props.href}
      className="flex items-center gap-3 py-2 text-gray-400 leading-base outline-none before:content-[''] before:w-1 before:bg-transparent before:rounded-full before:h-6 before:mr-1 transition-colors hover:text-gray-100 focus:underline focus:text-gray-100 data-[active=true]:text-gray-100 data-[active=true]:font-bold data-[active=true]:before:bg-gradient-vertical"
      {...props}
    />
  )
}
