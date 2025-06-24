import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function hashPassword(password) {
  return await bcrypt.hash(password, 12)
}

export async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword)
}

export function generateToken(userId, role) {
  return jwt.sign(
    { userId, role },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
} 