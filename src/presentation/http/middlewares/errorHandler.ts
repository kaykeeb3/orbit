import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error(err)

  if (err instanceof ZodError) {
    const messages = err.errors.map(e => e.message)
    res.status(400).json({ errors: messages })
    return
  }

  res.status(err.statusCode || 500).json({
    error: err.message || 'Internal error',
  })
}
