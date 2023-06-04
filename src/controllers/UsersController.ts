import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { Auth } from '../middlewares/Auth';
import User from '../models/User';
import { UsersRepository } from '../repositories/UsersRepository';
import { bodyValidator, controller, get, post, put, use } from './decorators';

@controller('/users')
class UsersController {
  @post('/register')
  async register(req: Request, res: Response) {
    try {
      const username: string = req.body.username;
      const password: string = req.body.password;

      const isUserNameAlreadyExists =
        await UsersRepository.isUserNameAlreadyExists(username);
      if (isUserNameAlreadyExists)
        res.status(409).send('Username already exists');

      const salt = 10 || process.env.SALT;
      const genSalt = await bcrypt.genSalt(salt);
      const hashedPassword = await bcrypt.hash(password, genSalt);

      const user = await UsersRepository.createUser(username, hashedPassword);
      const { id } = user;
      const authToken = jwt.sign(
        { id, username: user.username },
        'jwtPrivateKey'
      );
      res
        .header('authorization', `Bearer ${authToken}`)
        .status(201)
        .send({ message: 'User created!', authToken });
    } catch (ex: any) {
      res.status(500).send(ex.message);
    }
  }

  @post('/login')
  async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      const user: User | null = await UsersRepository.findUserByUserName(
        username
      );
      if (!user) throw new Error('Username or password invalid');

      const salt = 10 || process.env.SALT;
      const hashedPassword = await bcrypt.hash(password, salt);
      const isPasswordValid = await bcrypt.compare(password, hashedPassword);
      if (!isPasswordValid) throw new Error('Username or password invalid');

      const { id } = user;
      const authToken = jwt.sign({ id, username }, 'jwtPrivateKey');
      res.header('authorization', `Bearer ${authToken}`).send({ authToken });
    } catch (ex: any) {
      res.status(500).send(ex.message);
    }
  }
}
