import { UserType } from '../dto.const';

export default class CreateUserDto {
  public email!: string;

  public name!: string;

  public password!: string;

  public type!: UserType;
}
