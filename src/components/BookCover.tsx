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
        'h-[5.875rem] w-16': size === 'xs',
        'h-[8.375rem] w-24': size === 'sm',
        'h-[9.5rem] w-27': size === 'md',
        'h-[15.125rem] w-43': size === 'lg',
      })}
    />
  )
}
