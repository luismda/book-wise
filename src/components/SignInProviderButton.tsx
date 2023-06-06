import { ButtonHTMLAttributes, ReactNode } from 'react'
import { Slot } from '@radix-ui/react-slot'

interface RootProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  isLoading?: boolean
}

function Root({
  asChild = false,
  isLoading = false,
  disabled,
  ...props
}: RootProps) {
  const Component = asChild ? Slot : 'button'

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 animate-pulse rounded-sm bg-purple-100/90" />
      )}

      <Component
        aria-live={isLoading ? 'polite' : 'off'}
        aria-busy={isLoading}
        aria-disabled={disabled || isLoading}
        disabled={disabled || isLoading}
        className="flex w-full items-center gap-5 rounded-sm border-2 border-transparent bg-gray-600 px-6 py-5 text-lg font-bold leading-base text-gray-200 outline-none transition-colors hover:border-gray-500 focus:border-gray-500 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:border-transparent"
        {...props}
      />
    </div>
  )
}

interface IconProps {
  children: ReactNode
}

function Icon({ children }: IconProps) {
  return <Slot className="h-8 w-8">{children}</Slot>
}

export const SignInProviderButton = {
  Root,
  Icon,
}
