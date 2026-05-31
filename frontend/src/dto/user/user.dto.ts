import { UserType } from '../dto.const';

export default class UserDto {
  public email!: string;

  public name!: string;

  public avatarUrl!: string;

  public type!: UserType;
}
