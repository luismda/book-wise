import {
  RatingsRepository,
  CompleteRating,
} from '@/server/repositories/ratings-repository'

interface FetchRatingsUseCaseRequest {
  orderBy: 'asc' | 'desc'
  perPage: number
  page: number
}

interface FetchRatingsUseCaseResponse {
  ratings: CompleteRating[]
}

export class FetchRatingsUseCase {
  constructor(private ratingsRepository: RatingsRepository) {}

  async execute({
    orderBy,
    perPage,
    page,
  }: FetchRatingsUseCaseRequest): Promise<FetchRatingsUseCaseResponse> {
    const ratings = await this.ratingsRepository.findMany({
      orderBy,
      perPage,
      page,
    })

    return {
      ratings,
    }
  }
}
