// Mock dos schemas
jest.mock('../validators/userSchemas', () => ({
  registerSchema: {
    parse: jest.fn(data => data),
    partial: jest.fn(() => ({ parse: jest.fn(data => data) })),
  },
}))

// Mocks das funções do AuthService
const getAllUsers = jest.fn()
const getUserById = jest.fn()
const registerUser = jest.fn()
const updateUser = jest.fn()
const deleteUser = jest.fn()

// Mock do AuthService diretamente
jest.mock('../../../application/services/AuthService', () => {
  return {
    AuthService: jest.fn().mockImplementation(() => ({
      getAllUsers,
      getUserById,
      registerUser,
      updateUser,
      deleteUser,
    })),
  }
})

import { AdminController } from './AdminController'
import { Request, Response, NextFunction } from 'express'

// Função auxiliar para mock do response
const mockResponse = () => {
  const res = {} as Response
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res
}

describe('AdminController', () => {
  let next: NextFunction

  beforeEach(() => {
    jest.clearAllMocks()
    next = jest.fn()
  })

  it('should list all users', async () => {
    const req = {} as Request
    const res = mockResponse()

    getAllUsers.mockResolvedValue([{ id: 1, email: 'user@example.com' }])

    await AdminController.listUsers(req, res, next)

    expect(getAllUsers).toHaveBeenCalled()
    expect(res.json).toHaveBeenCalledWith({
      users: [{ id: 1, email: 'user@example.com' }],
    })
  })

  it('should get a user by ID', async () => {
    const req = { params: { userId: '1' } } as unknown as Request
    const res = mockResponse()

    getUserById.mockResolvedValue({ id: 1, email: 'user@example.com' })

    await AdminController.getUserById(req, res, next)

    expect(getUserById).toHaveBeenCalledWith('1')
    expect(res.json).toHaveBeenCalledWith({
      user: { id: 1, email: 'user@example.com' },
    })
  })

  it('should return 404 if user not found by ID', async () => {
    const req = { params: { userId: '1' } } as unknown as Request
    const res = mockResponse()

    getUserById.mockResolvedValue(null)

    await AdminController.getUserById(req, res, next)

    expect(getUserById).toHaveBeenCalledWith('1')
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ error: 'Not found' })
  })

  it('should create a user successfully', async () => {
    const req = {
      body: { email: 'test@example.com', password: '123456' },
    } as Request
    const res = mockResponse()

    registerUser.mockResolvedValue({ id: 1, email: req.body.email })

    await AdminController.createUser(req, res, next)

    expect(registerUser).toHaveBeenCalledWith(req.body)
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({
      user: { id: 1, email: req.body.email },
    })
  })

  it('should update a user successfully', async () => {
    const req = {
      params: { userId: '1' },
      body: { email: 'updated@example.com' },
    } as unknown as Request
    const res = mockResponse()

    updateUser.mockResolvedValue({ id: 1, email: req.body.email })

    await AdminController.updateUser(req, res, next)

    expect(updateUser).toHaveBeenCalledWith('1', req.body)
    expect(res.json).toHaveBeenCalledWith({
      user: { id: 1, email: req.body.email },
    })
  })

  it('should delete a user successfully', async () => {
    const req = { params: { userId: '1' } } as unknown as Request
    const res = mockResponse()

    deleteUser.mockResolvedValue(undefined)

    await AdminController.deleteUser(req, res, next)

    expect(deleteUser).toHaveBeenCalledWith('1')
    expect(res.json).toHaveBeenCalledWith({ message: 'Deleted' })
  })
})
