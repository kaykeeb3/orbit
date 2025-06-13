import { Request, Response, NextFunction } from 'express'
import { registerSchema, loginSchema } from '../validators/userSchemas'
import { AuthService } from '../../../application/services/AuthService'

let service: AuthService = new AuthService()

export class AuthController {
  static setService(authService: AuthService): void {
    service = authService
  }

  static async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const dto = registerSchema.parse(req.body)
      const user = await service.registerUser(dto)
      res.status(201).json({ message: 'User registered', user })
    } catch (err) {
      next(err)
    }
  }

  static async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const dto = loginSchema.parse(req.body)
      const { token, user } = await service.authenticateUser(
        dto.email,
        dto.password
      )
      res.json({ message: 'Logged in', token, user })
    } catch (err) {
      next(err)
    }
  }

  static async profile(
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await service.getUserById(req.user!.userId)
      if (!user) {
        res.status(404).json({ error: 'Not found' })
        return
      }
      res.json({ user })
    } catch (err) {
      next(err)
    }
  }

  static async updateProfile(
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const dto = registerSchema.partial().parse(req.body)
      const user = await service.updateUserProfile(req.user!.userId, dto as any)
      res.json({ message: 'Profile updated', user })
    } catch (err) {
      next(err)
    }
  }
}
