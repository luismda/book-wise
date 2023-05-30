import { makeFetchCategoriesUseCase } from '@/server/use-cases/factories/make-fetch-categories-use-case'

export async function fetchCategoriesService() {
  const fetchCategoriesUseCase = makeFetchCategoriesUseCase()

  const { categories } = await fetchCategoriesUseCase.execute()

  return categories
}
