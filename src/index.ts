import 'reflect-metadata';

import { ApolloServer } from 'apollo-server';
import * as dotenv from 'dotenv';
import * as log4js from 'log4js';
import { createConnection } from 'typeorm';

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

createConnection()
  .then(() => {
    const server = new ApolloServer({
      schema,
      context: ({ req }) => {
        const token: string = req.headers.authorization || '';
        if (token === '') {
          return { user: null };
        }
        return getUser(token.split(' ')[1]).then((user) => ({ user }));
      },
    });

    server.listen(5000).then(({ url }) => {
      logger.info(`Server listening on ${url}`);
    });
  })
  .catch((error) => logger.error(error));
