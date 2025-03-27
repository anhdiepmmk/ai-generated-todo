import express from 'express';
import { container } from 'tsyringe';
import AuthController from '../controllers/auth.controller';
import { validateBody } from '~/middleware/validation.middleware'; // Import validateBody
import { registerSchema, loginSchema } from '../controllers/auth.dto'; // Import schemas

const router = express.Router();

const authController: any = container.resolve(AuthController);

/**
 * @swagger
 * /auth/register:
 */
router.post('/register', validateBody(registerSchema), (req, res) => authController.register(req, res)); // Apply validation

/**
 * @swagger
 * /auth/login:
 */
router.post('/login', validateBody(loginSchema), (req, res) => authController.login(req, res)); // Apply validation

export default router;