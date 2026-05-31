import { Ref } from '@typegoose/typegoose';
import { Expose, Type } from 'class-transformer';
import { UserRdo, type UserEntity } from '../../user/index.js';
export class CommentRdo {
  @Expose()
  public id: string;

  @Expose()
  public text: string;

  @Expose()
  public date: string;

  @Expose()
  public rating: number;

  @Expose()
  @Type(() => UserRdo)
  public user: Ref<UserEntity>;
}
