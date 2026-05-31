import { UserType } from '../dto.const';

export default class UserWithTokenDto {
  public id!: string;

  public email!: string;

  public name!: string;

  public avatarUrl!: string;

  public type!: UserType;

  public token!: string;
}
