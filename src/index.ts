import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import express, { Application } from 'express';
import http from 'http';
import log4js from 'log4js';
import { createConnection } from 'typeorm';
import { User } from './entity/User';
import schema from './schema';
import { getUser } from './util/authTokens';

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

createConnection()
  .then(async () => {
    const app: Application = express();

    app.use(cors({ origin: '*', credentials: true }));
    app.use(cookieParser());

    // TODO: refresh token route
    // app.post()

    const apolloServer = new ApolloServer({
      schema,
      context: ({ req, connection }) => {
        if (connection) {
          // check connection for metadata
          return connection.context;
        }

        if (
          req.body.query.includes('login') ||
          req.body.query.includes('register') ||
          req.body.query.includes('IntrospectionQuery')
        ) {
          return { user: null };
        }
        const token: string = req.headers.authorization || '';
        if (token === '') {
          throw new AuthenticationError('User not logged in');
        }
        return getUser(token.split(' ')[1]).then((user) => ({ user }));
      },
      subscriptions: {
        keepAlive: 1000,
        onConnect: async (connectionParams, websocket, context) => {
          console.log(connectionParams);
          console.log(websocket);
          console.log(context);
        },
        onDisconnect: (websocket, context) => {
          console.log('WS Disconnected! -> ', JSON.stringify(context), websocket);
        },
        // path: '/graphql/ws', // TODO for development path for Subs is /graphql
      },
    });
    apolloServer.applyMiddleware({ app, cors: false });
    const httpServer = http.createServer(app);

    apolloServer.installSubscriptionHandlers(httpServer);
    const port = process.env.PORT || 5000;

    httpServer.listen({ port }, () => {
      console.log(`🚀 Server ready at http://localhost:${port}${apolloServer.graphqlPath}`);
      console.log(
        `🚀 Subscriptions ready at ws://localhost:${port}${apolloServer.subscriptionsPath}`,
      );
    });
  })
  .catch((error) => logger.error(error));
