import { injectable, inject } from 'tsyringe';
import UserRepository from '~/repositories/user.repository';
import { User } from '~/models';

@injectable()
class UserService {
  constructor(
    @inject(UserRepository) private userRepository: UserRepository,
  ) {}

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.getAll();
  }

  async getUserById(id: number): Promise<User | null> {
    return this.userRepository.getById(id);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.getByEmail(email);
  }

  async createUser(email: string, passwordHash: string, firstName?: string, lastName?: string): Promise<User> {
    return this.userRepository.create(email, passwordHash, firstName, lastName);
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | null> {
    return this.userRepository.update(id, updates);
  }

  async deleteUser(id: number): Promise<boolean> {
    return this.userRepository.delete(id);
  }
}

export default UserService;