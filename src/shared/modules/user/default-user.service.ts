import { IUserService } from './user-service.interface.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { UserEntity } from './user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/component.enum.js';
import { ILogger } from '../../libs/logger/index.js';
import { OfferEntity } from '../offer/offer.entity.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@injectable()
export class DefaultUserService implements IUserService {
  constructor(
    @inject(Component.Logger) private readonly logger: ILogger,
    @inject(Component.UserModel)
    private readonly userModel: types.ModelType<UserEntity>
  ) {}

  public async updateById(
    id: string,
    dto: UpdateUserDto
  ): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOneAndUpdate({ _id: id }, dto, {
      returnDocument: 'after',
    });
  }

  public async create(
    dto: CreateUserDto,
    salt: string
  ): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity({ ...dto });
    user.setPassword(dto.password, salt);

    const res = this.userModel.create(user);
    this.logger.info(`New user created: ${user.name}`);
    return res as Promise<DocumentType<UserEntity>>;
  }

  public findOneById(id: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({ _id: id });
  }

  public findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({ email });
  }

  public async findOrCreate(
    dto: CreateUserDto,
    salt: string
  ): Promise<DocumentType<UserEntity>> {
    const existedUser = await this.findByEmail(dto.email);
    if (existedUser) {
      return existedUser;
    }
    return this.create(dto, salt);
  }

  public async addFavorite(userId: string, offerId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      $addToSet: { favorites: offerId },
    });
  }

  public async getFavorites(
    userId: string
  ): Promise<DocumentType<OfferEntity>[]> {
    const user = await this.userModel
      .findById(userId)
      .populate<{ favorites: DocumentType<OfferEntity>[] }>({
        path: 'favorites',
        populate: { path: 'user' },
      })
      .exec();

    if (!user) {
      return [];
    }

    return user.favorites;
  }

  public async getFavoriteIds(userId: string): Promise<string[]> {
    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      return [];
    }

    return user.favorites.map((id) => id.toString());
  }

  public async deleteFavorite(userId: string, offerId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      $pull: { favorites: offerId },
    });
  }
}
