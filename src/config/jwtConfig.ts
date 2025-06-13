import { SignOptions } from 'jsonwebtoken'

const config: { secret: string; expiresIn: SignOptions['expiresIn'] } = {
  secret: process.env.JWT_SECRET || 'your_default_secret',
  expiresIn: (process.env.JWT_EXPIRES_IN || '1h') as SignOptions['expiresIn'],
}

export default config
