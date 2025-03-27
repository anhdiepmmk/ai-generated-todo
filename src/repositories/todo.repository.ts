import { Todo } from '~/models/index';
import { injectable } from 'tsyringe';

@injectable()
class TodoRepository {
  async search(userId: number, limit: number, offset: number): Promise<{ rows: Todo[]; count: number }> {
    return Todo.findAndCountAll({
      where: {
        userId: userId,
      },
      limit,
      offset,
    });
  }

  async getByUserIdAndId(id: number, userId: number): Promise<Todo | null> {
    return Todo.findOne({
      where: {
        id: id,
        userId: userId,
      },
    });
  }

  async create(title: string, userId: number): Promise<Todo> {
    return Todo.create({ title, completed: false, userId });
  }

  async update(id: number, completed: boolean, userId: number): Promise<Todo | null> {
    const todo = await Todo.findOne({
      where: {
        id: id,
        userId: userId,
      },
    });
    if (todo) {
      todo.completed = completed;
      await todo.save();
      return todo;
    }
    return null;
  }

  async delete(id: number, userId: number): Promise<boolean> {
    const todo = await Todo.findOne({
      where: {
        id: id,
        userId: userId,
      },
    });
    if (todo) {
      await todo.destroy();
      return true;
    }
    return false;
  }
}

export default TodoRepository;
