import { ButtonHTMLAttributes, ReactNode } from 'react'
import { Slot } from '@radix-ui/react-slot'

interface RootProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

function Root({ asChild = false, ...props }: RootProps) {
  const Component = asChild ? Slot : 'button'

  return (
    <Component
      className="flex items-center gap-5 px-6 py-5 rounded-sm bg-gray-600 text-lg font-bold leading-base text-gray-200 outline-none transition-colors border-2 border-transparent hover:border-gray-500 focus:border-gray-500"
      {...props}
    />
  )
}

interface IconProps {
  children: ReactNode
}

function Icon({ children }: IconProps) {
  return <Slot className="w-8 h-8">{children}</Slot>
}

export const SignInProviderButton = {
  Root,
  Icon,
}
