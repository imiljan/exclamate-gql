import { Field, ObjectType } from 'type-graphql';

import { User } from '../../entity/User';

@ObjectType()
export class RegisterResponse {
  @Field()
  user: User;

  @Field()
  token: string;
}
