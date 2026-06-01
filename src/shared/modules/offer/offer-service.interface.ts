import { DocumentType } from '@typegoose/typegoose';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { OfferEntity } from './offer.entity.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { DeleteResult } from 'mongoose';
import { IDocumentExists } from '../../types/document-exists.interface.js';

export interface IOfferService extends IDocumentExists {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  findByOfferId(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  findByOfferName(offerName: string): Promise<DocumentType<OfferEntity> | null>;
  find(count?: number): Promise<DocumentType<OfferEntity>[]>;
  deleteById(offerId: string): Promise<DeleteResult>;
  updateById(
    offerId: string,
    dto: UpdateOfferDto
  ): Promise<DocumentType<OfferEntity> | null>;
  findPremiumByCity(cityName: string): Promise<DocumentType<OfferEntity>[]>;
  incCommentCount(offerId: string): Promise<void>;
  recalculateRating(offerId: string): Promise<void>;
  exists(documentId: string): Promise<boolean>;
}
