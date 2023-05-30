import { ReactNode } from 'react'
import { Slot } from '@radix-ui/react-slot'

interface HeadingRootProps {
  children: ReactNode
}

function HeadingRoot({ children }: HeadingRootProps) {
  return <div className="flex items-center gap-3">{children}</div>
}

interface HeadingIconProps {
  children: ReactNode
}

function HeadingIcon({ children }: HeadingIconProps) {
  return <Slot className="h-8 w-8 text-green-100">{children}</Slot>
}

interface HeadingTitleProps {
  children: ReactNode
}

function HeadingTitle({ children }: HeadingTitleProps) {
  return <h1 className="text-2xl font-bold leading-short">{children}</h1>
}

export const Heading = {
  Root: HeadingRoot,
  Icon: HeadingIcon,
  Title: HeadingTitle,
}
