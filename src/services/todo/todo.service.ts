import TodoRepository from '../../repositories/todo.repository';
import Todo from '../../models/todo.model';
import { injectable, inject } from 'tsyringe';

@injectable()
class TodoService {
  constructor(@inject(TodoRepository) private todoRepository: TodoRepository) {}

  async search(userId: number, limit: number, offset: number): Promise<{ rows: Todo[]; count: number }> {
    return this.todoRepository.search(userId, limit, offset);
  }

  async getById(id: number, userId: number): Promise<Todo | null> {
    return this.todoRepository.getByUserIdAndId(id, userId);
  }

  async create(title: string, userId: number): Promise<Todo> {
    return this.todoRepository.create(title, userId);
  }

  async update(id: number, completed: boolean, userId: number): Promise<Todo | null> {
    return this.todoRepository.update(id, completed, userId);
  }

  async delete(id: number, userId: number): Promise<boolean> {
    return this.todoRepository.delete(id, userId);
  }
}

export default TodoService;