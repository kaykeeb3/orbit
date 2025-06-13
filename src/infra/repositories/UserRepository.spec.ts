import { UserRepository } from './UserRepository'
import { prisma } from '../prisma/PrismaClient'

jest.mock('../prisma/PrismaClient', () => ({
  prisma: {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}))

describe('UserRepository', () => {
  const repository = new UserRepository()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should create a user', async () => {
    const mockUser = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashedPassword',
      profilePicture: 'pic.jpg',
      isAdmin: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    ;(prisma.user.create as jest.Mock).mockResolvedValue(mockUser)

    const result = await repository.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashedPassword',
      profilePicture: 'pic.jpg',
      isAdmin: false,
    })

    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedPassword',
        profilePicture: 'pic.jpg',
        isAdmin: false,
      },
    })

    expect(result).toEqual(
      expect.objectContaining({
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedPassword',
        profilePicture: 'pic.jpg',
        isAdmin: false,
      })
    )
  })

  it('should find user by email', async () => {
    const mockUser = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashedPassword',
      profilePicture: 'pic.jpg',
      isAdmin: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser)

    const result = await repository.findByEmail('john@example.com')

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'john@example.com' },
    })

    expect(result?.email).toBe('john@example.com')
  })

  it('should return null when user not found by email', async () => {
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)

    const result = await repository.findByEmail('notfound@example.com')

    expect(result).toBeNull()
  })

  it('should find user by id', async () => {
    const mockUser = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashedPassword',
      profilePicture: 'pic.jpg',
      isAdmin: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser)

    const result = await repository.findById('1')

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: '1' },
    })

    expect(result?.id).toBe('1')
  })

  it('should return null when user not found by id', async () => {
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)

    const result = await repository.findById('notfound')

    expect(result).toBeNull()
  })

  it('should return all users', async () => {
    const mockUsers = [
      {
        id: '1',
        name: 'User One',
        email: 'user1@example.com',
        password: 'hashedPassword',
        profilePicture: 'pic1.jpg',
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        name: 'User Two',
        email: 'user2@example.com',
        password: 'hashedPassword',
        profilePicture: 'pic2.jpg',
        isAdmin: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    ;(prisma.user.findMany as jest.Mock).mockResolvedValue(mockUsers)

    const result = await repository.findAll()

    expect(prisma.user.findMany).toHaveBeenCalled()
    expect(result.length).toBe(2)
  })

  it('should update a user', async () => {
    const mockUser = {
      id: '1',
      name: 'Updated Name',
      email: 'updated@example.com',
      password: 'hashedPassword',
      profilePicture: 'pic.jpg',
      isAdmin: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    ;(prisma.user.update as jest.Mock).mockResolvedValue(mockUser)

    const result = await repository.update('1', {
      name: 'Updated Name',
      email: 'updated@example.com',
    })

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data: { name: 'Updated Name', email: 'updated@example.com' },
    })

    expect(result?.name).toBe('Updated Name')
  })

  it('should delete a user', async () => {
    ;(prisma.user.delete as jest.Mock).mockResolvedValue(undefined)

    await repository.delete('1')

    expect(prisma.user.delete).toHaveBeenCalledWith({
      where: { id: '1' },
    })
  })
})
