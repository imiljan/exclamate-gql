import 'reflect-metadata';

import { ApolloServer } from 'apollo-server';
import { createConnection } from 'typeorm';

import schema from './schema';

createConnection()
  .then(() => {
    //Create Apollo/GraphQl Server using typeDefs, resolvers and context object
    const server = new ApolloServer({ schema });

    server.listen(5000).then(({ url }) => {
      console.log(`Server listening on ${url}`);
    });
  })
  .catch((error) => console.log(error));
