import { describe, it, expect, beforeEach } from 'vitest'
import { CategoriesRepository } from '../repositories/categories-repository'
import { FetchCategoriesUseCase } from './fetch-categories'
import { InMemoryCategoriesRepository } from '../repositories/in-memory/in-memory-categories-repository'

let categoriesRepository: CategoriesRepository
let sut: FetchCategoriesUseCase

describe('Fetch Categories Use Case', () => {
  beforeEach(() => {
    categoriesRepository = new InMemoryCategoriesRepository()
    sut = new FetchCategoriesUseCase(categoriesRepository)
  })

  it('should be able to fetch categories', async () => {
    await categoriesRepository.create({
      name: 'Software Development',
    })

    await categoriesRepository.create({
      name: 'Fiction',
    })

    const { categories } = await sut.execute()

    expect(categories).toEqual([
      {
        id: expect.any(String),
        name: 'Software Development',
      },
      {
        id: expect.any(String),
        name: 'Fiction',
      },
    ])
  })
})
