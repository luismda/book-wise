import {
  CategoriesOnBooksRepository,
  CategoryOnBook,
  CategoryOnBookCreateInput,
} from '../categories-on-books-repository'

export class InMemoryCategoriesOnBooksRepository
  implements CategoriesOnBooksRepository
{
  private categoriesOnBooks: CategoryOnBook[] = []

  async create(data: CategoryOnBookCreateInput) {
    const categoryOnBook: CategoryOnBook = {
      book_id: data.book_id,
      category_id: data.category_id,
    }

    this.categoriesOnBooks.push(categoryOnBook)

    return categoryOnBook
  }

  async list() {
    return this.categoriesOnBooks
  }
}
