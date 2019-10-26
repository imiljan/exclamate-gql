import { buildSchemaSync } from 'type-graphql';

import { CommentResolvers } from './resolvers/CommentResolvers';
import { PostResolvers } from './resolvers/PostResolvers';
import { UserResolvers } from './resolvers/UserResolvers';

const schema = buildSchemaSync({
  resolvers: [UserResolvers, PostResolvers, CommentResolvers],
  dateScalarMode: 'isoDate', // "timestamp" or "isoDate"
});

export default schema;
