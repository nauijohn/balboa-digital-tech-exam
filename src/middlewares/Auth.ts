import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { RequestWithUser, UserJwtToken } from '../interfaces/RequestWithUser';

export class Auth {
  static authorization(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ): void {
    console.log('req.url: ', req.url);
    console.log('req.method: ', req.method);
    let { authorization } = req.headers;
    if (!authorization) {
      const regEx = new RegExp(/\/books\/\w+/s);
      if (
        (req.url === '/books' || regEx.test(req.url)) &&
        req.method === 'GET'
      ) {
        next();
        return;
      }
      res.send('Authorization required.');
      return;
    }
    authorization = authorization.split(' ')[1];
    const decoded = jwt.verify(authorization, 'jwtPrivateKey');
    req.user = decoded as UserJwtToken;
    next();
    return;
  }
}
