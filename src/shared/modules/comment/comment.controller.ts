import { inject, injectable } from 'inversify';
import {
  BaseController,
  DocumentExistsMiddleware,
  HttpError,
  HttpMethod,
  PathTransformer,
  PathTransformerMiddleware,
  PrivateRouteMiddleware,
  RequestBody,
  RequestParams,
  ValidateDtoMiddleware,
  ValidateObjectIdMiddleware,
} from '../../libs/rest/index.js';
import { Component } from '../../types/component.enum.js';
import { ILogger } from '../../libs/logger/logger.interface.js';
import { ICommentService } from './comment-service.interface.js';
import { Request, Response } from 'express';
import { fillDTO, getId } from '../../helpers/common.js';
import { CommentRdo } from './rdo/comment.rdo.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { IOfferService } from '../offer/offer-service.interface.js';
import { StatusCodes } from 'http-status-codes';

@injectable()
export class CommentController extends BaseController {
  private readonly pathTransformerMiddleware: PathTransformerMiddleware;

  constructor(
    @inject(Component.Logger) protected readonly logger: ILogger,
    @inject(Component.CommentService)
    private readonly commentService: ICommentService,
    @inject(Component.OfferService)
    protected readonly offerService: IOfferService,
    @inject(Component.PathTransformer) pathTransformer: PathTransformer
  ) {
    super(logger);

    this.pathTransformerMiddleware = new PathTransformerMiddleware(
      pathTransformer
    );

    this.addRoute({
      path: '/:offerId/comments',
      method: HttpMethod.Get,
      handler: this.index,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(offerService, 'Offer', 'offerId'),
        this.pathTransformerMiddleware,
      ],
    });

    this.addRoute({
      path: '/:offerId/comments',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(CreateCommentDto),
        new DocumentExistsMiddleware(offerService, 'Offer', 'offerId'),
        this.pathTransformerMiddleware,
      ],
    });
  }

  private async index(req: Request, res: Response) {
    const id = getId(req.params);
    const comments = await this.commentService.find(id);
    this.ok(res, fillDTO(CommentRdo, comments));
  }

  public async create(
    {
      params,
      body,
      tokenPayload,
    }: Request<RequestParams, RequestBody, CreateCommentDto>,
    res: Response
  ) {
    const offerId = getId(params);
    this.logger.info(
      `Creating comment for offer ${offerId} by user ${tokenPayload.email}`
    );
    if (!(await this.offerService.exists(offerId))) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${offerId} not found.`,
        'CommentController'
      );
    }

    const comment = await this.commentService.create({
      ...body,
      offerId,
      user: tokenPayload.id,
    });

    await this.offerService.incCommentCount(offerId);
    await this.offerService.recalculateRating(offerId);
    this.created(res, fillDTO(CommentRdo, comment));
  }
}
