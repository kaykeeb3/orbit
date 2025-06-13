import bcrypt from 'bcryptjs'

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10)
}
