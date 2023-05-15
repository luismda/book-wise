export interface CategoryOnBook {
  book_id: string
  category_id: string
}

export interface CategoryOnBookCreateInput {
  book_id: string
  category_id: string
}

export interface CategoriesOnBooksRepository {
  create(data: CategoryOnBookCreateInput): Promise<CategoryOnBook>
  list(): Promise<CategoryOnBook[]>
}
