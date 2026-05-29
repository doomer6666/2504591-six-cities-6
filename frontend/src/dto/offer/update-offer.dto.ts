import { OfferCityType, OfferType, OfferFeatureType } from '../dto.const';

export default class UpdateOfferDto {
  public name?: string;

  public description?: string;

  public date?: string;

  public city?: OfferCityType;

  public preview?: string;

  public images?: string[];

  public isPremium?: boolean;

  public rating?: number;

  public type?: OfferType;

  public rooms?: number;

  public guests?: number;

  public price?: number;

  public features?: OfferFeatureType[];

  public authorId?: string;

  public coordinates?: number[];
}
