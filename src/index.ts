import 'reflect-metadata';

import { ApolloServer, ForbiddenError } from 'apollo-server';
import * as dotenv from 'dotenv';
import * as log4js from 'log4js';
import * as mkdirp from 'mkdirp';
import { createConnection } from 'typeorm';

import { User } from './entity/User';
import schema from './schema';
import { getUser } from './util/auth';

dotenv.config({ path: '.env' });

log4js.configure({
  appenders: {
    out: { type: 'stdout' },
  },
  categories: {
    default: { appenders: ['out'], level: 'all' },
  },
});

const logger = log4js.getLogger('index.ts');

export interface Context {
  user: User;
}

export const UPLOAD_DIR = '../uploads';
mkdirp.sync(UPLOAD_DIR);

createConnection()
  .then(() => {
    const server = new ApolloServer({
      schema,
      context: ({ req }) => {
        if (req.body.query.includes('login') || req.body.query.includes('register')) {
          return { user: null };
        }
        const token: string = req.headers.authorization || '';
        if (token === '') {
          throw new ForbiddenError('User not logged in');
        }
        return getUser(token.split(' ')[1]).then((user) => ({ user }));
        // return { user: null };
      },
    });

    server.listen(5000).then(({ url }) => {
      logger.info(`Server listening on ${url}`);
    });
  })
  .catch((error) => logger.error(error));
