export interface User {
  id: string
  name: string
  email: string | null
  avatar_url: string | null
  created_at: Date
}

export interface UsersRepository {
  findById(id: string): Promise<User | null>
}
