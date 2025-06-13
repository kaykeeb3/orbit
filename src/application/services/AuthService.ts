import { IUserRepository } from '../../domain/repositories/IUserRepository'
import { hashPassword } from '../../infra/security/bcrypt'
import jwt, { SignOptions } from 'jsonwebtoken'
import jwtConfig from '../../config/jwtConfig'
import { User } from '../../domain/entities/User'
import { UserRepository } from '../../infra/repositories/UserRepository'
import bcrypt from 'bcryptjs'

interface RegisterDTO {
  name: string
  email: string
  password: string
  profilePicture?: string
  isAdmin?: boolean
}

export class AuthService {
  constructor(private repo: IUserRepository = new UserRepository()) {}

  async registerUser(input: RegisterDTO) {
    if (await this.repo.findByEmail(input.email))
      throw new Error('Email já está em uso')

    const hashed = hashPassword(input.password)

    // Garantir que isAdmin tenha um valor padrão
    const userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'> = {
      name: input.name,
      email: input.email,
      password: hashed,
      profilePicture: input.profilePicture,
      isAdmin: input.isAdmin ?? false,
    }

    const u = await this.repo.create(userData)
    const { password, ...rest } = u
    return rest
  }

  async authenticateUser(email: string, password: string) {
    const u = await this.repo.findByEmail(email)
    if (!u) throw new Error('Credenciais inválidas')
    if (!bcrypt.compareSync(password, u.password))
      throw new Error('Credenciais inválidas')

    const payload = { userId: u.id, isAdmin: u.isAdmin }
    const options: SignOptions = { expiresIn: jwtConfig.expiresIn }
    const token = jwt.sign(payload, jwtConfig.secret, options)

    const { password: _, ...rest } = u
    return { token, user: rest }
  }

  async getAllUsers() {
    return (await this.repo.findAll()).map(({ password, ...rest }) => rest)
  }

  async getUserById(userId: string) {
    const u = await this.repo.findById(userId)
    if (!u) return null
    const { password, ...rest } = u
    return rest
  }

  async updateUser(
    userId: string,
    data: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>
  ) {
    if (data.password) {
      data.password = hashPassword(data.password as string)
    }
    const u = await this.repo.update(userId, data)
    const { password, ...rest } = u
    return rest
  }

  async deleteUser(userId: string) {
    await this.repo.delete(userId)
  }

  async updateUserProfile(userId: string, data: RegisterDTO) {
    return this.updateUser(userId, data as any)
  }
}
