import { UserType } from '../dto.const';

export default class CreateUserWithIdDto {
  public id!: string;

  public email!: string;

  public name!: string;

  public avatar!: string;

  public type!: UserType;
}
