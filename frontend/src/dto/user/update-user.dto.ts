import { UserType } from '../dto.const';

export class UpdateUserDto {
  public email?: string;

  public name?: string;

  public password?: string;

  public type?: UserType;

  public avatar?: string;
}
