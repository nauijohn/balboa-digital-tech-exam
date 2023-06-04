import User from '../models/User';
import { SequelizeConnection } from '../SequelizeConnection';

const repositories = SequelizeConnection.connectToDb().getRepository(User);

export class UsersRepository {
  static async isUserNameAlreadyExists(username: string): Promise<boolean> {
    const user: User | null = await repositories.findOne({
      where: { username },
    });
    if (user) return true;
    return false;
  }

  static async createUser(username: string, password: string): Promise<User> {
    return await repositories.create({ username, password });
  }

  static async findUserByUserName(username: string): Promise<User | null> {
    const user: User | null = await repositories.findOne({
      where: { username },
    });
    if (user) return user;
    return null;
  }
}
