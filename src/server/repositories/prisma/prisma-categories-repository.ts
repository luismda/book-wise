import {
  CategoriesRepository,
  CategoryCreateInput,
} from '../categories-repository'

import { prisma } from '@/server/lib/prisma'

export class PrismaCategoriesRepository implements CategoriesRepository {
  async findMany() {
    const categories = await prisma.category.findMany()

    return categories
  }

  async create(data: CategoryCreateInput) {
    const category = await prisma.category.create({
      data: {
        name: data.name,
      },
    })

    return category
  }

  async list() {
    const categories = await prisma.category.findMany()

    return categories
  }
}
