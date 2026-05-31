import { OfferCityType, OfferType, OfferFeatureType } from '../dto.const';
import UserDto from '../user/user.dto';

export default class OfferDto {
  public id!: string;

  public name!: string;

  public description!: string;

  public date!: string;

  public city!: OfferCityType;

  public preview!: string;

  public images!: string[];

  public rating!: number;

  public type!: OfferType;

  public rooms!: number;

  public guests!: number;

  public price!: number;

  public features!: OfferFeatureType[];

  public user!: UserDto;

  public coordinates!: number[];

  public isFavorite!: boolean;

  public isPremium!: boolean;

  public commentsCount!: number;
}
