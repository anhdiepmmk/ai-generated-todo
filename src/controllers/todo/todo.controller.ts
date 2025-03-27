import { Request, Response } from "express";
import createHttpError from "http-errors";
import Todo from "../../models/todo.model";
import TodoService from "../../services/todo/todo.service";
import { injectable, inject } from "tsyringe";
import { PaginationResult } from "../../utils/pagination"; // Import pagination utility

@injectable()
class TodoController {
  constructor(@inject(TodoService) private todoService: TodoService) {}

  async search(req: Request, res: Response) {
    // Assuming userId is available in req.user from auth middleware
    const userId = req.user!.id;
    const page = Number(req.query.page) || 1; // Default page to 1
    const limit = Number(req.query.limit) || 10; // Default limit to 10
    const offset = (page - 1) * limit;

    const { rows: todos, count } = await this.todoService.search(
      userId,
      limit,
      offset
    );

    const paginationResult: PaginationResult<Todo> = {
      todos,
      pagination: {
        page,
        limit,
        totalItems: count,
        totalPages: Math.ceil(count / limit),
      },
    };
    res.json(paginationResult); // Use pagination utility
  }

  /**
   * @swagger
   * /todos:
   *   get:
   *     summary: Get all todos with pagination
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
   *                       totalPages:
   *                         type: integer
   */

  async getById(req: Request, res: Response) {
    const id = req.params.id;
    // Assuming userId is available in req.user from auth middleware
    const userId = req.user!.id;
    const todo = await this.todoService.getById(Number(id), userId);
    if (todo) {
      res.json(todo);
    } else {
      throw createHttpError.NotFound("Todo not found");
    }
  }

  async create(req: Request, res: Response) {
    const userId = req.user!.id;
    const newTodo = await this.todoService.create(req.body.title, userId);
    res.status(201).json(newTodo);
  }

  async update(req: Request, res: Response) {
    const id = req.params.id;
    const completed = req.body.completed;
    // Assuming userId is available in req.user from auth middleware
    const userId = req.user!.id;
    const updatedTodo = await this.todoService.update(
      Number(id),
      completed === "true",
      userId
    );
    if (updatedTodo) {
      res.json(updatedTodo);
    } else {
      throw createHttpError.NotFound("Todo not found");
    }
  }

  async delete(req: Request, res: Response) {
    const id = req.params.id;
    // Assuming userId is available in req.user from auth middleware
    const userId = req.user!.id;
    const deleted = await this.todoService.delete(Number(id), userId);
    if (deleted) {
      res.status(204).send();
    } else {
      throw createHttpError.NotFound("Todo not found");
    }
  }
}

export default TodoController;
