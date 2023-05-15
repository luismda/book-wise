import { randomUUID } from 'node:crypto'
import {
  CategoriesRepository,
  Category,
  CategoryCreateInput,
} from '../categories-repository'

export class InMemoryCategoriesRepository implements CategoriesRepository {
  private categories: Category[] = []

  async findMany() {
    return this.categories
  }

  async create(data: CategoryCreateInput) {
    const category: Category = {
      id: randomUUID(),
      name: data.name,
    }

    this.categories.push(category)

    return category
  }

  async list() {
    return this.categories
  }
}
