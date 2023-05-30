import { InputHTMLAttributes, ReactNode } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { clsx } from 'clsx'

interface TextInputRootProps {
  children: ReactNode
  iconPosition?: 'left' | 'right'
}

function TextInputRoot({ children, iconPosition }: TextInputRootProps) {
  return (
    <div
      className={clsx(
        'group relative rounded-xs border border-gray-500 bg-gray-800 transition-colors focus-within:border-green-200',
        {
          'group-left-icon': iconPosition === 'left',
          'group-right-icon': iconPosition === 'right',
        },
      )}
    >
      {children}
    </div>
  )
}

interface TextInputInputProps extends InputHTMLAttributes<HTMLInputElement> {}

function TextInputInput(props: TextInputInputProps) {
  return (
    <input
      className="w-full border-0 bg-transparent px-5 py-3 text-sm text-gray-200 outline-none placeholder:text-gray-400 group-[.group-left-icon]:pl-[2.625rem] group-[.group-right-icon]:pr-[2.625rem]"
      {...props}
    />
  )
}

interface TextInputIconProps {
  children: ReactNode
}

function TextInputIcon({ children }: TextInputIconProps) {
  return (
    <Slot className="absolute top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-green-200 group-[.group-left-icon]:left-3 group-[.group-right-icon]:right-3">
      {children}
    </Slot>
  )
}

export const TextInput = {
  Root: TextInputRoot,
  Input: TextInputInput,
  Icon: TextInputIcon,
}
