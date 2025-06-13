import jwtConfig from 'config/jwtConfig'
import { Request, Response, NextFunction } from 'express'
import { prisma } from 'infra/prisma/PrismaClient'
import jwt from 'jsonwebtoken'

export interface JwtPayload {
  userId: string
  isAdmin: boolean
}

export function authenticateToken(
  req: Request & { user?: JwtPayload },
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    res.status(401).json({ error: 'Token missing' })
    return
  }

  const [bearer, token] = authHeader.split(' ')

  if (bearer !== 'Bearer' || !token) {
    res.status(401).json({ error: 'Malformed token' })
    return
  }

  try {
    const decoded = jwt.verify(token, jwtConfig.secret) as JwtPayload
    req.user = decoded
    next()
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
}

export async function isAdmin(
  req: Request & { user?: JwtPayload },
  res: Response,
  next: NextFunction
): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Token missing' })
    return
  }

  try {
    const u = await prisma.user.findUnique({ where: { id: req.user.userId } })

    if (!u || !u.isAdmin) {
      res.status(403).json({ error: 'Admin required' })
      return
    }

    next()
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
}
