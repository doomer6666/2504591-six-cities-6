import CommentDto from '../dto/comment/comment.dto';
import OfferDto from '../dto/offer/offer.dto';
import UserWithTokenDto from '../dto/user/user-with-token.dto';
import UserDto from '../dto/user/user.dto';
import {
  Offer,
  Comment,
  User,
  City,
  Location,
  CityName,
  Type,
} from '../types/types';
import { CityLocation } from '../const';

const TYPE_MAP: Record<string, Type> = {
  Apartment: 'apartment',
  House: 'house',
  Room: 'room',
  Hotel: 'hotel',
};

const adaptType = (type: string): Type => TYPE_MAP[type] ?? 'apartment';

const createLocation = (coordinates: number[]): Location => ({
  latitude: coordinates?.[0] ?? 0,
  longitude: coordinates?.[1] ?? 0,
});

const createCity = (name: CityName): City => {
  const location = CityLocation[name];

  return {
    name,
    location: location
      ? { latitude: location.latitude, longitude: location.longitude }
      : { latitude: 0, longitude: 0 },
  };
};

export const adaptUserToClient = (user?: UserDto): User => ({
  name: user?.name ?? '',
  email: user?.email ?? '',
  avatarUrl: user?.avatarUrl ?? '',
  isPro: user?.type === 'Pro',
});

export const adaptLoginToClient = (
  user: UserWithTokenDto
): User & { token: string } => ({
  name: user.name,
  email: user.email,
  avatarUrl: user.avatarUrl,
  isPro: user.type === 'Pro',
  token: user.token,
});

export const adaptOfferToClient = (offer: OfferDto): Offer => ({
  id: offer.id,
  price: offer.price,
  rating: offer.rating,
  title: offer.name,
  isPremium: offer.isPremium,
  isFavorite: offer.isFavorite,
  city: createCity(offer.city as CityName),
  location: createLocation(offer.coordinates),
  previewImage: offer.preview,
  type: adaptType(offer.type),
  bedrooms: offer.rooms,
  description: offer.description,
  goods: offer.features,
  host: adaptUserToClient(offer.user),
  images: offer.images ?? [],
  maxAdults: offer.guests,
});

export const adaptOffersToClient = (offers: OfferDto[]): Offer[] =>
  offers.reduce<Offer[]>((acc, offer) => {
    try {
      acc.push(adaptOfferToClient(offer));
    } catch {
      throw new Error('Incorrect offer');
    }
    return acc;
  }, []);

export const adaptCommentToClient = (comment: CommentDto): Comment => ({
  id: comment.id,
  comment: comment.text,
  date: comment.date,
  rating: comment.rating,
  user: adaptUserToClient(comment.user),
});

export const adaptCommentsToClient = (comments: CommentDto[]): Comment[] =>
  comments.map(adaptCommentToClient);
