import { inject, injectable } from 'inversify';
import { Component } from '../../../types/component.enum.js';
import { ILogger } from '../../logger/logger.interface.js';
import { IConfig } from '../../config/config.interface.js';
import { RestSchema } from '../../config/rest.schema.js';
import {
  DEFAULT_STATIC_IMAGES,
  STATIC_RESOURCE_FIELDS,
} from './path-transformer.constant.js';
import {
  STATIC_FILES_ROUTE,
  STATIC_UPLOAD_ROUTE,
} from '../../../../rest/index.js';
import { getFullServerPath, isObject } from '../../../helpers/index.js';

@injectable()
export class PathTransformer {
  constructor(
    @inject(Component.Logger) private readonly logger: ILogger,
    @inject(Component.Config) private readonly config: IConfig<RestSchema>
  ) {
    this.logger.info('PathTranformer created!');
  }

  private hasDefaultImage(value: string) {
    return DEFAULT_STATIC_IMAGES.includes(value);
  }

  private isStaticProperty(property: string) {
    return STATIC_RESOURCE_FIELDS.includes(property);
  }

  public execute(data: Record<string, unknown>): Record<string, unknown> {
    const stack: unknown[] = [data];

    while (stack.length > 0) {
      const current = stack.pop();

      for (const key in current as Record<string, unknown>) {
        if (Object.hasOwn(current as object, key)) {
          const value = (current as Record<string, unknown>)[key];

          if (isObject(value)) {
            stack.push(value);
            continue;
          }

          if (this.isStaticProperty(key) && typeof value === 'string') {
            (current as Record<string, unknown>)[key] = this.buildUrl(value);
            continue;
          }

          if (this.isStaticProperty(key) && Array.isArray(value)) {
            (current as Record<string, unknown>)[key] = value.map((item) =>
              typeof item === 'string' ? this.buildUrl(item) : item
            );
          }
        }
      }
    }

    return data;
  }

  private buildUrl(value: string): string {
    const rootPath = this.hasDefaultImage(value)
      ? STATIC_FILES_ROUTE
      : STATIC_UPLOAD_ROUTE;
    return `${getFullServerPath(this.config.get('HOST'), this.config.get('PORT'))}${rootPath}/${value}`;
  }
}
