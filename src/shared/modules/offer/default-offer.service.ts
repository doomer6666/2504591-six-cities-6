import { DocumentType, types } from '@typegoose/typegoose';
import { inject } from 'inversify';
import { Component } from '../../types/index.js';
import { IOfferService } from './offer-service.interface.js';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { ILogger } from '../../libs/logger/index.js';
import mongoose, { DeleteResult } from 'mongoose';
import { CommentEntity } from '../comment/comment.entity.js';
import { UserEntity } from '../user/user.entity.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { SortType } from '../../types/index.js';
import {
  DEFAULT_OFFER_COUNT,
  DEFAULT_PREMIUM_OFFER_COUNT,
} from './offer.constant.js';

export class DefaultOfferService implements IOfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: ILogger,
    @inject(Component.OfferModel)
    private readonly offerModel: types.ModelType<OfferEntity>,
    @inject(Component.CommentModel)
    private readonly commentModel: types.ModelType<CommentEntity>,
    @inject(Component.UserModel)
    private readonly userModel: types.ModelType<UserEntity>
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

  public async findByOfferNameOrCreate(
    offerName: string,
    dto: CreateOfferDto
  ): Promise<DocumentType<OfferEntity>> {
    const existedOffer = await this.findByOfferName(offerName);

    if (existedOffer) {
      return existedOffer;
    }
    return this.create(dto);
  }

  public async find(): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find({})
      .sort({ createdAt: SortType.Down })
      .limit(DEFAULT_OFFER_COUNT)
      .populate('user')
      .exec();
  }

  public async findPremium(): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find({ isPremium: true })
      .sort({ createdAt: SortType.Down })
      .limit(DEFAULT_OFFER_COUNT)
      .populate('user')
      .exec();
  }

  public async deleteById(offerId: string): Promise<DeleteResult> {
    return this.offerModel.deleteOne({ _id: offerId }).exec();
  }

  public async updateById(
    offerId: string,
    dto: UpdateOfferDto
  ): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findOneAndUpdate({ _id: offerId }, dto, {
        new: true,
      })
      .populate('user')
      .exec();
  }

  public async findPremiumByCity(
    city: string
  ): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find({ city: city, isPremium: true })
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
    const rating = Math.round(avgRating * 10) / 10;

    await this.offerModel.findByIdAndUpdate(offerId, { rating });
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.offerModel.exists({ _id: documentId })) !== null;
  }

  public async findFavorite(
    userId: string
  ): Promise<DocumentType<OfferEntity>[]> {
    const offers = await this.offerModel
      .find({ favoriteByUsers: userId })
      .populate('user')
      .exec();
    return offers;
  }

  public async addToFavorite(offerId: string, userId: string): Promise<void> {
    await this.offerModel
      .updateOne({ _id: offerId }, { $addToSet: { favoriteByUsers: userId } })
      .exec();
    await this.userModel
      .updateOne({ _id: userId }, { $addToSet: { favoriteOffers: offerId } })
      .exec();
  }

  public async deleteFromFavorite(
    offerId: string,
    userId: string
  ): Promise<void> {
    await this.offerModel
      .updateOne({ _id: offerId }, { $pull: { favoriteByUsers: userId } })
      .exec();
    await this.userModel
      .updateOne({ _id: userId }, { $pull: { favoriteOffers: offerId } })
      .exec();
  }
}
