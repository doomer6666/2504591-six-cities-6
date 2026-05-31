import { Ref } from '@typegoose/typegoose';
import type { UserEntity } from '../modules/user/index.js';

export type CommentType = {
  text: string;
  date: Date;
  rating: number;
  user: Ref<UserEntity>;
  offerId: string;
};
