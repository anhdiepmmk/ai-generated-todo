import express from 'express';
import { container } from 'tsyringe';
import TodoController from '../controllers/todo/todo.controller';
import { validateBody, validateQuery, validateParams } from '~/middleware/validation.middleware';
import { createTodoSchema } from '~/controllers/todo/dto/todo.dto';
import { authenticateJWT } from '~/middleware/auth.middleware';

const router = express.Router();
const todoController = container.resolve(TodoController);

/**
 * @swagger
 * /search:
 *   get:
 *     summary: Search todos with pagination
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Maximum number of todos per page
 *     responses:
 *       200:
 *         description: Successful response with paginated todos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 todos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Todo'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalItems:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 */
router.get('/search', authenticateJWT, todoController.search.bind(todoController));

/**
 * @swagger
 * /todos/{id}:
 *   get:
 *     summary: Get a todo by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the todo to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: Todo not found
 */
router.get('/todos/:id', authenticateJWT, todoController.getById.bind(todoController));

/**
 * @swagger
 * /search:
 *   post:
 *     summary: Create a new todo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the todo
 *     responses:
 *       201:
 *         description: Successful response
 *       400:
 *         description: Invalid input
 */
router.post('/search', authenticateJWT, validateBody(createTodoSchema), todoController.create.bind(todoController));

/**
 * @swagger
 * /todos/{id}:
 *   put:
 *     summary: Update a todo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the todo to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               completed:
 *                 type: boolean
 *                 description: Whether the todo is completed
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: Todo not found
 */
router.put('/todos/:id', authenticateJWT, todoController.update.bind(todoController));

/**
 * @swagger
 * /todos/{id}:
 *   delete:
 *     summary: Delete a todo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the todo to delete
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Successful response
 *       404:
 *         description: Todo not found
 */
router.delete('/todos/:id', authenticateJWT, todoController.delete.bind(todoController));

export default router;