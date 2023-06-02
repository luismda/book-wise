import { makeGetUserMetricsUseCase } from '@/server/use-cases/factories/make-get-user-metrics-use-case'

interface GetUserMetricsServiceParams {
  userId: string
}

export async function getUserMetricsService({
  userId,
}: GetUserMetricsServiceParams) {
  const getUserMetricsUseCase = makeGetUserMetricsUseCase()

  const { userMetrics } = await getUserMetricsUseCase.execute({
    userId,
  })

  return userMetrics
}
