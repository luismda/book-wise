import {
  BookWithRelationships,
  BooksRepository,
} from '../repositories/books-repository'

interface GetBookDetailsUseCaseRequest {
  bookId: string
}

interface GetBookDetailsUseCaseResponse {
  book: BookWithRelationships | null
}

export class GetBookDetailsUseCase {
  constructor(private booksRepository: BooksRepository) {}

  async execute({
    bookId,
  }: GetBookDetailsUseCaseRequest): Promise<GetBookDetailsUseCaseResponse> {
    const book = await this.booksRepository.findByIdWithRelationships(bookId)

    return {
      book,
    }
  }
}
