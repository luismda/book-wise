import { ReactNode } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { clsx } from 'clsx'

interface RatingCommentRootProps {
  children: ReactNode
  variant?: 'default' | 'highlighted'
}

function RatingCommentRoot({
  children,
  variant = 'default',
}: RatingCommentRootProps) {
  return (
    <article
      className={clsx('flex flex-col gap-5 rounded-sm p-6', {
        'bg-gray-700': variant === 'default',
        'bg-gray-600': variant === 'highlighted',
      })}
    >
      {children}
    </article>
  )
}

RatingCommentRoot.displayName = 'RatingComment.Root'

interface RatingCommentHeaderProps {
  children: ReactNode
}

function RatingCommentHeader({ children }: RatingCommentHeaderProps) {
  return (
    <header className="flex items-start justify-between">{children}</header>
  )
}

RatingCommentHeader.displayName = 'RatingComment.Header'

interface RatingUserContainerProps {
  children: ReactNode
}

function RatingCommentUserContainer({ children }: RatingUserContainerProps) {
  return <div className="flex items-stretch gap-4">{children}</div>
}

RatingCommentUserContainer.displayName = 'RatingComment.UserContainer'

interface RatingCommentUserAvatarProps {
  children: ReactNode
}

function RatingCommentUserAvatar({ children }: RatingCommentUserAvatarProps) {
  return <Slot>{children}</Slot>
}

RatingCommentUserAvatar.displayName = 'RatingComment.UserAvatar'

interface RatingCommentUserInfoContainerProps {
  children: ReactNode
}

function RatingCommentUserInfoContainer({
  children,
}: RatingCommentUserInfoContainerProps) {
  return <div>{children}</div>
}

RatingCommentUserInfoContainer.displayName = 'RatingComment.UserInfoContainer'

interface RatingCommentUserNameProps {
  children: ReactNode
}

function RatingCommentUserName({ children }: RatingCommentUserNameProps) {
  return <strong className="block leading-short">{children}</strong>
}

RatingCommentUserName.displayName = 'RatingComment.UserName'

interface RatingCommentDateProps {
  children: ReactNode
}

function RatingCommentDate({ children }: RatingCommentDateProps) {
  return (
    <time className="block text-sm leading-base text-gray-400">{children}</time>
  )
}

RatingCommentDate.displayName = 'RatingComment.Date'

interface RatingCommentStarsProps {
  children: ReactNode
}

function RatingCommentStars({ children }: RatingCommentStarsProps) {
  return <Slot>{children}</Slot>
}

RatingCommentStars.displayName = 'RatingComment.Stars'

interface RatingCommentCommentProps {
  children: ReactNode
}

function RatingCommentComment({ children }: RatingCommentCommentProps) {
  return <p className="text-sm leading-base text-gray-300">{children}</p>
}

RatingCommentComment.displayName = 'RatingComment.Comment'

export const RatingComment = {
  Root: RatingCommentRoot,
  Header: RatingCommentHeader,
  UserContainer: RatingCommentUserContainer,
  UserAvatar: RatingCommentUserAvatar,
  UserInfoContainer: RatingCommentUserInfoContainer,
  UserName: RatingCommentUserName,
  Date: RatingCommentDate,
  Stars: RatingCommentStars,
  Comment: RatingCommentComment,
}
