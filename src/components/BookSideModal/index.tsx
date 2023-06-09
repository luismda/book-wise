import 'react-loading-skeleton/dist/skeleton.css'

import { ForwardedRef, ReactNode, forwardRef, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'phosphor-react'

import { BookDetails } from './BookDetails'
import { RatingsList } from './RatingsList'
import { CreateRatingForm } from './CreateRatingForm'
import { RateButton } from './RateButton'

interface BookSideModalContentProps {
  bookId: string
}

function BookSideModalContent({ bookId }: BookSideModalContentProps) {
  const [isShouldBeFormVisible, setIsShouldBeFormVisible] = useState(false)

  function handleHideForm() {
    setIsShouldBeFormVisible(false)
  }

  function handleShowForm() {
    setIsShouldBeFormVisible(true)
  }

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed top-0 h-screen w-screen bg-black/60" />

      <Dialog.Content className="fixed bottom-0 right-0 top-0 w-full max-w-[660px] overflow-y-auto bg-gray-800 px-8 py-16 font-sans shadow-xl shadow-black/50 outline-none sm:px-13">
        <Dialog.Close
          aria-label="Fechar modal de detalhes do livro"
          className="absolute right-8 top-6 leading-[0] text-gray-400 outline-none transition-colors hover:text-gray-300 focus:text-gray-300 sm:right-13"
        >
          <X className="h-6 w-6" />
        </Dialog.Close>

        <BookDetails bookId={bookId} />

        <div className="mb-4 mt-10 flex items-center justify-between">
          <span className="text-sm leading-base text-gray-200">Avaliações</span>

          <RateButton
            type="button"
            bookId={bookId}
            isShouldBeHidden={isShouldBeFormVisible}
            onClick={handleShowForm}
          >
            Avaliar
          </RateButton>
        </div>

        <CreateRatingForm
          bookId={bookId}
          isShouldBeHidden={!isShouldBeFormVisible}
          onHide={handleHideForm}
        />

        <RatingsList bookId={bookId} />
      </Dialog.Content>
    </Dialog.Portal>
  )
}

interface BookSideModalTriggerProps {
  bookId: string
  children: ReactNode
}

const BookSideModalTrigger = forwardRef(
  (
    { bookId, children }: BookSideModalTriggerProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ) => {
    return (
      <Dialog.Root>
        <Dialog.Trigger ref={ref} asChild>
          {children}
        </Dialog.Trigger>

        <BookSideModalContent bookId={bookId} />
      </Dialog.Root>
    )
  },
)

BookSideModalTrigger.displayName = 'BookSideModal.Trigger'

export const BookSideModal = {
  Trigger: BookSideModalTrigger,
}
