import NextLink from 'next/link'
import { ComponentProps, ReactNode } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { clsx } from 'clsx'

interface RootProps extends ComponentProps<typeof NextLink> {
  color?: 'purple' | 'white'
  size?: 'sm' | 'md'
}

function Root({ color = 'purple', size = 'sm', ...props }: RootProps) {
  return (
    <NextLink
      className={clsx(
        'group flex items-center rounded-xs px-2 py-1 font-bold leading-base outline-none transition-colors focus:underline',
        {
          'gap-2 text-sm': size === 'sm',
          'gap-3 text-md': size === 'md',
          'text-purple-100 hover:bg-purple-100/5 focus:bg-purple-100/5':
            color === 'purple',
          'text-gray-200 hover:bg-gray-200/5 focus:bg-gray-200/5':
            color === 'white',
        },
      )}
      {...props}
    />
  )
}

interface IconProps {
  children: ReactNode
}

function Icon({ children }: IconProps) {
  return (
    <Slot className="group-[.text-md]:text-xl group-[.text-sm]:text-md">
      {children}
    </Slot>
  )
}

export const Link = {
  Root,
  Icon,
}
