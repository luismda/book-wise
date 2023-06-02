import { ReactNode } from 'react'
import { Slot } from '@radix-ui/react-slot'

interface RatingRootProps {
  children: ReactNode
}

function RatingRoot({ children }: RatingRootProps) {
  return <article className="space-y-2">{children}</article>
}

RatingRoot.displayName = 'Rating.Root'

interface RatingDateProps {
  children: ReactNode
}

function RatingDate({ children }: RatingDateProps) {
  return <time className="text-sm leading-base text-gray-300">{children}</time>
}

RatingDate.displayName = 'Rating.Date'

interface RatingBoxProps {
  children: ReactNode
}

function RatingBox({ children }: RatingBoxProps) {
  return (
    <div className="flex flex-col justify-between gap-6 rounded-sm bg-gray-700 p-6">
      {children}
    </div>
  )
}

RatingBox.displayName = 'Rating.Box'

interface RatingBookContainerProps {
  children: ReactNode
}

function RatingBookContainer({ children }: RatingBookContainerProps) {
  return <div className="flex items-stretch gap-6">{children}</div>
}

RatingBookContainer.displayName = 'Rating.BookContainer'

interface RatingBookCoverProps {
  children: ReactNode
}

function RatingBookCover({ children }: RatingBookCoverProps) {
  return <Slot>{children}</Slot>
}

RatingBookCover.displayName = 'Rating.BookCover'

interface RatingBookInfoContainerProps {
  children: ReactNode
}

function RatingBookInfoContainer({ children }: RatingBookInfoContainerProps) {
  return <div className="flex flex-col justify-between">{children}</div>
}

RatingBookInfoContainer.displayName = 'Rating.BookInfoContainer'

interface RatingBookInfoProps {
  children: ReactNode
}

function RatingBookInfo({ children }: RatingBookInfoProps) {
  return <div>{children}</div>
}

RatingBookInfo.displayName = 'Rating.BookInfo'

interface RatingBookNameProps {
  children: ReactNode
}

function RatingBookName({ children }: RatingBookNameProps) {
  return <strong className="block text-lg leading-short">{children}</strong>
}

RatingBookName.displayName = 'Rating.BookName'

interface RatingBookAuthorProps {
  children: ReactNode
}

function RatingBookAuthor({ children }: RatingBookAuthorProps) {
  return <span className="text-sm leading-base text-gray-400">{children}</span>
}

RatingBookAuthor.displayName = 'Rating.BookAuthor'

interface RatingsStarsProps {
  children: ReactNode
}

function RatingsStars({ children }: RatingsStarsProps) {
  return <Slot>{children}</Slot>
}

RatingsStars.displayName = 'Ratings.Stars'

interface RatingDescriptionProps {
  children: ReactNode
}

function RatingDescription({ children }: RatingDescriptionProps) {
  return <p className="text-sm leading-base text-gray-300">{children}</p>
}

RatingDescription.displayName = 'Rating.Description'

export const Rating = {
  Root: RatingRoot,
  Date: RatingDate,
  Box: RatingBox,
  BookContainer: RatingBookContainer,
  BookCover: RatingBookCover,
  BookInfoContainer: RatingBookInfoContainer,
  BookInfo: RatingBookInfo,
  BookName: RatingBookName,
  BookAuthor: RatingBookAuthor,
  Stars: RatingsStars,
  Description: RatingDescription,
}
