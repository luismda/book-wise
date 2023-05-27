import { PrismaBooksRepository } from '@/server/repositories/prisma/prisma-books-repository'
import { FetchBooksUseCase } from '../fetch-books'

export function makeFetchBooksUseCase() {
  const booksRepository = new PrismaBooksRepository()

  const useCase = new FetchBooksUseCase(booksRepository)

  return useCase
}
