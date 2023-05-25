import { describe, it, expect, beforeEach } from 'vitest'
import { UsersRepository } from '../repositories/users-repository'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { GetUserProfileUseCase } from './get-user-profile'

let usersRepository: UsersRepository
let sut: GetUserProfileUseCase

describe('Get User Profile Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(usersRepository)
  })

  it('should be able to get user profile', async () => {
    const createdUser = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      avatar_url: 'https://avatars.com/my-avatar.png',
    })

    const { user } = await sut.execute({
      userId: createdUser.id,
    })

    expect(user).toEqual(
      expect.objectContaining({
        id: createdUser.id,
        name: 'John Doe',
        email: 'johndoe@example.com',
        avatar_url: 'https://avatars.com/my-avatar.png',
        created_at: expect.any(Date),
      }),
    )
  })

  it('should not be able to get profile of non-existent user', async () => {
    await expect(() =>
      sut.execute({
        userId: 'non-existent user id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
