import { OfferCityType, OfferType, OfferFeatureType } from '../dto.const';

export default class CreateOfferDto {
  public id!: string;

  public name!: string;

  public description!: string;

  public city!: OfferCityType;

  public rating!: number;

  public type!: OfferType;

  public rooms!: number;

  public guests!: number;

  public price!: number;

  public features!: OfferFeatureType[];

  public authorId!: string;

  public coordinates!: number[];
}
