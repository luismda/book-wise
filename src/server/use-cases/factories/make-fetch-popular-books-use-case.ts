import { PrismaBooksRepository } from '@/server/repositories/prisma/prisma-books-repository'
import { FetchPopularBooksUseCase } from '../fetch-popular-books'

export function makeFetchPopularBooksUseCase() {
  const booksRepository = new PrismaBooksRepository()

  const useCase = new FetchPopularBooksUseCase(booksRepository)

  return useCase
}
