import { User } from '../../entity/User';

declare module 'express' {
  export interface Request {
    user?: User;
  }
}
