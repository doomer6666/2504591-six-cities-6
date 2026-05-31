import { UserType } from '../dto.const';

export default class CreateUserDto {
  public name!: string;

  public email!: string;

  public password!: string;

  public type!: UserType;
}
