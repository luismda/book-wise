import { PrismaBooksRepository } from '@/server/repositories/prisma/prisma-books-repository'
import { GetBookDetailsUseCase } from '../get-book-details'

export function makeGetBookDetailsUseCase() {
  const booksRepository = new PrismaBooksRepository()

  const useCase = new GetBookDetailsUseCase(booksRepository)

  return useCase
}
