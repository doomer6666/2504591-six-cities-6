import { Expose, Type } from 'class-transformer';
import { OfferCityType, OfferFeatureType } from '../../../types/index.js';
import { UserRdo } from '../../user/rdo/user.rdo.js';

export class OfferRdo {
  @Expose()
  public id: string;

  @Expose()
  public name: string;

  @Expose()
  public description: string;

  @Expose()
  public date: string;

  @Expose()
  public city: OfferCityType;

  @Expose()
  public price: number;

  @Expose()
  public isPremium: boolean;

  @Expose()
  public isFavorite: boolean;

  @Expose()
  public rating: number;

  @Expose()
  public type: string;

  @Expose()
  public preview: string;

  @Expose()
  public images: string[];

  @Expose()
  public rooms: number;

  @Expose()
  public guests: number;

  @Expose()
  public features: OfferFeatureType[];

  @Expose()
  @Type(() => UserRdo)
  public user: UserRdo;

  @Expose()
  public coordinates: number[];

  @Expose()
  public commentsCount: number;
}
