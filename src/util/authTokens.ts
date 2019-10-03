import jwt from 'jsonwebtoken';

import { User } from '../entity/User';

interface IDataInToken {
  id: number;
}

export function createAccessToken(user: User) {
  const expiresIn = '1h';
  const secret = process.env.JWT_ACCESS_SECRET || 'secret';
  const dataStoredInToken: IDataInToken = {
    id: user.id,
  };
  return jwt.sign(dataStoredInToken, secret, { expiresIn });
}

export function createRefreshToken(user: User) {
  const expiresIn = '7d';
  const secret = process.env.JWT_REFRESH_SECRET || 'secret';
  const dataStoredInToken: IDataInToken = {
    id: user.id,
  };
  return jwt.sign(dataStoredInToken, secret, { expiresIn });
}

export function getUser(token: string) {
  const secret = process.env.JWT_ACCESS_SECRET || 'secret';
  const decoded: any = jwt.verify(token, secret);
  return User.findOne(decoded.id);
}
