import Image from 'next/image'
import { clsx } from 'clsx'

interface BookCoverProps {
  bookCoverUrl: string
  altText: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
}

export function BookCover({
  bookCoverUrl,
  altText,
  size = 'md',
}: BookCoverProps) {
  return (
    <Image
      src={bookCoverUrl}
      alt={altText}
      width={172}
      height={242}
      className={clsx('rounded-xs', {
        'w-16 h-[5.875rem]': size === 'xs',
        'w-24 h-[8.375rem]': size === 'sm',
        'w-27 h-[9.5rem]': size === 'md',
        'w-43 h-[15.125rem]': size === 'lg',
      })}
    />
  )
}
