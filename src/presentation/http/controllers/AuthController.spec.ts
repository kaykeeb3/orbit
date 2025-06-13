import { AuthService } from 'application/services/AuthService'
import { AuthController } from './AuthController'
import { Request, Response, NextFunction } from 'express'

// MOCK do schema
jest.mock('../validators/userSchemas', () => ({
  registerSchema: {
    parse: jest.fn(data => data),
    partial: jest.fn(() => ({
      parse: jest.fn(data => data),
    })),
  },
  loginSchema: { parse: jest.fn(data => data) },
}))

// Mock do AuthService
const mockAuthService = {
  registerUser: jest.fn(),
  authenticateUser: jest.fn(),
  getUserById: jest.fn(),
  updateUserProfile: jest.fn(),
} as unknown as AuthService

// Função auxiliar para criar mocks de response
const mockResponse = () => {
  const res = {} as Response
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res
}

describe('AuthController', () => {
  let next: NextFunction

  beforeEach(() => {
    // Configurar o service estático antes de cada teste
    AuthController.setService(mockAuthService)
    next = jest.fn()
    jest.clearAllMocks()
  })

  it('should register a user successfully', async () => {
    const req = {
      body: { email: 'test@example.com', password: '123456' },
    } as Request
    const res = mockResponse()

    ;(mockAuthService.registerUser as jest.Mock).mockResolvedValue({
      id: 1,
      email: req.body.email,
    })

    await AuthController.register(req, res, next)

    expect(mockAuthService.registerUser).toHaveBeenCalledWith(req.body)
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({
      message: 'User registered',
      user: { id: 1, email: req.body.email },
    })
  })

  it('should login successfully', async () => {
    const req = {
      body: { email: 'test@example.com', password: '123456' },
    } as Request
    const res = mockResponse()

    ;(mockAuthService.authenticateUser as jest.Mock).mockResolvedValue({
      token: 'mockToken',
      user: { id: 1, email: req.body.email },
    })

    await AuthController.login(req, res, next)

    expect(mockAuthService.authenticateUser).toHaveBeenCalledWith(
      req.body.email,
      req.body.password
    )
    expect(res.json).toHaveBeenCalledWith({
      message: 'Logged in',
      token: 'mockToken',
      user: { id: 1, email: req.body.email },
    })
  })

  it('should return user profile if user exists', async () => {
    const req = { user: { userId: 1 } } as Request & { user?: any }
    const res = mockResponse()

    ;(mockAuthService.getUserById as jest.Mock).mockResolvedValue({
      id: 1,
      email: 'test@example.com',
    })

    await AuthController.profile(req, res, next)

    expect(mockAuthService.getUserById).toHaveBeenCalledWith(1)
    expect(res.json).toHaveBeenCalledWith({
      user: { id: 1, email: 'test@example.com' },
    })
  })

  it('should return 404 if user not found in profile', async () => {
    const req = { user: { userId: 1 } } as Request & { user?: any }
    const res = mockResponse()

    ;(mockAuthService.getUserById as jest.Mock).mockResolvedValue(null)

    await AuthController.profile(req, res, next)

    expect(mockAuthService.getUserById).toHaveBeenCalledWith(1)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ error: 'Not found' })
  })

  it('should update user profile successfully', async () => {
    const req = {
      user: { userId: 1 },
      body: { email: 'updated@example.com' },
    } as Request & { user?: any }
    const res = mockResponse()

    // Configurar o mock antes de chamar o método
    ;(mockAuthService.updateUserProfile as jest.Mock).mockResolvedValue({
      id: 1,
      email: 'updated@example.com',
    })

    await AuthController.updateProfile(req, res, next)

    expect(mockAuthService.updateUserProfile).toHaveBeenCalledWith(1, req.body)
    expect(res.json).toHaveBeenCalledWith({
      message: 'Profile updated',
      user: { id: 1, email: 'updated@example.com' },
    })
  })

  it('should handle errors in updateProfile', async () => {
    const req = {
      user: { userId: 1 },
      body: { email: 'error@example.com' },
    } as Request & { user?: any }
    const res = mockResponse()
    const error = new Error('Update failed')

    ;(mockAuthService.updateUserProfile as jest.Mock).mockRejectedValue(error)

    await AuthController.updateProfile(req, res, next)

    expect(mockAuthService.updateUserProfile).toHaveBeenCalledWith(1, req.body)
    expect(next).toHaveBeenCalledWith(error)
  })
})
