import { User } from './user.type.js';

export type Offer = {
  name: string;
  description: string;
  date: Date;
  city: string;
  preview: string;
  images: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  type: string;
  rooms: number;
  guests: number;
  price: number;
  features: string[];
  user: User;
  commentCount: number;
  coordinates: [number, number];
};
