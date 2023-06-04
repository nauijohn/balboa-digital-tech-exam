import { Request } from 'express';
import jwt from 'jsonwebtoken';

export interface RequestWithUser extends Request {
  user?: UserJwtToken;
}

export interface UserJwtToken {
  id: number;
  username: string;
  iat: number;
}
