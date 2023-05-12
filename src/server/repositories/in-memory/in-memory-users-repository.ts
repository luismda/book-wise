import { randomUUID } from 'node:crypto'
import { User, UserCreateInput, UsersRepository } from '../users-repository'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async findById(id: string) {
    const user = this.items.find((item) => item.id === id)

    if (!user) {
      return null
    }

    return user
  }

  async create(data: UserCreateInput) {
    const user: User = {
      id: randomUUID(),
      name: data.name,
      email: data.email ?? null,
      avatar_url: data.avatar_url ?? null,
      created_at: new Date(),
    }

    this.items.push(user)

    return user
  }
}
