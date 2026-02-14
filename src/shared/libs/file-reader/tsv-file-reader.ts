import { readFileSync } from 'node:fs';
import { IFileReader } from './file-reader.interface.js';
import { Offer } from '../../types/offer.type.js';

export class TsvFileReader implements IFileReader {
  private rawData = '';

  constructor(private filePath: string) {}

  public read(): void {
    this.rawData = readFileSync(this.filePath, 'utf-8');
  }

  public toArray(): Offer[] {
    if (!this.rawData) {
      throw new Error('No data to parse. Please call read() method first.');
    }
    return this.rawData
      .split('\n')
      .filter((row) => row.trim().length > 0)
      .map((line) => {
        const [
          name,
          description,
          date,
          city,
          preview,
          images,
          isPremium,
          isFavorite,
          rating,
          type,
          rooms,
          guests,
          price,
          features,
          user,
          commentCount,
          coordinates,
        ] = line.split('\t');
        const [username, email, avatar, password] = user.split(';');
        return {
          name,
          description,
          date: new Date(date),
          city,
          preview,
          images: images.split(';'),
          isPremium: isPremium === 'true',
          isFavorite: isFavorite === 'true',
          rating: parseFloat(rating),
          type,
          rooms: parseInt(rooms, 10),
          guests: parseInt(guests, 10),
          price: parseInt(price, 10),
          features: features.split(';'),
          user: {
            name: username,
            email,
            avatar,
            password,
          },
          commentCount: parseInt(commentCount, 10),
          coordinates: coordinates
            .split(';')
            .map((coord) => parseFloat(coord)) as [number, number],
        };
      });
  }
}
