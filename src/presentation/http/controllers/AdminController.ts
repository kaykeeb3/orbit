import { Request, Response, NextFunction } from 'express'
import { registerSchema } from '../validators/userSchemas'
import { AuthService } from '../../../application/services/AuthService'

const service = new AuthService()

export class AdminController {
  static async listUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const users = await service.getAllUsers()
      res.json({ users })
    } catch (err) {
      next(err)
    }
  }

  static async getUserById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const u = await service.getUserById(req.params.userId)
      if (!u) {
        res.status(404).json({ error: 'Not found' })
        return
      }
      res.json({ user: u })
    } catch (err) {
      next(err)
    }
  }

  static async createUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const dto = registerSchema.parse(req.body)
      const user = await service.registerUser(dto)
      res.status(201).json({ user })
    } catch (err) {
      next(err)
    }
  }

  static async updateUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const dto = registerSchema.partial().parse(req.body)
      const u = await service.updateUser(req.params.userId, dto as any)
      res.json({ user: u })
    } catch (err) {
      next(err)
    }
  }

  static async deleteUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await service.deleteUser(req.params.userId)
      res.json({ message: 'Deleted' })
    } catch (err) {
      next(err)
    }
  }
}
