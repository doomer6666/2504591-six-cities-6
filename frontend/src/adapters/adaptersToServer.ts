import CreateUserDto from '../dto/user/create-user.dto';
import CreateOfferDto from '../dto/offer/create-offer.dto';
import UpdateOfferDto from '../dto/offer/update-offer.dto';
import CreateCommentDto from '../dto/comment/create-comment.dto';
import { OfferCityType, OfferType } from '../dto/dto.const';
import { NewOffer, UserRegister, CommentAuth, Type } from '../types/types';

const TYPE_MAP: Record<Type, OfferType> = {
  apartment: 'Apartment',
  house: 'House',
  room: 'Room',
  hotel: 'Hotel',
};

export const adaptSignupToServer = (
  user: Omit<UserRegister, 'avatar'>
): CreateUserDto => ({
  name: user.name,
  email: user.email,
  password: user.password,
  type: user.isPro ? 'Pro' : 'Standart',
});

export const adaptSignupToFormData = (user: UserRegister): FormData => {
  const formData = new FormData();
  formData.append('name', user.name);
  formData.append('email', user.email);
  formData.append('password', user.password);
  formData.append('type', user.isPro ? 'Pro' : 'Standart');

  if (user.avatar) {
    formData.append('avatar', user.avatar);
  }

  return formData;
};

export const adaptCreateOfferToServer = (offer: NewOffer): CreateOfferDto => ({
  name: offer.title,
  description: offer.description,
  city: offer.city.name as OfferCityType,
  preview: offer.previewImage,
  images: [],
  isPremium: offer.isPremium,
  type: TYPE_MAP[offer.type],
  rooms: offer.bedrooms,
  guests: offer.maxAdults,
  price: offer.price,
  features: offer.goods as CreateOfferDto['features'],
  coordinates: [offer.location.latitude, offer.location.longitude],
});

export const adaptEditOfferToServer = (
  offer: Partial<NewOffer>
): UpdateOfferDto => {
  const dto: UpdateOfferDto = {};

  if (offer.title !== undefined) {
    dto.name = offer.title;
  }
  if (offer.description !== undefined) {
    dto.description = offer.description;
  }
  if (offer.city !== undefined) {
    dto.city = offer.city.name as OfferCityType;
  }
  if (offer.previewImage !== undefined) {
    dto.preview = offer.previewImage;
  }
  if (offer.isPremium !== undefined) {
    dto.isPremium = offer.isPremium;
  }
  if (offer.type !== undefined) {
    dto.type = TYPE_MAP[offer.type];
  }
  if (offer.bedrooms !== undefined) {
    dto.rooms = offer.bedrooms;
  }
  if (offer.maxAdults !== undefined) {
    dto.guests = offer.maxAdults;
  }
  if (offer.price !== undefined) {
    dto.price = offer.price;
  }
  if (offer.goods !== undefined) {
    dto.features = offer.goods as UpdateOfferDto['features'];
  }
  if (offer.location !== undefined) {
    dto.coordinates = [offer.location.latitude, offer.location.longitude];
  }

  return dto;
};

export const adaptCreateCommentToServer = (
  comment: Pick<CommentAuth, 'comment' | 'rating'>
): CreateCommentDto => ({
  text: comment.comment,
  rating: comment.rating,
});

export const adaptAvatarToServer = (file: File): FormData => {
  const formData = new FormData();
  formData.set('avatar', file);
  return formData;
};

export const adaptPreviewToServer = (file: File): FormData => {
  const formData = new FormData();
  formData.set('preview', file);
  return formData;
};

export const adaptImagesToServer = (files: File[]): FormData => {
  const formData = new FormData();
  files.forEach((file) => formData.append('images', file));
  return formData;
};
