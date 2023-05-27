import Image from 'next/image'
import { clsx } from 'clsx'

interface AvatarProps {
  size?: 'sm' | 'md' | 'lg'
  avatarUrl: string
}

export function Avatar({ size = 'md', avatarUrl }: AvatarProps) {
  return (
    <div
      className={clsx('rounded-full bg-gradient-vertical p-[2px]', {
        'w-8 h-8': size === 'sm',
        'w-10 h-10': size === 'md',
        'w-18 h-18': size === 'lg',
      })}
    >
      <Image
        className="rounded-full h-full object-cover"
        src={avatarUrl}
        alt=""
        width={72}
        height={72}
      />
    </div>
  )
}
