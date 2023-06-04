import { ForwardedRef, forwardRef } from 'react'
import Image from 'next/image'
import { clsx } from 'clsx'
import { User } from 'phosphor-react'

interface AvatarProps {
  size?: 'sm' | 'md' | 'lg'
  avatarUrl?: string
}

export const Avatar = forwardRef(
  (
    { size = 'md', avatarUrl }: AvatarProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    if (!avatarUrl) {
      return (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-600">
          <User className="h-5 w-5 text-gray-400" />
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={clsx('rounded-full bg-gradient-vertical p-[2px]', {
          'h-8 w-8': size === 'sm',
          'h-10 w-10': size === 'md',
          'h-18 w-18': size === 'lg',
        })}
      >
        <Image
          className="h-full rounded-full object-cover"
          src={avatarUrl}
          alt=""
          width={72}
          height={72}
        />
      </div>
    )
  },
)

Avatar.displayName = 'Avatar'
