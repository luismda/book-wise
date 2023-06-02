import { makeGetUserProfileUseCase } from '@/server/use-cases/factories/make-get-user-profile-use-case'
import { excludeFields } from '@/server/utils/exclude-fields'

interface GetUserProfileServiceParams {
  userId: string
}

export async function getUserProfileService({
  userId,
}: GetUserProfileServiceParams) {
  const getUserProfileUseCase = makeGetUserProfileUseCase()

  const { user } = await getUserProfileUseCase.execute({
    userId,
  })

  const userWithoutIdAndEmail = {
    ...excludeFields(user, ['id', 'email']),
    created_at: user.created_at.toISOString(),
  }

  return userWithoutIdAndEmail
}
