import { ForwardedRef, ReactNode, forwardRef } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'phosphor-react'

import { BookDetails } from './BookDetails'
import { RatingsList } from './RatingsList'

interface BookSideModalContentProps {
  bookId: string
}

function BookSideModalContent({ bookId }: BookSideModalContentProps) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed top-0 h-screen w-screen bg-black/60" />

      <Dialog.Content className="fixed bottom-0 right-0 top-0 w-full max-w-[660px] overflow-y-auto bg-gray-800 px-13 py-16 font-sans shadow-xl shadow-black/50">
        <BookDetails bookId={bookId} />

        <div className="mt-10 flex items-center justify-between">
          <span className="text-sm leading-base text-gray-200">Avaliações</span>

          <button
            type="button"
            className="font-bold leading-base text-purple-100 outline-none focus:underline"
          >
            Avaliar
          </button>
        </div>

        <RatingsList bookId={bookId} />

        <Dialog.Close
          aria-label="Fechar modal de detalhes do livro"
          className="absolute right-13 top-6 leading-[0] text-gray-400 outline-none transition-colors hover:text-gray-300 focus:text-gray-300"
        >
          <X className="h-6 w-6" />
        </Dialog.Close>
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
