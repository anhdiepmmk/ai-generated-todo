import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import UserService from '~/services/user.service';

@injectable()
class UserController {
  constructor(
    @inject(UserService) private userService: UserService,
  ) {}

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.userService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch users' });
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid user ID' });
      return;
    }
    try {
      const user = await this.userService.getUserById(id);
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch user' });
    }
  }

  // Add other user API actions (create, update, delete) here
}

export default UserController;