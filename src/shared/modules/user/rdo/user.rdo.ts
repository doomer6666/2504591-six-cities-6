import { Expose } from 'class-transformer';

export class UserRdo {
  @Expose()
  public email: string;

  @Expose()
  public name: string;

  @Expose({ name: 'avatar' })
  public avatarUrl: string;

  @Expose()
  public type: string;
}
