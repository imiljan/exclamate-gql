import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { Context } from '../';
export type Maybe<T> = T | null;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: number,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
  /** Date custom scalar type */
  Date: any,
};

export type Comment = {
  __typename?: 'Comment',
  id: Scalars['ID'],
  body: Scalars['String'],
  created: Scalars['Date'],
  user: User,
};


export type Mutation = {
  __typename?: 'Mutation',
  _?: Maybe<Scalars['Boolean']>,
  register: RegisterResponse,
  createPost: Post,
};


export type MutationRegisterArgs = {
  userData?: Maybe<RegisterInput>
};


export type MutationCreatePostArgs = {
  body: Scalars['String']
};

export type Post = {
  __typename?: 'Post',
  id: Scalars['ID'],
  body: Scalars['String'],
  created: Scalars['Date'],
  user: User,
  comments: Array<Maybe<Comment>>,
  likes: Scalars['Int'],
};

export type Query = {
  __typename?: 'Query',
  _?: Maybe<Scalars['Boolean']>,
  login: Token,
  me: User,
  getPost?: Maybe<Post>,
  getPosts: Array<Maybe<Post>>,
};


export type QueryLoginArgs = {
  username: Scalars['String'],
  password: Scalars['String']
};


export type QueryGetPostArgs = {
  id: Scalars['ID']
};

export type RegisterInput = {
  username: Scalars['String'],
  password: Scalars['String'],
  firstName: Scalars['String'],
  lastName: Scalars['String'],
  email: Scalars['String'],
};

export type RegisterResponse = {
  __typename?: 'RegisterResponse',
  user?: Maybe<User>,
  token?: Maybe<Scalars['String']>,
};

export type Token = {
  __typename?: 'Token',
  token: Scalars['String'],
};

export type User = {
  __typename?: 'User',
  id: Scalars['ID'],
  username: Scalars['String'],
  firstName: Scalars['String'],
  lastName: Scalars['String'],
  email: Scalars['String'],
  posts?: Maybe<Array<Post>>,
};
export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;


export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Query: ResolverTypeWrapper<{}>,
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>,
  String: ResolverTypeWrapper<Scalars['String']>,
  Token: ResolverTypeWrapper<Token>,
  User: ResolverTypeWrapper<User>,
  ID: ResolverTypeWrapper<Scalars['ID']>,
  Post: ResolverTypeWrapper<Post>,
  Date: ResolverTypeWrapper<Scalars['Date']>,
  Comment: ResolverTypeWrapper<Comment>,
  Int: ResolverTypeWrapper<Scalars['Int']>,
  Mutation: ResolverTypeWrapper<{}>,
  RegisterInput: RegisterInput,
  RegisterResponse: ResolverTypeWrapper<RegisterResponse>,
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Query: {},
  Boolean: Scalars['Boolean'],
  String: Scalars['String'],
  Token: Token,
  User: User,
  ID: Scalars['ID'],
  Post: Post,
  Date: Scalars['Date'],
  Comment: Comment,
  Int: Scalars['Int'],
  Mutation: {},
  RegisterInput: RegisterInput,
  RegisterResponse: RegisterResponse,
}>;

export type CommentResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Comment'] = ResolversParentTypes['Comment']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  body?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  created?: Resolver<ResolversTypes['Date'], ParentType, ContextType>,
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>,
}>;

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date'
}

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  _?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>,
  register?: Resolver<ResolversTypes['RegisterResponse'], ParentType, ContextType, MutationRegisterArgs>,
  createPost?: Resolver<ResolversTypes['Post'], ParentType, ContextType, RequireFields<MutationCreatePostArgs, 'body'>>,
}>;

export type PostResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Post'] = ResolversParentTypes['Post']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  body?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  created?: Resolver<ResolversTypes['Date'], ParentType, ContextType>,
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>,
  comments?: Resolver<Array<Maybe<ResolversTypes['Comment']>>, ParentType, ContextType>,
  likes?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
}>;

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  _?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>,
  login?: Resolver<ResolversTypes['Token'], ParentType, ContextType, RequireFields<QueryLoginArgs, 'username' | 'password'>>,
  me?: Resolver<ResolversTypes['User'], ParentType, ContextType>,
  getPost?: Resolver<Maybe<ResolversTypes['Post']>, ParentType, ContextType, RequireFields<QueryGetPostArgs, 'id'>>,
  getPosts?: Resolver<Array<Maybe<ResolversTypes['Post']>>, ParentType, ContextType>,
}>;

export type RegisterResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['RegisterResponse'] = ResolversParentTypes['RegisterResponse']> = ResolversObject<{
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>,
  token?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
}>;

export type TokenResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Token'] = ResolversParentTypes['Token']> = ResolversObject<{
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
}>;

export type UserResolvers<ContextType = Context, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  posts?: Resolver<Maybe<Array<ResolversTypes['Post']>>, ParentType, ContextType>,
}>;

export type Resolvers<ContextType = Context> = ResolversObject<{
  Comment?: CommentResolvers<ContextType>,
  Date?: GraphQLScalarType,
  Mutation?: MutationResolvers<ContextType>,
  Post?: PostResolvers<ContextType>,
  Query?: QueryResolvers<ContextType>,
  RegisterResponse?: RegisterResponseResolvers<ContextType>,
  Token?: TokenResolvers<ContextType>,
  User?: UserResolvers<ContextType>,
}>;


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
*/
export type IResolvers<ContextType = Context> = Resolvers<ContextType>;
