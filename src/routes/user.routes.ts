import express from 'express';
import UserController from '~/controllers/user.controller';
import { container } from 'tsyringe';

const router = express.Router();
const userController = container.resolve(UserController);

router.get('/users', (req, res) => userController.getAllUsers(req, res));
router.get('/users/:id', (req, res) => userController.getUserById(req, res));

export default router;