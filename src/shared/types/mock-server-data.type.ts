import { OfferCityType, OfferFeatureType, OfferType } from './offer.type.js';
import { UserType } from './user.type.js';

export type MockServerData = {
  titles: string[];
  descriptions: string[];
  cities: OfferCityType[];
  previewImages: string[];
  photos: string[];
  types: OfferType[];
  features: OfferFeatureType[];
  users: {
    name: string;
    email: string;
    avatar: string;
    password: string;
    type: UserType;
  }[];
};
