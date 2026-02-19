import { User } from './user.type.js';

export type CommentType = {
  text: string;
  date: Date;
  rating: number;
  author: User;
};
