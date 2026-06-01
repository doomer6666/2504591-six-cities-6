import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import mongoose, { DeleteResult } from 'mongoose';
import { Component } from '../../types/index.js';
import { SortType } from '../../types/index.js';
import { ILogger } from '../../libs/logger/index.js';
import { IOfferService } from './offer-service.interface.js';
import { OfferEntity } from './offer.entity.js';
import { CommentEntity } from '../comment/comment.entity.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import {
  DEFAULT_OFFER_COUNT,
  DEFAULT_PREMIUM_OFFER_COUNT,
  RATING_FRACTION_MULTIPLIER,
} from './offer.constant.js';

@injectable()
export class DefaultOfferService implements IOfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: ILogger,
    @inject(Component.OfferModel)
    private readonly offerModel: types.ModelType<OfferEntity>,
    @inject(Component.CommentModel)
    private readonly commentModel: types.ModelType<CommentEntity>
  ) {}

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const offer = await this.offerModel.create({
      ...dto,
      user: new mongoose.Types.ObjectId(dto.user),
    });

    this.logger.info(`New offer created: ${dto.name}`);

    return offer.populate('user');
  }

  public async findByOfferId(
    offerId: string
  ): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findById(offerId).populate('user').exec();
  }

  public async findByOfferName(
    offerName: string
  ): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findOne({ name: offerName }).populate('user').exec();
  }

  public async find(count?: number): Promise<DocumentType<OfferEntity>[]> {
    const limit = count ?? DEFAULT_OFFER_COUNT;

    return this.offerModel
      .find({})
      .populate('user')
      .sort({ createdAt: SortType.Down })
      .limit(limit)
      .exec();
  }

  public async deleteById(offerId: string): Promise<DeleteResult> {
    await this.commentModel.deleteMany({ offerId }).exec();
    return this.offerModel.deleteOne({ _id: offerId }).exec();
  }

  public async updateById(
    offerId: string,
    dto: UpdateOfferDto
  ): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findOneAndUpdate({ _id: offerId }, dto, { returnDocument: 'after' })
      .populate('user')
      .exec();
  }

  public async findPremiumByCity(
    city: string
  ): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find({ city, isPremium: true })
      .sort({ createdAt: SortType.Down })
      .limit(DEFAULT_PREMIUM_OFFER_COUNT)
      .populate('user')
      .exec();
  }

  public async incCommentCount(offerId: string): Promise<void> {
    await this.offerModel
      .updateOne({ _id: offerId }, { $inc: { commentsCount: 1 } })
      .exec();
  }

  public async recalculateRating(offerId: string): Promise<void> {
    const match: Record<string, unknown>[] = [{ offerId }];

    if (mongoose.Types.ObjectId.isValid(offerId)) {
      match.push({ offerId: new mongoose.Types.ObjectId(offerId) });
    }

    const result = await this.commentModel
      .aggregate([
        { $match: { $or: match } },
        { $group: { _id: '$offerId', avgRating: { $avg: '$rating' } } },
      ])
      .exec();

    const avgRating = result.length > 0 ? result[0].avgRating : 0;
    const rating =
      Math.round(avgRating * RATING_FRACTION_MULTIPLIER) /
      RATING_FRACTION_MULTIPLIER;

    await this.offerModel.findByIdAndUpdate(offerId, { rating });
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.offerModel.exists({ _id: documentId })) !== null;
  }
}
