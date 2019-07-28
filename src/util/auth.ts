import * as jwt from 'jsonwebtoken';

import { User } from '../entity/User';

interface IDataInToken {
  id: number;
}

export function createToken(user: User) {
  const expiresIn = 24 * 60 * 60; // an hour
  const secret = process.env.JWT_SECRET || 'secret';
  const dataStoredInToken: IDataInToken = {
    id: user.id,
  };
  return jwt.sign(dataStoredInToken, secret, { expiresIn });
}

export function getUser(token: string) {
  const secret = process.env.JWT_SECRET || 'secret';
  const decoded: any = jwt.verify(token, secret);
  return User.findOne(decoded.id);
}
