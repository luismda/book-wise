import { UserCreateInput, UsersRepository } from '../users-repository'

import { prisma } from '@/server/lib/prisma'

export class PrismaUsersRepository implements UsersRepository {
  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    })

    return user
  }

  async create(data: UserCreateInput) {
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        avatar_url: data.avatar_url,
      },
    })

    return user
  }

  async list() {
    const users = await prisma.user.findMany()

    return users
  }
}
