import { Router } from 'express'
import { AuthController } from '../controllers/AuthController'
import { AdminController } from '../controllers/AdminController'
import { authenticateToken, isAdmin } from '../middlewares/authMiddleware'

const router = Router()

// Auth Routes
router.post('/auth/register', AuthController.register)
router.post('/auth/login', AuthController.login)
router.get('/auth/profile', authenticateToken, AuthController.profile)
router.put('/auth/profile', authenticateToken, AuthController.updateProfile)

// Admin Routes
router.get(
  '/admin/users',
  authenticateToken,
  isAdmin,
  AdminController.listUsers
)
router.get(
  '/admin/users/:userId',
  authenticateToken,
  isAdmin,
  AdminController.getUserById
)
router.post(
  '/admin/users',
  authenticateToken,
  isAdmin,
  AdminController.createUser
)
router.put(
  '/admin/users/:userId',
  authenticateToken,
  isAdmin,
  AdminController.updateUser
)
router.delete(
  '/admin/users/:userId',
  authenticateToken,
  isAdmin,
  AdminController.deleteUser
)

export default router
