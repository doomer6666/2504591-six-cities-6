import {
  defaultClasses,
  getModelForClass,
  modelOptions,
  mongoose,
  prop,
  Ref,
} from '@typegoose/typegoose';
import { CommentType } from '../../types/index.js';
import type { UserEntity } from '../user/user.entity.js';

export interface CommentEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'comments',
  },
})
export class CommentEntity
  extends defaultClasses.TimeStamps
  implements CommentType
{
  @prop({
    required: true,
    default: '',
    minlength: 20,
    maxlength: 1024,
    type: () => String,
  })
  text: string;

  @prop({
    required: true,
    type: () => Date,
    default: () => new Date(),
  })
  date: Date;

  @prop({
    required: true,
    min: 1,
    max: 5,
    default: 1,
    type: () => Number,
  })
  rating: number;

  @prop({
    required: true,
    ref: 'UserEntity',
    type: () => mongoose.Schema.Types.ObjectId,
  })
  user: Ref<UserEntity>;

  @prop({ required: true, type: () => String })
  offerId: string;
}

export const CommentModel = getModelForClass(CommentEntity);
