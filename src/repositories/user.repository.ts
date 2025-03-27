import { User } from '~/models/index';
import { injectable } from 'tsyringe';

@injectable()
class UserRepository {
  async getAll(): Promise<User[]> {
    return User.findAll();
  }

  async getById(id: number): Promise<User | null> {
    return User.findByPk(id);
  }

  async getByEmail(email: string): Promise<User | null> {
    return User.findOne({ where: { email } });
  }

  async create(email: string, passwordHash: string, firstName?: string, lastName?: string): Promise<User> {
    return User.create({ email, passwordHash, firstName, lastName });
  }

  async update(id: number, updates: Partial<User>): Promise<User | null> {
    const user = await User.findByPk(id);
    if (user) {
      await user.update(updates);
      return user;
    }
    return null;
  }

  async delete(id: number): Promise<boolean> {
    const user = await User.findByPk(id);
    if (user) {
      await user.destroy();
      return true;
    }
    return false;
  }
}

export default UserRepository;