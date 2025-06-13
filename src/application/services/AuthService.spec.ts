import { AuthService } from '../../application/services/AuthService'
import { IUserRepository } from '../../domain/repositories/IUserRepository'
import { User } from '../../domain/entities/User'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Mock bcrypt and jwt
jest.mock('bcryptjs')
jest.mock('jsonwebtoken')

const mockUser: User = new User(
  'user-id',
  'John Doe',
  'john@example.com',
  'hashed-password',
  'profile.jpg',
  false,
  new Date()
)

const userRepoMock: jest.Mocked<IUserRepository> = {
  create: jest.fn(),
  findAll: jest.fn(),
  findByEmail: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}

const service = new AuthService(userRepoMock)

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('registerUser', () => {
    it('should register a new user if email is not taken', async () => {
      userRepoMock.findByEmail.mockResolvedValue(null)
      userRepoMock.create.mockResolvedValue({ ...mockUser })

      const result = await service.registerUser({
        name: 'John Doe',
        email: 'john@example.com',
        password: '123456',
      })

      expect(userRepoMock.findByEmail).toHaveBeenCalledWith('john@example.com')
      expect(userRepoMock.create).toHaveBeenCalled()
      expect(result).toHaveProperty('id')
      expect(result).not.toHaveProperty('password')
    })

    it('should throw if email already exists', async () => {
      userRepoMock.findByEmail.mockResolvedValue(mockUser)

      await expect(
        service.registerUser({
          name: 'John Doe',
          email: 'john@example.com',
          password: '123456',
        })
      ).rejects.toThrow('Email já está em uso')
    })
  })

  describe('authenticateUser', () => {
    it('should authenticate and return token', async () => {
      userRepoMock.findByEmail.mockResolvedValue(mockUser)
      ;(bcrypt.compareSync as jest.Mock).mockReturnValue(true)
      ;(jwt.sign as jest.Mock).mockReturnValue('fake-token')

      const result = await service.authenticateUser(
        'john@example.com',
        '123456'
      )

      expect(userRepoMock.findByEmail).toHaveBeenCalledWith('john@example.com')
      expect(result).toHaveProperty('token', 'fake-token')
      expect(result.user).not.toHaveProperty('password')
    })

    it('should throw if email is not found', async () => {
      userRepoMock.findByEmail.mockResolvedValue(null)

      await expect(
        service.authenticateUser('nonexistent@example.com', '123456')
      ).rejects.toThrow('Credenciais inválidas')
    })

    it('should throw if password does not match', async () => {
      userRepoMock.findByEmail.mockResolvedValue(mockUser)
      ;(bcrypt.compareSync as jest.Mock).mockReturnValue(false)

      await expect(
        service.authenticateUser('john@example.com', 'wrongpass')
      ).rejects.toThrow('Credenciais inválidas')
    })
  })

  describe('getAllUsers', () => {
    it('should return list without passwords', async () => {
      userRepoMock.findAll.mockResolvedValue([mockUser])

      const result = await service.getAllUsers()
      expect(result.length).toBe(1)
      expect(result[0]).not.toHaveProperty('password')
    })
  })

  describe('getUserById', () => {
    it('should return user without password', async () => {
      userRepoMock.findById.mockResolvedValue(mockUser)

      const result = await service.getUserById('user-id')
      expect(result).toHaveProperty('id', 'user-id')
      expect(result).not.toHaveProperty('password')
    })

    it('should return null if user not found', async () => {
      userRepoMock.findById.mockResolvedValue(null)

      const result = await service.getUserById('invalid-id')
      expect(result).toBeNull()
    })
  })

  describe('updateUser', () => {
    it('should update user and hash password if present', async () => {
      userRepoMock.update.mockResolvedValue({
        ...mockUser,
        name: 'New Name',
        password: 'new-hash',
      })

      const result = await service.updateUser('user-id', {
        name: 'New Name',
        password: 'new-password',
      })

      expect(userRepoMock.update).toHaveBeenCalled()
      expect(result).toHaveProperty('name', 'New Name')
      expect(result).not.toHaveProperty('password')
    })
  })

  describe('deleteUser', () => {
    it('should call delete on repo', async () => {
      await service.deleteUser('user-id')
      expect(userRepoMock.delete).toHaveBeenCalledWith('user-id')
    })
  })
})
