export interface Category {
  id: string
  name: string
}

export interface CategoryCreateInput {
  name: string
}

export interface CategoriesRepository {
  findMany(): Promise<Category[]>
  create(data: CategoryCreateInput): Promise<Category>
  list(): Promise<Category[]>
}
