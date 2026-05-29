export const UserTypeEnum = {
  Standart: 'Standart',
  Pro: 'Pro',
} as const;

export type UserType = (typeof UserTypeEnum)[keyof typeof UserTypeEnum];

export const OfferCityEnum = {
  Paris: 'Paris',
  Cologne: 'Cologne',
  Brussels: 'Brussels',
  Amsterdam: 'Amsterdam',
  Hamburg: 'Hamburg',
  Dusseldorf: 'Dusseldorf',
} as const;
export type OfferCityType = (typeof OfferCityEnum)[keyof typeof OfferCityEnum];

export const OfferTypeEnum = {
  Apartment: 'Apartment',
  House: 'House',
  Room: 'Room',
  Hotel: 'Hotel',
} as const;
export type OfferType = (typeof OfferTypeEnum)[keyof typeof OfferTypeEnum];

export const OfferFeatureEnum = {
  Breakfast: 'Breakfast',
  AirConditioning: 'Air conditioning',
  LaptopFriendlyWorkspace: 'Laptop friendly workspace',
  BabySeat: 'Baby seat',
  Washer: 'Washer',
  Towels: 'Towels',
  Fridge: 'Fridge',
} as const;
export type OfferFeatureType =
  (typeof OfferFeatureEnum)[keyof typeof OfferFeatureEnum];
