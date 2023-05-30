import { ComponentProps, ElementType } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavLinkProps extends ComponentProps<typeof Link> {
  icon: ElementType
}

export function NavLink({ icon: Icon, children, ...props }: NavLinkProps) {
  const hrefPathname = usePathname()

  return (
    <Link
      data-active={hrefPathname === props.href}
      className="flex items-center gap-3 py-2 leading-base text-gray-400 outline-none transition-colors before:mr-1 before:h-6 before:w-1 before:rounded-full before:bg-transparent before:content-[''] hover:text-gray-100 focus:text-gray-100 focus:underline data-[active=true]:font-bold data-[active=true]:text-gray-100 data-[active=true]:before:bg-gradient-vertical"
      {...props}
    >
      <Icon className="h-6 w-6" />
      {children}
    </Link>
  )
}
