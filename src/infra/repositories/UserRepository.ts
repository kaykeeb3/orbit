import { IUserRepository } from '../../domain/repositories/IUserRepository'
import { User } from '../../domain/entities/User'
import { prisma } from '../prisma/PrismaClient'

export class UserRepository implements IUserRepository {
  async create(data: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const u = await prisma.user.create({ data })
    return new User(
      u.id,
      u.name,
      u.email,
      u.password,
      u.profilePicture,
      u.isAdmin,
      u.createdAt
    )
  }

  async findByEmail(email: string): Promise<User | null> {
    const u = await prisma.user.findUnique({ where: { email } })
    return u
      ? new User(
          u.id,
          u.name,
          u.email,
          u.password,
          u.profilePicture,
          u.isAdmin,
          u.createdAt
        )
      : null
  }

  async findById(id: string): Promise<User | null> {
    const u = await prisma.user.findUnique({ where: { id } })
    return u
      ? new User(
          u.id,
          u.name,
          u.email,
          u.password,
          u.profilePicture,
          u.isAdmin,
          u.createdAt
        )
      : null
  }

  async findAll(): Promise<User[]> {
    const list = await prisma.user.findMany()
    return list.map(
      u =>
        new User(
          u.id,
          u.name,
          u.email,
          u.password,
          u.profilePicture,
          u.isAdmin,
          u.createdAt
        )
    )
  }

  async update(
    id: string,
    data: Partial<Omit<User, 'id' | 'createdAt'>>
  ): Promise<User> {
    const u = await prisma.user.update({ where: { id }, data })
    return new User(
      u.id,
      u.name,
      u.email,
      u.password,
      u.profilePicture,
      u.isAdmin,
      u.createdAt
    )
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } })
  }
}
