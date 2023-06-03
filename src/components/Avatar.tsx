import { ForwardedRef, forwardRef } from 'react'
import Image from 'next/image'
import { clsx } from 'clsx'

interface AvatarProps {
  size?: 'sm' | 'md' | 'lg'
  avatarUrl: string
}

export const Avatar = forwardRef(
  (
    { size = 'md', avatarUrl }: AvatarProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
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
